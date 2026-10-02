import { brandLockup } from "./brand";
import { section, swatch } from "./design-system-helpers";

export function logoSection(): string {
  return section(
    "logo",
    "Logo",
    "PNG mark only — soft 3D open toolbox. No SVG part kit. Favicon crops of the same mark at 16 / 32.",
    `<div class="flex flex-col gap-8">
      <div class="flex flex-col gap-6 rounded-box border border-base-300 bg-base-100 p-6 md:p-8">
        ${brandLockup({ href: null, size: "display" })}
        <p class="text-sm text-base-content/70">
          Compressed mark in <code class="text-xs">src/brand-assets</code>
          · served at <code class="text-xs">/open-toolbox-mark.png</code>
          · favicon <code class="text-xs">/favicon.png</code>
        </p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="flex flex-col items-center gap-3 rounded-box border border-base-300 p-5">
          <img src="/favicon-16.png" width="16" height="16" alt="" class="image-pixelated" />
          <p class="font-mono text-xs text-base-content/60">16×16</p>
        </div>
        <div class="flex flex-col items-center gap-3 rounded-box border border-base-300 p-5">
          <img src="/favicon-32.png" width="32" height="32" alt="" />
          <p class="font-mono text-xs text-base-content/60">32×32</p>
        </div>
      </div>
    </div>`,
  );
}

export function colorSection(): string {
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
