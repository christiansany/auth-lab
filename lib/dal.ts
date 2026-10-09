import "server-only";
import { db, slowDatabase, type Note, type NoteSummary, type User } from "./db";
import { getCurrentUser } from "./session";

// The data access layer. Every read and write of notes goes through this file.
//
// proxy.ts sends everyone without a session cookie to the login page, so the
// pages and this file do not check the session again. The proxy only sees
// that a cookie exists. If its session is gone, getCurrentUser() returns null
// and the notes page crashes. verifySession fixes that too.
//
// TODO, step 2: write verifySession() in this file. Do not export it.
// - Get the user with getCurrentUser().
// - No user? Call redirect("/login"). It comes from "next/navigation".
// - Otherwise return the user.
//
// TODO, step 3: call verifySession() at the start of every function below.
// - getMyNotes and addNote: use the user it returns instead of getCurrentUser().
// - getNote and removeNote: only call it for now.

export async function getMyNotes(): Promise<NoteSummary[]> {
  const user = (await getCurrentUser()) as User;
  await slowDatabase();
  const rows = db().prepare("SELECT id, title FROM notes WHERE user_id = ? ORDER BY id").all(user.id);
  return rows.map((row) => ({ id: Number(row.id), title: String(row.title) }));
}

export async function getNote(id: number): Promise<Note | undefined> {
  return db().prepare("SELECT * FROM notes WHERE id = ?").get(id) as Note | undefined;
}

export async function addNote(title: string, body: string): Promise<void> {
  const user = (await getCurrentUser()) as User;
  db().prepare("INSERT INTO notes (user_id, title, body) VALUES (?, ?, ?)").run(user.id, title, body);
}

export async function removeNote(id: number): Promise<void> {
  db().prepare("DELETE FROM notes WHERE id = ?").run(id);
}
