"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { z } from "zod";
import { addNote, removeNote } from "@/lib/dal";
import { getCurrentUser } from "@/lib/session";

export type NoteFormState = { error: string | null };

const noteSchema = z.object({
  title: z.string().trim().min(1, "Give your note a title.").max(100, "Keep the title under 100 characters."),
  body: z.string().trim().max(2000, "Keep the note under 2000 characters."),
});

export async function createNote(_previous: NoteFormState, formData: FormData): Promise<NoteFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = noteSchema.safeParse({ title: formData.get("title"), body: formData.get("body") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await addNote(user.id, parsed.data.title, parsed.data.body);
  // Renders the page again, so the list shows the new note.
  refresh();
  return { error: null };
}

const idSchema = z.coerce.number().int().positive();

export async function deleteNote(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const id = idSchema.parse(formData.get("id"));
  await removeNote(id);
  refresh();
}
