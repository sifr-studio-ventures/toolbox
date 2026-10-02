export function designSystemPage(): string {
  return `<div class="drawer">
    <input id="nav-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex min-h-screen flex-col bg-base-100">
      <header class="navbar border-b border-base-300 bg-base-100 px-4 md:px-8">
        <div class="navbar-start gap-2">
          <label for="nav-drawer" class="btn btn-ghost btn-square lg:hidden" aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </label>
          <a class="brand-mark text-lg tracking-tight" href="/">Toolbox</a>
        </div>
        <nav class="navbar-center hidden gap-5 text-sm lg:flex">
          <a href="#color" class="link link-hover text-base-content">Color</a>
          <a href="#type" class="link link-hover text-base-content">Type</a>
          <a href="#spacing" class="link link-hover text-base-content">Spacing</a>
          <a href="#radii" class="link link-hover text-base-content">Radii</a>
          <a href="#components" class="link link-hover text-base-content">Components</a>
        </nav>
        <div class="navbar-end gap-2">
          <a class="btn btn-ghost btn-sm" href="/">Home</a>
          <a class="btn btn-primary btn-sm" href="/signin">Sign in</a>
        </div>
      </header>

      <main class="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-14 px-4 py-12 md:px-8">
        <header class="flex flex-col gap-3 border-b border-base-300 pb-10">
          <p class="text-sm font-medium">Design system</p>
          <h1 class="text-3xl font-extrabold tracking-tight md:text-4xl">Tokens and components</h1>
          <p class="max-w-2xl text-base leading-relaxed text-base-content/75">
            Coolors dark/work and blue/calm palettes, near-navy text
            <code class="rounded bg-base-200 px-1.5 py-0.5 text-sm">--text-navy</code>
            <code class="rounded bg-base-200 px-1.5 py-0.5 text-sm">#021028</code>,
            Active <code class="rounded bg-base-200 px-1.5 py-0.5 text-sm">#023047</code>,
            Poppins, and the DaisyUI theme <code class="rounded bg-base-200 px-1.5 py-0.5 text-sm">toolbox</code>.
            Same classes the Worker returns on home and Value Factory.
          </p>
        </header>

        ${colorSection()}
        ${typeSection()}
        ${spacingSection()}
        ${radiiSection()}
        ${componentsSection()}
      </main>

      <footer class="border-t border-base-300 px-4 py-6 text-sm text-base-content/60 md:px-8">
        Toolbox · design tokens from <code class="text-xs">src/styles.css</code>
      </footer>
    </div>
    <div class="drawer-side z-20">
      <label for="nav-drawer" class="drawer-overlay" aria-label="Close menu"></label>
      <ul class="menu min-h-full w-64 bg-base-100 p-4 text-base">
        <li><a href="#color">Color</a></li>
        <li><a href="#type">Type</a></li>
        <li><a href="#spacing">Spacing</a></li>
        <li><a href="#radii">Radii</a></li>
        <li><a href="#components">Components</a></li>
        <li><a href="/">Home</a></li>
      </ul>
    </div>
  </div>`;
}

function section(id: string, title: string, lead: string, body: string): string {
  return `<section id="${id}" class="flex flex-col gap-5">
    <div class="flex flex-col gap-2">
      <h2 class="text-xl font-bold tracking-tight">${title}</h2>
      <p class="max-w-2xl text-sm leading-relaxed text-base-content/70">${lead}</p>
    </div>
    ${body}
  </section>`;
}

