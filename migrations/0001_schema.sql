CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS magic_links (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS workspaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS memberships (
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE IF NOT EXISTS boards (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  name TEXT NOT NULL,
  share_token TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS columns (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL,
  name TEXT NOT NULL,
  position INTEGER NOT NULL,
  checklist_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL,
  column_id TEXT NOT NULL,
  title TEXT NOT NULL,
  owner_label TEXT NOT NULL DEFAULT '',
  value_score INTEGER NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  links_json TEXT NOT NULL DEFAULT '[]',
  position INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS card_checks (
  card_id TEXT NOT NULL,
  column_id TEXT NOT NULL,
  item_index INTEGER NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (card_id, column_id, item_index)
);

CREATE TABLE IF NOT EXISTS webhooks (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id TEXT PRIMARY KEY,
  webhook_id TEXT NOT NULL,
  board_id TEXT NOT NULL,
  event TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  status_code INTEGER,
  ok INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_magic_links_email ON magic_links (email);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships (user_id);
CREATE INDEX IF NOT EXISTS idx_boards_workspace ON boards (workspace_id);
CREATE INDEX IF NOT EXISTS idx_columns_board ON columns (board_id, position);
CREATE INDEX IF NOT EXISTS idx_cards_column ON cards (column_id, position);
CREATE INDEX IF NOT EXISTS idx_cards_board ON cards (board_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_board ON webhooks (board_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_board ON webhook_deliveries (board_id, created_at);
