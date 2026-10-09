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

  const user = findUserByEmail(parsed.data.email);
  if (!user) {
    // Hash anyway, so an unknown email takes as long as a wrong password.
    await hashPassword(parsed.data.password);
    return failed;
  }
  if (!(await verifyPassword(parsed.data.password, user.password_hash))) return failed;

  await createSession(user.id);
  redirect("/notes");
}
