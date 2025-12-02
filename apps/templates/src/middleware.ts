import { NextResponse } from "next/server";

export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|opengraph|_next/static|_next/image|_vercel|.*\\..*).*)"],
  runtime: "nodejs",
};
