import type { Context } from "hono";
import type { AppContext } from "../types";
import type { DeliveryRow, WebhookRow } from "../webhooks";
import {
  cardPayload,
  columnName,
  linksFromText,
  listWorkspaceBoards,
  loadBoard,
  memberBoard,
  type BoardRecord,
  type CardView,
  type User,
} from "./db";
import {
  boardColumns,
  boardPage,
  factoryHome,
  shell,
  webhookPanel,
} from "./view";

export type Layout = (
  css: string,
  body: string,
  options?: { title?: string; description?: string },
) => string;

export async function renderBoard(
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
      { title: `${board.name} · Value Factory`, description: `${board.name} on the Value Factory.` },
    ),
  );
}

export async function columnsResponse(c: Context<AppContext>, board: BoardRecord, alert: string | null): Promise<Response> {
  if (!isHtmx(c)) return c.redirect(`/boards/${board.id}`);
  const view = await loadBoard(c.env.DB, board);
  return c.html(boardColumns(view, "edit", alert, true), alert ? 400 : 200);
}

export async function hooksResponse(c: Context<AppContext>, boardId: string, error: string | null): Promise<Response> {
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

export async function editableBoard(c: Context<AppContext>): Promise<{ user: User; board: BoardRecord } | Response> {
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

export function findCard(columns: { cards: CardView[] }[], cardId: string): CardView | null {
  for (const column of columns) {
    const card = column.cards.find((item) => item.id === cardId);
    if (card) return card;
  }
  return null;
}

export function parseCardForm(form: FormData): { error: string } | { value: { title: string; owner: string; value: number; notes: string; links: { label: string; url: string }[] } } {
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

export function cleanName(value: string, max: number): string | null {
  const name = value.trim();
  if (!name || name.length > max) return null;
  return name;
}

export async function factoryError(
  c: Context<AppContext>,
  css: string,
  layout: Layout,
  user: User,
  error: string,
): Promise<Response> {
  const rows = await listWorkspaceBoards(c.env.DB, user.id);
  return c.html(
    layout(css, shell(user, factoryHome(rows, error)), { title: "Value Factory · Open Toolbox" }),
    400,
  );
}

export function missing(c: Context<AppContext>, css: string, layout: Layout, user: User | null): Response {
  return c.html(
    layout(
      css,
      shell(
        user,
        `<section class="mx-auto max-w-lg"><h1 class="text-2xl font-extrabold">That board is not here</h1><p class="mt-3">The link may be old, or the board was removed.</p><a class="btn btn-primary mt-4" href="/factory">Back to Value Factory</a></section>`,
      ),
      { title: "Board not found · Open Toolbox" },
    ),
    404,
  );
}
