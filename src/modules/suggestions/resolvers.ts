import { filterSuggestions, findSuggestion } from "./data";
import { db } from "../../db";
import { addTask, type TaskRow } from "../tasks/data";

export const suggestionsResolvers = {
  Query: {
    suggestions: (
      _r: unknown,
      args: { category?: string | null; limit?: number | null },
    ) => filterSuggestions({ category: args.category, limit: args.limit }),
    suggestion: (_r: unknown, args: { id: string }) =>
      findSuggestion(args.id) ?? null,
  },
  Mutation: {
    addSuggestionToTasks: async (
      _r: unknown,
      args: { suggestionId: string; type?: "TODO" | "NOT_TODO" },
      ctx: { userId?: string | null },
    ) => {
      if (!ctx?.userId) throw new Error("Not authenticated");
      const s = findSuggestion(args.suggestionId);
      if (!s) throw new Error("Suggestion not found");
      const created: TaskRow = await addTask(db, {
        type: args.type ?? "TODO",
        title: s.title,
        category: s.category,
        estimatedMinutes: s.estimatedMinutes,
        tags: s.tags,
      });
      // Map to full Task shape
      let tags: string[] = [];
      try {
        const parsed = JSON.parse(created.tags ?? "[]");
        if (Array.isArray(parsed))
          tags = parsed.filter((x) => typeof x === "string");
      } catch (_e) {
        tags = [];
      }
      return {
        id: String(created.id),
        title: created.title,
        category: created.category ?? "General",
        tags,
        estimatedMinutes: Number(created.estimatedMinutes ?? 0),
        completed: !!created.completed,
        type: created.type === "NOT_TODO" ? "NOT_TODO" : "TODO",
      };
    },
  },
};
