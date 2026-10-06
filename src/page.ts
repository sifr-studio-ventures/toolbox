import { brandHeadLinks, brandLockup, icon, type IconName } from "./brand";
import { escapeHtml } from "./html";

export function layout(
  css: string,
  body: string,
  options?: { title?: string; description?: string },
): string {
  const title = options?.title ?? "Open Toolbox";
  const description =
    options?.description ??
    "All the tools you need to grow your product. Docs, canvas, kanban, CRM, chat, analytics, forms, popups, surveys, and bug reporting — in one toolkit.";
  return `<!doctype html>
<html lang="en" data-theme="toolbox">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta
      name="description"
      content="${escapeHtml(description)}"
    />
    ${brandHeadLinks()}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700;800&display=swap"
      rel="stylesheet"
    />
    <style>${css}</style>
    <script src="https://unpkg.com/htmx.org@2.0.7"></script>
  </head>
  <body class="min-h-screen bg-base-100 font-sans text-base-content">
    ${body}
  </body>
</html>`;
}

type FeatureTile = {
  name: IconName;
  title: string;
  description: string;
  href?: string;
  ctaLabel?: string;
  size?: "lg" | "md" | "sm";
  live?: boolean;
};

const FEATURES: FeatureTile[] = [
  {
    name: "kanban",
    title: "Kanban",
    description:
      "Ship from research to done on a shared board — columns, cards, and status in one place.",
    size: "lg",
  },
  {
    name: "book",
    title: "Docs",
    description:
      "Specs, PRDs, and launch notes next to the work — plus the live design system for UI patterns.",
    href: "/design-system",
    ctaLabel: "Open design system",
    size: "md",
  },
  {
    name: "canvas",
    title: "Canvas",
    description: "Map journeys, flows, and product bets on a shared visual surface.",
    size: "md",
  },
  {
    name: "users",
    title: "CRM",
    description: "Keep accounts, contacts, and pipeline context beside product decisions.",
    size: "sm",
  },
  {
    name: "chat",
    title: "Chat",
    description:
      "Customer support chat — tickets and conversations tied to accounts, not scattered inboxes.",
    size: "sm",
  },
  {
    name: "chart",
    title: "Analytics",
    description: "Usage and funnel signals so you grow what people actually use.",
    size: "sm",
  },
  {
    name: "form",
    title: "Forms",
    description: "Capture intake, waitlists, and requests without a separate form stack.",
    size: "sm",
  },
  {
    name: "popup",
    title: "Popups",
    description: "On-site prompts for announcements, upgrades, and guided moments.",
    size: "sm",
  },
  {
    name: "survey",
    title: "Surveys",
    description: "Ask users what blocked them — and feed answers straight into the backlog.",
    size: "sm",
  },
  {
    name: "bug",
    title: "Bug reporting",
    description: "Collect repros and severity so triage lands on the board, not in chat scrollback.",
    size: "sm",
  },
];

function featureTile(feature: FeatureTile): string {
  const sizeClass =
    feature.size === "lg"
      ? "ot-bento-tile ot-bento-tile--lg"
      : feature.size === "md"
        ? "ot-bento-tile ot-bento-tile--md"
        : "ot-bento-tile";
  const badge = feature.live
    ? `<span class="ot-bento-live">Live</span>`
    : "";
  const cta =
    feature.href && feature.ctaLabel
      ? `<span class="ot-bento-cta">${icon("arrow-right", "icon icon-sm")} ${escapeHtml(feature.ctaLabel)}</span>`
      : "";
  const body = `<div class="ot-bento-icon text-primary">${icon(feature.name, "icon icon-lg")}</div>
      <div class="ot-bento-copy">
        <div class="ot-bento-title-row">
          <h3 class="ot-bento-title">${escapeHtml(feature.title)}</h3>
          ${badge}
        </div>
        <p class="ot-bento-desc">${escapeHtml(feature.description)}</p>
      </div>${cta}`;
  if (feature.href) {
    return `<a class="${sizeClass} ot-bento-tile--link" href="${escapeHtml(feature.href)}">${body}</a>`;
  }
  return `<article class="${sizeClass}">${body}</article>`;
}

