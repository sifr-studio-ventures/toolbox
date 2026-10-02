export function designSystemPage(): string {
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
        <nav class="navbar-center hidden gap-6 text-sm lg:flex">
          <a href="#tokens" class="link link-hover">Tokens</a>
          <a href="#components" class="link link-hover">Components</a>
          <a href="/factory" class="link link-hover">Value Factory</a>
        </nav>
        <div class="navbar-end gap-2">
          <a class="btn btn-ghost btn-sm" href="/">Bench</a>
          <a class="btn btn-primary btn-sm" href="/signin">Sign in</a>
        </div>
      </header>

      <main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10 md:px-8">
        <section class="flex flex-col gap-3">
          <p class="text-sm font-medium uppercase tracking-[0.16em] text-primary">Design system</p>
          <h1 class="text-4xl font-semibold leading-tight md:text-5xl">The pieces Toolbox already ships.</h1>
          <p class="max-w-2xl text-base leading-relaxed text-base-content/80">
            This page documents the DaisyUI theme named <code class="text-sm">sifr</code>, the CSS
            variables in <code class="text-sm">src/styles.css</code>, and the components used on the
            bench and Value Factory. Live examples only — the same classes the Worker returns today.
          </p>
        </section>

        ${tokensSection()}
        ${componentsSection()}
      </main>

      <footer class="border-t border-base-300 px-4 py-6 text-sm text-base-content/70 md:px-8">
        Toolbox · Sifr Studio · design tokens from the live Worker CSS
      </footer>
    </div>
    <div class="drawer-side z-20">
      <label for="nav-drawer" class="drawer-overlay" aria-label="Close menu"></label>
      <ul class="menu min-h-full w-64 bg-base-100 p-4 text-base">
        <li><a href="#tokens">Tokens</a></li>
        <li><a href="#components">Components</a></li>
        <li><a href="/factory">Value Factory</a></li>
        <li><a href="/">Bench</a></li>
      </ul>
    </div>
  </div>`;
}

function piece(name: string, when: string, example: string): string {
  return `<article class="card border border-base-300 bg-base-100 shadow-sm">
    <div class="card-body gap-4">
      <div class="flex flex-col gap-1">
        <h3 class="card-title text-lg">${name}</h3>
        <p class="text-sm text-base-content/70">${when}</p>
      </div>
      <div class="rounded-box bg-base-200/70 p-4">${example}</div>
    </div>
  </article>`;
}

function tokensSection(): string {
  return `<section id="tokens" class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h2 class="text-2xl font-semibold">Tokens</h2>
      <p class="max-w-2xl text-base-content/80">
        Colors and radii come from the DaisyUI <code class="text-sm">sifr</code> theme. Spacing and
        type use the Tailwind utilities the pages already pick.
      </p>
    </div>

    <div class="flex flex-col gap-4">
      ${piece(
        "Colors",
        "Use theme colors for surfaces, text, and status. Prefer semantic roles (primary, error) over raw values.",
        colorSwatches(),
      )}
      ${piece(
        "Typography",
        "Headlines stay semibold. Body stays relaxed. Uppercase tracking marks section labels on the bench and boards.",
        typographySample(),
      )}
      ${piece(
        "Spacing",
        "Stack content with gap utilities. Page padding is px-4 on small screens and md:px-8 on larger ones.",
        spacingSample(),
      )}
      ${piece(
        "Radii",
        "Boxes use --radius-box (0.75rem). Fields and selectors use --radius-field / --radius-selector (0.5rem).",
        radiiSample(),
      )}
    </div>
  </section>`;
}

function colorSwatches(): string {
  const roles = [
    ["base-100", "bg-base-100 text-base-content border border-base-300"],
    ["base-200", "bg-base-200 text-base-content"],
    ["base-300", "bg-base-300 text-base-content"],
    ["primary", "bg-primary text-primary-content"],
    ["secondary", "bg-secondary text-secondary-content"],
    ["accent", "bg-accent text-accent-content"],
    ["neutral", "bg-neutral text-neutral-content"],
    ["info", "bg-info text-info-content"],
    ["success", "bg-success text-success-content"],
    ["warning", "bg-warning text-warning-content"],
    ["error", "bg-error text-error-content"],
  ] as const;

  return `<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
    ${roles
      .map(
        ([name, classes]) =>
          `<div class="rounded-box ${classes} px-3 py-4 text-sm font-medium">${name}</div>`,
      )
      .join("")}
  </div>`;
}

function typographySample(): string {
  return `<div class="flex flex-col gap-3">
    <p class="text-sm font-medium uppercase tracking-[0.16em] text-primary">Section label</p>
    <p class="text-4xl font-semibold leading-tight md:text-5xl">Page title</p>
    <p class="text-3xl font-semibold">Board title</p>
    <p class="text-2xl font-semibold">Section title</p>
    <p class="text-lg font-semibold">Card title</p>
    <p class="text-base leading-relaxed text-base-content/80">
      Body copy uses text-base, leading-relaxed, and a soft content opacity for supporting sentences.
    </p>
    <p class="text-sm text-base-content/70">Supporting note · text-sm</p>
    <p class="text-xs text-base-content/60">Meta · text-xs</p>
  </div>`;
}

function spacingSample(): string {
  const gaps = [
    ["gap-1", "gap-1"],
    ["gap-2", "gap-2"],
    ["gap-3", "gap-3"],
    ["gap-4", "gap-4"],
    ["gap-6", "gap-6"],
    ["gap-10", "gap-10"],
  ] as const;

  return `<div class="flex flex-col gap-4">
    ${gaps
      .map(
        ([label, gap]) =>
          `<div>
            <p class="mb-2 text-xs uppercase tracking-wide text-base-content/60">${label}</p>
            <div class="flex ${gap}">
              <span class="rounded-box bg-primary px-3 py-2 text-xs text-primary-content">A</span>
              <span class="rounded-box bg-primary px-3 py-2 text-xs text-primary-content">B</span>
              <span class="rounded-box bg-primary px-3 py-2 text-xs text-primary-content">C</span>
            </div>
          </div>`,
      )
      .join("")}
    <div class="rounded-box border border-dashed border-base-300 bg-base-100 px-4 py-6 md:px-8">
      <p class="text-sm">Page padding · <code class="text-xs">px-4 py-8 md:px-8</code> on factory shells, <code class="text-xs">px-4 py-10 md:px-8</code> on the bench.</p>
    </div>
  </div>`;
}

function radiiSample(): string {
  return `<div class="grid gap-3 sm:grid-cols-3">
    <div class="rounded-box border border-base-300 bg-base-100 p-4 text-sm">
      <p class="font-medium">rounded-box</p>
      <p class="mt-1 text-base-content/70">Columns, swatches, and quiet panels.</p>
    </div>
    <div class="rounded-field border border-base-300 bg-base-100 p-4 text-sm" style="border-radius: var(--radius-field)">
      <p class="font-medium">--radius-field</p>
      <p class="mt-1 text-base-content/70">Inputs, textareas, selects.</p>
    </div>
    <div class="border border-base-300 bg-base-100 p-4 text-sm" style="border-radius: var(--radius-selector)">
      <p class="font-medium">--radius-selector</p>
      <p class="mt-1 text-base-content/70">Buttons and other controls.</p>
    </div>
  </div>`;
}

function componentsSection(): string {
  return `<section id="components" class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h2 class="text-2xl font-semibold">Components</h2>
      <p class="max-w-2xl text-base-content/80">
        Every example below uses a DaisyUI class already present in the Worker HTML, or a table —
        the common Value Factory surface that is not on a board page yet.
      </p>
    </div>

    <div class="flex flex-col gap-4">
      ${piece(
        "Buttons",
        "Primary for the main action on a screen. Outline and ghost for secondary and quiet actions. Size with btn-sm or btn-xs on dense board chrome.",
        `<div class="flex flex-wrap gap-2">
          <button class="btn btn-primary" type="button">Primary</button>
          <button class="btn btn-outline" type="button">Outline</button>
          <button class="btn btn-ghost" type="button">Ghost</button>
          <button class="btn btn-primary btn-sm" type="button">Small</button>
          <button class="btn btn-ghost btn-xs" type="button">Extra small</button>
          <button class="btn btn-ghost btn-square" type="button" aria-label="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <button class="btn btn-primary" type="button">
            <span class="loading loading-spinner loading-sm"></span>
            Loading
          </button>
        </div>`,
      )}

      ${piece(
        "Inputs",
        "Use for email, board names, card fields, and short text. Pair with a label stack (flex flex-col gap-1 text-sm). Prefer input-sm inside columns.",
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
      )}

      ${piece(
        "Cards",
        "Wrap a titled block of content. Home uses card + shadow-sm. Board cards add a light border. Put actions in card-actions.",
        `<div class="grid gap-3 md:grid-cols-2">
          <article class="card bg-base-100 shadow-sm">
            <div class="card-body">
              <h4 class="card-title text-lg">Bench card</h4>
              <p>Quiet surface for stack notes and calls to action.</p>
              <div class="card-actions">
                <button class="btn btn-primary btn-sm" type="button">Open</button>
              </div>
            </div>
          </article>
          <article class="card border border-base-300 bg-base-100 shadow-sm">
            <div class="card-body gap-3 p-4">
              <div class="flex items-start justify-between gap-2">
                <h4 class="font-medium leading-snug">Board card</h4>
                <span class="badge badge-primary shrink-0">Value 8</span>
              </div>
              <p class="text-sm leading-relaxed">Bordered cards sit inside a column.</p>
            </div>
          </article>
        </div>`,
      )}

      ${piece(
        "Badges",
        "Mark short status on a card or reply. Value Factory uses badge-primary for high scores and badge-ghost otherwise. Success marks an HTMX swap.",
        `<div class="flex flex-wrap gap-2">
          <span class="badge badge-primary">Value 8</span>
          <span class="badge badge-ghost">Value 4</span>
          <span class="badge badge-success">HTMX swap</span>
        </div>`,
      )}

      ${piece(
        "Alerts",
        "Tell the user what happened after a form or auth step. Error for failures, success for mail sent, warning when email could not send, info for share-link notes.",
        `<div class="flex flex-col gap-2">
          <div class="alert"><span>Default alert for a quiet notice on a public board.</span></div>
          <div class="alert alert-info"><span>Share this link. Anyone with it can read the board.</span></div>
          <div class="alert alert-success"><span>Check your inbox. The link expires in 30 minutes.</span></div>
          <div class="alert alert-warning"><span>Email sending is not available on this account.</span></div>
          <div class="alert alert-error"><span>That board name is already taken in this workspace.</span></div>
        </div>`,
      )}

      ${piece(
        "Modals",
        "Edit a Value Factory card in place. The board opens a dialog.modal, fills modal-box, and closes with modal-backdrop or modal-action buttons.",
        `<div class="flex flex-col gap-3">
          <button class="btn btn-outline btn-sm w-fit" type="button" onclick="document.getElementById('design-card-dialog')?.showModal()">
            Open card editor
          </button>
          <dialog id="design-card-dialog" class="modal">
            <div class="modal-box w-11/12 max-w-2xl">
              <h3 class="text-lg font-semibold">Edit card</h3>
              <p class="mt-2 text-sm text-base-content/70">Same shell Value Factory uses when you press Edit on a card.</p>
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
      )}

      ${piece(
        "Tables",
        "Not on a live board page yet. Use for Value Factory lists that need columns — webhooks, owners, scores — when a card stack is the wrong shape.",
        `<div class="overflow-x-auto">
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
      )}

      ${piece(
        "Nav",
        "Every Toolbox shell uses drawer + navbar. Desktop links sit in navbar-center. Mobile opens drawer-side with a menu. Keep the brand link as Toolbox.",
        `<div class="rounded-box border border-base-300 bg-base-100">
          <header class="navbar border-b border-base-300 px-4">
            <div class="navbar-start gap-2">
              <button class="btn btn-ghost btn-square lg:hidden" type="button" aria-label="Menu sample">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
              <span class="text-lg font-semibold tracking-tight">Toolbox</span>
            </div>
            <nav class="navbar-center hidden gap-6 text-sm lg:flex">
              <a class="link link-hover" href="/factory">Value Factory</a>
              <a class="link link-hover" href="/design-system">Design system</a>
            </nav>
            <div class="navbar-end">
              <a class="btn btn-primary btn-sm" href="/signin">Sign in</a>
            </div>
          </header>
          <ul class="menu w-full p-2 text-sm lg:hidden">
            <li><a href="/factory">Value Factory</a></li>
            <li><a href="/design-system">Design system</a></li>
            <li><a href="/">Bench</a></li>
          </ul>
        </div>`,
      )}
    </div>
  </section>`;
}
