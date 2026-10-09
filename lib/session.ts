import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { db, type User } from "./db";

// Right now a cookie named "user" holds your user id. Anyone can change it in
// DevTools and become someone else. We replace it with a session: a long
// random token in a cookie named "session", and a row in the sessions table
// that says whose token it is and until when it is valid.

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

// TODO, step 1: create a session. Replace the code in createSession.
// - Make a token: randomBytes(32).toString("base64url")
// - Compute the expiry: const expiresAt = Date.now() + sessionLength
// - Store the hash of the token, the user id and the expiry:
//     INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)
//   Use hashToken(token) for token_hash.
// - Set the cookie:
//     cookieStore.set(cookieName, token, { ...cookieOptions, expires: new Date(expiresAt) })
export async function createSession(userId: number): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("user", String(userId), { httpOnly: true, sameSite: "lax", path: "/" });
}

// TODO, step 2: find the user of the session. Replace the code in getCurrentUser.
// - Read the token: cookieStore.get(cookieName)?.value
// - No token? Return null.
// - Look up the user by the hash of the token, if the session has not expired:
//     SELECT users.id, users.name, users.email FROM sessions
//     JOIN users ON users.id = sessions.user_id
//     WHERE sessions.token_hash = ? AND sessions.expires_at > unixepoch('subsec') * 1000
//   Use hashToken(token) for the ?.
// - Return the user, or null if there is no row.
//
// unixepoch('subsec') * 1000 is the current time in milliseconds, computed by
// SQLite. It is the same unit as Date.now().
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user")?.value;
  if (!userId) return null;

  const row = db().prepare("SELECT id, name, email FROM users WHERE id = ?").get(Number(userId));
  return row ? { id: Number(row.id), name: String(row.name), email: String(row.email) } : null;
}

// TODO, step 3: end the session. Replace the code in deleteSession.
// - Read the token from the cookie.
// - If there is one, delete its row: DELETE FROM sessions WHERE token_hash = ?
// - Then delete the cookie: cookieStore.delete(cookieName)
//
// Why both? Deleting only the cookie is not enough: a copy of the token would
// still work.
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("user");
}
