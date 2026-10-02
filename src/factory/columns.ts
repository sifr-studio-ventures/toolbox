import { escapeHtml } from "../html";
import type { BoardView, CardView, ColumnView } from "./db";
export function boardColumns(
  board: BoardView,
  mode: "edit" | "read",
  alert: string | null = null,
  oob = false,
): string {
  const columns = board.columns
    .map((column) => columnView(board, column, mode))
    .join("");
  const addColumn =
    mode === "edit"
      ? `<form class="flex w-[80vw] max-w-xs shrink-0 snap-start flex-col gap-2 rounded-box border border-dashed border-base-300 bg-base-100 p-3 sm:w-72" hx-post="/boards/${escapeHtml(board.id)}/columns" hx-target="#board-columns" hx-swap="outerHTML" hx-indicator="#board-pending">
          <p class="text-sm font-medium">Add a column</p>
          <input class="input input-sm w-full" name="name" required maxlength="40" placeholder="Column name" />
          <button class="btn btn-sm btn-primary">Add column</button>
        </form>`
      : "";

  const alertHtml = !oob
    ? ""
    : alert
      ? `<div id="board-alert" hx-swap-oob="true" class="alert alert-error"><span>${escapeHtml(alert)}</span></div>`
      : `<div id="board-alert" hx-swap-oob="true"></div>`;

  return `${alertHtml}<div id="board-columns" class="flex snap-x gap-3 overflow-x-auto pb-3">${columns}${addColumn}</div>`;
}

function columnView(board: BoardView, column: ColumnView, mode: "edit" | "read"): string {
  const cards = column.cards.length
    ? column.cards.map((card) => cardView(board, column, card, mode)).join("")
    : `<p class="rounded-box bg-base-100 px-3 py-4 text-sm text-base-content/60">Nothing in this column yet.</p>`;

  const title =
    mode === "edit"
      ? `<input class="input input-sm w-full font-semibold" name="name" value="${escapeHtml(column.name)}" aria-label="Column name" hx-patch="/boards/${escapeHtml(board.id)}/columns/${escapeHtml(column.id)}" hx-trigger="change" hx-target="#board-columns" hx-swap="outerHTML" hx-indicator="#board-pending" />`
      : `<h2 class="px-1 text-sm font-semibold">${escapeHtml(column.name)}</h2>`;

  const remove =
    mode === "edit"
      ? `<button class="btn btn-ghost btn-xs" hx-delete="/boards/${escapeHtml(board.id)}/columns/${escapeHtml(column.id)}" hx-target="#board-columns" hx-swap="outerHTML" hx-confirm="Remove this column? Cards move to the neighbor column." hx-indicator="#board-pending">Remove</button>`
      : "";

  const add =
    mode === "edit"
      ? `<form class="mt-2 flex flex-col gap-2" hx-post="/boards/${escapeHtml(board.id)}/columns/${escapeHtml(column.id)}/cards" hx-target="#board-columns" hx-swap="outerHTML" hx-indicator="#board-pending">
          <input class="input input-sm w-full" name="title" required maxlength="140" placeholder="New card" />
          <button class="btn btn-sm btn-outline">Add card</button>
        </form>`
      : "";

  return `<section class="flex w-[80vw] max-w-xs shrink-0 snap-start flex-col gap-3 rounded-box bg-base-200 p-3 sm:w-72">
    <div class="flex items-center justify-between gap-2">${title}${remove}</div>
    <div class="flex flex-col gap-3">${cards}</div>
    ${add}
  </section>`;
}

