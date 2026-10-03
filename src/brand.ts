import {
  appleTouchIconPng,
  favicon16Png,
  faviconPng,
  openToolboxMarkPng,
} from "./brand-assets";

const pngHeaders = {
  "Content-Type": "image/png",
  "Cache-Control": "public, max-age=86400, immutable",
} as const;

function pngResponse(b64: string): Response {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Response(bytes, { headers: pngHeaders });
}

/** Brand PNG routes — compressed mark + favicons. */
export const brandAssetRoutes: Record<string, () => Response> = {
  "/open-toolbox-mark.png": () => pngResponse(openToolboxMarkPng),
  "/favicon.png": () => pngResponse(faviconPng),
  "/favicon-16.png": () => pngResponse(favicon16Png),
  "/favicon-32.png": () => pngResponse(faviconPng),
  "/apple-touch-icon.png": () => pngResponse(appleTouchIconPng),
};

/** Favicon + apple-touch link tags for layout head. */
export function brandHeadLinks(): string {
  return `<link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
    <link rel="icon" href="/favicon-16.png" type="image/png" sizes="16x16" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />`;
}

/**
 * Logo mark + wordmark.
 * size: nav (header — larger mark) | hero (landing) | display (design-system)
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
  const inner = `<img class="${markClass}" src="/open-toolbox-mark.png" width="280" height="185" alt="" decoding="async" />
    <span class="${textClass}">Open Toolbox</span>`;
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
  | "external-link"
  | "book"
  | "canvas"
  | "kanban"
  | "users"
  | "chat"
  | "chart"
  | "form"
  | "popup"
  | "survey"
  | "bug";

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
  book: `<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5Z" /><path d="M4 5.5V21.5" /><path d="M8 7h8" /><path d="M8 11h8" />`,
  canvas: `<rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 16c1.5-3 3-5 4-5s2.5 2 4 5" /><circle cx="9" cy="9" r="1.5" />`,
  kanban: `<rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 7v10" /><path d="M12 7v6" /><path d="M16 7v8" />`,
  users: `<circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><circle cx="17" cy="9" r="2.5" /><path d="M15 19a4.5 4.5 0 0 1 5.5-4.3" />`,
  chat: `<path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M8 10h8" /><path d="M8 13h5" />`,
  chart: `<path d="M4 19h16" /><path d="M7 16V10" /><path d="M12 16V6" /><path d="M17 16v-4" />`,
  form: `<rect x="4" y="3" width="16" height="18" rx="3" /><path d="M8 8h8" /><path d="M8 12h8" /><path d="M8 16h5" />`,
  popup: `<rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18" /><path d="M8 15h4" />`,
  survey: `<rect x="5" y="3" width="14" height="18" rx="3" /><path d="M9 8h6" /><path d="M9 12h6" /><path d="m9 16 1.5 1.5L14 14" />`,
  bug: `<path d="M8 9a4 4 0 0 1 8 0v7a4 4 0 0 1-8 0Z" /><path d="M12 5V3" /><path d="M7 8 4.5 6" /><path d="m17 8 2.5-2" /><path d="M4 12h3" /><path d="M17 12h3" /><path d="M7 16 4.5 18" /><path d="m17 16 2.5 2" />`,
};
