import { escapeHtml } from "../html";
import type { BoardView, CardView } from "./db";
import type { DeliveryRow, WebhookRow } from "../webhooks";
import { boardColumns } from "./columns";

export function cardForm(boardId: string, card: CardView, error: string | null): string {
  const links = card.links
    .map((link) => (link.label === link.url ? link.url : `${link.label} | ${link.url}`))
    .join("\n");
  return `<form class="flex flex-col gap-3" hx-post="/boards/${escapeHtml(boardId)}/cards/${escapeHtml(card.id)}" hx-target="#board-columns" hx-swap="outerHTML" hx-indicator="#board-pending">
    <h3 class="text-lg font-bold">Edit card</h3>
    ${error ? `<div class="alert alert-error"><span>${escapeHtml(error)}</span></div>` : ""}
    <label class="flex flex-col gap-1 text-sm">
      <span class="font-medium">Title</span>
      <input class="input w-full" name="title" required maxlength="140" value="${escapeHtml(card.title)}" />
    </label>
    <label class="flex flex-col gap-1 text-sm">
      <span class="font-medium">Owner</span>
      <input class="input w-full" name="owner" maxlength="80" value="${escapeHtml(card.owner_label)}" placeholder="Who owns this?" />
    </label>
    <label class="flex flex-col gap-1 text-sm">
      <span class="font-medium">Value score</span>
      <input class="input w-full" type="number" name="value_score" min="0" max="10" step="1" value="${card.value_score}" />
    </label>
    <label class="flex flex-col gap-1 text-sm">
      <span class="font-medium">Notes</span>
      <textarea class="textarea w-full" name="notes" rows="4" maxlength="4000">${escapeHtml(card.notes)}</textarea>
    </label>
    <label class="flex flex-col gap-1 text-sm">
      <span class="font-medium">Links</span>
      <textarea class="textarea w-full" name="links" rows="3" placeholder="https://example.com&#10;Label | https://example.com">${escapeHtml(links)}</textarea>
    </label>
    <div class="modal-action">
      <button class="btn btn-primary" type="submit">Save card</button>
      <button class="btn btn-ghost" type="button" onclick="document.getElementById('card-dialog')?.close()">Close</button>
    </div>
  </form>`;
}

export function boardPage(options: {
  board: BoardView;
  mode: "edit" | "read";
  origin: string;
  canEdit: boolean;
  webhooks: WebhookRow[];
  deliveries: DeliveryRow[];
  webhookError: string | null;
}): string {
  const { board, mode, origin, canEdit } = options;
  const shareUrl = `${origin}/b/${board.share_token}`;
  const editLink =
    canEdit && mode === "read"
      ? `<a class="btn btn-primary btn-sm" href="/boards/${escapeHtml(board.id)}">Edit this board</a>`
      : "";
  const banner =
    mode === "read"
      ? `<div class="alert"><span>This is a public read-only link. Signed-out visitors cannot edit.</span>${editLink}</div>`
      : `<div class="alert alert-info"><span>Share this link. Anyone with it can read the board and cannot change it.</span></div>`;

  const webhooks = mode === "edit" ? webhookPanel(board.id, options.webhooks, options.deliveries, options.webhookError) : "";
  const dialog =
    mode === "edit"
      ? `<dialog id="card-dialog" class="modal">
          <div class="modal-box w-11/12 max-w-2xl">
            <div id="card-dialog-body"></div>
          </div>
          <form method="dialog" class="modal-backdrop"><button>close</button></form>
        </dialog>
        <script>
          document.body.addEventListener("closeCard", () => {
            document.getElementById("card-dialog")?.close();
          });
        </script>`
      : "";

  return `<div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="text-sm text-base-content/70"><a class="link" href="/factory">${escapeHtml(board.workspace_name)}</a></p>
        <h1 class="text-3xl font-extrabold">${escapeHtml(board.name)}</h1>
      </div>
      <div class="flex items-center gap-2">
        <span id="board-pending" class="htmx-indicator loading loading-spinner loading-sm"></span>
        <a class="btn btn-sm btn-outline" href="${escapeHtml(shareUrl)}">Public link</a>
      </div>
    </div>
    ${banner}
    <p class="break-all text-sm text-base-content/70">${escapeHtml(shareUrl)}</p>
    <p class="text-sm text-base-content/60 md:hidden">Swipe sideways to see the next column.</p>
    <div id="board-alert"></div>
    ${boardColumns(board, mode)}
    ${webhooks}
    ${dialog}`;
}

