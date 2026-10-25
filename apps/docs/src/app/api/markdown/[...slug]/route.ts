import { defaultLocale } from "@workspace/i18n/config";
import { resolveDocsPage } from "@/lib/docs/page-data";
import { pageMarkdown } from "@/lib/docs/llms";
import { DOCS_LOCALES } from "@/lib/docs/locales.mjs";

/**
 * Markdown twin of a docs page. src/middleware.ts rewrites `<page>.md` and
 * `Accept: text/markdown` requests here. The slug is the public path, locale
 * included: /api/markdown/ar/developers/docs/payments.
 */
export const dynamicParams = true;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const locale = DOCS_LOCALES.includes(slug[0] ?? "")
    ? slug[0]!
    : defaultLocale;
  const rest = locale === defaultLocale ? slug : slug.slice(1);
  const resolved = resolveDocsPage(locale, rest);
  if (!resolved) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return new Response(await pageMarkdown(resolved.page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      Vary: "Accept",
    },
  });
}
