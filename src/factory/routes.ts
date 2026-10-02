import type { Context, Hono } from "hono";
import {
  clearSessionCookie,
  consumeMagicLink,
  createSessionToken,
  deleteSession,
  isSecureRequest,
  normalizeEmail,
  requestMagicLink,
  sessionCookie,
} from "../auth";
import { safeNext } from "../html";
import type { AppContext } from "../types";
import { newWebhookSecret, resendDelivery, safeWebhookUrl, queueWebhooks } from "../webhooks";
import type { DeliveryRow, WebhookRow } from "../webhooks";
import {
  addCard,
  addColumn,
  boardByShare,
  cardPayload,
  columnName,
  createBoard,
  createWorkspace,
  deleteCard,
  linksFromText,
  listWorkspaceBoards,
  loadBoard,
  memberBoard,
  moveCard,
  removeColumn,
  renameColumn,
  setCheck,
  updateCard,
  workspaceForMember,
  type BoardRecord,
  type CardView,
  type User,
} from "./db";
import {
  authResultView,
  boardColumns,
  boardPage,
  cardForm,
  factoryHome,
  shell,
  signInView,
  webhookPanel,
} from "./view";

function isHtmx(c: Context<AppContext>): boolean {
  return (c.req.header("HX-Request") ?? "").toLowerCase() === "true";
}

function requireUser(c: Context<AppContext>): User | Response {
  const user = c.get("user");
  if (user) return user;
  if (isHtmx(c)) {
    return c.html(`<div class="alert alert-error"><span>Sign in to change this board.</span></div>`, 401);
  }
  const boardId = c.req.param("boardId");
  const next = boardId ? `/boards/${boardId}` : "/factory";
  return c.redirect(`/signin?next=${encodeURIComponent(next)}`);
}

