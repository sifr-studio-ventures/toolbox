import { brandLockup, icon } from "./brand";
import { logoSection, colorSection } from "./design-system-brand";
import { typeSection, iconsSection } from "./design-system-type";
import { spacingSection, radiiSection } from "./design-system-ui";
import { componentsSection } from "./design-system-components";

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
        Open Toolbox · design tokens from <code class="text-xs">src/styles.css</code>
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
