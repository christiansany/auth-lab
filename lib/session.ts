import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { db, type User } from "./db";

// A session is a long random token in a cookie named "session", plus a row
// in the sessions table that says whose token it is and until when it is
// valid.

const cookieName = "session";
const sessionLength = 7 * 24 * 60 * 60 * 1000; // 7 days

const cookieOptions = {
  httpOnly: true, // JavaScript in the page cannot read the cookie
  secure: true, // only sent over HTTPS (Chrome and Firefox allow http://localhost)
  sameSite: "lax", // not sent when another site posts a form to this app
  path: "/",
} as const;

// The database stores only a hash of the token. Someone who reads the
// database still cannot use it to log in.
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = Date.now() + sessionLength;

  db()
    .prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)")
    .run(hashToken(token), userId, expiresAt);

  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, { ...cookieOptions, expires: new Date(expiresAt) });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!token) return null;

  const user = db()
    .prepare(
      `SELECT users.id, users.name, users.email FROM sessions
       JOIN users ON users.id = sessions.user_id
       WHERE sessions.token_hash = ? AND sessions.expires_at > unixepoch('subsec') * 1000`,
    )
    .get(hashToken(token)) as User | undefined;

  return user ?? null;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (token) {
    db().prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashToken(token));
  }
  cookieStore.delete(cookieName);
}
