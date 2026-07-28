import { db } from "../../db";
import { requireUserId, type Ctx } from "../../graphql/guards";
import {
  addEvent,
  deleteEvent,
  getEventsInRange,
  updateEvent,
  type EventRow,
} from "./data";

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
      const userId = requireUserId(ctx);
      const rows = await getEventsInRange(db, userId, args.timeMin, args.timeMax);
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
      const userId = requireUserId(ctx);
      const created = await addEvent(db, userId, args);
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
      const userId = requireUserId(ctx);
      const updated = await updateEvent(db, userId, Number(args.id), {
        title: args.title,
        start: args.start,
        end: args.end,
        kind: args.kind,
        notes: args.notes,
      });
      return mapRow(updated);
    },
    deleteEvent: async (_r: unknown, args: { id: string }, ctx: Ctx) => {
      const userId = requireUserId(ctx);
      return await deleteEvent(db, userId, Number(args.id));
    },
  },
};
