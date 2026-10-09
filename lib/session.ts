import "server-only";
import { cookies } from "next/headers";
import { db, type User } from "./db";

// After the login, a cookie named "user" remembers who you are. The browser
// sends it back with every request.

export async function createSession(userId: number): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("user", String(userId), { httpOnly: true, sameSite: "lax", path: "/" });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user")?.value;
  if (!userId) return null;

  const row = db().prepare("SELECT id, name, email FROM users WHERE id = ?").get(Number(userId));
  return row ? { id: Number(row.id), name: String(row.name), email: String(row.email) } : null;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("user");
}
