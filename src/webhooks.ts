import type { Context } from "hono";
import { hmacSha256Hex, randomHex } from "./crypto";
import type { AppContext } from "./types";

export type WebhookRow = {
  id: string;
  board_id: string;
  url: string;
  secret: string;
  created_at: string;
};

export type DeliveryRow = {
  id: string;
  webhook_id: string;
  board_id: string;
  event: string;
  payload_json: string;
  status_code: number | null;
  ok: number;
  error: string | null;
  created_at: string;
};

export function newWebhookSecret(): string {
  return randomHex(24);
}

export function safeWebhookUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return null;
  if (host === "127.0.0.1" || host === "0.0.0.0" || host === "::1") return null;
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|169\.254\.)/.test(host)) return null;
  if (url.toString().length > 500) return null;
  return url.toString();
}

export function queueWebhooks(
  c: Context<AppContext>,
  boardId: string,
  event: string,
  data: unknown,
): void {
  const task = deliverBoardEvent(c.env.DB, boardId, event, data).catch((error: unknown) => {
    console.error("webhook delivery failed", error instanceof Error ? error.message : "delivery failed");
  });
  c.executionCtx.waitUntil(task);
}

async function deliverBoardEvent(db: D1Database, boardId: string, event: string, data: unknown): Promise<void> {
  const hooks = await db
    .prepare("SELECT id, board_id, url, secret, created_at FROM webhooks WHERE board_id = ?")
    .bind(boardId)
    .all<WebhookRow>();
  await Promise.all((hooks.results ?? []).map((hook) => postWebhook(db, hook, event, data)));
}

async function postWebhook(db: D1Database, hook: WebhookRow, event: string, data: unknown): Promise<void> {
  const id = crypto.randomUUID();
  const sentAt = new Date().toISOString();
  const payload = JSON.stringify({
    id,
    event,
    board_id: hook.board_id,
    sent_at: sentAt,
    data,
  });
  await sendPayload(db, hook, id, event, payload);
}

export async function resendDelivery(db: D1Database, boardId: string, deliveryId: string): Promise<string | null> {
  const delivery = await db
    .prepare(
      "SELECT id, webhook_id, board_id, event, payload_json, status_code, ok, error, created_at FROM webhook_deliveries WHERE id = ? AND board_id = ?",
    )
    .bind(deliveryId, boardId)
    .first<DeliveryRow>();
  if (!delivery) return "That delivery is not on this board.";

  const hook = await db
    .prepare("SELECT id, board_id, url, secret, created_at FROM webhooks WHERE id = ? AND board_id = ?")
    .bind(delivery.webhook_id, boardId)
    .first<WebhookRow>();
  if (!hook) return "That webhook was removed.";

  let data: unknown = {};
  try {
    const parsed = JSON.parse(delivery.payload_json) as { data?: unknown };
    data = parsed.data ?? {};
  } catch {
    data = {};
  }

  await postWebhook(db, hook, delivery.event, data);
  return null;
}

async function sendPayload(
  db: D1Database,
  hook: WebhookRow,
  id: string,
  event: string,
  payload: string,
): Promise<void> {
  const createdAt = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO webhook_deliveries
        (id, webhook_id, board_id, event, payload_json, status_code, ok, error, created_at)
       VALUES (?, ?, ?, ?, ?, NULL, 0, NULL, ?)`,
    )
    .bind(id, hook.id, hook.board_id, event, payload, createdAt)
    .run();

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = await hmacSha256Hex(hook.secret, `${timestamp}.${payload}`);

  try {
    const response = await fetch(hook.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Toolbox-Event": event,
        "X-Toolbox-Timestamp": timestamp,
        "X-Toolbox-Signature": `v1=${signature}`,
      },
      body: payload,
      signal: AbortSignal.timeout(4000),
    });
    await db
      .prepare("UPDATE webhook_deliveries SET status_code = ?, ok = ?, error = ? WHERE id = ?")
      .bind(response.status, response.ok ? 1 : 0, response.ok ? null : `HTTP ${response.status}`, id)
      .run();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    await db
      .prepare("UPDATE webhook_deliveries SET ok = 0, error = ? WHERE id = ?")
      .bind(message.slice(0, 300), id)
      .run();
  }
}
