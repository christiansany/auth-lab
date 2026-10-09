import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { logout } from "./actions";

export async function UserMenu() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <nav className="menu">
        <Link href="/login">Log in</Link>
      </nav>
    );
  }

  return (
    <nav className="menu">
      <Link href="/notes">Your notes</Link>
      <span className="muted">Logged in as {user.name}</span>
      <form action={logout}>
        <button type="submit" className="link">
          Log out
        </button>
      </form>
    </nav>
  );
}
