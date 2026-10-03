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
  const live = [
    ["Active / primary", "#2870f8", "--active"],
    ["Text", "#000000", "--text"],
    ["White", "#ffffff", "--white"],
    ["Warning", "#f8d030", "--warning"],
    ["Error", "#f04048", "--error"],
  ] as const;

  const body = `<div class="flex flex-col gap-10">
    <div class="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
      ${live.map(([n, h, v]) => swatch(n, h, v)).join("")}
    </div>

    <p class="text-sm text-base-content/70">
      Sampled from <code class="text-xs">open-toolbox-mark.png</code>:
      active from the toolbox body, warning from handles / sparks / level,
      error from the screwdriver. Text is full black. White is the page ground.
      Coolors ramps are archived — not in the live theme.
    </p>

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
      <p class="text-sm text-base-content/60">
        primary / info / success → active · accent / warning → warning · error → error ·
        secondary / neutral → black · base-100 → white · base-200/300 → light neutrals for borders.
      </p>
    </div>
  </div>`;

  return section(
    "color",
    "Color",
    "Five logo-matched roles only. Active #2870F8, text #000000, white #FFFFFF, warning #F8D030, error #F04048.",
    body,
  );
}
