import { db } from "../../db";
import {
  addTask,
  deleteTask,
  getTaskById,
  getTasks,
  toggleTask,
  updateTaskTitle,
  type TaskRow,
} from "./data";

type Ctx = { userId?: string | null };

type GqlTask = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  estimatedMinutes: number;
  completed: boolean;
  type: "TODO" | "NOT_TODO";
};

function mapRow(t: TaskRow): GqlTask {
  let tags: string[] = [];
  try {
    const parsed = JSON.parse(t.tags ?? "[]");
    if (Array.isArray(parsed))
      tags = parsed.filter((x) => typeof x === "string");
  } catch (_e) {
    tags = [];
  }
  return {
    id: String(t.id),
    title: t.title,
    category: t.category ?? "General",
    tags,
    estimatedMinutes: Number(t.estimatedMinutes ?? 0),
    completed: !!t.completed,
    type: t.type === "NOT_TODO" ? "NOT_TODO" : "TODO",
  };
}

export const tasksResolvers = {
  Query: {
    tasks: async (_r: unknown, args: { type: "TODO" | "NOT_TODO" }) => {
      const rows = await getTasks(db, args.type);
      return rows.map(mapRow);
    },
    task: async (_r: unknown, args: { id: string }) => {
      const row = await getTaskById(db, Number(args.id));
      return row ? mapRow(row) : null;
    },
  },
  Mutation: {
    addTask: async (
      _r: unknown,
      args: {
        title: string;
        type: "TODO" | "NOT_TODO";
        category?: string | null;
        estimatedMinutes?: number | null;
        tags?: string[] | null;
      },
      ctx: Ctx,
    ) => {
      if (!ctx?.userId) throw new Error("Not authenticated");
      const created = await addTask(db, {
        type: args.type,
        title: args.title,
        category: args.category,
        estimatedMinutes: args.estimatedMinutes,
        tags: args.tags,
      });
      return mapRow(created);
    },
    toggleTask: async (_r: unknown, args: { id: string }, ctx: Ctx) => {
      if (!ctx?.userId) throw new Error("Not authenticated");
      const updated = await toggleTask(db, Number(args.id));
      return mapRow(updated);
    },
    updateTaskTitle: async (
      _r: unknown,
      args: { id: string; title: string },
      ctx: Ctx,
    ) => {
      if (!ctx?.userId) throw new Error("Not authenticated");
      const updated = await updateTaskTitle(db, Number(args.id), args.title);
      return mapRow(updated);
    },
    deleteTask: async (_r: unknown, args: { id: string }, ctx: Ctx) => {
      if (!ctx?.userId) throw new Error("Not authenticated");
      return await deleteTask(db, Number(args.id));
    },
  },
};