export function webhookPanel(
  boardId: string,
  webhooks: WebhookRow[],
  deliveries: DeliveryRow[],
  error: string | null,
): string {
  const hookList =
    webhooks.length === 0
      ? `<p class="text-sm text-base-content/70">No webhooks yet. Add an https URL and we will POST when a card or column changes.</p>`
      : `<ul class="flex flex-col gap-3">${webhooks
          .map(
            (hook) => `<li class="rounded-box bg-base-200 p-3">
              <div class="flex flex-wrap items-start justify-between gap-2">
                <p class="break-all text-sm font-medium">${escapeHtml(hook.url)}</p>
                <button class="btn btn-ghost btn-xs" hx-delete="/boards/${escapeHtml(boardId)}/webhooks/${escapeHtml(hook.id)}" hx-target="#webhook-panel" hx-swap="outerHTML" hx-confirm="Remove this webhook?">Remove</button>
              </div>
              <p class="mt-2 text-xs text-base-content/60">Signing secret</p>
              <code class="mt-1 block break-all text-xs">${escapeHtml(hook.secret)}</code>
            </li>`,
          )
          .join("")}</ul>`;

  const deliveryList =
    deliveries.length === 0
      ? `<p class="text-sm text-base-content/70">No deliveries yet.</p>`
      : `<ul class="flex flex-col gap-2">${deliveries
          .map((delivery) => {
            const status = delivery.status_code === null ? "No response" : String(delivery.status_code);
            const tone = delivery.ok ? "badge-success" : "badge-warning";
            return `<li class="flex flex-col gap-2 rounded-box border border-base-300 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="badge ${tone}">${escapeHtml(delivery.event)}</span>
                  <span class="text-sm">${escapeHtml(status)}</span>
                </div>
                <p class="mt-1 text-xs text-base-content/60">${escapeHtml(delivery.created_at)}${delivery.error ? ` \u00b7 ${escapeHtml(delivery.error)}` : ""}</p>
              </div>
              <button class="btn btn-sm btn-outline" hx-post="/boards/${escapeHtml(boardId)}/deliveries/${escapeHtml(delivery.id)}/resend" hx-target="#webhook-panel" hx-swap="outerHTML" hx-indicator="#board-pending">Resend</button>
            </li>`;
          })
          .join("")}</ul>`;

  return `<section id="webhook-panel" class="card bg-base-100 shadow-sm">
    <div class="card-body gap-4">
      <h2 class="card-title">Webhooks</h2>
      <p class="text-sm text-base-content/80">We POST JSON when a card is created, edited, moved, or deleted, and when a column is added, renamed, or removed. Sign the value <code>timestamp + "." + raw body</code> with HMAC-SHA256 and compare the hex to <code>X-Toolbox-Signature</code> after the <code>v1=</code> prefix. The timestamp is <code>X-Toolbox-Timestamp</code>.</p>
      ${error ? `<div class="alert alert-error"><span>${escapeHtml(error)}</span></div>` : ""}
      <form class="flex flex-col gap-2 sm:flex-row" hx-post="/boards/${escapeHtml(boardId)}/webhooks" hx-target="#webhook-panel" hx-swap="outerHTML" hx-indicator="#board-pending">
        <input class="input w-full" type="url" name="url" required placeholder="https://example.com/hooks/value-factory" />
        <button class="btn btn-primary">Add webhook</button>
      </form>
      ${hookList}
      <h3 class="font-medium">Delivery log</h3>
      ${deliveryList}
    </div>
  </section>`;
}
