import { and, eq, gte, lte } from "drizzle-orm";
import { events as eventsTable } from "../../db/schema";

export type EventKind = "TODO" | "NOT_TODO";

export type EventRow = {
  id: number;
  userId: number;
  title: string;
  start: string; // ISO
  end: string; // ISO
  kind: string;
  notes: string | null;
  createdAt: string;
};

export async function getEventsInRange(
  db: typeof import("../../db").db,
  userId: number,
  timeMin: string,
  timeMax: string,
): Promise<EventRow[]> {
  // Return this user's events that overlap the requested window:
  // start <= timeMax AND end >= timeMin
  return await db
    .select()
    .from(eventsTable)
    .where(
      and(
        eq(eventsTable.userId, userId),
        lte(eventsTable.start, timeMax),
        gte(eventsTable.end, timeMin),
      ),
    );
}

export async function getEventById(
  db: typeof import("../../db").db,
  userId: number,
  id: number,
): Promise<EventRow | null> {
  const rows = await db
    .select()
    .from(eventsTable)
    .where(and(eq(eventsTable.id, id), eq(eventsTable.userId, userId)));
  return rows[0] ?? null;
}

export async function addEvent(
  db: typeof import("../../db").db,
  userId: number,
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
      userId,
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
  userId: number,
  id: number,
  patch: Partial<{
    title: string;
    start: string;
    end: string;
    kind: EventKind;
    notes: string | null;
  }>,
): Promise<EventRow> {
  const found = await getEventById(db, userId, id);
  if (!found) throw new Error("Event not found");
  const [updated] = await db
    .update(eventsTable)
    .set({ ...(patch as any) })
    .where(and(eq(eventsTable.id, id), eq(eventsTable.userId, userId)))
    .returning();
  return updated;
}

export async function deleteEvent(
  db: typeof import("../../db").db,
  userId: number,
  id: number,
): Promise<boolean> {
  const found = await getEventById(db, userId, id);
  if (!found) return false;
  await db
    .delete(eventsTable)
    .where(and(eq(eventsTable.id, id), eq(eventsTable.userId, userId)));
  return true;
}
