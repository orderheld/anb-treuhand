import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic access check for the admin area: without a session cookie, admin pages redirect to
 * the login. The real check (session in the database) runs in every page and Server Action;
 * this only avoids rendering for strangers. The public site never passes through here.
 */

const ADMIN_COOKIE = process.env.NODE_ENV === "production" ? "__Host-anb-admin" : "anb-admin";

const PUBLIC_PATHS = ["/admin/login", "/admin/einrichtung"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublic(pathname) || request.cookies.has(ADMIN_COOKIE)) {
    return NextResponse.next();
  }
  const login = new URL("/admin/login", request.url);
  if (pathname !== "/admin") {
    login.searchParams.set("next", pathname + request.nextUrl.search);
  }
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
