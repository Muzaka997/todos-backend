-- Backfill data from legacy tables into unified tasks table, then drop old tables
BEGIN TRANSACTION;

-- Copy todos into tasks as type 'TODO'
INSERT INTO tasks (title, completed, type, created_at)
SELECT title, completed, 'TODO' as type, COALESCE(created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
FROM todos;

-- Copy not_todos into tasks as type 'NOT_TODO'
INSERT INTO tasks (title, completed, type, created_at)
SELECT title, completed, 'NOT_TODO' as type, COALESCE(created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
FROM not_todos;

-- Drop legacy tables
DROP TABLE IF EXISTS todos;
DROP TABLE IF EXISTS not_todos;

COMMIT;
