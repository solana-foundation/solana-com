/**
 * /developers/docs/<section>/llms.txt: scoped agent indexes, one per
 * first-level section, built with the app (force-static).
 * The old /docs/<section>/llms.txt redirects here (redirects.ts).
 * The middleware (src/middleware.ts) skips file paths, so the request
 * reaches this route without the locale rewrite.
 */
import { indexPages } from "@/lib/docs/llms";
import { docsSections, renderSectionLlmsTxt } from "@/lib/docs/llms-index";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return docsSections(indexPages()).map((section) => ({ section }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ section: string }> },
) {
  const { section } = await params;
  const body = renderSectionLlmsTxt(indexPages(), section);

  if (body === null) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
