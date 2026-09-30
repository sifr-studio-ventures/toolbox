import type { MiddlewareHandler } from "hono";

const CANONICAL_ORIGIN = "https://opentoolbox.io";

const REDIRECT_HOSTS = new Set([
  "opentoolbox.dev",
  "www.opentoolbox.dev",
  "www.opentoolbox.io",
  "toolbox.mohammadameer.workers.dev",
]);

export function requestHostname(hostHeader: string | undefined, requestUrl: string): string {
  const raw = hostHeader?.trim() || new URL(requestUrl).host;
  return raw.replace(/:\d+$/, "").toLowerCase();
}

export function canonicalUrl(requestUrl: string): string {
  const url = new URL(requestUrl);
  return `${CANONICAL_ORIGIN}${url.pathname}${url.search}`;
}

function escapeHtmlAttr(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export const canonicalHost: MiddlewareHandler = async (c, next) => {
  const hostname = requestHostname(c.req.header("host"), c.req.url);
  const htmx = (c.req.header("HX-Request") ?? "").toLowerCase() === "true";

  if (REDIRECT_HOSTS.has(hostname) && !htmx) {
    return c.redirect(canonicalUrl(c.req.url), 301);
  }

  await next();

  const contentType = c.res.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("text/html")) return;

  const canonical = canonicalUrl(c.req.url);
  const headers = new Headers(c.res.headers);
  headers.append("Link", `<${canonical}>; rel="canonical"`);

  let body = await c.res.text();
  if (body.includes("<head>") && !body.includes('rel="canonical"')) {
    body = body.replace(
      "<head>",
      `<head>\n    <link rel="canonical" href="${escapeHtmlAttr(canonical)}" />`,
    );
    headers.delete("content-length");
  }

  c.res = new Response(body, {
    status: c.res.status,
    statusText: c.res.statusText,
    headers,
  });
};
