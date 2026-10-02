import { brandHeadLinks, brandLockup, icon } from "./brand";
import { escapeHtml } from "./html";

export function layout(
  css: string,
  body: string,
  options?: { title?: string; description?: string },
): string {
  const title = options?.title ?? "Toolbox · Open Toolbox";
  const description =
    options?.description ??
    "Open Toolbox on Cloudflare Workers. HTML from Hono, DaisyUI on Tailwind, and the Value Factory board.";
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

export function homePage(): string {
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
          <a href="#bench" class="link link-hover text-base-content">Bench</a>
          <a href="/factory" class="link link-hover text-base-content">Value Factory</a>
          <a href="/design-system" class="link link-hover text-base-content">Design system</a>
          <a href="#swap" class="link link-hover text-base-content">Swap</a>
        </nav>
        <div class="navbar-end gap-3">
          <a class="btn btn-primary btn-sm" href="/signin">Sign in</a>
        </div>
      </header>

      <main class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-16 page-shell">
        <section id="bench" class="flex flex-col gap-6 border-b border-base-300 pb-14">
          <div class="flex flex-wrap items-center gap-4">
            ${brandLockup({ href: null, size: "hero" })}
          </div>
          <p class="text-sm font-medium">Edge bench</p>
          <h1 class="text-3xl font-extrabold tracking-tight md:text-4xl">A Worker that answers in HTML.</h1>
          <p class="max-w-2xl text-base font-normal leading-relaxed text-base-content/75">
            Toolbox proves a site can live on Cloudflare Workers without a client framework.
            Hono writes the page. Tailwind and DaisyUI dress it. HTMX swaps one piece when you ask.
          </p>
          <div class="flex flex-wrap gap-3">
            <a href="/factory" class="btn btn-primary">${icon("layers")} Open Value Factory</a>
            <a href="#swap" class="btn btn-outline">${icon("zap")} Try the swap</a>
          </div>
        </section>

        <section id="stack" class="grid gap-8 border-b border-base-300 pb-14 md:grid-cols-3">
          <article class="flex flex-col gap-3">
            <div class="text-primary">${icon("layout", "icon icon-lg")}</div>
            <h2 class="text-lg font-bold">Hono</h2>
            <p class="text-sm font-normal leading-relaxed text-base-content/70">Routes return HTML. This page and the fragment below both come from the Worker.</p>
          </article>
          <article class="flex flex-col gap-3">
            <div class="text-primary">${icon("layers", "icon icon-lg")}</div>
            <h2 class="text-lg font-bold">DaisyUI</h2>
            <p class="text-sm font-normal leading-relaxed text-base-content/70">Navbar, buttons, and boards use the <code class="text-xs">toolbox</code> theme built from Coolors tokens.</p>
          </article>
          <article class="flex flex-col gap-3">
            <div class="text-primary">${icon("zap", "icon icon-lg")}</div>
            <h2 class="text-lg font-bold">HTMX</h2>
            <p class="text-sm font-normal leading-relaxed text-base-content/70">One request to <code class="text-xs">/stack</code> replaces a panel. No React, no extra page load.</p>
          </article>
        </section>

        <section class="flex flex-col gap-5 border-b border-base-300 pb-14 sm:flex-row sm:items-end sm:justify-between">
          <div class="max-w-xl">
            <h2 class="text-xl font-bold">Value Factory</h2>
            <p class="mt-3 text-sm font-normal leading-relaxed text-base-content/70">A kanban from research to done. The first board is public. Sign in when you want your own.</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <a class="btn btn-primary btn-sm" href="/b/building-opentoolbox">Building opentoolbox</a>
            <a class="btn btn-ghost btn-sm" href="/signin">Sign in</a>
          </div>
        </section>

        ${promptCard()}
      </main>

      <footer class="border-t border-base-300 px-5 py-8 text-sm font-normal text-base-content/60 md:px-10">
        Toolbox · HTML on Cloudflare Workers · <a class="link link-hover" href="https://opentoolbox.io">opentoolbox.io</a>
      </footer>
    </div>
    <div class="drawer-side z-20">
      <label for="nav-drawer" class="drawer-overlay" aria-label="Close menu"></label>
      <ul class="menu min-h-full w-72 bg-base-100 text-base">
        <li><a href="#bench">Bench</a></li>
        <li><a href="/factory">Value Factory</a></li>
        <li><a href="/b/building-opentoolbox">Building opentoolbox</a></li>
        <li><a href="/design-system">Design system</a></li>
        <li><a href="#swap">Swap</a></li>
      </ul>
    </div>
  </div>`;
}

function promptCard(): string {
  return `<section id="stack-result" class="rounded-box border border-base-300 bg-base-100 p-6 md:p-8">
    <div class="flex flex-col gap-5">
      <h2 id="swap" class="text-xl font-bold">Ask the worker</h2>
      <p class="text-sm font-normal leading-relaxed text-base-content/70">
        This panel is the first HTML response. The button calls a Hono route and HTMX swaps the reply into this same spot.
      </p>
      <div>
        <button
          class="btn btn-primary"
          hx-get="/stack"
          hx-target="#stack-result"
          hx-swap="outerHTML"
          hx-indicator="#stack-pending"
        >
          <span id="stack-pending" class="htmx-indicator loading loading-spinner loading-sm"></span>
          Check the stack
        </button>
      </div>
    </div>
  </section>`;
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
