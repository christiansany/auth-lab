import Link from "next/link";
import { notFound } from "next/navigation";
import { getNote } from "@/lib/dal";

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const note = await getNote(Number(id));
  if (!note) notFound();

  return (
    <main className="page narrow">
      <p>
        <Link href="/">Back to the start</Link>
      </p>
      <h1>{note.title}</h1>
      <p className="body">{note.body}</p>
      <p className="muted">Note {note.id}</p>
    </main>
  );
}
