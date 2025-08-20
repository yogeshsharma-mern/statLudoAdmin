// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("adminToken")?.value; // ✅ get cookie value
  const url = req.nextUrl.clone();

  // If accessing /dashboard without a token → redirect to login
  // if (url.pathname.startsWith("/dashboard") && !token) {
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }

  // If accessing /login but already logged in → redirect to dashboard
  if (url.pathname.startsWith("/login") && token) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"], // apply to dashboard + login
};
