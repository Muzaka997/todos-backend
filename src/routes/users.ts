import { Router, Request, Response } from "express";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

// GET all users
router.get("/", async (req: Request, res: Response) => {
  const allUsers = await db.select().from(users);
  res.json(allUsers);
});

// GET single user
router.get("/:id", async (req: Request, res: Response) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(req.params.id)));
  res.json(user[0] || { message: "User not found" });
});

// POST create user
router.post("/", async (req: Request, res: Response) => {
  const { name, email } = req.body || {};
  if (!name || !email) {
    return res
      .status(400)
      .json({ message: "Missing name or email in request body" });
  }

  const newUser = await db.insert(users).values({ name, email }).returning();
  res.status(201).json(newUser[0]);
});

// DELETE user
router.delete("/:id", async (req: Request, res: Response) => {
  await db.delete(users).where(eq(users.id, Number(req.params.id)));
  res.json({ message: "User deleted" });
});

export default router;