function swatch(name: string, hex: string, cssVar: string): string {
  return `<div class="flex flex-col gap-2">
    <div class="h-14 w-full rounded border border-base-300" style="background:${hex}" title="${hex}"></div>
    <div class="min-w-0">
      <p class="truncate text-sm font-medium">${name}</p>
      <p class="font-mono text-xs text-base-content/60">${hex}</p>
      <p class="truncate font-mono text-xs text-base-content/50">${cssVar}</p>
    </div>
  </div>`;
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

  const body = `<div class="flex flex-col gap-8">
    <div class="grid gap-3 sm:grid-cols-2">
      <div class="rounded border border-base-300 bg-base-100 p-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-medium">Near-navy text</p>
            <p class="mt-1 text-sm text-base-content/70">Brand, headings, and body.</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="inline-block size-10 rounded border border-base-300" style="background:#021028"></span>
            <div>
              <p class="font-mono text-sm">#021028</p>
              <p class="font-mono text-xs text-base-content/50">--text-navy</p>
            </div>
          </div>
        </div>
      </div>
      <div class="rounded border border-base-300 bg-base-100 p-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-medium">Active / primary</p>
            <p class="mt-1 text-sm text-base-content/70">CTAs, selected states, and focus rings.</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="inline-block size-10 rounded border border-base-300" style="background:#023047"></span>
            <div>
              <p class="font-mono text-sm">#023047</p>
              <p class="font-mono text-xs text-base-content/50">--active · primary</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <h3 class="text-sm font-bold uppercase tracking-wide text-base-content/60">Dark / work</h3>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        ${darkWork.map(([n, h, v]) => swatch(n, h, v)).join("")}
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <h3 class="text-sm font-bold uppercase tracking-wide text-base-content/60">Blue / calm</h3>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        ${blueCalm.map(([n, h, v]) => swatch(n, h, v)).join("")}
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <h3 class="text-sm font-bold uppercase tracking-wide text-base-content/60">DaisyUI roles</h3>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        <div class="rounded bg-primary px-3 py-3 text-sm text-primary-content">primary</div>
        <div class="rounded bg-secondary px-3 py-3 text-sm text-secondary-content">secondary</div>
        <div class="rounded bg-accent px-3 py-3 text-sm text-accent-content">accent</div>
        <div class="rounded bg-neutral px-3 py-3 text-sm text-neutral-content">neutral</div>
        <div class="rounded bg-info px-3 py-3 text-sm text-info-content">info</div>
        <div class="rounded bg-success px-3 py-3 text-sm text-success-content">success</div>
        <div class="rounded bg-warning px-3 py-3 text-sm text-warning-content">warning</div>
        <div class="rounded bg-error px-3 py-3 text-sm text-error-content">error</div>
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
    "Poppins sitewide. ExtraBold 800 for brand and big titles, Bold 700 for section titles and buttons, Regular/Medium 400/500 for body. All UI text uses --text-navy.",
    `<div class="flex flex-col gap-5">
      <div class="rounded border border-base-300 bg-base-100 p-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-medium">Near-navy text</p>
            <p class="mt-1 text-sm text-base-content/70">Brand wordmark, headings, and body. Sampled from the Toolbox wordmark in the logo.</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="inline-block size-10 rounded border border-base-300" style="background:#021028"></span>
            <div>
              <p class="font-mono text-sm">#021028</p>
              <p class="font-mono text-xs text-base-content/50">--text-navy · base-content</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-3 rounded border border-base-300 p-5">
        <p class="brand-mark text-lg tracking-tight">Toolbox</p>
        <p class="text-sm font-medium">Section label · Medium 500</p>
        <p class="text-3xl font-extrabold tracking-tight md:text-4xl">Page title · ExtraBold 800</p>
        <p class="text-xl font-bold">Section title · Bold 700</p>
        <p class="text-base font-normal leading-relaxed text-base-content/75">
          Body copy · Regular 400. Soft opacity for supporting sentences. One near-navy for Open and Toolbox — no blue/black split.
        </p>
        <p class="text-sm font-medium text-base-content/60">Supporting note · Medium 500</p>
        <p class="text-xs font-normal text-base-content/50">Meta · Regular 400</p>
        <div class="flex flex-wrap gap-2 pt-2">
          <button class="btn btn-primary" type="button">Button · Bold 700</button>
          <button class="btn btn-outline" type="button">Outline</button>
        </div>
      </div>
    </div>`,
  );
}

function spacingSection(): string {
  const gaps = [
    ["gap-1", "gap-1"],
    ["gap-2", "gap-2"],
    ["gap-3", "gap-3"],
    ["gap-4", "gap-4"],
    ["gap-6", "gap-6"],
    ["gap-10", "gap-10"],
  ] as const;

  return section(
    "spacing",
    "Spacing",
    "Stack with gap utilities. Page padding is px-4, then md:px-8.",
    `<div class="flex flex-col gap-4 rounded border border-base-300 p-5">
      ${gaps
        .map(
          ([label, gap]) =>
            `<div>
              <p class="mb-2 font-mono text-xs text-base-content/50">${label}</p>
              <div class="flex ${gap}">
                <span class="rounded bg-primary px-2.5 py-1.5 text-xs text-primary-content">A</span>
                <span class="rounded bg-primary px-2.5 py-1.5 text-xs text-primary-content">B</span>
                <span class="rounded bg-primary px-2.5 py-1.5 text-xs text-primary-content">C</span>
              </div>
            </div>`,
        )
        .join("")}
      <p class="border-t border-base-300 pt-4 text-sm text-base-content/70">
        Page padding · <code class="text-xs">px-4 py-8 md:px-8</code> on factory,
        <code class="text-xs">px-4 py-10 md:px-8</code> on home.
      </p>
    </div>`,
  );
}

function radiiSection(): string {
  return section(
    "radii",
    "Radii",
    "Tighter Cloudflare-like corners: 0.5rem boxes, 0.375rem fields and controls.",
    `<div class="grid gap-3 sm:grid-cols-3">
      <div class="rounded-box border border-base-300 p-4 text-sm">
        <p class="font-medium">rounded-box</p>
        <p class="mt-1 font-mono text-xs text-base-content/50">--radius-box · 0.5rem</p>
      </div>
      <div class="border border-base-300 bg-base-100 p-4 text-sm" style="border-radius: var(--radius-field)">
        <p class="font-medium">--radius-field</p>
        <p class="mt-1 font-mono text-xs text-base-content/50">0.375rem · inputs</p>
      </div>
      <div class="border border-base-300 bg-base-100 p-4 text-sm" style="border-radius: var(--radius-selector)">
        <p class="font-medium">--radius-selector</p>
        <p class="mt-1 font-mono text-xs text-base-content/50">0.375rem · buttons</p>
      </div>
    </div>`,
  );
}

function componentsSection(): string {
  const pieces = [
    [
      "Buttons",
      "Primary is Active. Outline and ghost stay quiet. Accent is spare.",
      `<div class="flex flex-wrap gap-2">
        <button class="btn btn-primary" type="button">Primary</button>
        <button class="btn btn-outline" type="button">Outline</button>
        <button class="btn btn-ghost" type="button">Ghost</button>
        <button class="btn btn-accent btn-sm" type="button">Accent</button>
        <button class="btn btn-primary btn-sm" type="button">Small</button>
        <button class="btn btn-ghost btn-xs" type="button">Extra small</button>
        <button class="btn btn-primary" type="button">
          <span class="loading loading-spinner loading-sm"></span>
          Loading
        </button>
      </div>`,
    ],
    [
      "Inputs",
      "Email, board names, card fields. Prefer input-sm in dense columns.",
      `<div class="flex flex-col gap-3 sm:max-w-md">
        <label class="flex flex-col gap-1 text-sm">
          Email
          <input class="input w-full" type="email" placeholder="you@example.com" />
        </label>
        <label class="flex flex-col gap-1 text-sm">
          Board name
          <input class="input input-sm w-full" placeholder="Building opentoolbox" />
        </label>
        <label class="flex flex-col gap-1 text-sm">
          Notes
          <textarea class="textarea w-full" rows="3" placeholder="What still needs a decision?"></textarea>
        </label>
        <label class="flex flex-col gap-1 text-sm">
          Move to column
          <select class="select select-sm w-full">
            <option>Research</option>
            <option>Build</option>
            <option>Done</option>
          </select>
        </label>
        <label class="flex items-start gap-2 text-sm">
          <input type="checkbox" class="checkbox checkbox-xs mt-0.5" checked />
          <span>Checklist item on a Value Factory card</span>
        </label>
      </div>`,
    ],
    [
      "Cards",
      "Light border, little shadow. Actions in card-actions.",
      `<div class="grid gap-3 md:grid-cols-2">
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
          <div class="card-body gap-3 p-4">
            <div class="flex items-start justify-between gap-2">
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
      "Short status on a card or reply.",
      `<div class="flex flex-wrap gap-2">
        <span class="badge badge-primary">Value 8</span>
        <span class="badge badge-ghost">Value 4</span>
        <span class="badge badge-success">HTMX swap</span>
        <span class="badge badge-warning">Warning</span>
      </div>`,
    ],
    [
      "Alerts",
      "Form and auth outcomes. Colors stay inside the Coolors set.",
      `<div class="flex flex-col gap-2">
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
      `<div class="flex flex-col gap-3">
        <button class="btn btn-outline btn-sm w-fit" type="button" onclick="document.getElementById('design-card-dialog')?.showModal()">
          Open card editor
        </button>
        <dialog id="design-card-dialog" class="modal">
          <div class="modal-box w-11/12 max-w-2xl">
            <h3 class="text-lg font-bold">Edit card</h3>
            <p class="mt-2 text-sm text-base-content/70">Same shell Value Factory uses when you press Edit.</p>
            <label class="mt-4 flex flex-col gap-1 text-sm">
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
      `<div class="overflow-x-auto rounded border border-base-300">
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
      "Drawer + navbar on every shell.",
      `<div class="rounded border border-base-300 bg-base-100">
        <header class="navbar border-b border-base-300 px-4">
          <div class="navbar-start gap-2">
            <button class="btn btn-ghost btn-square lg:hidden" type="button" aria-label="Menu sample">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <span class="brand-mark text-lg tracking-tight">Toolbox</span>
          </div>
          <nav class="navbar-center hidden gap-5 text-sm lg:flex">
            <a class="link link-hover text-base-content" href="/factory">Value Factory</a>
            <a class="link link-hover text-base-content" href="/design-system">Design system</a>
          </nav>
          <div class="navbar-end">
            <a class="btn btn-primary btn-sm" href="/signin">Sign in</a>
          </div>
        </header>
        <ul class="menu w-full p-2 text-sm lg:hidden">
          <li><a href="/factory">Value Factory</a></li>
          <li><a href="/design-system">Design system</a></li>
          <li><a href="/">Home</a></li>
        </ul>
      </div>`,
    ],
  ] as const;

  const body = `<div class="flex flex-col gap-8">
    ${pieces
      .map(
        ([name, when, example]) =>
          `<article class="flex flex-col gap-3 border-t border-base-300 pt-6 first:border-t-0 first:pt-0">
            <div>
              <h3 class="text-base font-bold">${name}</h3>
              <p class="mt-1 text-sm text-base-content/65">${when}</p>
            </div>
            <div>${example}</div>
          </article>`,
      )
      .join("")}
  </div>`;

  return section(
    "components",
    "Components",
    "Live DaisyUI pieces already used on the bench and Value Factory.",
    body,
  );
}
