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
  size?: "lg" | "md" | "sm";
  live?: boolean;
};

const FEATURES: FeatureTile[] = [
  {
    name: "kanban",
    title: "Kanban · Value Factory",
    description:
      "Ship from research to done on a live board. Open Building Open Toolbox and move work in public.",
    href: "/b/building-opentoolbox",
    size: "lg",
    live: true,
  },
  {
    name: "book",
    title: "Docs",
    description: "Specs, PRDs, and launch notes next to the work — not buried in another tab.",
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
    description: "Team threads that stay tied to boards, docs, and customer signals.",
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
    description: "Ask users what blocked them — and feed answers straight into the factory.",
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
  const live = feature.live
    ? `<span class="ot-bento-live">Live</span>`
    : `<span class="ot-bento-soon">In toolkit</span>`;
  const body = `<div class="ot-bento-icon text-primary">${icon(feature.name, "icon icon-lg")}</div>
      <div class="ot-bento-copy">
        <div class="ot-bento-title-row">
          <h3 class="ot-bento-title">${escapeHtml(feature.title)}</h3>
          ${live}
        </div>
        <p class="ot-bento-desc">${escapeHtml(feature.description)}</p>
      </div>`;
  if (feature.href) {
    return `<a class="${sizeClass} ot-bento-tile--link" href="${escapeHtml(feature.href)}">${body}<span class="ot-bento-cta">${icon("arrow-right", "icon icon-sm")} Open board</span></a>`;
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
          <a href="/factory" class="link link-hover text-base-content">Value Factory</a>
          <a href="/design-system" class="link link-hover text-base-content">Design system</a>
        </nav>
        <div class="navbar-end gap-3">
          <a class="btn btn-ghost btn-sm hidden sm:inline-flex" href="/signin">Sign in</a>
          <a class="btn btn-primary btn-sm" href="/factory">Get started</a>
        </div>
      </header>

      <main>
        <section class="ot-hero" aria-label="Open Toolbox hero">
          <div class="ot-hero-atmosphere" aria-hidden="true">
            <canvas id="ot-hero-shader" class="ot-hero-shader"></canvas>
            <div class="ot-hero-mesh"></div>
            <div class="ot-hero-glow ot-hero-glow--a"></div>
            <div class="ot-hero-glow ot-hero-glow--b"></div>
          </div>
          <div class="ot-hero-inner">
            ${brandLockup({ href: null, size: "hero", className: "ot-hero-brand" })}
            <h1 class="ot-hero-title">All the tools you need to grow your product</h1>
            <p class="ot-hero-support">
              Open Toolbox is the product-team toolkit — docs, canvas, kanban, CRM, chat, analytics,
              forms, popups, surveys, and bug reporting — so research to ship stays in one place.
            </p>
            <div class="ot-hero-cta">
              <a href="/factory" class="btn btn-primary">${icon("layers")} Open Value Factory</a>
              <a href="/signin" class="btn btn-outline">Get started</a>
              <a href="/signin" class="btn btn-ghost">Sign in</a>
            </div>
          </div>
        </section>

        <section id="features" class="ot-section">
          <div class="ot-section-head">
            <p class="ot-eyebrow">Toolkit</p>
            <h2 class="ot-section-title">One bench for product ops</h2>
            <p class="ot-section-support">
              Built for teams who refuse to glue ten apps together. Live Value Factory first;
              the rest of the kit ships beside it.
            </p>
          </div>
          <div class="ot-bento">
            ${tiles}
          </div>
        </section>

        <section id="pricing" class="ot-section ot-section--pricing">
          <div class="ot-section-head">
            <p class="ot-eyebrow">Pricing</p>
            <h2 class="ot-section-title">Start free. Grow when the team does.</h2>
            <p class="ot-section-support">
              No fake checkout. Paid tiers are coming soon — Free already opens Value Factory and sign-in today.
            </p>
          </div>
          <div class="ot-price-grid">
            ${pricingTier({
              name: "Free",
              price: "$0",
              note: "Forever for getting started",
              description: "Open the public board, sign in, and run Value Factory.",
              features: [
                "Public Value Factory board",
                "Magic-link sign in",
                "Share links & webhooks",
                "Design system on the edge",
              ],
              ctaLabel: "Open Value Factory",
              ctaHref: "/factory",
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
              ctaLabel: "Get started",
              ctaHref: "/signin",
              featured: true,
              badge: "Most useful next",
            })}
            ${pricingTier({
              name: "Team",
              price: "$49",
           