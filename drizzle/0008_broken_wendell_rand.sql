CREATE TABLE `notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`pinned` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT '2026-07-16T13:30:12.466Z' NOT NULL,
	`updated_at` text DEFAULT '2026-07-16T13:30:12.466Z' NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`kind` text DEFAULT 'TODO' NOT NULL,
	`notes` text,
	`created_at` text DEFAULT '2026-07-16T13:30:12.466Z' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_events`("id", "title", "start", "end", "kind", "notes", "created_at") SELECT "id", "title", "start", "end", "kind", "notes", "created_at" FROM `events`;--> statement-breakpoint
DROP TABLE `events`;--> statement-breakpoint
ALTER TABLE `__new_events` RENAME TO `events`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`category` text DEFAULT 'General' NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`estimated_minutes` integer DEFAULT 0 NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL,
	`type` text DEFAULT 'TODO' NOT NULL,
	`created_at` text DEFAULT '2026-07-16T13:30:12.466Z' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tasks`("id", "title", "category", "tags", "estimated_minutes", "completed", "type", "created_at") SELECT "id", "title", "category", "tags", "estimated_minutes", "completed", "type", "created_at" FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text,
	`gender` text DEFAULT 'OTHER' NOT NULL,
	`created_at` text DEFAULT '2026-07-16T13:30:12.465Z' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "password_hash", "gender", "created_at") SELECT "id", "name", "email", "password_hash", "gender", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);