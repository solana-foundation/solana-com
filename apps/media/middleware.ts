import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Handle Keystatic admin routes
  // Keystatic uses GitHub OAuth for authentication
  if (pathname.startsWith("/keystatic")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match keystatic paths
    "/keystatic/:path*",
  ],
  runtime: "nodejs",
};
