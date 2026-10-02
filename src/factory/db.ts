import { randomHex } from "../crypto";
import { NEW_COLUMN_CHECKS, VALUE_FACTORY_COLUMNS } from "./template";

export type User = { id: string; email: string };

export type WorkspaceBoard = {
  workspace_id: string;
  workspace_name: string;
  board_id: string | null;
  board_name: string | null;
  share_token: string | null;
};

export type LinkItem = { label: string; url: string };

export type CardRow = {
  id: string;
  board_id: string;
  column_id: string;
  title: string;
  owner_label: string;
  value_score: number;
  notes: string;
  links_json: string;
  position: number;
};

export type ColumnRow = {
  id: string;
  board_id: string;
  name: string;
  position: number;
  checklist_json: string;
};

export type CheckRow = {
  card_id: string;
  column_id: string;
  item_index: number;
  done: number;
};

export type BoardRecord = {
  id: string;
  workspace_id: string;
  workspace_name: string;
  name: string;
  share_token: string;
};

export type CardView = CardRow & {
  links: LinkItem[];
  checks: { index: number; label: string; done: boolean }[];
};

export type ColumnView = ColumnRow & { cards: CardView[] };

export type BoardView = BoardRecord & { columns: ColumnView[] };

export function parseLinks(raw: string): LinkItem[] {
  try {
    const value = JSON.parse(raw) as unknown;
    if (!Array.isArray(value)) return [];
    return value
      .filter((item): item is LinkItem => {
        if (!item || typeof item !== "object") return false;
        const link = item as { label?: unknown; url?: unknown };
        return typeof link.url === "string" && typeof link.label === "string";
      })
      .slice(0, 8);
  } catch {
    return [];
  }
}

export function parseChecklist(raw: string): string[] {
  try {
    const value = JSON.parse(raw) as unknown;
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is string => typeof item === "string").slice(0, 12);
  } catch {
    return [];
  }
}

export function linksFromText(raw: string): { links: LinkItem[]; error: string | null } {
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const links: LinkItem[] = [];
  for (const line of lines) {
    const [left, right] = line.includes("|") ? line.split("|").map((part) => part.trim()) : [line, line];
    const url = right || left;
    const label = left || url;
    if (!/^https?:\/\//i.test(url)) {
      return { links: [], error: "Links must start with http:// or https://." };
    }
    links.push({ label, url });
  }
  return { links: links.slice(0, 8), error: null };
}

export async function listWorkspaceBoards(db: D1Database, userId: string): Promise<WorkspaceBoard[]> {
  const rows = await db
    .prepare(
      `SELECT w.id AS workspace_id, w.name AS workspace_name,
              b.id AS board_id, b.name AS board_name, b.share_token AS share_token
       FROM memberships m
       JOIN workspaces w ON w.id = m.workspace_id
       LEFT JOIN boards b ON b.workspace_id = w.id
       WHERE m.user_id = ?
       ORDER BY w.created_at, b.updated_at DESC`,
    )
    .bind(userId)
    .all<WorkspaceBoard>();
  return rows.results ?? [];
}

export async function createWorkspace(db: D1Database, userId: string, name: string): Promise<string> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.batch([
    db.prepare("INSERT INTO workspaces (id, name, created_at) VALUES (?, ?, ?)").bind(id, name, now),
    db
      .prepare("INSERT INTO memberships (workspace_id, user_id, role, created_at) VALUES (?, ?, 'owner', ?)" )
      .bind(id, userId, now),
  ]);
  return id;
}

export async function workspaceForMember(
  db: D1Database,
  userId: string,
  workspaceId: string,
): Promise<{ id: string; name: string } | null> {
  return db
    .prepare(
      `SELECT w.id, w.name FROM workspaces w
       JOIN memberships m ON m.workspace_id = w.id
       WHERE w.id = ? AND m.user_id = ?`,
    )
    .bind(workspaceId, userId)
    .first<{ id: string; name: string }>();
}

