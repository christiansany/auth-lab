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

// The list waits 600 ms for the database on every request.
//
// TODO, step 1: try to cache the whole function.
// - Add the line "use cache"; at the top of getMyNotes.
// - Reload /notes and read the error, in the browser or in the terminal.
//
// TODO, step 2: cache only the database read, once per user.
// - Remove "use cache" from getMyNotes again. Keep the session check there.
// - Move the database read into a new function that takes the user id:
//
//     async function getNotesFor(userId: number): Promise<NoteSummary[]> {
//       "use cache";
//       cacheTag(`notes:${userId}`);
//       ...
//     }
//
// - In getMyNotes, return getNotesFor(user.id).
// - Import cacheTag from "next/cache".
//
// The arguments are part of the cache key, so Ada and Grace each get their
// own entry. Do not export getNotesFor. Then nothing outside this file can
// ask the cache for someone else's notes.
export async function getMyNotes(): Promise<NoteSummary[]> {
  const user = await verifySession();
  await slowDatabase();
  const rows = db().prepare("SELECT id, title FROM notes WHERE user_id = ? ORDER BY id").all(user.id);
  return rows.map((row) => ({ id: Number(row.id), title: String(row.title) }));
}

export async function getNote(id: number): Promise<Note | undefined> {
  const user = await verifySession();
  return db().prepare("SELECT * FROM notes WHERE id = ? AND user_id = ?").get(id, user.id) as Note | undefined;
}

// TODO, step 4: clear the cached list after every change.
// - At the end of addNote and removeNote, call updateTag(`notes:${user.id}`).
// - Import updateTag from "next/cache".
//
// Without it, a new or deleted note only shows up once the cache entry runs
// out. With it, the next render reads the list from the database again.
export async function addNote(title: string, body: string): Promise<void> {
  const user = await verifySession();
  db().prepare("INSERT INTO notes (user_id, title, body) VALUES (?, ?, ?)").run(user.id, title, body);
}

export async function removeNote(id: number): Promise<void> {
  const user = await verifySession();
  db().prepare("DELETE FROM notes WHERE id = ? AND user_id = ?").run(id, user.id);
}
