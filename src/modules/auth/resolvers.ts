import { eq } from "drizzle-orm";
import { GraphQLError } from "graphql";
import { db } from "../../db";
import { users } from "../../db/schema";
import bcrypt from "bcryptjs";
import { signToken } from "./utils/jwt";
import { rateLimit } from "./rateLimit";

type Ctx = { userId?: string | null; ip?: string };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MIN_PASSWORD = 8;

function badInput(message: string): never {
  throw new GraphQLError(message, { extensions: { code: "BAD_USER_INPUT" } });
}

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
      ctx: Ctx,
    ) => {
      rateLimit(`signup:${ctx.ip ?? "unknown"}`, 10, 15 * 60 * 1000);

      const email = args.email.trim().toLowerCase();
      const name = args.name?.trim() ?? "";
      if (!EMAIL_RE.test(email)) badInput("Please enter a valid email address.");
      if (!name) badInput("Please enter your name.");
      if (typeof args.password !== "string" || args.password.length < MIN_PASSWORD) {
        badInput(`Password must be at least ${MIN_PASSWORD} characters.`);
      }

      const existing = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email));
      if (existing.length) throw new Error("Email already in use");

      const passwordHash = bcrypt.hashSync(args.password, 10);
      const [created] = await db
        .insert(users)
        .values({ email, name, gender: args.gender, passwordHash })
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
    login: async (
      _r: unknown,
      args: { email: string; password: string },
      ctx: Ctx,
    ) => {
      rateLimit(`login:${ctx.ip ?? "unknown"}`, 10, 15 * 60 * 1000);

      const email = args.email.trim().toLowerCase();
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