export function registerFactory(app: Hono<AppContext>, css: string, layout: Layout): void {
  app.get("/signin", (c) => {
    if (c.get("user")) return c.redirect(safeNext(c.req.query("next")));
    return c.html(
      layout(css, shell(null, signInView(safeNext(c.req.query("next")), "")), {
        title: "Sign in \u00b7 Value Factory",
        description: "Sign in to Value Factory with an email link. No password.",
      }),
    );
  });

  app.post("/auth/magic", async (c) => {
    const form = await c.req.formData();
    const email = normalizeEmail(String(form.get("email") ?? ""));
    const next = safeNext(String(form.get("next") ?? ""));
    if (!email) {
      const html = authResultView({ sent: false, reason: null, link: null, emailError: "Enter a real email address." });
      return isHtmx(c) ? c.html(html, 400) : c.html(layout(css, shell(null, signInView(next, html))), 400);
    }
    const outcome = await requestMagicLink(c.env, c.req.url, email, next);
    const html = authResultView(outcome);
    return isHtmx(c) ? c.html(html) : c.html(layout(css, shell(null, signInView(next, html))));
  });

  app.get("/auth/verify", async (c) => {
    const token = c.req.query("token") ?? "";
    const user = await consumeMagicLink(c.env.DB, token);
    if (!user) {
      return c.html(
        layout(
          css,
          shell(
            c.get("user"),
            `<section class="mx-auto max-w-lg"><div class="alert alert-error"><span>That sign-in link is invalid or expired. Request a new one.</span></div><a class="btn btn-primary mt-4" href="/signin">Request a new link</a></section>`,
          ),
          { title: "Link expired \u00b7 Value Factory" },
        ),
        400,
      );
    }
    const session = await createSessionToken(c.env.DB, user.id);
    c.header("Set-Cookie", sessionCookie(session, isSecureRequest(c)));
    return c.redirect(safeNext(c.req.query("next")));
  });

  app.post("/signout", async (c) => {
    await deleteSession(c.env.DB, c.req.header("cookie") ?? "");
    c.header("Set-Cookie", clearSessionCookie(isSecureRequest(c)));
    return c.redirect("/");
  });

  app.get("/factory", async (c) => {
    const user = c.get("user");
    if (!user) return c.redirect("/signin?next=/factory");
    const rows = await listWorkspaceBoards(c.env.DB, user.id);
    return c.html(
      layout(css, shell(user, factoryHome(rows, null)), {
        title: "Value Factory \u00b7 Toolbox",
        description: "Boards for taking work from research to done.",
      }),
    );
  });

  app.post("/workspaces", async (c) => {
    const user = requireUser(c);
    if (user instanceof Response) return user;
    const form = await c.req.formData();
    const name = cleanName(String(form.get("name") ?? ""), 80);
    if (!name) return factoryError(c, css, layout, user, "Give the workspace a name.");
    await createWorkspace(c.env.DB, user.id, name);
    return c.redirect("/factory");
  });

  app.post("/workspaces/:workspaceId/boards", async (c) => {
    const user = requireUser(c);
    if (user instanceof Response) return user;
    const workspace = await workspaceForMember(c.env.DB, user.id, c.req.param("workspaceId"));
    if (!workspace) return c.redirect("/factory");
    const form = await c.req.formData();
    const name = cleanName(String(form.get("name") ?? ""), 80);
    if (!name) return factoryError(c, css, layout, user, "Give the board a name.");
    const boardId = await createBoard(c.env.DB, workspace.id, name);
    return c.redirect(`/boards/${boardId}`);
  });

  app.get("/boards/:boardId", async (c) => {
    const user = c.get("user");
    if (!user) return c.redirect(`/signin?next=/boards/${c.req.param("boardId")}`);
    const board = await memberBoard(c.env.DB, user.id, c.req.param("boardId"));
    if (!board) return missing(c, css, layout, user);
    return renderBoard(c, css, layout, board, "edit", true);
  });

  app.get("/b/:token", async (c) => {
    const board = await boardByShare(c.env.DB, c.req.param("token"));
    if (!board) return missing(c, css, layout, c.get("user"));
    const user = c.get("user");
    const canEdit = user ? Boolean(await memberBoard(c.env.DB, user.id, board.id)) : false;
    return renderBoard(c, css, layout, board, "read", canEdit);
  });

  app.post("/boards/:boardId/columns", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    const form = await c.req.formData();
    const name = cleanName(String(form.get("name") ?? ""), 40);
    if (!name) return columnsResponse(c, access.board, "Give the column a name.");
    const columnId = await addColumn(c.env.DB, access.board.id, name);
    queueWebhooks(c, access.board.id, "column.added", { board_name: access.board.name, column: { id: columnId, name } });
    return columnsResponse(c, access.board, null);
  });

  app.patch("/boards/:boardId/columns/:columnId", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    const form = await c.req.formData();
    const name = cleanName(String(form.get("name") ?? ""), 40);
    if (!name) return columnsResponse(c, access.board, "Give the column a name.");
    const renamed = await renameColumn(c.env.DB, access.board.id, c.req.param("columnId"), name);
    if (!renamed) return columnsResponse(c, access.board, "That column is already gone.");
    if (renamed.previous !== renamed.name) {
      queueWebhooks(c, access.board.id, "column.renamed", {
        board_name: access.board.name,
        column: { id: renamed.id, name: renamed.name, previous_name: renamed.previous },
      });
    }
    return columnsResponse(c, access.board, null);
  });

  app.delete("/boards/:boardId/columns/:columnId", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    const removed = await removeColumn(c.env.DB, access.board.id, c.req.param("columnId"));
    if ("error" in removed) return columnsResponse(c, access.board, removed.error);
    queueWebhooks(c, access.board.id, "column.removed", { board_name: access.board.name, column: removed.column });
    return columnsResponse(c, access.board, null);
  });

  app.post("/boards/:boardId/columns/:columnId/cards", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    const form = await c.req.formData();
    const title = cleanName(String(form.get("title") ?? ""), 140);
    if (!title) return columnsResponse(c, access.board, "Give the card a title.");
    const cardId = await addCard(c.env.DB, access.board.id, c.req.param("columnId"), {
      title,
      owner: "",
      value: 0,
      notes: "",
      links: [],
    });
    const name = (await columnName(c.env.DB, c.req.param("columnId"))) ?? "";
    queueWebhooks(c, access.board.id, "card.created", {
      board_name: access.board.name,
      card: { id: cardId, title, owner: "", value_score: 0, notes: "", links: [], column_id: c.req.param("columnId"), column_name: name },
    });
    return columnsResponse(c, access.board, null);
  });

  app.get("/boards/:boardId/cards/:cardId/edit", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    const board = await loadBoard(c.env.DB, access.board);
    const card = findCard(board.columns, c.req.param("cardId"));
    if (!card) return c.html(`<div class="alert alert-error"><span>That card is gone.</span></div>`, 404);
    return c.html(cardForm(access.board.id, card, null));
  });

  app.post("/boards/:boardId/cards/:cardId", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    const form = await c.req.formData();
    const parsed = parseCardForm(form);
    if ("error" in parsed) {
      const board = await loadBoard(c.env.DB, access.board);
      const existing = findCard(board.columns, c.req.param("cardId"));
      if (!existing) return columnsResponse(c, access.board, "That card is gone.");
      const draft: CardView = {
        ...existing,
        title: String(form.get("title") ?? existing.title),
        owner_label: String(form.get("owner") ?? ""),
        notes: String(form.get("notes") ?? ""),
        value_score: existing.value_score,
      };
      if (isHtmx(c)) {
        c.header("HX-Retarget", "#card-dialog-body");
        c.header("HX-Reswap", "innerHTML");
        return c.html(cardForm(access.board.id, draft, parsed.error), 400);
      }
      return columnsResponse(c, access.board, parsed.error);
    }
    const updated = await updateCard(c.env.DB, access.board.id, c.req.param("cardId"), parsed.value);
    if (!updated) return columnsResponse(c, access.board, "That card is gone.");
    const name = (await columnName(c.env.DB, updated.column_id)) ?? "";
    queueWebhooks(c, access.board.id, "card.edited", {
      board_name: access.board.name,
      card: cardPayload(updated, name),
    });
    if (isHtmx(c)) c.header("HX-Trigger", JSON.stringify({ closeCard: true }));
    return columnsResponse(c, access.board, null);
  });

  app.post("/boards/:boardId/cards/:cardId/move", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    const form = await c.req.formData();
    const columnId = String(form.get("column_id") ?? "");
    const moved = await moveCard(c.env.DB, access.board.id, c.req.param("cardId"), columnId);
    if (!moved) return columnsResponse(c, access.board, "Pick a column on this board.");
    if (moved.fromColumnId !== moved.card.column_id) {
      const [fromName, toName] = await Promise.all([
        columnName(c.env.DB, moved.fromColumnId),
        columnName(c.env.DB, moved.card.column_id),
      ]);
      queueWebhooks(c, access.board.id, "card.moved", {
        board_name: access.board.name,
        from_column: { id: moved.fromColumnId, name: fromName },
        to_column: { id: moved.card.column_id, name: toName },
        card: cardPayload(moved.card, toName ?? ""),
      });
    }
    return columnsResponse(c, access.board, null);
  });

  app.post("/boards/:boardId/cards/:cardId/checks", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    const form = await c.req.formData();
    const columnId = String(form.get("column_id") ?? "");
    const itemIndex = Number(form.get("item_index") ?? "");
    const done = form.getAll("done").includes("1");
    if (!Number.isInteger(itemIndex) || itemIndex < 0) return columnsResponse(c, access.board, "That checklist item is missing.");
    const ok = await setCheck(c.env.DB, access.board.id, c.req.param("cardId"), columnId, itemIndex, done);
    if (!ok) return columnsResponse(c, access.board, "That card is not in this column.");
    return columnsResponse(c, access.board, null);
  });

  app.delete("/boards/:boardId/cards/:cardId", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    const card = await deleteCard(c.env.DB, access.board.id, c.req.param("cardId"));
    if (!card) return columnsResponse(c, access.board, "That card is already gone.");
    const name = (await columnName(c.env.DB, card.column_id)) ?? "";
    queueWebhooks(c, access.board.id, "card.deleted", {
      board_name: access.board.name,
      card: cardPayload(card, name),
    });
    return columnsResponse(c, access.board, null);
  });

  app.post("/boards/:boardId/webhooks", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    const form = await c.req.formData();
    const url = safeWebhookUrl(String(form.get("url") ?? ""));
    if (!url) return hooksResponse(c, access.board.id, "Use an https URL that is not a private address.");
    const now = new Date().toISOString();
    await c.env.DB.prepare("INSERT INTO webhooks (id, board_id, url, secret, created_at) VALUES (?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), access.board.id, url, newWebhookSecret(), now)
      .run();
    return hooksResponse(c, access.board.id, null);
  });

  app.delete("/boards/:boardId/webhooks/:webhookId", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    await c.env.DB.prepare("DELETE FROM webhooks WHERE id = ? AND board_id = ?")
      .bind(c.req.param("webhookId"), access.board.id)
      .run();
    return hooksResponse(c, access.board.id, null);
  });

  app.post("/boards/:boardId/deliveries/:deliveryId/resend", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    const error = await resendDelivery(c.env.DB, access.board.id, c.req.param("deliveryId"));
    return hooksResponse(c, access.board.id, error);
  });
}

