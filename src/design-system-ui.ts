import { section } from "./design-system-helpers";

export function spacingSection(): string {
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

export function radiiSection(): string {
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
