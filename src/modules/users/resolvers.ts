import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export const usersResolvers = {
  Query: {
    users: async () => {
      const all = await db.select().from(users);
      // Ensure gender is always present to satisfy GraphQL non-null
      return all.map((u) => ({ ...u, gender: (u as any).gender ?? "OTHER" }));
    },
    user: async (_: unknown, args: { id: number }) => {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(args.id)));
      const u = result[0] as any;
      if (!u) return null;
      return { ...u, gender: u.gender ?? "OTHER" };
    },
  },
  Mutation: {
    createUser: async (
      _: unknown,
      args: { input: { name: string; email: string } },
    ) => {
      const { name, email } = args.input;
      const [created] = await db
        .insert(users)
        // auth flow will create passwordHash/gender; default Others here
        .values({ name, email, gender: "OTHER" })
        .returning();
      return created;
    },
    deleteUser: async (_: unknown, args: { id: number }) => {
      await db.delete(users).where(eq(users.id, Number(args.id)));
      return true;
    },
  },
};