function cardView(board: BoardView, column: ColumnView, card: CardView, mode: "edit" | "read"): string {
  const scoreClass = card.value_score >= 7 ? "badge-primary" : "badge-ghost";
  const owner = card.owner_label
    ? `<p class="text-xs text-base-content/70">Owner \u00b7 ${escapeHtml(card.owner_label)}</p>`
    : `<p class="text-xs text-base-content/50">No owner yet</p>`;
  const notes = card.notes
    ? `<p class="whitespace-pre-wrap text-sm leading-relaxed">${escapeHtml(card.notes)}</p>`
    : "";
  const links = card.links.length
    ? `<ul class="flex flex-col gap-1 text-sm">${card.links
        .map(
          (link) =>
            `<li><a class="link break-all" href="${escapeHtml(link.url)}" target="_blank" rel="noopener">${escapeHtml(link.label)}</a></li>`,
        )
        .join("")}</ul>`
    : "";
  const checks = card.checks.length
    ? `<ul class="flex flex-col gap-1">${card.checks.map((check) => checkView(board, card, check, mode)).join("")}</ul>`
    : `<p class="text-xs text-base-content/50">No checklist on this column.</p>`;

  const move =
    mode === "edit"
      ? `<form class="flex flex-col gap-1 text-xs" method="post" action="/boards/${escapeHtml(board.id)}/cards/${escapeHtml(card.id)}/move" hx-post="/boards/${escapeHtml(board.id)}/cards/${escapeHtml(card.id)}/move" hx-trigger="change, submit" hx-target="#board-columns" hx-swap="outerHTML" hx-indicator="#board-pending">
          <span>Move to</span>
          <select class="select select-sm w-full" name="column_id" aria-label="Move ${escapeHtml(card.title)}">
            ${board.columns
              .map(
                (option) =>
                  `<option value="${escapeHtml(option.id)}" ${option.id === column.id ? "selected" : ""}>${escapeHtml(option.name)}</option>`,
              )
              .join("")}
          </select>
          <button class="btn btn-xs btn-ghost justify-start px-0">Move</button>
        </form>`
      : "";

  const actions =
    mode === "edit"
      ? `<div class="flex gap-2">
          <button class="btn btn-sm btn-outline" hx-get="/boards/${escapeHtml(board.id)}/cards/${escapeHtml(card.id)}/edit" hx-target="#card-dialog-body" hx-swap="innerHTML" hx-on::after-request="if (event.detail.successful) document.getElementById('card-dialog')?.showModal()">Edit</button>
          <button class="btn btn-sm btn-ghost text-error" hx-delete="/boards/${escapeHtml(board.id)}/cards/${escapeHtml(card.id)}" hx-target="#board-columns" hx-swap="outerHTML" hx-confirm="Delete this card?" hx-indicator="#board-pending">Delete</button>
        </div>`
      : "";

  return `<article class="card border border-base-300 bg-base-100 shadow-sm">
    <div class="card-body gap-3 p-4">
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-medium leading-snug">${escapeHtml(card.title)}</h3>
        <span class="badge ${scoreClass} shrink-0">Value ${card.value_score}</span>
      </div>
      ${owner}
      ${notes}
      ${links}
      ${checks}
      ${move}
      ${actions}
    </div>
  </article>`;
}

function checkView(
  board: BoardView,
  card: CardView,
  check: { index: number; label: string; done: boolean },
  mode: "edit" | "read",
): string {
  if (mode === "read") {
    return `<li class="flex items-start gap-2 text-sm">
      <input type="checkbox" class="checkbox checkbox-xs mt-0.5" disabled ${check.done ? "checked" : ""} />
      <span class="${check.done ? "line-through text-base-content/50" : ""}">${escapeHtml(check.label)}</span>
    </li>`;
  }
  return `<li>
    <form class="flex items-start gap-2 text-sm">
      <input type="hidden" name="column_id" value="${escapeHtml(card.column_id)}" />
      <input type="hidden" name="item_index" value="${check.index}" />
      <input type="checkbox" class="checkbox checkbox-xs mt-0.5" name="done" value="1" ${check.done ? "checked" : ""} hx-post="/boards/${escapeHtml(board.id)}/cards/${escapeHtml(card.id)}/checks" hx-trigger="change" hx-include="closest form" hx-target="#board-columns" hx-swap="outerHTML" hx-indicator="#board-pending" />
      <span class="${check.done ? "line-through text-base-content/50" : ""}">${escapeHtml(check.label)}</span>
    </form>
  </li>`;
}
