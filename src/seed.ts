import {
  PUBLIC_SHARE_TOKEN,
  SEEDED,
  SEEDED_CARDS,
  SEEDED_COLUMN_IDS,
  VALUE_FACTORY_COLUMNS,
} from "./factory/template";

export async function ensureSeed(db: D1Database): Promise<void> {
  const board = await db
    .prepare("SELECT id FROM boards WHERE share_token = ?")
    .bind(PUBLIC_SHARE_TOKEN)
    .first();
  if (board) return;

  const user = await db.prepare("SELECT id FROM users WHERE email = ?").bind(SEEDED.email).first();
  if (user) return;

  const columnIdByName = new Map<string, string>();
  const statements: D1PreparedStatement[] = [
    db
      .prepare("INSERT OR IGNORE INTO users (id, email, created_at) VALUES (?, ?, ?)")
      .bind(SEEDED.userId, SEEDED.email, SEEDED.createdAt),
    db
      .prepare("INSERT OR IGNORE INTO workspaces (id, name, created_at) VALUES (?, ?, ?)")
      .bind(SEEDED.workspaceId, SEEDED.workspaceName, SEEDED.createdAt),
    db
      .prepare(
        "INSERT OR IGNORE INTO memberships (workspace_id, user_id, role, created_at) VALUES (?, ?, 'owner', ?)",
      )
      .bind(SEEDED.workspaceId, SEEDED.userId, SEEDED.createdAt),
    db
      .prepare(
        "INSERT OR IGNORE INTO boards (id, workspace_id, name, share_token, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .bind(
        SEEDED.boardId,
        SEEDED.workspaceId,
        SEEDED.boardName,
        PUBLIC_SHARE_TOKEN,
        SEEDED.createdAt,
        SEEDED.createdAt,
      ),
  ];

  VALUE_FACTORY_COLUMNS.forEach((column, index) => {
    const id = SEEDED_COLUMN_IDS[index];
    if (!id) return;
    columnIdByName.set(column.name, id);
    statements.push(
      db
        .prepare(
          "INSERT OR IGNORE INTO columns (id, board_id, name, position, checklist_json, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        )
        .bind(id, SEEDED.boardId, column.name, index, JSON.stringify(column.checks), SEEDED.createdAt),
    );
  });

  for (const card of SEEDED_CARDS) {
    const columnId = columnIdByName.get(card.column);
    if (!columnId) continue;
    statements.push(
      db
        .prepare(
          `INSERT OR IGNORE INTO cards
            (id, board_id, column_id, title, owner_label, value_score, notes, links_json, position, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
        )
        .bind(
          card.id,
          SEEDED.boardId,
          columnId,
          card.title,
          card.owner,
          card.value,
          card.notes,
          JSON.stringify(card.links),
          SEEDED.createdAt,
          SEEDED.createdAt,
        ),
    );
    for (const itemIndex of card.done) {
      statements.push(
        db
          .prepare(
            "INSERT OR IGNORE INTO card_checks (card_id, column_id, item_index, done) VALUES (?, ?, ?, 1)",
          )
          .bind(card.id, columnId, itemIndex),
      );
    }
  }

  await db.batch(statements);
}