type Layout = (
  css: string,
  body: string,
  options?: { title?: string; description?: string },
) => string;

async function renderBoard(
  c: Context<AppContext>,
  css: string,
  layout: Layout,
  board: BoardRecord,
  mode: "edit" | "read",
  canEdit: boolean,
): Promise<Response> {
  const view = await loadBoard(c.env.DB, board);
  const origin = new URL(c.req.url).origin;
  const [webhooks, deliveries] = mode === "edit" ? await hookData(c.env.DB, board.id) : [[], []];
  c.header("Cache-Control", "no-store");
  return c.html(
    layout(
      css,
      shell(
        c.get("user"),
        boardPage({ board: view, mode, origin, canEdit, webhooks, deliveries, webhookError: null }),
      ),
      { title: `${board.name} \u00b7 Value Factory`, description: `${board.name} on the Value Factory.` },
    ),
  );
}

async function columnsResponse(c: Context<AppContext>, board: BoardRecord, alert: string | null): Promise<Response> {
  if (!isHtmx(c)) return c.redirect(`/boards/${board.id}`);
  const view = await loadBoard(c.env.DB, board);
  return c.html(boardColumns(view, "edit", alert, true), alert ? 400 : 200);
}

async function hooksResponse(c: Context<AppContext>, boardId: string, error: string | null): Promise<Response> {
  if (!isHtmx(c)) return c.redirect(`/boards/${boardId}`);
  const [webhooks, deliveries] = await hookData(c.env.DB, boardId);
  return c.html(webhookPanel(boardId, webhooks, deliveries, error), error ? 400 : 200);
}

