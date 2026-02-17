import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export const usersResolvers = {
  Query: {
    users: async () => {
      const all = await db.select().from(users);
      return all;
    },
    user: async (_: unknown, args: { id: number }) => {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(args.id)));
      return result[0] ?? null;
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
        .values({ name, email })
        .returning();
      return created;
    },
    deleteUser: async (_: unknown, args: { id: number }) => {
      await db.delete(users).where(eq(users.id, Number(args.id)));
      return true;
    },
  },
};
