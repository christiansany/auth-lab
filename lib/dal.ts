import "server-only";
import { redirect } from "next/navigation";
import { db, slowDatabase, type Note, type NoteSummary, type User } from "./db";
import { getCurrentUser } from "./session";

// The data access layer. Every read and write of notes goes through this
// file, and every exported function checks the session first.

// Not exported. Pages and actions reach the notes only through the functions
// below, so none of them can skip this check.
async function verifySession(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function getMyNotes(): Promise<NoteSummary[]> {
  const user = await verifySession();
  await slowDatabase();
  const rows = db().prepare("SELECT id, title FROM notes WHERE user_id = ? ORDER BY id").all(user.id);
  return rows.map((row) => ({ id: Number(row.id), title: String(row.title) }));
}

export async function getNote(id: number): Promise<Note | undefined> {
  await verifySession();
  return db().prepare("SELECT * FROM notes WHERE id = ?").get(id) as Note | undefined;
}

export async function addNote(title: string, body: string): Promise<void> {
  const user = await verifySession();
  db().prepare("INSERT INTO notes (user_id, title, body) VALUES (?, ?, ?)").run(user.id, title, body);
}

export async function removeNote(id: number): Promise<void> {
  await verifySession();
  db().prepare("DELETE FROM notes WHERE id = ?").run(id);
}
