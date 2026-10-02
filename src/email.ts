import type { AppBindings } from "./types";

const FROM_EMAIL = "noreply@opentoolbox.io";
const FROM_NAME = "Open Toolbox";

export type SendResult =
  | { ok: true; provider: "cloudflare" | "resend" }
  | { ok: false; reason: "no-provider" | "send-failed" };

export function showMagicLinkOnScreen(environment: string, host: string): boolean {
  if (environment === "preview" || environment === "development" || environment === "local") return true;
  const normalized = host.toLowerCase();
  return normalized === "localhost" || normalized === "127.0.0.1" || normalized.endsWith(".local");
}

function magicLinkCopy(link: string): { subject: string; text: string; html: string } {
  const subject = "Your Open Toolbox sign-in link";
  const text = [
    "Open Toolbox",
    "",
    "Use this link to sign in. It expires in 30 minutes.",
    "",
    link,
    "",
    "If you did not ask for this, ignore this email.",
    "",
    "— Open Toolbox",
  ].join("\n");
  const html = [
    `<div style="font-family:Georgia,'Times New Roman',serif;line-height:1.55;color:#023047;max-width:32rem">`,
    `<p style="font-size:22px;margin:0 0 16px;font-weight:700">Open Toolbox</p>`,
    `<p style="margin:0 0 16px">Use this link to sign in. It expires in 30 minutes.</p>`,
    `<p style="margin:0 0 20px"><a href="${link}" style="color:#023047;font-weight:700">Sign in to Open Toolbox</a></p>`,
    `<p style="margin:0;color:#555;font-size:14px">Sign-in URL:<br><a href="${link}" style="color:#023047;word-break:break-all">${link}</a></p>`,
    `<p style="margin:20px 0 0;color:#555;font-size:14px">If you did not ask for this, ignore this email.</p>`,
    `</div>`,
  ].join("");
  return { subject, text, html };
}

export async function sendMagicLink(
  env: AppBindings,
  to: string,
  link: string,
): Promise<SendResult> {
  const { subject, text, html } = magicLinkCopy(link);

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
