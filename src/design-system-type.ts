import { brandLockup, icon } from "./brand";
import { section } from "./design-system-helpers";

export function typeSection(): string {
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

export function iconsSection(): string {
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
