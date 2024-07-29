import { NextResponse } from "next/server";

export const config = {
  matcher: "/((?!.*\\.).*)",
};

export async function middleware(req) {
  if (req.nextUrl.pathname === req.nextUrl.pathname.toLowerCase()) {
    return NextResponse.next();
  }

  return NextResponse.redirect(
    `${req.nextUrl.origin + req.nextUrl.pathname.toLowerCase()}`,
  );
}
