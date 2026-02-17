import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import bcrypt from "bcryptjs";
import { signToken } from "./utils/jwt";

type Ctx = { userId?: string | null };

export const authResolvers = {
  Query: {
    me: async (_r: unknown, _a: unknown, ctx: Ctx) => {
      if (!ctx?.userId) return null;
      const result = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          gender: users.gender,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, Number(ctx.userId)));
      return result[0] ?? null;
    },
  },
  Mutation: {
    signup: async (
      _r: unknown,
      args: {
        email: string;
        password: string;
        name: string;
        gender: "MALE" | "FEMALE" | "OTHER";
      },
    ) => {
      const email = args.email.toLowerCase();
      const existing = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email));
      if (existing.length) throw new Error("Email already in use");

      const passwordHash = bcrypt.hashSync(args.password, 10);
      const [created] = await db
        .insert(users)
        .values({ email, name: args.name, gender: args.gender, passwordHash })
        .returning({
          id: users.id,
          email: users.email,
          name: users.name,
          gender: users.gender,
          createdAt: users.createdAt,
        });

      const token = signToken({ sub: String(created.id) });
      return { token, user: created };
    },
    login: async (_r: unknown, args: { email: string; password: string }) => {
      const email = args.email.toLowerCase();
      const found = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          gender: users.gender,
          passwordHash: users.passwordHash,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.email, email));
      const u = found[0];
      if (!u?.passwordHash) throw new Error("Invalid credentials");
      const ok = bcrypt.compareSync(args.password, u.passwordHash);
      if (!ok) throw new Error("Invalid credentials");
      const token = signToken({ sub: String(u.id) });
      const user = {
        id: u.id,
        email: u.email,
        name: u.name,
        gender: u.gender,
        createdAt: u.createdAt,
      };
      return { token, user };
    },
  },
};