function pricingTier(options: {
  name: string;
  price: string;
  note: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
  badge?: string;
}): string {
  const featured = options.featured ? " ot-price-card--featured" : "";
  const badge = options.badge
    ? `<span class="ot-price-badge">${escapeHtml(options.badge)}</span>`
    : "";
  const btnClass = options.featured ? "btn btn-primary w-full" : "btn btn-outline w-full";
  const items = options.features
    .map(
      (item) =>
        `<li>${icon("check", "icon icon-sm text-primary")}<span>${escapeHtml(item)}</span></li>`,
    )
    .join("");
  return `<article class="ot-price-card${featured}">
    ${badge}
    <h3 class="ot-price-name">${escapeHtml(options.name)}</h3>
    <p class="ot-price-amount">${escapeHtml(options.price)}</p>
    <p class="ot-price-note">${escapeHtml(options.note)}</p>
    <p class="ot-price-desc">${escapeHtml(options.description)}</p>
    <ul class="ot-price-list">${items}</ul>
    <a class="${btnClass}" href="${escapeHtml(options.ctaHref)}">${escapeHtml(options.ctaLabel)}</a>
  </article>`;
}

export function homePage(): string {
  const tiles = FEATURES.map(featureTile).join("");
  return `<div class="drawer">
    <input id="nav-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex min-h-screen flex-col">
      <header class="navbar border-b border-base-300 bg-base-100/90 ot-nav">
        <div class="navbar-start gap-3">
          <label for="nav-drawer" class="btn btn-ghost btn-square lg:hidden" aria-label="Open menu">
            ${icon("menu", "icon icon-lg")}
          </label>
          ${brandLockup({ size: "nav" })}
        </div>
        <nav class="navbar-center hidden gap-8 text-sm lg:flex">
          <a href="#features" class="link link-hover text-base-content">Features</a>
          <a href="#pricing" class="link link-hover text-base-content">Pricing</a>
        </nav>
        <div class="navbar-end gap-3">
          <a class="btn btn-primary btn-sm" href="/signin">Sign in</a>
        </div>
      </header>

      <main>
        <section class="ot-hero" aria-label="Open Toolbox hero">
          <div class="ot-hero-atmosphere" aria-hidden="true">
            <div class="ot-hero-photo"></div>
            <canvas id="ot-hero-shader" class="ot-hero-shader"></canvas>
            <div class="ot-hero-veil"></div>
            <div class="ot-hero-glow ot-hero-glow--a"></div>
            <div class="ot-hero-glow ot-hero-glow--b"></div>
            <div class="ot-hero-fade"></div>
          </div>
          <div class="ot-hero-inner">
            <h1 class="ot-hero-title">All the tools you need to grow your product</h1>
            <p class="ot-hero-support">
              Open Toolbox is the product-team toolkit — docs, canvas, kanban, CRM, support chat,
              analytics, forms, popups, surveys, and bug reporting — so research to ship stays in one place.
            </p>
            <div class="ot-hero-cta">
              <a href="/signin" class="btn btn-primary">Sign in</a>
            </div>
          </div>
        </section>

        <section id="features" class="ot-section">
          <div class="ot-section-head">
            <p class="ot-eyebrow">Toolkit</p>
            <h2 class="ot-section-title">One bench for product ops</h2>
            <p class="ot-section-support">
              Built for teams who refuse to glue ten apps together. Kanban, docs, CRM, support chat,
              and the rest of the kit — planned around how product teams actually ship.
            </p>
          </div>
          <div class="ot-bento">
            ${tiles}
          </div>
        </section>

        <section id="pricing" class="ot-pricing-band" aria-labelledby="pricing-heading">
          <div class="ot-pricing-inner">
            <div class="ot-section-head">
              <p class="ot-eyebrow">Pricing</p>
              <h2 id="pricing-heading" class="ot-section-title">Start free. Grow when the team does.</h2>
              <p class="ot-section-support">
                No fake checkout. Paid tiers are coming soon — Free already opens sign-in today.
              </p>
            </div>
            <div class="ot-price-grid">
              ${pricingTier({
                name: "Free",
                price: "$0",
                note: "Forever for getting started",
                description: "Sign in and explore the toolkit as it ships.",
                features: [
                  "Magic-link sign in",
                  "Public toolkit updates",
                  "Share links & webhooks",
                  "Design system on the edge",
                ],
                ctaLabel: "Sign in",
                ctaHref: "/signin",
              })}
              ${pricingTier({
                name: "Pro",
                price: "$19",
                note: "per seat / month · coming soon",
                description: "Private boards and the full toolkit for solo builders shipping fast.",
                features: [
                  "Private workspaces & boards",
                  "Docs, canvas, forms, surveys",
                  "Analytics + bug reporting",
                  "Popups for on-site prompts",
                ],
                ctaLabel: "Sign in",
                ctaHref: "/signin",
                featured: true,
                badge: "Most useful next",
              })}
              ${pricingTier({
                name: "Team",
                price: "$49",
                note: "per seat / month · coming soon",
                description:
                  "Shared CRM, support chat, and roles when product, sales, and support share one bench.",
                features: [
                  "Everything in Pro",
                  "Shared CRM + support chat",
                  "Roles & shared boards",
                  "Priority toolkit updates",
                ],
                ctaLabel: "Sign in",
                ctaHref: "/signin",
              })}
            </div>
          </div>
        </section>
      </main>

      <footer class="border-t border-base-300 px-5 py-8 text-sm font-normal text-base-content/60 md:px-10">
        <div class="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>Open Toolbox · product-team toolkit on Cloudflare Workers</p>
          <p class="flex flex-wrap gap-4">
            <a class="link link-hover" href="https://opentoolbox.io">opentoolbox.io</a>
            <a class="link link-hover" href="/design-system">Design system</a>
          </p>
        </div>
      </footer>
    </div>
    <div class="drawer-side z-20">
      <label for="nav-drawer" class="drawer-overlay" aria-label="Close menu"></label>
      <ul class="menu min-h-full w-72 bg-base-100 text-base">
        <li><a href="#features">Features</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="/signin">Sign in</a></li>
      </ul>
    </div>
  </div>
  <script>
    (() => {
      const canvas = document.getElementById("ot-hero-shader");
      if (!(canvas instanceof HTMLCanvasElement)) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;
      let raf = 0;
      let w = 0;
      let h = 0;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      function resize() {
        const rect = canvas.getBoundingClientRect();
        w = Math.max(1, Math.floor(rect.width));
        h = Math.max(1, Math.floor(rect.height));
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      function frame(t) {
        ctx.clearRect(0, 0, w, h);
        const tSec = t * 0.00012;
        const blobs = [
          { x: 0.18 + Math.sin(tSec) * 0.03, y: 0.3 + Math.cos(tSec * 0.8) * 0.04, r: 0.48, c: "40,112,248" },
          { x: 0.82 + Math.cos(tSec * 0.7) * 0.04, y: 0.25 + Math.sin(tSec * 1.1) * 0.03, r: 0.38, c: "248,208,48" },
          { x: 0.5 + Math.sin(tSec * 0.5) * 0.05, y: 0.75 + Math.cos(tSec * 0.9) * 0.03, r: 0.44, c: "40,112,248" },
        ];
        for (const b of blobs) {
          const gx = b.x * w;
          const gy = b.y * h;
          const gr = Math.max(w, h) * b.r;
          const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
          g.addColorStop(0, "rgba(" + b.c + ",0.22)");
          g.addColorStop(0.45, "rgba(" + b.c + ",0.08)");
          g.addColorStop(1, "rgba(" + b.c + ",0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }
        if (!reduce) raf = requestAnimationFrame(frame);
      }
      resize();
      frame(0);
      window.addEventListener("resize", () => {
        resize();
        if (reduce) frame(0);
      });
      if (!reduce) raf = requestAnimationFrame(frame);
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else if (!reduce) raf = requestAnimationFrame(frame);
      });
    })();
  </script>`;
}

