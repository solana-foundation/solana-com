import { NextRequest, NextResponse } from "next/server";

const basePath =
  process.env.NEXT_PUBLIC_USE_BASE_PATH === "true"
    ? "/developers/templates"
    : "";

export default function middleware(req: NextRequest) {
  console.log(
    "[templates-mw]",
    JSON.stringify({
      path: req.nextUrl.pathname,
      search: req.nextUrl.search,
    }),
  );

  const defaultLocalePath = `${basePath || ""}/en`;

  // Redirect root to default locale (respecting basePath when set)
  if (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "") {
    return NextResponse.redirect(new URL(defaultLocalePath, req.nextUrl));
  }

  // Redirect base path to default locale
  if (
    (basePath && req.nextUrl.pathname === basePath) ||
    (basePath && req.nextUrl.pathname === `${basePath}/`)
  ) {
    return NextResponse.redirect(new URL(defaultLocalePath, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|opengraph|_next/static|_next/image|_vercel|.*\\..*).*)"],
  runtime: "nodejs",
};
