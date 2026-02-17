import jwt from "jsonwebtoken";

const DEFAULT_SECRET = "dev-secret-change-me";

export type JwtPayload = {
  sub: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
};

export function signToken(
  payload: JwtPayload,
  opts: jwt.SignOptions = {},
): string {
  const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
  return jwt.sign(payload, secret, { expiresIn: "7d", ...opts });
}

export function verifyToken(token: string): JwtPayload | null {
  const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}