export function stackFragment(details: {
  environment: string;
  when: string;
  colo: string;
}): string {
  const environment = escapeHtml(details.environment);
  const when = escapeHtml(details.when);
  const colo = escapeHtml(details.colo);

  return `<section id="stack-result" class="rounded-box border border-success/40 bg-base-100 p-6 md:p-8">
    <div class="flex flex-col gap-5">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h2 class="text-xl font-bold">Worker reply</h2>
        <span class="badge badge-success">HTMX swap</span>
      </div>
      <p class="text-sm font-normal leading-relaxed text-base-content/70">
        Hono rendered this fragment on the Worker. HTMX replaced the panel. The rest of the page stayed put.
      </p>
      <dl class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-box border border-base-300 bg-base-200/40 p-4">
          <dt class="text-xs font-medium uppercase tracking-wide text-base-content/50">Environment</dt>
          <dd class="mt-2 font-medium">${environment}</dd>
        </div>
        <div class="rounded-box border border-base-300 bg-base-200/40 p-4">
          <dt class="text-xs font-medium uppercase tracking-wide text-base-content/50">When</dt>
          <dd class="mt-2 font-medium">${when}</dd>
        </div>
        <div class="rounded-box border border-base-300 bg-base-200/40 p-4">
          <dt class="text-xs font-medium uppercase tracking-wide text-base-content/50">Colo</dt>
          <dd class="mt-2 font-medium">${colo}</dd>
        </div>
      </dl>
      <div>
        <button
          class="btn btn-outline btn-primary"
          hx-get="/stack"
          hx-target="#stack-result"
          hx-swap="outerHTML"
          hx-indicator="#stack-pending"
        >
          <span id="stack-pending" class="htmx-indicator loading loading-spinner loading-sm"></span>
          Ask again
        </button>
      </div>
    </div>
  </section>`;
}
