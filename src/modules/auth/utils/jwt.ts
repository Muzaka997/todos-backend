import jwt from "jsonwebtoken";

const DEV_FALLBACK_SECRET = "dev-secret-change-me";

export type JwtPayload = {
  sub: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
};

/**
 * Resolves the signing secret. In production a real JWT_SECRET is mandatory —
 * we refuse to fall back to the committed dev value, which would let anyone
 * forge tokens. In development we allow the fallback for convenience.
 */
function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length > 0) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "JWT_SECRET must be set in production (refusing to use the dev fallback).",
    );
  }
  return DEV_FALLBACK_SECRET;
}

export function signToken(
  payload: JwtPayload,
  opts: jwt.SignOptions = {},
): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d", ...opts });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getSecret()) as JwtPayload;
  } catch {
    return null;
  }
}
