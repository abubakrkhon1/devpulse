// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Allow Next.js internals and API calls
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2) Allow all static files (anything with a dot in the last segment)
  if (/\.[^\/]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // 3) Allow your explicitly public page routes
  const PUBLIC_PATHS = ["/", "/login", "/sign-up"];
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // 4) All other routes require a valid token
  const token = req.cookies.get("token")?.value;
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    return NextResponse.next();
  } catch {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }
}