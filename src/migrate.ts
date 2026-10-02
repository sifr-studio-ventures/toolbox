import schemaSql from "../migrations/0001_schema.sql?raw";
import { ensureSeed } from "./seed";

const MIGRATIONS = [{ name: "0001_schema.sql", sql: schemaSql }];

let ready: Promise<void> | null = null;

export function ensureReady(db: D1Database): Promise<void> {
  if (!ready) {
    ready = setup(db).catch((error: unknown) => {
      ready = null;
      throw error;
    });
  }
  return ready;
}

function sqlStatements(sql: string): string[] {
  return sql
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function runSql(db: D1Database, sql: string): Promise<void> {
  for (const statement of sqlStatements(sql)) {
    await db.prepare(statement).run();
  }
}

async function setup(db: D1Database): Promise<void> {
  await runSql(
    db,
    `CREATE TABLE IF NOT EXISTS d1_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`,
  );

  const applied = await db.prepare("SELECT name FROM d1_migrations").all<{ name: string }>();
  const seen = new Set((applied.results ?? []).map((row) => row.name));

  for (const migration of MIGRATIONS) {
    if (seen.has(migration.name)) continue;
    await runSql(db, migration.sql);
    await db.prepare("INSERT OR IGNORE INTO d1_migrations (name) VALUES (?)").bind(migration.name).run();
  }

  await ensureSeed(db);
}