async function hookData(db: D1Database, boardId: string): Promise<[WebhookRow[], DeliveryRow[]]> {
  const [hooks, deliveries] = await Promise.all([
    db
      .prepare("SELECT id, board_id, url, secret, created_at FROM webhooks WHERE board_id = ? ORDER BY created_at")
      .bind(boardId)
      .all<WebhookRow>(),
    db
      .prepare(
        "SELECT id, webhook_id, board_id, event, payload_json, status_code, ok, error, created_at FROM webhook_deliveries WHERE board_id = ? ORDER BY created_at DESC LIMIT 20",
      )
      .bind(boardId)
      .all<DeliveryRow>(),
  ]);
  return [hooks.results ?? [], deliveries.results ?? []];
}

async function editableBoard(c: Context<AppContext>): Promise<{ user: User; board: BoardRecord } | Response> {
  const user = requireUser(c);
  if (user instanceof Response) return user;
  const boardId = c.req.param("boardId");
  if (!boardId) return c.redirect("/factory");
  const board = await memberBoard(c.env.DB, user.id, boardId);
  if (!board) {
    if (isHtmx(c)) return c.html(`<div class="alert alert-error"><span>That board is not yours.</span></div>`, 404);
    return c.redirect("/factory");
  }
  return { user, board };
}

function findCard(columns: { cards: CardView[] }[], cardId: string): CardView | null {
  for (const column of columns) {
    const card = column.cards.find((item) => item.id === cardId);
    if (card) return card;
  }
  return null;
}

function parseCardForm(form: FormData): { error: string } | { value: { title: string; owner: string; value: number; notes: string; links: { label: string; url: string }[] } } {
  const title = cleanName(String(form.get("title") ?? ""), 140);
  if (!title) return { error: "Give the card a title, up to 140 characters." };
  const owner = String(form.get("owner") ?? "").trim();
  if (owner.length > 80) return { error: "Owner is too long." };
  const notes = String(form.get("notes") ?? "").trim();
  if (notes.length > 4000) return { error: "Notes are too long." };
  const rawScore = String(form.get("value_score") ?? "0").trim();
  if (!/^\d+$/.test(rawScore)) return { error: "Value score is a whole number from 0 to 10." };
  const value = Number(rawScore);
  if (value > 10) return { error: "Value score is a whole number from 0 to 10." };
  const links = linksFromText(String(form.get("links") ?? ""));
  if (links.error) return { error: links.error };
  return { value: { title, owner, value, notes, links: links.links } };
}

function cleanName(value: string, max: number): string | null {
  const name = value.trim();
  if (!name || name.length > max) return null;
  return name;
}

async function factoryError(
  c: Context<AppContext>,
  css: string,
  layout: Layout,
  user: User,
  error: string,
): Promise<Response> {
  const rows = await listWorkspaceBoards(c.env.DB, user.id);
  return c.html(
    layout(css, shell(user, factoryHome(rows, error)), { title: "Value Factory \u00b7 Toolbox" }),
    400,
  );
}

function missing(c: Context<AppContext>, css: string, layout: Layout, user: User | null): Response {
  return c.html(
    layout(
      css,
      shell(
        user,
        `<section class="mx-auto max-w-lg"><h1 class="text-2xl font-semibold">That board is not here</h1><p class="mt-3">The link may be old, or the board was removed.</p><a class="btn btn-primary mt-4" href="/factory">Back to Value Factory</a></section>`,
      ),
      { title: "Board not found \u00b7 Toolbox" },
    ),
    404,
  );
}
