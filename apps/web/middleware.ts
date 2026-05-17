import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/content", "/campaigns", "/leads", "/team", "/reports"];
const sessionCookieNames = ["authjs.session-token", "__Secure-authjs.session-token"];

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/LOGIN") {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }

  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const hasSessionCookie = sessionCookieNames.some((cookieName) => request.cookies.has(cookieName));

  if (!hasSessionCookie) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
