import { and, eq } from "drizzle-orm";
import { tasks as tasksTable } from "../../db/schema";

export type TaskType = "TODO" | "NOT_TODO";

export type TaskRow = {
  id: number;
  userId: number;
  title: string;
  category: string;
  tags: string; // JSON string in DB
  estimatedMinutes: number;
  completed: number; // 0/1
  type: string;
  createdAt: string;
};

export async function getTasks(
  db: typeof import("../../db").db,
  userId: number,
  type: TaskType,
): Promise<TaskRow[]> {
  return await db
    .select()
    .from(tasksTable)
    .where(and(eq(tasksTable.userId, userId), eq(tasksTable.type, type)));
}

export async function getTaskById(
  db: typeof import("../../db").db,
  userId: number,
  id: number,
): Promise<TaskRow | null> {
  const rows = await db
    .select()
    .from(tasksTable)
    .where(and(eq(tasksTable.id, id), eq(tasksTable.userId, userId)));
  return rows[0] ?? null;
}

export async function addTask(
  db: typeof import("../../db").db,
  userId: number,
  params: {
    type: TaskType;
    title: string;
    category?: string | null;
    estimatedMinutes?: number | null;
    tags?: string[] | null;
  },
): Promise<TaskRow> {
  const category = params.category ?? "General";
  const estimated = params.estimatedMinutes ?? 0;
  const tagsJson = JSON.stringify(params.tags ?? []);
  const [created] = await db
    .insert(tasksTable)
    .values({
      userId,
      title: params.title,
      type: params.type,
      completed: 0,
      category,
      estimatedMinutes: estimated,
      tags: tagsJson,
    } as any)
    .returning();
  return created;
}

export async function toggleTask(
  db: typeof import("../../db").db,
  userId: number,
  id: number,
): Promise<TaskRow> {
  const found = await getTaskById(db, userId, id);
  if (!found) throw new Error("Task not found");
  const [updated] = await db
    .update(tasksTable)
    .set({ completed: found.completed === 0 ? 1 : 0 })
    .where(and(eq(tasksTable.id, id), eq(tasksTable.userId, userId)))
    .returning();
  return updated;
}

export async function updateTaskTitle(
  db: typeof import("../../db").db,
  userId: number,
  id: number,
  title: string,
): Promise<TaskRow> {
  const found = await getTaskById(db, userId, id);
  if (!found) throw new Error("Task not found");
  const [updated] = await db
    .update(tasksTable)
    .set({ title })
    .where(and(eq(tasksTable.id, id), eq(tasksTable.userId, userId)))
    .returning();
  return updated;
}

export async function deleteTask(
  db: typeof import("../../db").db,
  userId: number,
  id: number,
): Promise<boolean> {
  const found = await getTaskById(db, userId, id);
  if (!found) return false;
  await db
    .delete(tasksTable)
    .where(and(eq(tasksTable.id, id), eq(tasksTable.userId, userId)));
  return true;
}
