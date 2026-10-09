import "server-only";
import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

// scrypt is slow on purpose. These are the minimum settings OWASP recommends.
// Every guess an attacker makes with a stolen hash costs the same time.
const options: ScryptOptions = { N: 2 ** 17, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };
const keyLength = 64;

function derive(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (error, key) => (error ? reject(error) : resolve(key)));
  });
}

// Stores the salt next to the hash, as "salt:hash" in hex.
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await derive(password, salt);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

// TODO, step 2: check a password against the stored "salt:hash" string.
// - Split the stored value at the colon into salt and hash.
// - Turn both back into bytes with Buffer.from(text, "hex").
// - Derive a new hash: await derive(password, salt)
// - Compare it with the stored hash using timingSafeEqual(a, b), and return
//   the result.
//
// Why timingSafeEqual and not ===? It always takes the same time, so an
// attacker cannot measure how many bytes were right.
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  return false;
}
