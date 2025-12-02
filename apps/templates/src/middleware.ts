import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  console.log(
    "[templates-mw]",
    JSON.stringify({
      path: req.nextUrl.pathname,
      search: req.nextUrl.search,
    }),
  );

  // Redirect base path to default locale
  if (
    req.nextUrl.pathname === "/developers/templates" ||
    req.nextUrl.pathname === "/developers/templates/"
  ) {
    return NextResponse.redirect(
      new URL("/developers/templates/en", req.nextUrl),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|opengraph|_next/static|_next/image|_vercel|.*\\..*).*)"],
  runtime: "nodejs",
};
