import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { UserMenu } from "./UserMenu";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notes",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <Link href="/" className="brand">
            Notes
          </Link>
          {/* The menu reads the session cookie, so it waits for the request. */}
          <Suspense fallback={null}>
            <UserMenu />
          </Suspense>
        </header>
        {children}
      </body>
    </html>
  );
}
