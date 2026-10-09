import Link from "next/link";

// Nothing on this page depends on who is asking, so Next.js renders it
// during the build. Only the menu in the header waits for the request.
export default function HomePage() {
  return (
    <main className="page narrow">
      <h1>Your private notebook</h1>
      <p>Write down what you want to remember. Only you can read your notes.</p>
      <p>
        <Link href="/notes" className="button">
          Open your notes
        </Link>
      </p>
    </main>
  );
}
