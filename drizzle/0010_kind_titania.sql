-- Add per-user ownership to the previously-global tables.
-- Non-destructive: existing rows are backfilled with user_id = 0, which belongs
-- to no real account, so previously-shared data becomes invisible once
-- ownership is enforced in the resolvers.
ALTER TABLE `tasks` ADD COLUMN `user_id` integer NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `notes` ADD COLUMN `user_id` integer NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `events` ADD COLUMN `user_id` integer NOT NULL DEFAULT 0;
