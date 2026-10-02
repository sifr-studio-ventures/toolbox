import { brandLockup, icon } from "./brand";

export function designSystemPage(): string {
  return `<div class="drawer">
    <input id="nav-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex min-h-screen flex-col bg-base-100">
      <header class="navbar border-b border-base-300 bg-base-100">
        <div class="navbar-start gap-3">
          <label for="nav-drawer" class="btn btn-ghost btn-square lg:hidden" aria-label="Open menu">
            ${icon("menu", "icon icon-lg")}
          </label>
          ${brandLockup({ size: "nav" })}
        </div>
        <nav class="navbar-center hidden gap-8 text-sm lg:flex">
          <a href="#logo" class="link link-hover text-base-content">Logo</a>
          <a href="#color" class="link link-hover text-base-content">Color</a>
          <a href="#type" class="link link-hover text-base-content">Type</a>
          <a href="#icons" class="link link-hover text-base-content">Icons</a>
          <a href="#spacing" class="link link-hover text-base-content">Spacing</a>
          <a href="#radii" class="link link-hover text-base-content">Radii</a>
          <a href="#components" class="link link-hover text-base-content">Components</a>
        </nav>
        <div class="navbar-end gap-3">
          <a class="btn btn-ghost btn-sm" href="/">Home</a>
          <a class="btn btn-primary btn-sm" href="/signin">Sign in</a>
        </div>
      </header>

      <main class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-16 page-shell">
        <header class="flex flex-col gap-4 border-b border-base-300 pb-12">
          <p class="text-sm font-medium">Design system</p>
          <h1 class="text-3xl font-extrabold tracking-tight md:text-4xl">Tokens and components</h1>
          <p class="max-w-2xl text-base leading-relaxed text-base-content/75">
            Coolors dark/work and blue/calm palettes, near-navy text
            <code class="rounded-field bg-base-200 px-2 py-1 text-sm">--text-navy</code>
            <code class="rounded-field bg-base-200 px-2 py-1 text-sm">#021028</code>,
            Active <code class="rounded-field bg-base-200 px-2 py-1 text-sm">#023047</code>,
            Poppins, the soft 3D PNG mark, chunky icons, and roomier spacing on the DaisyUI theme
            <code class="rounded-field bg-base-200 px-2 py-1 text-sm">toolbox</code>.
          </p>
        </header>

        ${logoSection()}
        ${colorSection()}
        ${typeSection()}
        ${iconsSection()}
        ${spacingSection()}
        ${radiiSection()}
        ${componentsSection()}
      </main>

      <footer class="border-t border-base-300 px-5 py-8 text-sm text-base-content/60 md:px-10">
        Toolbox · design tokens from <code class="text-xs">src/styles.css</code>
      </footer>
    </div>
    <div class="drawer-side z-20">
      <label for="nav-drawer" class="drawer-overlay" aria-label="Close menu"></label>
      <ul class="menu min-h-full w-72 bg-base-100 text-base">
        <li><a href="#logo">Logo</a></li>
        <li><a href="#color">Color</a></li>
        <li><a href="#type">Type</a></li>
        <li><a href="#icons">Icons</a></li>
        <li><a href="#spacing">Spacing</a></li>
        <li><a href="#radii">Radii</a></li>
        <li><a href="#components">Components</a></li>
        <li><a href="/">Home</a></li>
      </ul>
    </div>
  </div>`;
}

function section(id: string, title: string, lead: string, body: string): string {
  return `<section id="${id}" class="flex flex-col gap-6">
    <div class="flex flex-col gap-3">
      <h2 class="text-2xl font-bold tracking-tight">${title}</h2>
      <p class="max-w-2xl text-sm leading-relaxed text-base-content/70">${lead}</p>
    </div>
    ${body}
  </section>`;
}

function swatch(name: string, hex: string, cssVar: string): string {
  return `<div class="flex flex-col gap-3">
    <div class="h-16 w-full rounded-box border border-base-300" style="background:${hex}" title="${hex}"></div>
    <div class="min-w-0">
      <p class="truncate text-sm font-medium">${name}</p>
      <p class="font-mono text-xs text-base-content/60">${hex}</p>
      <p class="truncate font-mono text-xs text-base-content/50">${cssVar}</p>
    </div>
  </div>`;
}

function logoSection(): string {
  return section(
    "logo",
    "Logo",
    "PNG mark only — soft 3D open toolbox. No SVG part kit. Favicon crops of the same mark at 16 / 32 / 48.",
    `<div class="flex flex-col gap-8">
      <div class="flex flex-col gap-6 rounded-box border border-base-300 bg-base-100 p-6 md:p-8">
        ${brandLockup({ href: null, size: "display" })}
        <p class="text-sm text-base-content/70">
          Source <code class="text-xs">brand-png/open-toolbox-mark.png.b64</code> → <code class="text-xs">public/open-toolbox-mark.png</code>
          · served at <code class="text-xs">/open-toolbox-mark.png</code>
          · favicon <code class="text-xs">/favicon.png</code>
        </p>
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="flex flex-col items-center gap-3 rounded-box border border-base-300 p-5">
          <img src="/favicon-16.png" width="16" height="16" alt="" class="image-pixelated" />
          <p class="font-mono text-xs text-base-content/60">16×16</p>
        </div>
        <div class="flex flex-col items-center gap-3 rounded-box border border-base-300 p-5">
          <img src="/favicon-32.png" width="32" height="32" alt="" />
          <p class="font-mono text-xs text-base-content/60">32×32</p>
        </div>
        <div class="flex flex-col items-center gap-3 rounded-box border border-base-300 p-5">
          <img src="/favicon-48.png" width="48" height="48" alt="" />
          <p class="font-mono text-xs text-base-content/60">48×48</p>
        </div>
      </div>
    </div>`,
  );
}

