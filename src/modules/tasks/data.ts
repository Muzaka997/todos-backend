import { eq } from "drizzle-orm";
import { tasks as tasksTable } from "../../db/schema";

export type TaskType = "TODO" | "NOT_TODO";

export type TaskRow = {
  id: number;
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
  type: TaskType,
): Promise<TaskRow[]> {
  return await db.select().from(tasksTable).where(eq(tasksTable.type, type));
}

export async function getTaskById(
  db: typeof import("../../db").db,
  id: number,
): Promise<TaskRow | null> {
  const rows = await db.select().from(tasksTable).where(eq(tasksTable.id, id));
  return rows[0] ?? null;
}

export async function addTask(
  db: typeof import("../../db").db,
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
  id: number,
): Promise<TaskRow> {
  const found = await getTaskById(db, id);
  if (!found) throw new Error("Task not found");
  const [updated] = await db
    .update(tasksTable)
    .set({ completed: found.completed === 0 ? 1 : 0 })
    .where(eq(tasksTable.id, id))
    .returning();
  return updated;
}

export async function updateTaskTitle(
  db: typeof import("../../db").db,
  id: number,
  title: string,
): Promise<TaskRow> {
  const found = await getTaskById(db, id);
  if (!found) throw new Error("Task not found");
  const [updated] = await db
    .update(tasksTable)
    .set({ title })
    .where(eq(tasksTable.id, id))
    .returning();
  return updated;
}

export async function deleteTask(
  db: typeof import("../../db").db,
  id: number,
): Promise<boolean> {
  const found = await getTaskById(db, id);
  if (!found) return false;
  await db.delete(tasksTable).where(eq(tasksTable.id, id));
  return true;
}
