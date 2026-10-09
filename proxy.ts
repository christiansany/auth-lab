import { NextResponse, type NextRequest } from "next/server";

// The proxy runs before the requests it matches. People without a session
// cookie go straight to the login page.
export function proxy(request: NextRequest) {
  if (!request.cookies.has("session")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/notes"],
};
