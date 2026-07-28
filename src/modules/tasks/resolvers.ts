import { db } from "../../db";
import { requireUserId, type Ctx } from "../../graphql/guards";
import {
  addTask,
  deleteTask,
  getTaskById,
  getTasks,
  toggleTask,
  updateTaskTitle,
  type TaskRow,
} from "./data";

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
    tasks: async (
      _r: unknown,
      args: { type: "TODO" | "NOT_TODO" },
      ctx: Ctx,
    ) => {
      const userId = requireUserId(ctx);
      const rows = await getTasks(db, userId, args.type);
      return rows.map(mapRow);
    },
    task: async (_r: unknown, args: { id: string }, ctx: Ctx) => {
      const userId = requireUserId(ctx);
      const row = await getTaskById(db, userId, Number(args.id));
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
      const userId = requireUserId(ctx);
      const created = await addTask(db, userId, {
        type: args.type,
        title: args.title,
        category: args.category,
        estimatedMinutes: args.estimatedMinutes,
        tags: args.tags,
      });
      return mapRow(created);
    },
    toggleTask: async (_r: unknown, args: { id: string }, ctx: Ctx) => {
      const userId = requireUserId(ctx);
      const updated = await toggleTask(db, userId, Number(args.id));
      return mapRow(updated);
    },
    updateTaskTitle: async (
      _r: unknown,
      args: { id: string; title: string },
      ctx: Ctx,
    ) => {
      const userId = requireUserId(ctx);
      const updated = await updateTaskTitle(db, userId, Number(args.id), args.title);
      return mapRow(updated);
    },
    deleteTask: async (_r: unknown, args: { id: string }, ctx: Ctx) => {
      const userId = requireUserId(ctx);
      return await deleteTask(db, userId, Number(args.id));
    },
  },
};
