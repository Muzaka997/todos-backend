import { db } from "../../db";
import {
  addNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
  type NoteRow,
} from "./data";

type Ctx = { userId?: string | null };

type GqlNote = {
  id: string;
  title: string;
  body: string;
  audio: string | null;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
};

function mapRow(n: NoteRow): GqlNote {
  return {
    id: String(n.id),
    title: n.title ?? "",
    body: n.body ?? "",
    audio: n.audio ?? null,
    pinned: !!n.pinned,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
  };
}

export const notesResolvers = {
  Query: {
    notes: async (_r: unknown, _a: unknown, ctx: Ctx) => {
      if (!ctx?.userId) throw new Error("Not authenticated");
      const rows = await getNotes(db);
      return rows.map(mapRow);
    },
    note: async (_r: unknown, args: { id: string }, ctx: Ctx) => {
      if (!ctx?.userId) throw new Error("Not authenticated");
      const row = await getNoteById(db, Number(args.id));
      return row ? mapRow(row) : null;
    },
  },
  Mutation: {
    addNote: async (
      _r: unknown,
      args: { title?: string | null; body?: string | null; audio?: string | null },
      ctx: Ctx,
    ) => {
      if (!ctx?.userId) throw new Error("Not authenticated");
      const created = await addNote(db, args);
      return mapRow(created);
    },
    updateNote: async (
      _r: unknown,
      args: {
        id: string;
        title?: string | null;
        body?: string | null;
        audio?: string | null;
        pinned?: boolean | null;
      },
      ctx: Ctx,
    ) => {
      if (!ctx?.userId) throw new Error("Not authenticated");
      const updated = await updateNote(db, Number(args.id), {
        title: args.title ?? undefined,
        body: args.body ?? undefined,
        audio: args.audio ?? undefined,
        pinned: args.pinned ?? undefined,
      });
      return mapRow(updated);
    },
    deleteNote: async (_r: unknown, args: { id: string }, ctx: Ctx) => {
      if (!ctx?.userId) throw new Error("Not authenticated");
      return await deleteNote(db, Number(args.id));
    },
  },
};
