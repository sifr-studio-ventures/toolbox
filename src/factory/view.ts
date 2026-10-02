import { brandLockup, icon } from "../brand";
import { escapeHtml } from "../html";
import type { WorkspaceBoard } from "./db";

export { boardColumns } from "./columns";
export { cardForm, boardPage, webhookPanel } from "./board-page";

export type FactoryUser = { email: string } | null;

export function shell(user: FactoryUser, main: string): string {
  const account = user
    ? `<div class="flex items-center gap-3">
        <span class="hidden max-w-48 truncate text-sm sm:inline">${escapeHtml(user.email)}</span>
        <form method="post" action="/signout"><button class="btn btn-ghost btn-sm">Sign out</button></form>
      </div>`
    : `<a class="btn btn-primary btn-sm" href="/signin">Sign in</a>`;

  return `<div class="drawer">
    <input id="nav-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex min-h-screen flex-col">
      <header class="navbar border-b border-base-300 bg-base-100">
        <div class="navbar-start gap-3">
          <label for="nav-drawer" class="btn btn-ghost btn-square lg:hidden" aria-label="Open menu">
            ${icon("menu", "icon icon-lg")}
          </label>
          ${brandLockup({ size: "nav" })}
        </div>
        <nav class="navbar-center hidden gap-8 text-sm lg:flex">
          <a href="/factory" class="link link-hover">Value Factory</a>
          <a href="/b/building-opentoolbox" class="link link-hover">Public board</a>
          <a href="/design-system" class="link link-hover">Design system</a>
        </nav>
        <div class="navbar-end">${account}</div>
      </header>
      <main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 page-shell">${main}</main>
      <footer class="border-t border-base-300 px-5 py-8 text-sm text-base-content/70 md:px-10">
        Value Factory · Open Toolbox · a board anyone can open
      </footer>
    </div>
    <div class="drawer-side z-20">
      <label for="nav-drawer" class="drawer-overlay" aria-label="Close menu"></label>
      <ul class="menu min-h-full w-72 bg-base-100 text-base">
        <li><a href="/factory">Value Factory</a></li>
        <li><a href="/b/building-opentoolbox">Building opentoolbox</a></li>
        <li><a href="/design-system">Design system</a></li>
        <li><a href="/">Bench</a></li>
      </ul>
    </div>
  </div>`;
}

export function signInView(next: string, result: string): string {
  return `<section class="mx-auto w-full max-w-lg">
    <p class="text-sm font-medium uppercase tracking-[0.16em]">Value Factory</p>
    <h1 class="mt-4 text-3xl font-extrabold">Sign in with a link</h1>
    <p class="mt-4 text-base-content/80">
      No password. Enter your email and we send a link that signs you in.
    </p>
    <form class="mt-8 flex flex-col gap-5" hx-post="/auth/magic" hx-target="#auth-result" hx-swap="innerHTML">
      <input type="hidden" name="next" value="${escapeHtml(next)}" />
      <label class="flex flex-col gap-2 text-sm">
        <span class="font-medium">Email</span>
        <input class="input w-full" type="email" name="email" autocomplete="email" required placeholder="you@example.com" />
      </label>
      <button class="btn btn-primary">
        <span class="htmx-indicator loading loading-spinner loading-sm"></span>
        ${icon("mail")} Email me a sign-in link
      </button>
    </form>
    <div id="auth-result" class="mt-5">${result}</div>
    <p class="mt-8 text-sm text-base-content/70">
      You can also read the public board
      <a class="link" href="/b/building-opentoolbox">Building opentoolbox</a>
      without an account.
    </p>
  </section>`;
}

