import type { Context, Hono } from "hono";
import { isSecureRequest } from "./auth";
import { brandLockup, icon, type IconName } from "./brand";
import {
  activeOrgCookie,
  createOrg,
  orgForMember,
  resolveActiveOrg,
  type OrgMembership,
  type User,
} from "./db";
import { escapeHtml } from "./html";
import type { AppContext } from "./types";

type Layout = (
  css: string,
  body: string,
  options?: { title?: string; description?: string },
) => string;

type ToolId = "docs" | "canvas" | "kanban";

const TOOLS: { id: ToolId; href: string; title: string; description: string; icon: IconName }[] = [
  {
    id: "docs",
    href: "/dashboard/docs",
    title: "Docs",
    description: "Specs, PRDs, and launch notes next to the work.",
    icon: "book",
  },
  {
    id: "canvas",
    href: "/dashboard/canvas",
    title: "Canvas",
    description: "Map journeys, flows, and product bets on a shared surface.",
    icon: "canvas",
  },
  {
    id: "kanban",
    href: "/dashboard/kanban",
    title: "Kanban",
    description: "Ship from research to done on a shared board.",
    icon: "kanban",
  },
];

function requireUser(c: Context<AppContext>): User | Response {
  const user = c.get("user");
  if (user) return user;
  const path = new URL(c.req.url).pathname;
  return c.redirect(`/signin?next=${encodeURIComponent(path)}`);
}

function cleanName(value: string, max: number): string | null {
  const name = value.trim();
  if (!name || name.length > max) return null;
  return name;
}

export function registerDashboard(app: Hono<AppContext>, css: string, layout: Layout): void {
  app.get("/dashboard", async (c) => {
    const user = requireUser(c);
    if (user instanceof Response) return user;
    return renderDashboard(c, css, layout, user, null);
  });

  for (const tool of TOOLS) {
    app.get(tool.href, async (c) => {
      const user = requireUser(c);
      if (user instanceof Response) return user;
      return renderDashboard(c, css, layout, user, tool.id);
    });
  }

  app.post("/dashboard/orgs", async (c) => {
    const user = requireUser(c);
    if (user instanceof Response) return user;
    const form = await c.req.formData();
    const name = cleanName(String(form.get("name") ?? ""), 80);
    if (!name) {
      return renderDashboard(c, css, layout, user, null, "Give the organization a name.");
    }
    const orgId = await createOrg(c.env.DB, user.id, name);
    const headers = new Headers();
    headers.append("Set-Cookie", activeOrgCookie(orgId, isSecureRequest(c)));
    headers.set("Location", "/dashboard");
    return new Response(null, { status: 302, headers });
  });

  app.post("/dashboard/orgs/switch", async (c) => {
    const user = requireUser(c);
    if (user instanceof Response) return user;
    const form = await c.req.formData();
    const orgId = String(form.get("org_id") ?? "");
    const org = await orgForMember(c.env.DB, user.id, orgId);
    if (!org) {
      return renderDashboard(c, css, layout, user, null, "That organization is not yours.");
    }
    const headers = new Headers();
    headers.append("Set-Cookie", activeOrgCookie(org.id, isSecureRequest(c)));
    headers.set("Location", "/dashboard");
    return new Response(null, { status: 302, headers });
  });
}

async function renderDashboard(
  c: Context<AppContext>,
  css: string,
  layout: Layout,
  user: User,
  tool: ToolId | null,
  error: string | null = null,
): Promise<Response> {
  try {
    const { orgs, active } = await resolveActiveOrg(c.env.DB, user, c.req.header("cookie") ?? "");
    c.header("Set-Cookie", activeOrgCookie(active.id, isSecureRequest(c)));
    const title = tool
      ? `${TOOLS.find((item) => item.id === tool)?.title ?? "Tool"} · Open Toolbox`
      : "Dashboard · Open Toolbox";
    c.header("Cache-Control", "no-store");
    return c.html(
      layout(css, dashboardShell({ user, orgs, active, tool, error }), {
        title,
        description: "Your Open Toolbox organizations and tools.",
      }),
    );
  } catch {
    return c.html(
      layout(
        css,
        `<main class="mx-auto max-w-xl page-shell py-16">
          <div class="alert alert-error"><span>Could not load your organizations. Try again.</span></div>
        </main>`,
        { title: "Dashboard · Open Toolbox" },
      ),
      500,
    );
  }
}

