import { brandLockup, icon } from "./brand";
import { section } from "./design-system-helpers";

export function componentsSection(): string {
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
      "At rest: light neutral border. On focus: Active border only — no glow, ring, or outline shadow. Coinbase form pattern.",
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
        <label class="flex items-start gap-3 text-sm">
          <input type="checkbox" class="checkbox mt-1" checked />
          <span>Checklist item on a Value Factory card</span>
        </label>
      </div>`,
    ],
    [
      "Select",
      "Native <code class=\"text-xs\">&lt;select&gt;</code> styled like a text field with a chevron. Opens the browser list panel — no custom widget library. Coinbase + Square pattern.",
      `<div class="flex flex-col gap-4 sm:max-w-md">
        <label class="flex flex-col gap-2 text-sm">
          Move to column
          <select class="select w-full">
            <option>Research</option>
            <option>Build</option>
            <option selected>Done</option>
          </select>
        </label>
        <label class="flex flex-col gap-2 text-sm">
          Dense board control
          <select class="select select-sm w-full">
            <option>Research</option>
            <option>Build</option>
            <option>Done</option>
          </select>
        </label>
      </div>`,
    ],
    [
      "Date",
      "Native <code class=\"text-xs\">&lt;input type=\"date\"&gt;</code> with the same field chrome. Calendar affordance is the browser control.",
      `<div class="flex flex-col gap-4 sm:max-w-md">
        <label class="flex flex-col gap-2 text-sm">
          Due date
          <input class="input w-full" type="date" />
        </label>
        <label class="flex flex-col gap-2 text-sm">
          Compact date
          <input class="input input-sm w-full" type="date" value="2026-10-03" />
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
      "Form and auth outcomes. Colors stay inside the logo-matched set.",
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
      "Square-style bands: header (title + close), scrollable body, footer (Cancel + primary). Scrim behind. Native <code class=\"text-xs\">&lt;dialog&gt;</code> + tiny showModal/close JS.",
      `<div class="flex flex-col gap-4">
        <button class="btn btn-outline btn-sm w-fit" type="button" onclick="document.getElementById('design-card-dialog')?.showModal()">
          ${icon("pencil", "icon icon-sm")} Open card editor
        </button>
        <dialog id="design-card-dialog" class="modal">
          <div class="modal-box ot-modal w-11/12 max-w-2xl">
            <header class="ot-modal-header">
              <h3 class="ot-modal-title">Edit card</h3>
              <button class="ot-modal-close" type="button" aria-label="Close" onclick="document.getElementById('design-card-dialog')?.close()">
                ${icon("x", "icon icon-sm")}
              </button>
            </header>
            <div class="ot-modal-body flex flex-col gap-4">
              <p class="text-sm text-base-content/70">Same shell Value Factory uses when you press Edit.</p>
              <label class="flex flex-col gap-2 text-sm">
                Title
                <input class="input w-full" value="Ship the design system page" />
              </label>
              <label class="flex flex-col gap-2 text-sm">
                Column
                <select class="select w-full">
                  <option>Research</option>
                  <option selected>Build</option>
                  <option>Done</option>
                </select>
              </label>
              <label class="flex flex-col gap-2 text-sm">
                Due date
                <input class="input w-full" type="date" />
              </label>
            </div>
            <footer class="ot-modal-footer">
              <button class="btn btn-ghost" type="button" onclick="document.getElementById('design-card-dialog')?.close()">Cancel</button>
              <button class="btn btn-primary" type="button" onclick="document.getElementById('design-card-dialog')?.close()">Save card</button>
            </footer>
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
      "Drawer + navbar with a larger logo mark on every shell.",
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
    "Live DaisyUI pieces already used on the bench and Value Factory, restyled with Base/Coinbase + Square field and modal patterns.",
    body,
  );
}
