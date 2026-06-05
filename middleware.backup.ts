import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token =
    req.cookies.get("sb-access-token") ||
    req.cookies.get("supabase-auth-token")

  const path = req.nextUrl.pathname

  // protège admin
  if (path.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      )
    }
  }

  // protège client
  if (path.startsWith("/client")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/client/:path*"
  ]
}