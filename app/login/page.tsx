import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="page narrow">
      <h1>Log in</h1>
      <LoginForm />
      <p className="hint">
        Ada: <code>ada@example.com</code> / <code>analytical-engine</code>
        <br />
        Grace: <code>grace@example.com</code> / <code>first-compiler</code>
      </p>
    </main>
  );
}
