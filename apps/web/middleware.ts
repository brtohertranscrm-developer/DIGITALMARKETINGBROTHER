import { NextResponse } from "next/server";
import { auth } from "@/auth";

const protectedRoutes = ["/dashboard", "/content", "/campaigns", "/leads", "/team", "/reports"];

export default auth((request) => {
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (!request.auth && isProtectedRoute) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  if (request.auth && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
