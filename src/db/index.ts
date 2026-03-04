import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database("db.sqlite");

export const db = drizzle(sqlite, { schema });

// Best-effort migration for events, users, and tasks tables if they do not exist yet
sqlite.exec(`
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		password_hash TEXT,
		gender TEXT NOT NULL DEFAULT 'OTHER',
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS tasks (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		category TEXT NOT NULL DEFAULT 'General',
		tags TEXT NOT NULL DEFAULT '[]',
		estimated_minutes INTEGER NOT NULL DEFAULT 0,
		completed INTEGER NOT NULL DEFAULT 0,
		type TEXT NOT NULL DEFAULT 'TODO',
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

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
