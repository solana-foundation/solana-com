import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  console.log(
    "[templates-mw]",
    JSON.stringify({
      path: req.nextUrl.pathname,
      search: req.nextUrl.search,
    }),
  );
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|opengraph|_next/static|_next/image|_vercel|.*\\..*).*)"],
  runtime: "nodejs",
};
