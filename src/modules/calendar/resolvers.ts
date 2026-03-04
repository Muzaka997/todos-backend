import { db } from "../../db";
import {
  addEvent,
  deleteEvent,
  getEventById,
  getEventsInRange,
  updateEvent,
  type EventRow,
} from "./data";

type Ctx = { userId?: string | null };

type GqlEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  kind: "TODO" | "NOT_TODO";
  notes?: string | null;
};

function mapRow(e: EventRow): GqlEvent {
  return {
    id: String(e.id),
    title: e.title,
    start: e.start,
    end: e.end,
    kind: e.kind === "NOT_TODO" ? "NOT_TODO" : "TODO",
    notes: e.notes,
  };
}

export const calendarResolvers = {
  Query: {
    events: async (
      _r: unknown,
      args: { timeMin: string; timeMax: string },
      ctx: Ctx,
    ) => {
      if (!ctx?.userId) throw new Error("Not authenticated");
      // Note: per-user events would need a userId column. For now this is global.
      const rows = await getEventsInRange(db, args.timeMin, args.timeMax);
      return rows.map(mapRow);
    },
  },
  Mutation: {
    addEvent: async (
      _r: unknown,
      args: {
        title: string;
        start: string;
        end: string;
        kind: "TODO" | "NOT_TODO";
        notes?: string | null;
      },
      ctx: Ctx,
    ) => {
      if (!ctx?.userId) throw new Error("Not authenticated");
      const created = await addEvent(db, args);
      return mapRow(created);
    },
    updateEvent: async (
      _r: unknown,
      args: {
        id: string;
        title?: string;
        start?: string;
        end?: string;
        kind?: "TODO" | "NOT_TODO";
        notes?: string | null;
      },
      ctx: Ctx,
    ) => {
      if (!ctx?.userId) throw new Error("Not authenticated");
      const updated = await updateEvent(db, Number(args.id), {
        title: args.title,
        start: args.start,
        end: args.end,
        kind: args.kind,
        notes: args.notes,
      });
      return mapRow(updated);
    },
    deleteEvent: async (_r: unknown, args: { id: string }, ctx: Ctx) => {
      if (!ctx?.userId) throw new Error("Not authenticated");
      return await deleteEvent(db, Number(args.id));
    },
  },
};
