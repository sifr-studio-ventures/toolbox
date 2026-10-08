import { brandLockup, icon } from "./brand";
import { escapeHtml } from "./html";

export function authShell(main: string): string {
  return `<div class="min-h-screen bg-base-100">
    <header class="navbar border-b border-base-300 bg-base-100">
      <div class="navbar-start px-2">${brandLockup({ size: "nav", href: "/" })}</div>
      <div class="navbar-end px-2">
        <a class="btn btn-ghost btn-sm" href="/">Home</a>
      </div>
    </header>
    <main class="mx-auto flex w-full max-w-lg flex-col gap-6 page-shell py-12">${main}</main>
  </div>`;
}

export function signInView(next: string, result: string): string {
  return `<section>
    <h1 class="text-3xl font-extrabold">Sign in with a link</h1>
    <p class="mt-4 text-base-content/80">
      No password. Enter your email and we send a link that signs you in.
    </p>
    <form class="mt-8 flex flex-col gap-5" hx-post="/auth/magic" hx-target="#auth-result" hx-swap="innerHTML">
      <input type="hidden" name="next" value="${escapeHtml(next)}" />
      <label class="flex flex-col gap-2 text-sm">
        <span class="font-medium">Email</span>
        <input class="input w-full" type="email" name="email" autocomplete="email" required placeholder="you@example.com" />
      </label>
      <button class="btn btn-primary">
        <span class="htmx-indicator loading loading-spinner loading-sm"></span>
        ${icon("mail")} Email me a sign-in link
      </button>
    </form>
    <div id="auth-result" class="mt-5">${result}</div>
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
