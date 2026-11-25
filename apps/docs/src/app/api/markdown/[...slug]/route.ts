import type { NextRequest } from "next/server";
import { defaultLocale } from "@workspace/i18n/config";
import { resolveDocsPage } from "@/lib/docs/page-data";
import { pageMarkdown } from "@/lib/docs/llms";
import { DOCS_LOCALES } from "@/lib/docs/locales.mjs";
import { developersMarkdown } from "@/lib/docs/developers-markdown";
import { canonicalPath } from "@/lib/docs/metadata";
import {
  markdownResponse,
  notFoundMarkdown,
  searchMarkdown,
} from "@/lib/docs/markdown-response";

/**
 * Markdown twin of a docs page and of the /developers landing.
 * src/middleware.ts rewrites `<page>.md` and requests whose Accept header
 * prefers text/markdown here. The slug is the public path, locale
 * included: /api/markdown/ar/developers/docs/payments. A missing page is a
 * 404 in Markdown; the docs home with `?q=` answers search results.
 */
export const dynamicParams = true;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const locale = DOCS_LOCALES.includes(slug[0] ?? "")
    ? slug[0]!
    : defaultLocale;
  const rest = locale === defaultLocale ? slug : slug.slice(1);
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const path = `${prefix}/${rest.join("/")}`;

  if (rest.length === 1 && rest[0] === "developers") {
    return markdownResponse(request, await developersMarkdown(locale), {
      canonical: path,
    });
  }

  const resolved = resolveDocsPage(locale, rest);
  if (!resolved) {
    return markdownResponse(
      request,
      await notFoundMarkdown(path, rest, locale),
      { status: 404 },
    );
  }

  const query = request.nextUrl.searchParams.get("q")?.trim().slice(0, 200);
  if (query && resolved.page.url === `${prefix}/developers/docs`) {
    return markdownResponse(request, await searchMarkdown(query, locale));
  }

  return markdownResponse(request, await pageMarkdown(resolved.page), {
    canonical: canonicalPath(resolved),
  });
}
