import { brandHeadLinks, brandLockup, icon, type IconName } from "./brand";
import { escapeHtml } from "./html";

export function layout(
  css: string,
  body: string,
  options?: { title?: string; description?: string },
): string {
  const title = options?.title ?? "Open Toolbox";
  const description =
    options?.description ??
    "All the tools you need to grow your product. Docs, canvas, kanban, CRM, chat, analytics, forms, popups, surveys, and bug reporting — in one toolkit.";
  return `<!doctype html>
<html lang="en" data-theme="toolbox">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta
      name="description"
      content="${escapeHtml(description)}"
    />
    ${brandHeadLinks()}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700;800&display=swap"
      rel="stylesheet"
    />
    <style>${css}</style>
    <script src="https://unpkg.com/htmx.org@2.0.7"></script>
  </head>
  <body class="min-h-screen bg-base-100 font-sans text-base-content">
    ${body}
  </body>
</html>`;
}
