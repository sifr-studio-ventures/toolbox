import type { Hono } from "hono";
import {
  clearSessionCookie,
  consumeMagicLink,
  createSessionToken,
  deleteSession,
  isSecureRequest,
  normalizeEmail,
  requestMagicLink,
  sessionCookie,
} from "./auth";
import { authResultView, authShell, signInView } from "./auth-views";
import { clearActiveOrgCookie } from "./db";
import { safeNext } from "./html";
import type { AppContext } from "./types";

type Layout = (
  css: string,
  body: string,
  options?: { title?: string; description?: string },
) => string;

function isHtmx(c: { req: { header: (name: string) => string | undefined } }): boolean {
  return (c.req.header("HX-Request") ?? "").toLowerCase() === "true";
}

export function registerAuth(app: Hono<AppContext>, css: string, layout: Layout): void {
  app.get("/signin", (c) => {
    if (c.get("user")) return c.redirect(safeNext(c.req.query("next")));
    return c.html(
      layout(css, authShell(signInView(safeNext(c.req.query("next")), "")), {
        title: "Sign in · Open Toolbox",
        description: "Sign in to Open Toolbox with an email link. No password.",
      }),
    );
  });

  app.post("/auth/magic", async (c) => {
    const form = await c.req.formData();
    const email = normalizeEmail(String(form.get("email") ?? ""));
    const next = safeNext(String(form.get("next") ?? ""));
    if (!email) {
      const html = authResultView({
        sent: false,
        reason: null,
        link: null,
        emailError: "Enter a real email address.",
      });
      return isHtmx(c)
        ? c.html(html, 400)
        : c.html(layout(css, authShell(signInView(next, html)), { title: "Sign in · Open Toolbox" }), 400);
    }
    const outcome = await requestMagicLink(c.env, c.req.url, email, next);
    const html = authResultView(outcome);
    return isHtmx(c)
      ? c.html(html)
      : c.html(layout(css, authShell(signInView(next, html)), { title: "Sign in · Open Toolbox" }));
  });

  app.get("/auth/verify", async (c) => {
    const token = c.req.query("token") ?? "";
    const user = await consumeMagicLink(c.env.DB, token);
    if (!user) {
      return c.html(
        layout(
          css,
          authShell(
            `<section>
              <div class="alert alert-error"><span>That sign-in link is invalid or expired. Request a new one.</span></div>
              <a class="btn btn-primary mt-4" href="/signin">Request a new link</a>
            </section>`,
          ),
          { title: "Link expired · Open Toolbox" },
        ),
        400,
      );
    }
    const session = await createSessionToken(c.env.DB, user.id);
    const headers = new Headers();
    headers.append("Set-Cookie", sessionCookie(session, isSecureRequest(c)));
    headers.set("Location", safeNext(c.req.query("next")));
    return new Response(null, { status: 302, headers });
  });

  app.post("/signout", async (c) => {
    await deleteSession(c.env.DB, c.req.header("cookie") ?? "");
    const secure = isSecureRequest(c);
    const headers = new Headers();
    headers.append("Set-Cookie", clearSessionCookie(secure));
    headers.append("Set-Cookie", clearActiveOrgCookie(secure));
    headers.set("Location", "/");
    return new Response(null, { status: 302, headers });
  });
}
