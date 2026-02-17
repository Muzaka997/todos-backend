import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

export type Gender = "MALE" | "FEMALE" | "OTHER";

type InternalUser = {
  id: string;
  email: string;
  name: string;
  gender: Gender;
  passwordHash: string;
};

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  gender: Gender;
};

export const users: InternalUser[] = [];

export function createUser(
  email: string,
  password: string,
  name: string,
  gender: Gender,
): PublicUser {
  const existing = users.find((u) => u.email === email.toLowerCase());
  if (existing) throw new Error("Email already in use");
  const user: InternalUser = {
    id: uuid(),
    email: email.toLowerCase(),
    name,
    gender,
    passwordHash: bcrypt.hashSync(password, 10),
  };
  users.push(user);
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    gender: user.gender,
  };
}

export function verifyUser(email: string, password: string): PublicUser {
  const user = users.find((u) => u.email === email.toLowerCase());
  if (!user) throw new Error("Invalid credentials");
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) throw new Error("Invalid credentials");
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    gender: user.gender,
  };
}

export function getUserById(id: string): PublicUser | null {
  const user = users.find((u) => u.id === id);
  return user
    ? { id: user.id, email: user.email, name: user.name, gender: user.gender }
    : null;
}
