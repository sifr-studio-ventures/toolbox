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
        title: "Sign in · Value Factory",
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
          { title: "Link expired · Value Factory" },
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
        title: "Value Factory · Open Toolbox",
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