export async function createBoard(db: D1Database, workspaceId: string, name: string): Promise<string> {
  const boardId = crypto.randomUUID();
  const now = new Date().toISOString();
  const share = randomHex(16);
  const statements: D1PreparedStatement[] = [
    db
      .prepare(
        "INSERT INTO boards (id, workspace_id, name, share_token, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .bind(boardId, workspaceId, name, share, now, now),
  ];
  VALUE_FACTORY_COLUMNS.forEach((column, index) => {
    statements.push(
      db
        .prepare(
          "INSERT INTO columns (id, board_id, name, position, checklist_json, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        )
        .bind(crypto.randomUUID(), boardId, column.name, index, JSON.stringify(column.checks), now),
    );
  });
  await db.batch(statements);
  return boardId;
}

export async function memberBoard(db: D1Database, userId: string, boardId: string): Promise<BoardRecord | null> {
  return db
    .prepare(
      `SELECT b.id, b.workspace_id, w.name AS workspace_name, b.name, b.share_token
       FROM boards b
       JOIN workspaces w ON w.id = b.workspace_id
       JOIN memberships m ON m.workspace_id = b.workspace_id
       WHERE b.id = ? AND m.user_id = ?`,
    )
    .bind(boardId, userId)
    .first<BoardRecord>();
}

export async function boardByShare(db: D1Database, token: string): Promise<BoardRecord | null> {
  return db
    .prepare(
      `SELECT b.id, b.workspace_id, w.name AS workspace_name, b.name, b.share_token
       FROM boards b
       JOIN workspaces w ON w.id = b.workspace_id
       WHERE b.share_token = ?`,
    )
    .bind(token)
    .first<BoardRecord>();
}

export async function loadBoard(db: D1Database, board: BoardRecord): Promise<BoardView> {
  const [columns, cards, checks] = await Promise.all([
    db
      .prepare(
        "SELECT id, board_id, name, position, checklist_json FROM columns WHERE board_id = ? ORDER BY position, created_at",
      )
      .bind(board.id)
      .all<ColumnRow>(),
    db
      .prepare(
        `SELECT id, board_id, column_id, title, owner_label, value_score, notes, links_json, position
         FROM cards WHERE board_id = ? ORDER BY position, created_at`,
      )
      .bind(board.id)
      .all<CardRow>(),
    db
      .prepare(
        `SELECT cc.card_id, cc.column_id, cc.item_index, cc.done
         FROM card_checks cc
         JOIN cards c ON c.id = cc.card_id
         WHERE c.board_id = ?`,
      )
      .bind(board.id)
      .all<CheckRow>(),
  ]);

  const checkMap = new Map<string, Map<number, boolean>>();
  for (const check of checks.results ?? []) {
    const key = `${check.card_id}:${check.column_id}`;
    const items = checkMap.get(key) ?? new Map<number, boolean>();
    items.set(check.item_index, check.done === 1);
    checkMap.set(key, items);
  }

  const cardsByColumn = new Map<string, CardView[]>();
  const columnList = columns.results ?? [];
  const checklistById = new Map(columnList.map((column) => [column.id, parseChecklist(column.checklist_json)]));

  for (const card of cards.results ?? []) {
    const labels = checklistById.get(card.column_id) ?? [];
    const doneMap = checkMap.get(`${card.id}:${card.column_id}`) ?? new Map<number, boolean>();
    const view: CardView = {
      ...card,
      links: parseLinks(card.links_json),
      checks: labels.map((label, index) => ({ index, label, done: doneMap.get(index) === true })),
    };
    const list = cardsByColumn.get(card.column_id) ?? [];
    list.push(view);
    cardsByColumn.set(card.column_id, list);
  }

  return {
    ...board,
    columns: columnList.map((column) => ({
      ...column,
      cards: cardsByColumn.get(column.id) ?? [],
    })),
  };
}

async function touchBoard(db: D1Database, boardId: string): Promise<void> {
  await db.prepare("UPDATE boards SET updated_at = ? WHERE id = ?").bind(new Date().toISOString(), boardId).run();
}

export async function addCard(
  db: D1Database,
  boardId: string,
  columnId: string,
  input: { title: string; owner: string; value: number; notes: string; links: LinkItem[] },
): Promise<string> {
  const column = await db
    .prepare("SELECT id FROM columns WHERE id = ? AND board_id = ?")
    .bind(columnId, boardId)
    .first();
  if (!column) throw new Error("missing-column");
  const next = await db
    .prepare("SELECT COALESCE(MAX(position), -1) + 1 AS next FROM cards WHERE column_id = ?")
    .bind(columnId)
    .first<{ next: number }>();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.batch([
    db
      .prepare(
        `INSERT INTO cards
          (id, board_id, column_id, title, owner_label, value_score, notes, links_json, position, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        boardId,
        columnId,
        input.title,
        input.owner,
        input.value,
        input.notes,
        JSON.stringify(input.links),
        next?.next ?? 0,
        now,
        now,
      ),
    db.prepare("UPDATE boards SET updated_at = ? WHERE id = ?").bind(now, boardId),
  ]);
  return id;
}

export async function updateCard(
  db: D1Database,
  boardId: string,
  cardId: string,
  input: { title: string; owner: string; value: number; notes: string; links: LinkItem[] },
): Promise<CardRow | null> {
  const now = new Date().toISOString();
  const result = await db
    .prepare(
      `UPDATE cards
       SET title = ?, owner_label = ?, value_score = ?, notes = ?, links_json = ?, updated_at = ?
       WHERE id = ? AND board_id = ?`,
    )
    .bind(input.title, input.owner, input.value, input.notes, JSON.stringify(input.links), now, cardId, boardId)
    .run();
  if (!result.meta.changes) return null;
  await touchBoard(db, boardId);
  return db
    .prepare(
      "SELECT id, board_id, column_id, title, owner_label, value_score, notes, links_json, position FROM cards WHERE id = ?",
    )
    .bind(cardId)
    .first<CardRow>();
}

export async function moveCard(
  db: D1Database,
  boardId: string,
  cardId: string,
  columnId: string,
): Promise<{ card: CardRow; fromColumnId: string } | null> {
  const card = await db
    .prepare(
      "SELECT id, board_id, column_id, title, owner_label, value_score, notes, links_json, position FROM cards WHERE id = ? AND board_id = ?",
    )
    .bind(cardId, boardId)
    .first<CardRow>();
  if (!card) return null;
  const column = await db
    .prepare("SELECT id, name FROM columns WHERE id = ? AND board_id = ?")
    .bind(columnId, boardId)
    .first<{ id: string; name: string }>();
  if (!column) return null;
  if (card.column_id === columnId) return { card, fromColumnId: card.column_id };
  const next = await db
    .prepare("SELECT COALESCE(MAX(position), -1) + 1 AS next FROM cards WHERE column_id = ?")
    .bind(columnId)
    .first<{ next: number }>();
  const now = new Date().toISOString();
  await db.batch([
    db
      .prepare("UPDATE cards SET column_id = ?, position = ?, updated_at = ? WHERE id = ?")
      .bind(columnId, next?.next ?? 0, now, cardId),
    db.prepare("UPDATE boards SET updated_at = ? WHERE id = ?").bind(now, boardId),
  ]);
  return {
    card: { ...card, column_id: columnId },
    fromColumnId: card.column_id,
  };
}

export async function deleteCard(db: D1Database, boardId: string, cardId: string): Promise<CardRow | null> {
  const card = await db
    .prepare(
      "SELECT id, board_id, column_id, title, owner_label, value_score, notes, links_json, position FROM cards WHERE id = ? AND board_id = ?",
    )
    .bind(cardId, boardId)
    .first<CardRow>();
  if (!card) return null;
  const now = new Date().toISOString();
  await db.batch([
    db.prepare("DELETE FROM card_checks WHERE card_id = ?").bind(cardId),
    db.prepare("DELETE FROM cards WHERE id = ?").bind(cardId),
    db.prepare("UPDATE boards SET updated_at = ? WHERE id = ?").bind(now, boardId),
  ]);
  return card;
}

export async function setCheck(
  db: D1Database,
  boardId: string,
  cardId: string,
  columnId: string,
  itemIndex: number,
  done: boolean,
): Promise<boolean> {
  const card = await db
    .prepare("SELECT id FROM cards WHERE id = ? AND board_id = ? AND column_id = ?")
    .bind(cardId, boardId, columnId)
    .first();
  if (!card) return false;
  await db
    .prepare(
      `INSERT INTO card_checks (card_id, column_id, item_index, done) VALUES (?, ?, ?, ?)
       ON CONFLICT (card_id, column_id, item_index) DO UPDATE SET done = excluded.done`,
    )
    .bind(cardId, columnId, itemIndex, done ? 1 : 0)
    .run();
  await touchBoard(db, boardId);
  return true;
}

export async function addColumn(db: D1Database, boardId: string, name: string): Promise<string> {
  const next = await db
    .prepare("SELECT COALESCE(MAX(position), -1) + 1 AS next FROM columns WHERE board_id = ?")
    .bind(boardId)
    .first<{ next: number }>();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.batch([
    db
      .prepare(
        "INSERT INTO columns (id, board_id, name, position, checklist_json, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .bind(id, boardId, name, next?.next ?? 0, JSON.stringify(NEW_COLUMN_CHECKS), now),
    db.prepare("UPDATE boards SET updated_at = ? WHERE id = ?").bind(now, boardId),
  ]);
  return id;
}

export async function renameColumn(
  db: D1Database,
  boardId: string,
  columnId: string,
  name: string,
): Promise<{ id: string; name: string; previous: string } | null> {
  const column = await db
    .prepare("SELECT id, name FROM columns WHERE id = ? AND board_id = ?")
    .bind(columnId, boardId)
    .first<{ id: string; name: string }>();
  if (!column) return null;
  if (column.name === name) return { id: column.id, name, previous: column.name };
  const now = new Date().toISOString();
  await db.batch([
    db.prepare("UPDATE columns SET name = ? WHERE id = ?").bind(name, columnId),
    db.prepare("UPDATE boards SET updated_at = ? WHERE id = ?").bind(now, boardId),
  ]);
  return { id: column.id, name, previous: column.name };
}

export async function removeColumn(
  db: D1Database,
  boardId: string,
  columnId: string,
): Promise<{ error: string } | { column: { id: string; name: string } }> {
  const columns = await db
    .prepare("SELECT id, name, position FROM columns WHERE board_id = ? ORDER BY position")
    .bind(boardId)
    .all<{ id: string; name: string; position: number }>();
  const list = columns.results ?? [];
  if (list.length <= 1) return { error: "Keep at least one column." };
  const index = list.findIndex((column) => column.id === columnId);
  if (index < 0) return { error: "That column is already gone." };
  const current = list[index];
  if (!current) return { error: "That column is already gone." };
  const neighbor = list[index - 1] ?? list[index + 1];
  if (!neighbor) return { error: "Keep at least one column." };

  const cards = await db
    .prepare("SELECT id FROM cards WHERE column_id = ? ORDER BY position")
    .bind(columnId)
    .all<{ id: string }>();
  const next = await db
    .prepare("SELECT COALESCE(MAX(position), -1) + 1 AS next FROM cards WHERE column_id = ?")
    .bind(neighbor.id)
    .first<{ next: number }>();
  let position = next?.next ?? 0;
  const now = new Date().toISOString();
  const statements: D1PreparedStatement[] = [];
  for (const card of cards.results ?? []) {
    statements.push(
      db
        .prepare("UPDATE cards SET column_id = ?, position = ?, updated_at = ? WHERE id = ?")
        .bind(neighbor.id, position, now, card.id),
    );
    position += 1;
  }
  statements.push(db.prepare("DELETE FROM card_checks WHERE column_id = ?").bind(columnId));
  statements.push(db.prepare("DELETE FROM columns WHERE id = ?").bind(columnId));
  const remaining = list.filter((column) => column.id !== columnId);
  remaining.forEach((column, columnIndex) => {
    statements.push(db.prepare("UPDATE columns SET position = ? WHERE id = ?").bind(columnIndex, column.id));
  });
  statements.push(db.prepare("UPDATE boards SET updated_at = ? WHERE id = ?").bind(now, boardId));
  await db.batch(statements);
  return { column: { id: current.id, name: current.name } };
}

export async function columnName(db: D1Database, columnId: string): Promise<string | null> {
  const row = await db.prepare("SELECT name FROM columns WHERE id = ?").bind(columnId).first<{ name: string }>();
  return row?.name ?? null;
}

export function cardPayload(card: CardRow, columnNameValue: string) {
  return {
    id: card.id,
    title: card.title,
    owner: card.owner_label,
    value_score: card.value_score,
    notes: card.notes,
    links: parseLinks(card.links_json),
    column_id: card.column_id,
    column_name: columnNameValue,
  };
}
