import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(
    new URL(
      "/keystatic/login",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"
    )
  );

  response.cookies.set("keystatic_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  // Clear the short-lived GitHub token cookie set by refresh-token
  response.cookies.set("keystatic-gh-access-token", "", {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