function dashboardShell(options: {
  user: User;
  orgs: OrgMembership[];
  active: OrgMembership;
  tool: ToolId | null;
  error: string | null;
}): string {
  const { user, orgs, active, tool, error } = options;
  const orgList = orgs
    .map((org) => {
      const activeClass = org.id === active.id ? " ot-dash-org--active" : "";
      if (org.id === active.id) {
        return `<li>
          <span class="ot-dash-org${activeClass}" aria-current="true">
            ${escapeHtml(org.name)}
          </span>
        </li>`;
      }
      return `<li>
        <form method="post" action="/dashboard/orgs/switch">
          <input type="hidden" name="org_id" value="${escapeHtml(org.id)}" />
          <button type="submit" class="ot-dash-org${activeClass}">${escapeHtml(org.name)}</button>
        </form>
      </li>`;
    })
    .join("");

  const toolLinks = TOOLS.map((item) => {
    const current = tool === item.id ? " aria-current=\"page\"" : "";
    const activeClass = tool === item.id ? " ot-dash-tool--active" : "";
    return `<li>
      <a class="ot-dash-tool${activeClass}" href="${item.href}"${current}>
        ${icon(item.icon, "icon icon-sm")}
        <span>${escapeHtml(item.title)}</span>
      </a>
    </li>`;
  }).join("");

  const main = tool ? toolComingSoon(tool) : orgHome(active, error);

  return `<div class="drawer lg:drawer-open ot-dash">
    <input id="dash-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex min-h-screen flex-col bg-base-100">
      <header class="navbar border-b border-base-300 bg-base-100 lg:hidden">
        <div class="navbar-start gap-2">
          <label for="dash-drawer" class="btn btn-ghost btn-square" aria-label="Open menu">
            ${icon("menu", "icon icon-lg")}
          </label>
          ${brandLockup({ size: "nav", href: "/dashboard" })}
        </div>
      </header>
      <div class="ot-dash-main flex-1">${main}</div>
    </div>
    <div class="drawer-side z-30">
      <label for="dash-drawer" class="drawer-overlay" aria-label="Close menu"></label>
      <aside class="ot-dash-sidebar flex min-h-full w-72 flex-col border-r border-base-300 bg-base-100">
        <div class="hidden border-b border-base-300 px-4 py-5 lg:block">
          ${brandLockup({ size: "nav", href: "/dashboard" })}
        </div>
        <div class="flex flex-1 flex-col gap-8 px-4 py-5">
          <section class="flex flex-col gap-3">
            <h2 class="ot-dash-section-label">Organizations</h2>
            <ul class="ot-dash-org-list flex flex-col gap-1">${orgList}</ul>
            <form class="ot-dash-create-org flex flex-col gap-2" method="post" action="/dashboard/orgs">
              <label class="sr-only" for="org-name">New organization</label>
              <input id="org-name" class="input input-sm w-full" name="name" required maxlength="80" placeholder="New org name" />
              <button class="btn btn-outline btn-sm" type="submit">${icon("plus", "icon icon-sm")} Create org</button>
            </form>
          </section>
          <section class="flex flex-col gap-3">
            <h2 class="ot-dash-section-label">Tools</h2>
            <ul class="ot-dash-tool-list flex flex-col gap-1">${toolLinks}</ul>
          </section>
        </div>
        <div class="ot-dash-profile mt-auto border-t border-base-300 px-4 py-4">
          <p class="truncate text-sm font-medium" title="${escapeHtml(user.email)}">${escapeHtml(user.email)}</p>
          <form method="post" action="/signout" class="mt-3">
            <button class="btn btn-ghost btn-sm w-full justify-start" type="submit">Sign out</button>
          </form>
        </div>
      </aside>
    </div>
  </div>`;
}

function orgHome(active: OrgMembership, error: string | null): string {
  const tiles = TOOLS.map(
    (tool) => `<a class="ot-dash-pick" href="${tool.href}">
      <span class="ot-dash-pick-icon text-primary">${icon(tool.icon, "icon icon-lg")}</span>
      <span class="ot-dash-pick-title">${escapeHtml(tool.title)}</span>
      <span class="ot-dash-pick-desc">${escapeHtml(tool.description)}</span>
    </a>`,
  ).join("");

  return `<section class="ot-dash-pane">
    <p class="ot-dash-eyebrow">${escapeHtml(active.name)}</p>
    <h1 class="ot-dash-title">Pick a tool</h1>
    <p class="ot-dash-support">Docs, Canvas, and Kanban will live here. Each one is coming soon.</p>
    ${error ? `<div class="alert alert-error mt-6"><span>${escapeHtml(error)}</span></div>` : ""}
    <div class="ot-dash-pick-grid mt-8">${tiles}</div>
  </section>`;
}

function toolComingSoon(tool: ToolId): string {
  const meta = TOOLS.find((item) => item.id === tool);
  const title = meta?.title ?? "Tool";
  const description = meta?.description ?? "";
  return `<section class="ot-dash-pane">
    <p class="ot-dash-eyebrow">Coming soon</p>
    <h1 class="ot-dash-title">${escapeHtml(title)}</h1>
    <p class="ot-dash-support">${escapeHtml(description)}</p>
    <div class="ot-dash-soon mt-8">
      <p class="font-medium">This tool is not built yet.</p>
      <p class="mt-2 text-base-content/70">We are shipping the dashboard first. ${escapeHtml(title)} lands next.</p>
      <a class="btn btn-primary mt-6" href="/dashboard">Back to org home</a>
    </div>
  </section>`;
}
