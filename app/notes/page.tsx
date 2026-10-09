import Link from "next/link";
import { notFound } from "next/navigation";
import { getNotes } from "@/lib/dal";
import { getUserByName } from "@/lib/users";
import { deleteNote } from "./actions";
import { NewNoteForm } from "./NewNoteForm";

// The page trusts the name in the address, for example /notes?user=ada.
export default async function NotesPage({ searchParams }: { searchParams: Promise<{ user?: string }> }) {
  const { user: name } = await searchParams;
  const user = getUserByName(name ?? "");
  if (!user) notFound();

  const notes = await getNotes(user.id);

  return (
    <main className="page">
      <h1>{user.name}&apos;s notes</h1>
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
      <NewNoteForm userId={user.id} />
    </main>
  );
}
