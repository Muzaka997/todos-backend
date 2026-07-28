import { db } from "../../db";
import { requireUserId, type Ctx } from "../../graphql/guards";
import {
  addNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
  type NoteRow,
} from "./data";

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
      const userId = requireUserId(ctx);
      const rows = await getNotes(db, userId);
      return rows.map(mapRow);
    },
    note: async (_r: unknown, args: { id: string }, ctx: Ctx) => {
      const userId = requireUserId(ctx);
      const row = await getNoteById(db, userId, Number(args.id));
      return row ? mapRow(row) : null;
    },
  },
  Mutation: {
    addNote: async (
      _r: unknown,
      args: { title?: string | null; body?: string | null; audio?: string | null },
      ctx: Ctx,
    ) => {
      const userId = requireUserId(ctx);
      const created = await addNote(db, userId, args);
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
      const userId = requireUserId(ctx);
      const updated = await updateNote(db, userId, Number(args.id), {
        title: args.title ?? undefined,
        body: args.body ?? undefined,
        audio: args.audio ?? undefined,
        pinned: args.pinned ?? undefined,
      });
      return mapRow(updated);
    },
    deleteNote: async (_r: unknown, args: { id: string }, ctx: Ctx) => {
      const userId = requireUserId(ctx);
      return await deleteNote(db, userId, Number(args.id));
    },
  },
};
