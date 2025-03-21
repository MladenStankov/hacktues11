import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";
import type { Session } from "@/lib/auth";

const authRoutes = [
  "/sign-in",
  "/sign-up",
  "/sign-up/doctor",
  "/sign-up/patient",
];
const protectedRoutes = ["/dashboard", "/appointments", "/ai-suggestions"];

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(pathName);
  const isProtectedRoute = protectedRoutes.includes(pathName);

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.BETTER_AUTH_URL as string,
      headers: { cookie: request.headers.get("cookie") || "" },
    }
  );

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
