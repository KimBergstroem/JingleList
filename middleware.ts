import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { decrypt } from "./app/lib/session"

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get("session")?.value
  const session = await decrypt(cookie)

  if (request.nextUrl.pathname === "/" && !session?.userId) {
    return NextResponse.rewrite(new URL("features/landing-page", request.url))
  }

  if (
    (request.nextUrl.pathname.startsWith("/features/profile") ||
      request.nextUrl.pathname.startsWith("/features/whishlist") ||
      request.nextUrl.pathname.startsWith("/users")) &&
    !session?.userId
  ) {
    return NextResponse.redirect(new URL("/features/auth/login", request.url))
  }

  if (
    (request.nextUrl.pathname.startsWith("/features/auth/login") ||
      request.nextUrl.pathname.startsWith("/features/auth/register")) &&
    session?.userId
  ) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/features/profile/:path*",
    "/users/:path*",
    "/features/auth/:path*",
    "/features/whishlist/:path*",
  ],
}
