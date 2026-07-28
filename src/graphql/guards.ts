import { GraphQLError } from "graphql";

export type Ctx = { userId?: string | null; ip?: string };

/**
 * Ensures the request is authenticated and returns the numeric user id.
 * Throws a typed UNAUTHENTICATED error otherwise. Every resolver that reads or
 * writes user-owned data (tasks, events, notes) must call this and scope its
 * queries by the returned id.
 */
export function requireUserId(ctx: Ctx): number {
  if (!ctx?.userId) {
    throw new GraphQLError("Not authenticated", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  const id = Number(ctx.userId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new GraphQLError("Not authenticated", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  return id;
}
