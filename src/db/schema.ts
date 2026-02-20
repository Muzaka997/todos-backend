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

// Unified tasks table to back both Todo and NotTodo
export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  // 0/1 stored as integer for boolean
  category: text("category").notNull().default("General"),
  tags: text("tags").notNull().default("[]"), // Store array as JSON string
  estimatedMinutes: integer("estimated_minutes").notNull().default(0),
  completed: integer("completed").notNull().default(0),
  // 'TODO' or 'NOT_TODO'
  type: text("type").notNull().default("TODO"),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});
