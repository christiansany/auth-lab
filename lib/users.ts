import "server-only";
import { db, type UserWithPassword } from "./db";

export function findUserByEmail(email: string): UserWithPassword | undefined {
  const row = db().prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
  if (!row) return undefined;
  return {
    id: Number(row.id),
    name: String(row.name),
    email: String(row.email),
    password_hash: String(row.password_hash),
  };
}
