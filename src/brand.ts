/** Favicon + apple-touch link tags for layout head. */
export function brandHeadLinks(): string {
  return `<link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
    <link rel="icon" href="/favicon-16.png" type="image/png" sizes="16x16" />
    <link rel="icon" href="/favicon-48.png" type="image/png" sizes="48x48" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />`;
}

/**
 * Logo mark + wordmark.
 * size: nav (compact) | hero (landing) | display (design-system)
 * Pass href: null for a non-link display (hero / design-system samples).
 */
export function brandLockup(options?: {
  href?: string | null;
  size?: "nav" | "hero" | "display";
  className?: string;
}): string {
  const size = options?.size ?? "nav";
  const className = options?.className ?? "";
  const markClass =
    size === "hero"
      ? "brand-logo-mark brand-logo-mark--hero"
      : size === "display"
        ? "brand-logo-mark brand-logo-mark--display"
        : "brand-logo-mark";
  const textClass =
    size === "hero"
      ? "brand-mark text-2xl tracking-tight md:text-3xl"
      : size === "display"
        ? "brand-mark text-xl tracking-tight md:text-2xl"
        : "brand-mark text-xl tracking-tight";
  const inner = `<img class="${markClass}" src="/open-toolbox-mark.png" width="1023" height="674" alt="" decoding="async" />
    <span class="${textClass}">Toolbox</span>`;
  if (options?.href === null) {
    return `<div class="brand-lockup ${className}">${inner}</div>`;
  }
  const href = options?.href ?? "/";
  return `<a class="brand-lockup ${className}" href="${href}">${inner}</a>`;
}

/** Chunky Lucide-style icons — round joins, stroke 2.5. */
export function icon(name: IconName, className = "icon"): string {
  const body = ICONS[name];
  return `<svg xmlns="http://www.w3.org/2000/svg" class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

export type IconName =
  | "menu"
  | "arrow-right"
  | "layout"
  | "layers"
  | "zap"
  | "check"
  | "plus"
  | "x"
  | "link"
  | "share"
  | "pencil"
  | "trash"
  | "mail"
  | "home"
  | "external-link";

const ICONS: Record<IconName, string> = {
  menu: `<path d="M4 7h16M4 12h16M4 17h16" />`,
  "arrow-right": `<path d="M5 12h14" /><path d="m13 6 6 6-6 6" />`,
  layout: `<rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18" /><path d="M9 21V9" />`,
  layers: `<path d="m12 3 9 4.5-9 4.5L3 7.5 12 3Z" /><path d="m3 12 9 4.5 9-4.5" /><path d="m3 16.5 9 4.5 9-4.5" />`,
  zap: `<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />`,
  check: `<path d="M20 6 9 17l-5-5" />`,
  plus: `<path d="M12 5v14" /><path d="M5 12h14" />`,
  x: `<path d="M18 6 6 18" /><path d="m6 6 12 12" />`,
  link: `<path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L10.7 5.23" /><path d="M14 11a5 5 0 0 0-7.07 0L4.8 13.12a5 5 0 0 0 7.07 7.07l1.42-1.41" />`,
  share: `<circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 13.3 7.6 4.4" /><path d="m15.8 6.3-7.6 4.4" />`,
  pencil: `<path d="M17 3a2.4 2.4 0 0 1 3.4 3.4L8.5 18.3 3 20l1.7-5.5Z" /><path d="m15 5 3.4 3.4" />`,
  trash: `<path d="M4 7h16" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /><path d="m6 7 1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />`,
  mail: `<rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 8 8 5 8-5" />`,
  home: `<path d="M4 10.5 12 4l8 6.5" /><path d="M6 9.5V19a1 1 0 0 0 1 1h4v-5h2v5h4a1 1 0 0 0 1-1V9.5" />`,
  "external-link": `<path d="M14 4h6v6" /><path d="M10 14 20 4" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />`,
};
