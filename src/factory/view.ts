import { escapeHtml } from "../html";
import type { BoardView, CardView, ColumnView, WorkspaceBoard } from "./db";
import type { DeliveryRow, WebhookRow } from "../webhooks";

export type FactoryUser = { email: string } | null;

export function shell(user: FactoryUser, main: string): string {
  const account = user
    ? `<div class="flex items-center gap-2">
        <span class="hidden max-w-40 truncate text-sm sm:inline">${escapeHtml(user.email)}</span>
        <form method="post" action="/signout"><button class="btn btn-ghost btn-sm">Sign out</button></form>
      </div>`
    : `<a class="btn btn-primary btn-sm" href="/signin">Sign in</a>`;

  return `<div class="drawer">
    <input id="nav-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex min-h-screen flex-col">
      <header class="navbar border-b border-base-300 bg-base-100 px-4 md:px-8">
        <div class="navbar-start gap-2">
          <label for="nav-drawer" class="btn btn-ghost btn-square lg:hidden" aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </label>
          <a class="text-lg font-semibold tracking-tight" href="/">Toolbox</a>
        </div>
        <nav class="navbar-center hidden gap-6 text-sm lg:flex">
          <a href="/factory" class="link link-hover">Value Factory</a>
          <a href="/b/building-opentoolbox" class="link link-hover">Public board</a>
        </nav>
        <div class="navbar-end">${account}</div>
      </header>
      <main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:px-8">${main}</main>
      <footer class="border-t border-base-300 px-4 py-6 text-sm text-base-content/70 md:px-8">
        Value Factory · Toolbox · a board anyone can open
      </footer>
    </div>
    <div class="drawer-side z-20">
      <label for="nav-drawer" class="drawer-overlay" aria-label="Close menu"></label>
      <ul class="menu min-h-full w-72 bg-base-100 p-4 text-base">
        <li><a href="/factory">Value Factory</a></li>
        <li><a href="/b/building-opentoolbox">Building opentoolbox</a></li>
        <li><a href="/">Bench</a></li>
      </ul>
    </div>
  </div>`;
}

export function signInView(next: string, result: string): string {
  return `<section class="mx-auto w-full max-w-lg">
    <p class="text-sm font-medium uppercase tracking-[0.16em] text-primary">Value Factory</p>
    <h1 class="mt-3 text-3xl font-semibold">Sign in with a link</h1>
    <p class="mt-3 text-base-content/80">
      No password. Enter your email and we send a link that signs you in.
    </p>
    <form class="mt-6 flex flex-col gap-4" hx-post="/auth/magic" hx-target="#auth-result" hx-swap="innerHTML">
      <input type="hidden" name="next" value="${escapeHtml(next)}" />
      <label class="flex flex-col gap-1 text-sm">
        <span class="font-medium">Email</span>
        <input class="input w-full" type="email" name="email" autocomplete="email" required placeholder="you@example.com" />
      </label>
      <button class="btn btn-primary">
        <span class="htmx-indicator loading loading-spinner loading-sm"></span>
        Email me a sign-in link
      </button>
    </form>
    <div id="auth-result" class="mt-4">${result}</div>
    <p class="mt-6 text-sm text-base-content/70">
      You can also read the public board
      <a class="link" href="/b/building-opentoolbox">Building opentoolbox</a>
      without an account.
    </p>
  </section>`;
}

export function authResultView(outcome: {
  sent: boolean;
  reason: "no-provider" | "send-failed" | null;
  link: string | null;
  emailError?: string;
}): string {
  if (outcome.emailError) {
    return `<div class="alert alert-error"><span>${escapeHtml(outcome.emailError)}</span></div>`;
  }
  const parts: string[] = [];
  if (outcome.sent && !outcome.link) {
    parts.push(`<div class="alert alert-success"><span>Check your inbox. The link expires in 30 minutes.</span></div>`);
  } else if (outcome.sent && outcome.link) {
    parts.push(
      `<div class="alert alert-success"><span>The email sender accepted the message. This environment also shows the link below. It expires in 30 minutes.</span></div>`,
    );
  } else if (outcome.reason === "no-provider") {
    parts.push(
      `<div class="alert alert-warning"><span>Email sending is not available on this account, so no message was sent. Connect Cloudflare Email Sending for opentoolbox.io, or set the RESEND_API_KEY secret.</span></div>`,
    );
  } else if (outcome.reason === "send-failed") {
    parts.push(
      `<div class="alert alert-warning"><span>We tried to send the sign-in email and it did not go out. No message was delivered. Check that noreply@opentoolbox.io is allowed to send, or set the RESEND_API_KEY secret.</span></div>`,
    );
  }
  if (outcome.link) {
    parts.push(`<div class="alert alert-info">
      <div>
        <p class="font-medium">Use this sign-in link</p>
        <p class="mt-1 text-sm">This environment shows the link on screen so you can sign in without email.</p>
        <a class="btn btn-primary btn-sm mt-3" href="${escapeHtml(outcome.link)}">Open sign-in link</a>
        <p class="mt-3 break-all text-xs">${escapeHtml(outcome.link)}</p>
      </div>
    </div>`);
  }
  return parts.join("");
}