export function authResultView(outcome: {
  sent: boolean;
  reason: "no-provider" | "send-failed" | null;
  link: string | null;
  emailError?: string;
}): string {
  if (outcome.emailError) {
    return `<div class="alert alert-error"><span>${escapeHtml(outcome.emailError)}</span></div>`;
  }
  const parts: string[] = [];
  if (outcome.sent && !outcome.link) {
    parts.push(`<div class="alert alert-success"><span>Check your inbox. The link expires in 30 minutes.</span></div>`);
  } else if (outcome.sent && outcome.link) {
    parts.push(
      `<div class="alert alert-success"><span>The email sender accepted the message. This environment also shows the link below. It expires in 30 minutes.</span></div>`,
    );
  } else if (outcome.reason === "no-provider") {
    parts.push(
      `<div class="alert alert-warning"><span>Email sending is not available on this account, so no message was sent. Connect Cloudflare Email Sending for opentoolbox.io, or set the RESEND_API_KEY secret.</span></div>`,
    );
  } else if (outcome.reason === "send-failed") {
    parts.push(
      `<div class="alert alert-warning"><span>We tried to send the sign-in email and it did not go out. No message was delivered. Check that noreply@opentoolbox.io is allowed to send, or set the RESEND_API_KEY secret.</span></div>`,
    );
  }
  if (outcome.link) {
    parts.push(`<div class="alert alert-info">
      <div>
        <p class="font-medium">Use this sign-in link</p>
        <p class="mt-1 text-sm">This environment shows the link on screen so you can sign in without email.</p>
        <a class="btn btn-primary btn-sm mt-3" href="${escapeHtml(outcome.link)}">Open sign-in link</a>
        <p class="mt-3 break-all text-xs">${escapeHtml(outcome.link)}</p>
      </div>
    </div>`);
  }
  return parts.join("");
}

export function factoryHome(rows: WorkspaceBoard[], error: string | null): string {
  const groups = new Map<string, { name: string; boards: { id: string; name: string }[] }>();
  for (const row of rows) {
    const group = groups.get(row.workspace_id) ?? { name: row.workspace_name, boards: [] };
    if (row.board_id && row.board_name) group.boards.push({ id: row.board_id, name: row.board_name });
    groups.set(row.workspace_id, group);
  }

  const workspaceCards =
    groups.size === 0
      ? `<div class="alert"><span>You do not have a workspace yet. Create one, then add a board. New boards start on the Value Factory columns.</span></div>`
      : [...groups.entries()]
          .map(([id, group]) => {
            const boards =
              group.boards.length === 0
                ? `<p class="text-sm text-base-content/70">No boards yet.</p>`
                : `<ul class="flex flex-col gap-2">${group.boards
                    .map(
                      (board) =>
                        `<li><a class="link font-medium" href="/boards/${escapeHtml(board.id)}">${escapeHtml(board.name)}</a></li>`,
                    )
                    .join("")}</ul>`;
            return `<article class="card bg-base-100 shadow-sm">
              <div class="card-body">
                <h2 class="card-title">${escapeHtml(group.name)}</h2>
                ${boards}
                <form class="flex flex-col gap-3 sm:flex-row" method="post" action="/workspaces/${escapeHtml(id)}/boards">
                  <input class="input w-full" name="name" required maxlength="80" placeholder="Board name" />
                  <button class="btn btn-primary">${icon("plus")} Create board</button>
                </form>
              </div>
            </article>`;
          })
          .join("");

  return `<section class="flex flex-col gap-3">
      <p class="text-sm font-medium uppercase tracking-[0.16em]">Value Factory</p>
      <h1 class="text-3xl font-extrabold">Your boards</h1>
      <p class="max-w-2xl text-base-content/80">A board starts in Research and ends in Done. Move a card when the column's checklist is true.</p>
    </section>
    ${error ? `<div class="alert alert-error"><span>${escapeHtml(error)}</span></div>` : ""}
    <section class="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <div class="flex flex-col gap-5">${workspaceCards}</div>
      <aside class="card h-fit bg-base-100 shadow-sm">
        <div class="card-body">
          <h2 class="card-title text-lg">New workspace</h2>
          <form class="flex flex-col gap-4" method="post" action="/workspaces">
            <input class="input w-full" name="name" required maxlength="80" placeholder="Workspace name" />
            <button class="btn btn-primary">${icon("plus")} Create workspace</button>
          </form>
          <a class="link text-sm" href="/b/building-opentoolbox">Open the public board, Building opentoolbox</a>
        </div>
      </aside>
    </section>`;
}
