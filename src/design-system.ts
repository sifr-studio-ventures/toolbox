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
          <button class="btn btn-primary" type="button">Button · Bold 700</button>
          <button class="btn btn-outline" type="button">Outline</button>
        </div>
      </div>
    </div>`,
  );
}

function iconsSection(): string {
  const names = [
    "menu",
    "arrow-right",
    "layout",
    "layers",
    "zap",
    "check",
    "plus",
    "link",
    "share",
    "pencil",
    "trash",
    "mail",
    "home",
    "external-link",
  ] as const;

  return section(
    "icons",
    "Icons",
    "Chunky Lucide-style strokes (2.5) with round caps and joins — matches Poppins Bold and the soft 3D mark. Helper: icon() in src/brand.ts.",
    `<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      ${names
        .map(
          (name) => `<div class="flex items-center gap-3 rounded-box border border-base-300 px-4 py-4">
            <span class="text-primary">${icon(name, "icon icon-lg")}</span>
            <span class="font-mono text-xs">${name}</span>
          </div>`,
        )
        .join("")}
    </div>`,
  );
}

function spacingSection(): string {
  const gaps = [
    ["gap-2 / --space-2", "gap-2"],
    ["gap-3 / --space-3", "gap-3"],
    ["gap-4 / --space-4", "gap-4"],
    ["gap-6 / --space-6", "gap-6"],
    ["gap-8 / --space-8", "gap-8"],
    ["gap-10 / --space-10", "gap-10"],
  ] as const;

  return section(
    "spacing",
    "Spacing",
    "Roomier scale. CSS vars --space-1…12, --page-pad-x, --page-pad-y, --section-gap, --control-pad-*. Components use larger min-heights and padding.",
    `<div class="flex flex-col gap-5 rounded-box border border-base-300 p-6 md:p-8">
      ${gaps
        .map(
          ([label, gap]) =>
            `<div>
              <p class="mb-3 font-mono text-xs text-base-content/50">${label}</p>
              <div class="flex ${gap}">
                <span class="rounded-field bg-primary px-3 py-2 text-xs text-primary-content">A</span>
                <span class="rounded-field bg-primary px-3 py-2 text-xs text-primary-content">B</span>
                <span class="rounded-field bg-primary px-3 py-2 text-xs text-primary-content">C</span>
              </div>
            </div>`,
        )
        .join("")}
      <div class="border-t border-base-300 pt-5 text-sm text-base-content/70">
        <p>Page shell · <code class="text-xs">page-shell</code> → <code class="text-xs">--page-pad-x</code> 1.25rem / md 2.5rem, <code class="text-xs">--page-pad-y</code> 2.5rem</p>
        <p class="mt-2">Controls · buttons/inputs min-height 3rem, <code class="text-xs">--control-pad-x/y</code></p>
        <p class="mt-2">Base font · <code class="text-xs">html { font-size: 17px }</code></p>
      </div>
    </div>`,
  );
}

function radiiSection(): string {
  return section(
    "radii",
    "Radii",
    "Softer corners to sit with the chunky mark: 0.9rem boxes, 0.65rem fields and controls.",
    `<div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-box border border-base-300 p-5 text-sm">
        <p class="font-medium">rounded-box</p>
        <p class="mt-2 font-mono text-xs text-base-content/50">--radius-box · 0.9rem</p>
      </div>
      <div class="border border-base-300 bg-base-100 p-5 text-sm" style="border-radius: var(--radius-field)">
        <p class="font-medium">--radius-field</p>
        <p class="mt-2 font-mono text-xs text-base-content/50">0.65rem · inputs</p>
      </div>
      <div class="border border-base-300 bg-base-100 p-5 text-sm" style="border-radius: var(--radius-selector)">
        <p class="font-medium">--radius-selector</p>
        <p class="mt-2 font-mono text-xs text-base-content/50">0.65rem · buttons</p>
      </div>
    </div>`,
  );
}

function componentsSection(): string {
  const pieces = [
    [
      "Buttons",
      "Primary is Active. Taller hit targets. Icons sit beside labels with gap.",
      `<div class="flex flex-wrap gap-3">
        <button class="btn btn-primary" type="button">${icon("check")} Primary</button>
        <button class="btn btn-outline" type="button">Outline</button>
        <button class="btn btn-ghost" type="button">Ghost</button>
        <button class="btn btn-accent btn-sm" type="button">Accent</button>
        <button class="btn btn-primary btn-sm" type="button">${icon("plus", "icon icon-sm")} Small</button>
        <button class="btn btn-ghost btn-xs" type="button">Extra small</button>
        <button class="btn btn-primary" type="button">
          <span class="loading loading-spinner loading-sm"></span>
          Loading
        </button>
      </div>`,
    ],
    [
      "Inputs",
      "Taller fields. Prefer input-sm only in dense board columns.",
      `<div class="flex flex-col gap-4 sm:max-w-md">
        <label class="flex flex-col gap-2 text-sm">
          Email
          <input class="input w-full" type="email" placeholder="you@example.com" />
        </label>
        <label class="flex flex-col gap-2 text-sm">
          Board name
          <input class="input input-sm w-full" placeholder="Building opentoolbox" />
        </label>
        <label class="flex flex-col gap-2 text-sm">
          Notes
          <textarea class="textarea w-full" rows="3" placeholder="What still needs a decision?"></textarea>
        </label>
        <label class="flex flex-col gap-2 text-sm">
          Move to column
          <select class="select select-sm w-full">
            <option>Research</option>
            <option>Build</option>
            <option>Done</option>
          </select>
        </label>
        <label class="flex items-start gap-3 text-sm">
          <input type="checkbox" class="checkbox mt-1" checked />
          <span>Checklist item on a Value Factory card</span>
        </label>
      </div>`,
    ],
    [
      "Cards",
      "Roomier card-body padding. Light border, little shadow.",
      `<div class="grid gap-4 md:grid-cols-2">
        <article class="card border border-base-300 bg-base-100">
          <div class="card-body">
            <h4 class="card-title text-base">Bench card</h4>
            <p class="text-sm text-base-content/70">Quiet surface for stack notes.</p>
            <div class="card-actions">
              <button class="btn btn-primary btn-sm" type="button">Open</button>
            </div>
          </div>
        </article>
        <article class="card border border-base-300 bg-base-100">
          <div class="card-body">
            <div class="flex items-start justify-between gap-3">
              <h4 class="font-medium leading-snug">Board card</h4>
              <span class="badge badge-primary shrink-0">Value 8</span>
            </div>
            <p class="text-sm text-base-content/70">Bordered cards sit inside a column.</p>
          </div>
        </article>
      </div>`,
    ],
    [
      "Badges",
      "Short status on a card or reply. Pill radius, denser type.",
      `<div class="flex flex-wrap gap-3">
        <span class="badge badge-primary">Value 8</span>
        <span class="badge badge-ghost">Value 4</span>
        <span class="badge badge-success">HTMX swap</span>
        <span class="badge badge-warning">Warning</span>
      </div>`,
    ],
    [
      "Alerts",
      "Form and auth outcomes. Colors stay inside the Coolors set.",
      `<div class="flex flex-col gap-3">
        <div class="alert"><span>Default alert for a quiet notice.</span></div>
        <div class="alert alert-info"><span>Share this link. Anyone with it can read the board.</span></div>
        <div class="alert alert-success"><span>Check your inbox. The link expires in 30 minutes.</span></div>
        <div class="alert alert-warning"><span>Email sending is not available on this account.</span></div>
        <div class="alert alert-error"><span>That board name is already taken in this workspace.</span></div>
      </div>`,
    ],
    [
      "Modals",
      "Value Factory card editor shell.",
      `<div class="flex flex-col gap-4">
        <button class="btn btn-outline btn-sm w-fit" type="button" onclick="document.getElementById('design-card-dialog')?.showModal()">
          ${icon("pencil", "icon icon-sm")} Open card editor
        </button>
        <dialog id="design-card-dialog" class="modal">
          <div class="modal-box w-11/12 max-w-2xl">
            <h3 class="text-lg font-bold">Edit card</h3>
            <p class="mt-3 text-sm text-base-content/70">Same shell Value Factory uses when you press Edit.</p>
            <label class="mt-5 flex flex-col gap-2 text-sm">
              Title
              <input class="input w-full" value="Ship the design system page" />
            </label>
            <div class="modal-action">
              <button class="btn btn-primary" type="button" onclick="document.getElementById('design-card-dialog')?.close()">Save card</button>
              <button class="btn btn-ghost" type="button" onclick="document.getElementById('design-card-dialog')?.close()">Close</button>
            </div>
          </div>
          <form method="dialog" class="modal-backdrop"><button>close</button></form>
        </dialog>
      </div>`,
    ],
    [
      "Tables",
      "List surfaces for webhooks, owners, scores.",
      `<div class="overflow-x-auto rounded-box border border-base-300">
        <table class="table">
          <thead>
            <tr>
              <th>Card</th>
              <th>Owner</th>
              <th>Value</th>
              <th>Column</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Canonical host redirects</td>
              <td>Studio</td>
              <td><span class="badge badge-primary">9</span></td>
              <td>Done</td>
            </tr>
            <tr>
              <td>Magic link email</td>
              <td>Ops</td>
              <td><span class="badge badge-ghost">6</span></td>
              <td>Build</td>
            </tr>
            <tr>
              <td>Design system page</td>
              <td>Studio</td>
              <td><span class="badge badge-primary">8</span></td>
              <td>Research</td>
            </tr>
          </tbody>
        </table>
      </div>`,
    ],
    [
      "Nav",
      "Drawer + navbar with logo mark on every shell.",
      `<div class="rounded-box border border-base-300 bg-base-100">
        <header class="navbar border-b border-base-300">
          <div class="navbar-start gap-3">
            <button class="btn btn-ghost btn-square lg:hidden" type="button" aria-label="Menu sample">
              ${icon("menu", "icon icon-lg")}
            </button>
            ${brandLockup({ href: null, size: "nav" })}
          </div>
          <nav class="navbar-center hidden gap-8 text-sm lg:flex">
            <a class="link link-hover text-base-content" href="/factory">Value Factory</a>
            <a class="link link-hover text-base-content" href="/design-system">Design system</a>
          </nav>
          <div class="navbar-end">
            <a class="btn btn-primary btn-sm" href="/signin">Sign in</a>
          </div>
        </header>
        <ul class="menu w-full text-sm lg:hidden">
          <li><a href="/factory">Value Factory</a></li>
          <li><a href="/design-system">Design system</a></li>
          <li><a href="/">Home</a></li>
        </ul>
      </div>`,
    ],
  ] as const;

  const body = `<div class="flex flex-col gap-10">
    ${pieces
      .map(
        ([name, when, example]) =>
          `<article class="flex flex-col gap-4 border-t border-base-300 pt-8 first:border-t-0 first:pt-0">
            <div>
              <h3 class="text-lg font-bold">${name}</h3>
              <p class="mt-2 text-sm text-base-content/65">${when}</p>
            </div>
            <div>${example}</div>
          </article>`,
      )
      .join("")}
  </div>`;

  return section(
    "components",
    "Components",
    "Live DaisyUI pieces already used on the bench and Value Factory, with the larger spacing scale.",
    body,
  );
}
