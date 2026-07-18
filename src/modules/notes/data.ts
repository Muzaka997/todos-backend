import { desc, eq } from "drizzle-orm";
import { notes as notesTable } from "../../db/schema";

export type NoteRow = {
  id: number;
  title: string;
  body: string;
  audio: string | null;
  pinned: number; // 0/1
  createdAt: string;
  updatedAt: string;
};

export async function getNotes(
  db: typeof import("../../db").db,
): Promise<NoteRow[]> {
  // Pinned notes first, then most-recently-updated.
  return await db
    .select()
    .from(notesTable)
    .orderBy(desc(notesTable.pinned), desc(notesTable.updatedAt));
}

export async function getNoteById(
  db: typeof import("../../db").db,
  id: number,
): Promise<NoteRow | null> {
  const rows = await db.select().from(notesTable).where(eq(notesTable.id, id));
  return rows[0] ?? null;
}

export async function addNote(
  db: typeof import("../../db").db,
  params: { title?: string | null; body?: string | null; audio?: string | null },
): Promise<NoteRow> {
  const now = new Date().toISOString();
  const [created] = await db
    .insert(notesTable)
    .values({
      title: params.title ?? "",
      body: params.body ?? "",
      audio: params.audio ?? null,
      pinned: 0,
      createdAt: now,
      updatedAt: now,
    } as any)
    .returning();
  return created;
}

export async function updateNote(
  db: typeof import("../../db").db,
  id: number,
  patch: Partial<{
    title: string;
    body: string;
    audio: string | null;
    pinned: boolean;
  }>,
): Promise<NoteRow> {
  const found = await getNoteById(db, id);
  if (!found) throw new Error("Note not found");
  const set: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (patch.title !== undefined) set.title = patch.title;
  if (patch.body !== undefined) set.body = patch.body;
  if (patch.audio !== undefined) set.audio = patch.audio;
  if (patch.pinned !== undefined) set.pinned = patch.pinned ? 1 : 0;
  const [updated] = await db
    .update(notesTable)
    .set(set as any)
    .where(eq(notesTable.id, id))
    .returning();
  return updated;
}

export async function deleteNote(
  db: typeof import("../../db").db,
  id: number,
): Promise<boolean> {
  const found = await getNoteById(db, id);
  if (!found) return false;
  await db.delete(notesTable).where(eq(notesTable.id, id));
  return true;
}
