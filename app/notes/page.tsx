import Link from "next/link";
import { getMyNotes } from "@/lib/dal";
import { deleteNote } from "./actions";
import { NewNoteForm } from "./NewNoteForm";

export default async function NotesPage() {
  const notes = await getMyNotes();

  return (
    <main className="page">
      <h1>Your notes</h1>
      <ul className="notes">
        {notes.map((note) => (
          <li key={note.id} className="card note">
            <Link href={`/notes/${note.id}`}>{note.title}</Link>
            <form action={deleteNote}>
              <input type="hidden" name="id" value={note.id} />
              <button type="submit" className="secondary">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
      {notes.length === 0 && <p className="muted">No notes yet.</p>}
      <h2>New note</h2>
      <NewNoteForm />
    </main>
  );
}
