import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { decrypt } from "./app/lib/session"

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get("session")?.value
  const session = await decrypt(cookie)

  if (request.nextUrl.pathname === "/" && !session?.userId) {
    return NextResponse.rewrite(new URL("/landing-page", request.url))
  }

  if (
    (request.nextUrl.pathname.startsWith("/profile") ||
      request.nextUrl.pathname.startsWith("/wishlist") ||
      request.nextUrl.pathname.startsWith("/users")) &&
    !session?.userId
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (
    (request.nextUrl.pathname.startsWith("/auth/login") ||
      request.nextUrl.pathname.startsWith("/auth/register")) &&
    session?.userId
  ) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/profile/:path*",
    "/users/:path*",
    "/auth/login",
    "/auth/register",
    "/wishlist",
  ],
}
