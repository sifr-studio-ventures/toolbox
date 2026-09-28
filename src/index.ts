import { Hono } from "hono";
import css from "./styles.css?inline";
import { homePage, layout, stackFragment } from "./page";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.html(layout(css, homePage()));
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

app.notFound((c) => {
  return c.html(
    layout(
      css,
      `<main class="mx-auto max-w-xl px-4 py-16">
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h1 class="card-title text-2xl">That path is not on the bench</h1>
            <p>Toolbox only serves the home page and the <code>/stack</code> fragment.</p>
            <div class="card-actions">
              <a class="btn btn-primary" href="/">Back home</a>
            </div>
          </div>
        </div>
      </main>`,
    ),
    404,
  );
});

export default app;
