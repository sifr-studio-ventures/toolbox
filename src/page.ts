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
    <style>${css}</style>
    <script src="https://unpkg.com/htmx.org@2.0.7"></script>
  </head>
  <body class="min-h-screen bg-base-100 text-base-content">
    ${body}
  </body>
</html>`;
}

export function homePage(): string {
  return `<div class="drawer">
    <input id="nav-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex min-h-screen flex-col">
      <header class="navbar border-b border-base-300 bg-base-100 px-4 md:px-8">
        <div class="navbar-start gap-2">
          <label for="nav-drawer" class="btn btn-ghost btn-square lg:hidden" aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </label>
          <a class="text-lg font-semibold tracking-tight" href="/">Toolbox</a>
        </div>
        <nav class="navbar-center hidden gap-5 text-sm lg:flex">
          <a href="#bench" class="link link-hover text-base-content">Bench</a>
          <a href="/factory" class="link link-hover text-base-content">Value Factory</a>
          <a href="/design-system" class="link link-hover text-base-content">Design system</a>
          <a href="#swap" class="link link-hover text-base-content">Swap</a>
        </nav>
        <div class="navbar-end gap-2">
          <a class="btn btn-primary btn-sm" href="/signin">Sign in</a>
        </div>
      </header>

      <main class="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-4 py-12 md:px-8">
        <section id="bench" class="flex flex-col gap-5 border-b border-base-300 pb-12">
          <p class="text-sm font-medium text-primary">Edge bench</p>
          <h1 class="text-3xl font-semibold tracking-tight md:text-4xl">A Worker that answers in HTML.</h1>
          <p class="max-w-2xl text-base leading-relaxed text-base-content/75">
            Toolbox proves a site can live on Cloudflare Workers without a client framework.
            Hono writes the page. Tailwind and DaisyUI dress it. HTMX swaps one piece when you ask.
          </p>
          <div class="flex flex-wrap gap-2">
            <a href="/factory" class="btn btn-primary">Open Value Factory</a>
            <a href="#swap" class="btn btn-outline">Try the swap</a>
          </div>
        </section>

        <section id="stack" class="grid gap-6 border-b border-base-300 pb-12 md:grid-cols-3">
          <article class="flex flex-col gap-2">
            <h2 class="text-base font-semibold">Hono</h2>
            <p class="text-sm leading-relaxed text-base-content/70">Routes return HTML. This page and the fragment below both come from the Worker.</p>
          </article>
          <article class="flex flex-col gap-2">
            <h2 class="text-base font-semibold">DaisyUI</h2>
            <p class="text-sm leading-relaxed text-base-content/70">Navbar, buttons, and boards use the <code class="text-xs">toolbox</code> theme built from Coolors tokens.</p>
          </article>
          <article class="flex flex-col gap-2">
            <h2 class="text-base font-semibold">HTMX</h2>
            <p class="text-sm leading-relaxed text-base-content/70">One request to <code class="text-xs">/stack</code> replaces a panel. No React, no extra page load.</p>
          </article>
        </section>

        <section class="flex flex-col gap-4 border-b border-base-300 pb-12 sm:flex-row sm:items-end sm:justify-between">
          <div class="max-w-xl">
            <h2 class="text-xl font-semibold">Value Factory</h2>
            <p class="mt-2 text-sm leading-relaxed text-base-content/70">A kanban from research to done. The first board is public. Sign in when you want your own.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <a class="btn btn-primary btn-sm" href="/b/building-opentoolbox">Building opentoolbox</a>
            <a class="btn btn-ghost btn-sm" href="/signin">Sign in</a>
          </div>
        </section>

        ${promptCard()}
      </main>

      <footer class="border-t border-base-300 px-4 py-6 text-sm text-base-content/60 md:px-8">
        Toolbox · HTML on Cloudflare Workers · <a class="link link-hover" href="https://opentoolbox.io">opentoolbox.io</a>
      </footer>
    </div>
    <div class="drawer-side z-20">
      <label for="nav-drawer" class="drawer-overlay" aria-label="Close menu"></label>
      <ul class="menu min-h-full w-64 bg-base-100 p-4 text-base">
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
  return `<section id="stack-result" class="rounded border border-base-300 bg-base-100 p-5">
    <div class="flex flex-col gap-4">
      <h2 id="swap" class="text-xl font-semibold">Ask the worker</h2>
      <p class="text-sm leading-relaxed text-base-content/70">
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

  return `<section id="stack-result" class="rounded border border-success/40 bg-base-100 p-5">
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-xl font-semibold">Worker reply</h2>
        <span class="badge badge-success">HTMX swap</span>
      </div>
      <p class="text-sm leading-relaxed text-base-content/70">
        Hono rendered this fragment on the Worker. HTMX replaced the panel. The rest of the page stayed put.
      </p>
      <dl class="grid gap-3 sm:grid-cols-3">
        <div class="rounded border border-base-300 bg-base-200/40 p-3">
          <dt class="text-xs uppercase tracking-wide text-base-content/50">Environment</dt>
          <dd class="mt-1 font-medium">${environment}</dd>
        </div>
        <div class="rounded border border-base-300 bg-base-200/40 p-3">
          <dt class="text-xs uppercase tracking-wide text-base-content/50">When</dt>
          <dd class="mt-1 font-medium">${when}</dd>
        </div>
        <div class="rounded border border-base-300 bg-base-200/40 p-3">
          <dt class="text-xs uppercase tracking-wide text-base-content/50">Colo</dt>
          <dd class="mt-1 font-medium">${colo}</dd>
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