function colorSection(): string {
  const darkWork = [
    ["Ink black", "#000814", "--ink-black"],
    ["Prussian blue", "#001d3d", "--prussian-blue"],
    ["Regal navy", "#003566", "--regal-navy"],
    ["School bus yellow", "#ffc300", "--school-bus-yellow"],
    ["Gold", "#ffd60a", "--gold"],
  ] as const;

  const blueCalm = [
    ["Deep twilight", "#03045e", "--deep-twilight"],
    ["French blue", "#023e8a", "--french-blue"],
    ["Bright teal blue", "#0077b6", "--bright-teal-blue"],
    ["Blue green", "#0096c7", "--blue-green"],
    ["Turquoise surf", "#00b4d8", "--turquoise-surf"],
    ["Sky aqua", "#48cae4", "--sky-aqua"],
    ["Frosted blue", "#90e0ef", "--frosted-blue"],
    ["Frosted blue 2", "#ade8f4", "--frosted-blue-2"],
    ["Light cyan", "#caf0f8", "--light-cyan"],
  ] as const;

  const body = `<div class="flex flex-col gap-10">
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="rounded-box border border-base-300 bg-base-100 p-5">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-medium">Near-navy text</p>
            <p class="mt-2 text-sm text-base-content/70">Brand, headings, and body.</p>
          </div>
          <div class="flex items-center gap-4">
            <span class="inline-block size-12 rounded-box border border-base-300" style="background:#021028"></span>
            <div>
              <p class="font-mono text-sm">#021028</p>
              <p class="font-mono text-xs text-base-content/50">--text-navy</p>
            </div>
          </div>
        </div>
      </div>
      <div class="rounded-box border border-base-300 bg-base-100 p-5">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-medium">Active / primary</p>
            <p class="mt-2 text-sm text-base-content/70">CTAs, selected states, and focus rings.</p>
          </div>
          <div class="flex items-center gap-4">
            <span class="inline-block size-12 rounded-box border border-base-300" style="background:#023047"></span>
            <div>
              <p class="font-mono text-sm">#023047</p>
              <p class="font-mono text-xs text-base-content/50">--active · primary</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h3 class="text-sm font-bold uppercase tracking-wide text-base-content/60">Dark / work</h3>
      <div class="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
        ${darkWork.map(([n, h, v]) => swatch(n, h, v)).join("")}
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h3 class="text-sm font-bold uppercase tracking-wide text-base-content/60">Blue / calm</h3>
      <div class="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
        ${blueCalm.map(([n, h, v]) => swatch(n, h, v)).join("")}
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h3 class="text-sm font-bold uppercase tracking-wide text-base-content/60">DaisyUI roles</h3>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        <div class="rounded-box bg-primary px-4 py-4 text-sm text-primary-content">primary</div>
        <div class="rounded-box bg-secondary px-4 py-4 text-sm text-secondary-content">secondary</div>
        <div class="rounded-box bg-accent px-4 py-4 text-sm text-accent-content">accent</div>
        <div class="rounded-box bg-neutral px-4 py-4 text-sm text-neutral-content">neutral</div>
        <div class="rounded-box bg-info px-4 py-4 text-sm text-info-content">info</div>
        <div class="rounded-box bg-success px-4 py-4 text-sm text-success-content">success</div>
        <div class="rounded-box bg-warning px-4 py-4 text-sm text-warning-content">warning</div>
        <div class="rounded-box bg-error px-4 py-4 text-sm text-error-content">error</div>
      </div>
    </div>
  </div>`;

  return section(
    "color",
    "Color",
    "Two Coolors palettes plus Active. UI text is --text-navy (#021028). Accent yellow is spare. Blue ramp covers info, links, and calm surfaces.",
    body,
  );
}

function typeSection(): string {
  return section(
    "type",
    "Type",
    "Poppins sitewide. ExtraBold 800 for brand and big titles, Bold 700 for section titles and buttons, Regular/Medium 400/500 for body. Base size is 17px. All UI text uses --text-navy.",
    `<div class="flex flex-col gap-6">
      <div class="rounded-box border border-base-300 bg-base-100 p-5">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-medium">Near-navy text</p>
            <p class="mt-2 text-sm text-base-content/70">Brand wordmark, headings, and body. Sampled from the Toolbox wordmark in the logo.</p>
          </div>
          <div class="flex items-center gap-4">
            <span class="inline-block size-12 rounded-box border border-base-300" style="background:#021028"></span>
            <div>
              <p class="font-mono text-sm">#021028</p>
              <p class="font-mono text-xs text-base-content/50">--text-navy · base-content</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4 rounded-box border border-base-300 p-6 md:p-8">
        ${brandLockup({ href: null, size: "nav" })}
        <p class="text-sm font-medium">Section label · Medium 500</p>
        <p class="text-3xl font-extrabold tracking-tight md:text-4xl">Page title · ExtraBold 800</p>
        <p class="text-xl font-bold">Section title · Bold 700</p>
        <p class="text-base font-normal leading-relaxed text-base-content/75">
          Body copy · Regular 400. Soft opacity for supporting sentences. One near-navy for Open and Toolbox — no blue/black split.
        </p>
        <p class="text-sm font-medium text-base-content/60">Supporting note · Medium 500</p>
        <p class="text-xs font-normal text-base-content/50">Meta · Regular 400</p>
        <div class="flex flex-wrap gap-3 pt-3">
        `
}