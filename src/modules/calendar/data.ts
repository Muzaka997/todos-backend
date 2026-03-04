import { and, between, eq, gte, lte } from "drizzle-orm";
import { events as eventsTable } from "../../db/schema";

export type EventKind = "TODO" | "NOT_TODO";

export type EventRow = {
  id: number;
  title: string;
  start: string; // ISO
  end: string; // ISO
  kind: string;
  notes: string | null;
  createdAt: string;
};

export async function getEventsInRange(
  db: typeof import("../../db").db,
  timeMin: string,
  timeMax: string,
): Promise<EventRow[]> {
  return await db
    .select()
    .from(eventsTable)
    .where(and(gte(eventsTable.start, timeMin), lte(eventsTable.end, timeMax)));
}

export async function getEventById(
  db: typeof import("../../db").db,
  id: number,
): Promise<EventRow | null> {
  const rows = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.id, id));
  return rows[0] ?? null;
}

export async function addEvent(
  db: typeof import("../../db").db,
  params: {
    title: string;
    start: string;
    end: string;
    kind: EventKind;
    notes?: string | null;
  },
): Promise<EventRow> {
  const [created] = await db
    .insert(eventsTable)
    .values({
      title: params.title,
      start: params.start,
      end: params.end,
      kind: params.kind,
      notes: params.notes ?? null,
    } as any)
    .returning();
  return created;
}

export async function updateEvent(
  db: typeof import("../../db").db,
  id: number,
  patch: Partial<{
    title: string;
    start: string;
    end: string;
    kind: EventKind;
    notes: string | null;
  }>,
): Promise<EventRow> {
  const found = await getEventById(db, id);
  if (!found) throw new Error("Event not found");
  const [updated] = await db
    .update(eventsTable)
    .set({ ...(patch as any) })
    .where(eq(eventsTable.id, id))
    .returning();
  return updated;
}

export async function deleteEvent(
  db: typeof import("../../db").db,
  id: number,
): Promise<boolean> {
  const found = await getEventById(db, id);
  if (!found) return false;
  await db.delete(eventsTable).where(eq(eventsTable.id, id));
  return true;
}
