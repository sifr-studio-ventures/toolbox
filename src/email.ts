import type { AppBindings } from "./types";

const FROM_EMAIL = "noreply@opentoolbox.io";
const FROM_NAME = "Value Factory";

export type SendResult =
  | { ok: true; provider: "cloudflare" | "resend" }
  | { ok: false; reason: "no-provider" | "send-failed" };

export function showMagicLinkOnScreen(environment: string, host: string): boolean {
  if (environment === "preview" || environment === "development" || environment === "local") return true;
  const normalized = host.toLowerCase();
  return normalized === "localhost" || normalized === "127.0.0.1" || normalized.endsWith(".local");
}

export async function sendMagicLink(
  env: AppBindings,
  to: string,
  link: string,
): Promise<SendResult> {
  const subject = "Sign in to Value Factory";
  const text = `Use this link to sign in to Value Factory. It expires in 30 minutes.\n\n${link}\n\nIf you did not ask for this, ignore the email.`;
  const html = `<p>Use this link to sign in to Value Factory. It expires in 30 minutes.</p><p><a href="${link}">Sign in</a></p><p>If you did not ask for this, ignore the email.</p>`;

  if (env.EMAIL && typeof env.EMAIL.send === "function") {
    try {
      await env.EMAIL.send({
        to,
        from: { email: FROM_EMAIL, name: FROM_NAME },
        subject,
        text,
        html,
      });
      return { ok: true, provider: "cloudflare" };
    } catch (error) {
      console.error("cloudflare email send failed", error instanceof Error ? error.message : "send failed");
    }
  }

  const resendKey = env.RESEND_API_KEY?.trim();
  if (resendKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: [to],
          subject,
          text,
          html,
        }),
      });
      if (response.ok) return { ok: true, provider: "resend" };
      console.error("resend email send failed", response.status);
    } catch (error) {
      console.error("resend email send failed", error instanceof Error ? error.message : "send failed");
    }
    return { ok: false, reason: "send-failed" };
  }

  if (env.EMAIL) return { ok: false, reason: "send-failed" };
  return { ok: false, reason: "no-provider" };
}
