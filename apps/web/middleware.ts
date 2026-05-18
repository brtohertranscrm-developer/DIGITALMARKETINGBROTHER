import { NextResponse, type NextRequest } from "next/server";

const appSessionCookieName = "bt_session";
const protectedRoutes = ["/dashboard", "/content", "/social-accounts", "/campaigns", "/leads", "/team", "/reports"];

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/LOGIN") {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }

  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  if (!request.cookies.has(appSessionCookieName)) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
