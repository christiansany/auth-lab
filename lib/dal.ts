import "server-only";
import { db, slowDatabase, type Note, type NoteSummary } from "./db";

// The data access layer. Every read and write of notes goes through this file.

export async function getNotes(userId: number): Promise<NoteSummary[]> {
  await slowDatabase();
  const rows = db().prepare("SELECT id, title FROM notes WHERE user_id = ? ORDER BY id").all(userId);
  return rows.map((row) => ({ id: Number(row.id), title: String(row.title) }));
}

export async function getNote(id: number): Promise<Note | undefined> {
  return db().prepare("SELECT * FROM notes WHERE id = ?").get(id) as Note | undefined;
}

export async function addNote(userId: number, title: string, body: string): Promise<void> {
  db().prepare("INSERT INTO notes (user_id, title, body) VALUES (?, ?, ?)").run(userId, title, body);
}

export async function removeNote(id: number): Promise<void> {
  db().prepare("DELETE FROM notes WHERE id = ?").run(id);
}
