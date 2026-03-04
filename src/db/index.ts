import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database("db.sqlite");

export const db = drizzle(sqlite, { schema });

// Best-effort migration for events table if it does not exist yet
sqlite.exec(`
	CREATE TABLE IF NOT EXISTS events (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		start TEXT NOT NULL,
		end TEXT NOT NULL,
		kind TEXT NOT NULL DEFAULT 'TODO',
		notes TEXT,
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);
	CREATE INDEX IF NOT EXISTS idx_events_start ON events(start);
	CREATE INDEX IF NOT EXISTS idx_events_end ON events(end);
	CREATE INDEX IF NOT EXISTS idx_events_kind ON events(kind);
`);
