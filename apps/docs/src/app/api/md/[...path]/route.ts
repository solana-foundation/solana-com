import { NextRequest, NextResponse } from "next/server";
import { docsSource } from "@@/src/app/sources/docs";
import { cookbookSource } from "@@/src/app/sources/cookbook";
import { guidesSource } from "@@/src/app/sources/guides";
import { learnSource } from "@@/src/app/sources/learn";
import { locales, defaultLocale } from "@workspace/i18n/config";

/**
 * Serves raw markdown content at /api/md/[locale]/[...slug]
 * Example: /api/md/en/docs/core/accounts -> raw markdown for that page
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;

  if (!path || path.length < 2) {
    return NextResponse.json(
      { error: "Invalid path. Expected: /api/md/{locale}/{section}/..." },
      { status: 400 },
    );
  }

  const [localeOrSection, ...rest] = path;

  // Determine locale and slug
  let locale = defaultLocale;
  let section: string;
  let slug: string[];

  if (locales.includes(localeOrSection)) {
    locale = localeOrSection;
    [section, ...slug] = rest;
  } else {
    section = localeOrSection;
    slug = rest;
  }

  // Select the appropriate source based on section
  let source;
  switch (section) {
    case "docs":
      source = docsSource;
      break;
    case "cookbook":
      source = cookbookSource;
      break;
    case "guides":
      source = guidesSource;
      break;
    case "learn":
      source = learnSource;
      break;
    default:
      return NextResponse.json(
        {
          error: `Unknown section: ${section}. Valid sections: docs, cookbook, guides, learn`,
        },
        { status: 404 },
      );
  }

  try {
    const page = source.getPage(slug, locale);

    if (!page) {
      return NextResponse.json(
        { error: `Page not found: /${locale}/${section}/${slug.join("/")}` },
        { status: 404 },
      );
    }

    const markdown = await page.data.getText("raw");

    return new NextResponse(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching markdown:", error);
    return NextResponse.json(
      { error: "Failed to fetch markdown content" },
      { status: 500 },
    );
  }
}
