import createMiddleware from "next-intl/middleware";
import { routing } from "@workspace/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const basePath =
  process.env.NEXT_PUBLIC_USE_BASE_PATH === "true"
    ? "/developers/templates"
    : "";

const handleI18nRouting = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  console.log(
    "[templates-mw]",
    JSON.stringify({
      path: req.nextUrl.pathname,
      search: req.nextUrl.search,
      useBasePath: !!basePath,
    }),
  );

  // If basePath is active, strip it before handing off to next-intl so routes resolve.
  if (basePath && req.nextUrl.pathname.startsWith(basePath)) {
    const url = req.nextUrl.clone();
    const stripped = url.pathname.slice(basePath.length) || "/";
    url.pathname = stripped.startsWith("/") ? stripped : `/${stripped}`;
    console.log(
      "[templates-mw]",
      JSON.stringify({
        action: "rewrite",
        original: req.nextUrl.pathname,
        stripped: url.pathname,
      }),
    );
    const rewrittenReq = new NextRequest(url, {
      headers: req.headers,
      method: req.method,
      body: req.body,
    });
    return handleI18nRouting(rewrittenReq);
  }

  console.log(
    "[templates-mw]",
    JSON.stringify({ action: "passthrough", path: req.nextUrl.pathname }),
  );
  return handleI18nRouting(req);
}

export const config = {
  matcher: ["/((?!api|opengraph|_next/static|_next/image|_vercel|.*\\..*).*)"],
  runtime: "nodejs",
};
