import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Attempt to retrieve the session token
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Public routes that don't require authentication
  if (pathname === "/" || pathname === "/authenticate") {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protected routes that require authentication
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/authenticate", req.url));
    }
    return NextResponse.next();
  }

  // For any other case, redirect to "/"
  return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: ["/", "/authenticate", "/dashboard", "/dashboard/:path*"],
};
