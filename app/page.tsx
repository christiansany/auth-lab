import Link from "next/link";

// There is no login yet. You choose who you are, and the notes page reads
// the name from the address.
export default function HomePage() {
  return (
    <main className="page narrow">
      <h1>Your private notebook</h1>
      <p>Write down what you want to remember. Only you can read your notes.</p>
      <p>Who are you?</p>
      <p className="choices">
        <Link href="/notes?user=ada" className="button">
          I am Ada
        </Link>
        <Link href="/notes?user=grace" className="button">
          I am Grace
        </Link>
      </p>
    </main>
  );
}
