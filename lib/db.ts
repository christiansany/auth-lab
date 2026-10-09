import "server-only";
import { mkdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

// A small SQLite database in data/notes.db, built into Node.js. It is created
// and filled with two users and their notes on first use. `npm run reset`
// deletes it, so you start fresh.

export type User = { id: number; name: string; email: string };
export type UserWithPassword = User & { password_hash: string };
export type NoteSummary = { id: number; title: string };
export type Note = NoteSummary & { user_id: number; body: string };

const globalForDb = globalThis as unknown as { notesDb?: DatabaseSync };

export function db(): DatabaseSync {
  if (!globalForDb.notesDb) {
    mkdirSync("data", { recursive: true });
    const database = new DatabaseSync("data/notes.db");
    database.exec("PRAGMA journal_mode = WAL");
    setUp(database);
    globalForDb.notesDb = database;
  }
  return globalForDb.notesDb;
}

// The notes list waits like a remote database would.
export function slowDatabase(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 600));
}

function setUp(database: DatabaseSync) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      body TEXT NOT NULL
    );
  `);

  const { count } = database.prepare("SELECT COUNT(*) AS count FROM users").get() as { count: number };
  if (count > 0) return;

  // The passwords are "analytical-engine" for Ada and "first-compiler" for
  // Grace. Only their scrypt hashes are stored.
  const addUser = database.prepare("INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)");
  addUser.run(1, "Ada", "ada@example.com", "68453fe9b15587f5e1bc07339e2bb6d9:82112e17defef113a9917b4a5b9159f8687b4c1f88237cde1b43f3fa4dc11a8b926d424435968b8c13c8e5edb23b8936714e955e51501ff0f3c2948fb5441c2f");
  addUser.run(2, "Grace", "grace@example.com", "9e833dd4267270957acd136ce4346551:ebbf6b0b084c9d80ba997e82c7522664174810b8e4c04d257701bc41c437bf26efc5174070823b96628ec574e152dd97f7bfa08d0284d393dc6fc258fd78ec52");

  const addNote = database.prepare("INSERT INTO notes (id, user_id, title, body) VALUES (?, ?, ?, ?)");
  addNote.run(1, 1, "Note G", "The engine can compute Bernoulli numbers. Write the steps down as a table.");
  addNote.run(2, 1, "Letter to Charles", "Ask about the punched cards. Mention the weaving looms in Lyon.");
  addNote.run(3, 1, "Shopping list", "Ink, paper, a new pen nib, candles.");
  addNote.run(4, 2, "The first bug", "Found a moth in relay 70 of the Mark II. Taped it into the log book.");
  addNote.run(5, 2, "Nanoseconds", "Cut wires 30 cm long. That is how far light travels in one nanosecond.");
}
