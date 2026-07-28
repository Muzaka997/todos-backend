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
  // Owner. Scopes every read/write to the authenticated user.
  userId: integer("user_id").notNull(),
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

// Notes table for free-form personal notes
export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  title: text("title").notNull().default(""),
  body: text("body").notNull().default(""),
  // Optional voice recording, stored as a base64 data URL (e.g. data:audio/webm;base64,…)
  audio: text("audio"),
  // 0/1 stored as integer for boolean
  pinned: integer("pinned").notNull().default(0),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  updatedAt: text("updated_at").notNull().default(new Date().toISOString()),
});

// Events table for calendar scheduling
export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  start: text("start").notNull(), // ISO string
  end: text("end").notNull(), // ISO string
  kind: text("kind").notNull().default("TODO"), // TODO | NOT_TODO
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});
