CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL,
	`type` text DEFAULT 'TODO' NOT NULL,
	`created_at` text DEFAULT '2026-02-18T11:25:00.418Z' NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_not_todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT '2026-02-18T11:25:00.419Z' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_not_todos`("id", "title", "completed", "created_at") SELECT "id", "title", "completed", "created_at" FROM `not_todos`;--> statement-breakpoint
DROP TABLE `not_todos`;--> statement-breakpoint
ALTER TABLE `__new_not_todos` RENAME TO `not_todos`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT '2026-02-18T11:25:00.419Z' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_todos`("id", "title", "completed", "created_at") SELECT "id", "title", "completed", "created_at" FROM `todos`;--> statement-breakpoint
DROP TABLE `todos`;--> statement-breakpoint
ALTER TABLE `__new_todos` RENAME TO `todos`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text,
	`gender` text DEFAULT 'OTHER' NOT NULL,
	`created_at` text DEFAULT '2026-02-18T11:25:00.418Z' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "password_hash", "gender", "created_at") SELECT "id", "name", "email", "password_hash", "gender", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);