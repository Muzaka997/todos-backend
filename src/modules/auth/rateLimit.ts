import { GraphQLError } from "graphql";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/**
 * Minimal in-memory fixed-window rate limiter. Good enough to blunt brute-force
 * and signup spam on a single instance. For multi-instance deployments this
 * should move to a shared store (e.g. Redis).
 */
export function rateLimit(key: string, max: number, windowMs: number): void {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now > existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  existing.count += 1;
  if (existing.count > max) {
    const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    throw new GraphQLError(
      `Too many attempts. Please try again in ${retryAfter}s.`,
      { extensions: { code: "TOO_MANY_REQUESTS", retryAfter } },
    );
  }
}

// Occasionally drop expired buckets so the map can't grow unbounded.
setInterval(
  () => {
    const now = Date.now();
    for (const [key, b] of buckets) {
      if (now > b.resetAt) buckets.delete(key);
    }
  },
  10 * 60 * 1000,
).unref?.();
