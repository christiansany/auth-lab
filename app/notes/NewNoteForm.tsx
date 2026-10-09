"use client";

import { useActionState } from "react";
import { createNote, type NoteFormState } from "./actions";

const initialState: NoteFormState = { error: null };

export function NewNoteForm() {
  const [state, formAction, pending] = useActionState(createNote, initialState);

  return (
    <form action={formAction} className="card form">
      <label>
        Title
        <input name="title" required maxLength={100} />
      </label>
      <label>
        Note
        <textarea name="body" rows={4} maxLength={2000} />
      </label>
      {state.error && (
        <p role="alert" className="error">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save note"}
      </button>
    </form>
  );
}
