import createMiddleware from "next-intl/middleware";
import { routing } from "@workspace/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "@workspace/i18n/config";
import { readFileSync } from "fs";
import { join } from "path";
import { docsSource } from "./app/sources/docs";

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  // Skip i18n for /breakpoint/* paths
  if (req.nextUrl.pathname.startsWith("/breakpoint")) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname !== req.nextUrl.pathname.toLowerCase()) {
    return NextResponse.redirect(
      `${req.nextUrl.origin + req.nextUrl.pathname.toLowerCase()}`,
    );
  }

  const localeParam = req.nextUrl?.searchParams?.get("locale");
  if (localeParam && !locales.includes(localeParam)) {
    // An invalid locale search param means that the pages router was trying
    // to do a soft navigation and matched the route pages/[locale]/[...slug]
    // the right route will be resolved after the middleware adds the right locale prefix
    // we can safely remove the locale and slug params to avoid poluting the URL
    req.nextUrl.searchParams.delete("locale");
    req.nextUrl.searchParams.delete("slug");
  }

  const acceptHeader = (req.headers.get("accept") || "").toLowerCase();
  const wantsMarkdown =
    acceptHeader.includes("text/markdown") ||
    acceptHeader.includes("text/plain");

  if (wantsMarkdown && req.nextUrl.pathname.match(/^\/[a-z]{2}\/docs\//)) {
    try {
      const pathParts = req.nextUrl.pathname.split("/").filter(Boolean);
      const locale = pathParts[0];
      const slug = pathParts.slice(2);

      const page = docsSource.getPage(slug, locale);

      if (!page) {
        return new NextResponse("Documentation page not found", {
          status: 404,
        });
      }

      const relativeFilePath = page.data.info.path;
      const fullPath = join("content", "docs", relativeFilePath);
      const absolutePath = join(process.cwd(), fullPath);

      let rawContent: string;

      try {
        rawContent = readFileSync(absolutePath, "utf-8");
      } catch (error) {
        console.error(`Error reading file at ${absolutePath}:`, error);
        return new NextResponse("Error reading documentation file", {
          status: 500,
        });
      }

      const contentType = acceptHeader.includes("text/plain")
        ? "text/plain; charset=utf-8"
        : "text/markdown; charset=utf-8";

      return new NextResponse(rawContent, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "X-Content-Format": "markdown",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      });
    } catch (error) {
      console.error("Error in markdown middleware:", error);
      return new NextResponse("Internal server error", { status: 500 });
    }
  }

  return handleI18nRouting(req);
}

export const config = {
  matcher: ["/((?!api|opengraph|_next|_vercel|breakpoint|.*\\..*).*)"],
  runtime: "nodejs",
};
