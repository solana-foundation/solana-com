import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  console.log(
    "[templates-mw-basic]",
    JSON.stringify({
      path: req.nextUrl.pathname,
      search: req.nextUrl.search,
    }),
  );
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
  runtime: "nodejs",
};
