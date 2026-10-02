import type { Context } from "hono";
import { sha256Hex, randomHex } from "./crypto";
import { sendMagicLink, showMagicLinkOnScreen } from "./email";
import type { User } from "./factory/db";
import { readCookie, safeNext } from "./html";
import { requestHostname } from "./canonical";
import type { AppBindings, AppContext } from "./types";

const SESSION_COOKIE = "vf_session";
const SESSION_DAYS = 30;
const LINK_MINUTES = 30;

export type MagicLinkOutcome = {
  sent: boolean;
  reason: "no-provider" | "send-failed" | null;
  link: string | null;
};

export async function userFromCookie(db: D1Database, cookieHeader: string): Promise<User | null> {
  const token = readCookie(cookieHeader, SESSION_COOKIE);
  if (!token) return null;
  const tokenHash = await sha256Hex(token);
  const now = new Date().toISOString();
  return db
    .prepare(
      `SELECT u.id, u.email
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .bind(tokenHash, now)
    .first<User>();
}

export function sessionCookie(token: string, secure: boolean): string {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const secureFlag = secure ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`;
}

export function clearSessionCookie(secure: boolean): string {
  const secureFlag = secure ? "; Secure" : "";
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secureFlag}`;
}

export function isSecureRequest(c: Context<AppContext>): boolean {
  return new URL(c.req.url).protocol === "https:";
}

export async function requestMagicLink(
  env: AppBindings,
  requestUrl: string,
  email: string,
  nextPath: string,
): Promise<MagicLinkOutcome> {
  const host = requestHostname(new URL(requestUrl).host, requestUrl);
  const showLink = showMagicLinkOnScreen(env.ENVIRONMENT, host);
  const origin = publicOrigin(requestUrl, host);
  const token = randomHex(32);
  const link = `${origin}/auth/verify?token=${token}&next=${encodeURIComponent(safeNext(nextPath))}`;
  const now = new Date();
  const expires = new Date(now.getTime() + LINK_MINUTES * 60 * 1000).toISOString();
  const tokenHash = await sha256Hex(token);

  await env.DB.prepare("DELETE FROM magic_links WHERE email = ? AND used_at IS NULL").bind(email).run();
  await env.DB.prepare(
    "INSERT INTO magic_links (id, email, token_hash, expires_at, used_at, created_at) VALUES (?, ?, ?, ?, NULL, ?)",
  )
    .bind(crypto.randomUUID(), email, tokenHash, expires, now.toISOString())
    .run();

  const sent = await sendMagicLink(env, email, link);
  if (!sent.ok && !showLink) {
    await env.DB.prepare("DELETE FROM magic_links WHERE token_hash = ?").bind(tokenHash).run();
    return { sent: false, reason: sent.reason, link: null };
  }

  return {
    sent: sent.ok,
    reason: sent.ok ? null : sent.reason,
    link: showLink ? link : null,
  };
}

export async function consumeMagicLink(db: D1Database, token: string): Promise<User | null> {
  const tokenHash = await sha256Hex(token);
  const now = new Date().toISOString();
  const link = await db
    .prepare("SELECT email FROM magic_links WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?")
    .bind(tokenHash, now)
    .first<{ email: string }>();
  if (!link) return null;

  const used = await db
    .prepare("UPDATE magic_links SET used_at = ? WHERE token_hash = ? AND used_at IS NULL")
    .bind(now, tokenHash)
    .run();
  if (!used.meta.changes) return null;

  let user = await db.prepare("SELECT id, email FROM users WHERE email = ?").bind(link.email).first<User>();
  if (!user) {
    user = { id: crypto.randomUUID(), email: link.email };
    await db.prepare("INSERT INTO users (id, email, created_at) VALUES (?, ?, ?)").bind(user.id, user.email, now).run();
  }

  return user;
}

export async function createSessionToken(db: D1Database, userId: string): Promise<string> {
  const token = randomHex(32);
  const now = new Date().toISOString();
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await db
    .prepare("INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(crypto.randomUUID(), userId, await sha256Hex(token), expires, now)
    .run();
  return token;
}

export async function deleteSession(db: D1Database, cookieHeader: string): Promise<void> {
  const token = readCookie(cookieHeader, SESSION_COOKIE);
  if (!token) return;
  await db.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256Hex(token)).run();
}

function publicOrigin(requestUrl: string, host: string): string {
  if (host === "opentoolbox.io" || host === "www.opentoolbox.io" || host === "opentoolbox.dev" || host === "www.opentoolbox.dev" || host === "toolbox.mohammadameer.workers.dev") {
    return "https://opentoolbox.io";
  }
  return new URL(requestUrl).origin;
}

export function normalizeEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  if (email.length < 3 || email.length > 254) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}
