import { Hono } from "hono";
import { userFromCookie } from "./auth";
import { brandAssetRoutes } from "./brand";
import { canonicalHost } from "./canonical";
import { registerFactory } from "./factory/routes";
import { ensureReady } from "./migrate";
import { designSystemPage } from "./design-system";
import { homePage, layout, stackFragment } from "./page";
import css from "./styles.css?inline";
import type { AppContext } from "./types";

const app = new Hono<AppContext>();

app.use("*", canonicalHost);

for (const [path, handler] of Object.entries(brandAssetRoutes)) {
  app.get(path, () => handler());
}

app.use("*", async (c, next) => {
  if (!["GET", "HEAD", "OPTIONS"].includes(c.req.method)) {
    const origin = c.req.header("origin");
    if (origin && origin !== new URL(c.req.url).origin) {
      return c.text("Cross-origin request blocked", 403);
    }
  }

  try {
    await ensureReady(c.env.DB);
  } catch (error) {
    console.error("database setup failed", error instanceof Error ? error.message : "setup failed");
    return c.html(
      layout(
        css,
        `<main class="mx-auto max-w-xl page-shell py-16">
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body">
              <h1 class="card-title text-2xl">The database is not ready</h1>
              <p>Reload in a moment. If this keeps happening, the D1 migration did not apply.</p>
            </div>
          </div>
        </main>`,
        { title: "Database not ready · Open Toolbox" },
      ),
      500,
    );
  }

  c.set("user", await userFromCookie(c.env.DB, c.req.header("cookie") ?? ""));
  await next();
});

app.get("/", (c) => {
  return c.html(
    layout(css, homePage(), {
      title: "Open Toolbox · All the tools you need to grow your product",
      description:
        "Open Toolbox is the product-team toolkit — docs, canvas, kanban, CRM, chat, analytics, forms, popups, surveys, and bug reporting.",
    }),
  );
});

app.get("/design-system", (c) => {
  return c.html(
    layout(css, designSystemPage(), {
      title: "Design system · Open Toolbox",
      description:
        "Logo-matched palette (active #2870F8, text #000000, warning, error), type, spacing, radii, and DaisyUI components Open Toolbox uses on the bench and Value Factory.",
    }),
  );
});

app.get("/stack", (c) => {
  const colo = c.req.raw.cf?.colo;
  const fragment = stackFragment({
    environment: c.env.ENVIRONMENT,
    when: new Date().toISOString(),
    colo: typeof colo === "string" ? colo : "local",
  });

  c.header("Cache-Control", "no-store");
  return c.html(fragment);
});

registerFactory(app, css, layout);

app.notFound(async (c) => {
  const assets = c.env.ASSETS;
  if (assets) {
    const asset = await assets.fetch(c.req.raw);
    if (asset.status !== 404) return asset;
  }

  return c.html(
    layout(
      css,
      `<main class="mx-auto max-w-xl page-shell py-16">
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h1 class="card-title text-2xl">That path is not on the bench</h1>
            <p>Try the home page, or open Value Factory.</p>
            <div class="card-actions gap-3">
              <a class="btn btn-primary" href="/">Back home</a>
              <a class="btn btn-ghost" href="/factory">Value Factory</a>
            </div>
          </div>
        </div>
      </main>`,
    ),
    404,
  );
});

export default app;
