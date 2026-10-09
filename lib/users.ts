import "server-only";
import { db, type User } from "./db";

export function getUserByName(name: string): User | undefined {
  const row = db().prepare("SELECT id, name, email FROM users WHERE lower(name) = lower(?)").get(name);
  return row ? { id: Number(row.id), name: String(row.name), email: String(row.email) } : undefined;
}
