export function section(id: string, title: string, lead: string, body: string): string {
  return `<section id="${id}" class="flex flex-col gap-6">
    <div class="flex flex-col gap-3">
      <h2 class="text-2xl font-bold tracking-tight">${title}</h2>
      <p class="max-w-2xl text-sm leading-relaxed text-base-content/70">${lead}</p>
    </div>
    ${body}
  </section>`;
}

export function swatch(name: string, hex: string, cssVar: string): string {
  return `<div class="flex flex-col gap-3">
    <div class="h-16 w-full rounded-box border border-base-300" style="background:${hex}" title="${hex}"></div>
    <div class="min-w-0">
      <p class="truncate text-sm font-medium">${name}</p>
      <p class="font-mono text-xs text-base-content/60">${hex}</p>
      <p class="truncate font-mono text-xs text-base-content/50">${cssVar}</p>
    </div>
  </div>`;
}
