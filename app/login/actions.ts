"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
import { findUserByEmail } from "@/lib/users";

export type LoginState = { error: string | null; email: string };

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const failed = { error: "Invalid email or password.", email };

  const parsed = loginSchema.safeParse({ email, password: formData.get("password") });
  if (!parsed.success) return failed;

  // TODO, step 1: log the user in.
  // - Find the user with findUserByEmail(parsed.data.email).
  // - No user? Call hashPassword(parsed.data.password) anyway, then return failed.
  // - Check the password with verifyPassword(parsed.data.password, user.password_hash).
  //   Wrong password? Return failed.
  // - Both right? Call createSession(user.id), then redirect("/notes").
  //
  // Why the same answer for both cases, and why hash for an unknown email?
  // Then nobody can tell from the message or from the time which emails have
  // an account.
  return failed;
}
