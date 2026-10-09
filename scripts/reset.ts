import { rmSync } from "node:fs";

// Deletes the database. The app creates a fresh one with the starting data
// on the next request.
for (const file of ["data/notes.db", "data/notes.db-wal", "data/notes.db-shm"]) {
  rmSync(file, { force: true });
}
console.log("Database deleted. Start the server again to begin with fresh data.");
