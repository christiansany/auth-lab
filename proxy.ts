import { NextResponse, type NextRequest } from "next/server";

// The proxy runs before every matching request. It only checks that a session
// cookie exists, so people who are not logged in go straight to the login
// page. It does not check the session in the database. That happens in
// lib/dal.ts, for every read and write.
export function proxy(request: NextRequest) {
  if (!request.cookies.has("session")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*"],
};
