import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  // Nullable so existing createUser mutation keeps working; auth will always set it.
  passwordHash: text("password_hash"),
  // Store enum as text; default OTHER for legacy rows
  gender: text("gender").notNull().default("OTHER"),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});
