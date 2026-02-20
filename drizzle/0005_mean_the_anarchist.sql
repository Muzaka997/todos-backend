DROP TABLE IF EXISTS `not_todos`;--> statement-breakpoint
DROP TABLE IF EXISTS `todos`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`category` text DEFAULT 'General' NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`estimated_minutes` integer DEFAULT 0 NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL,
	`type` text DEFAULT 'TODO' NOT NULL,
	`created_at` text DEFAULT '2026-02-18T13:27:04.470Z' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tasks`("id", "title", "category", "tags", "estimated_minutes", "completed", "type", "created_at")
SELECT "id",
	   "title",
	   'General' as "category",
	   '[]' as "tags",
	   0 as "estimated_minutes",
	   "completed",
	   "type",
	   "created_at"
FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text,
	`gender` text DEFAULT 'OTHER' NOT NULL,
	`created_at` text DEFAULT '2026-02-18T13:27:04.469Z' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "password_hash", "gender", "created_at") SELECT "id", "name", "email", "password_hash", "gender", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);