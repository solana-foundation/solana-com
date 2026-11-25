import { createHash } from "node:crypto";
import { docsSearchServer } from "./search";

/**
 * Responses of the markdown route (app/api/markdown/[...slug]): a page's
 * Markdown twin, the 404 for a missing page, and docs search results
 * (`/developers/docs?q=...` with `Accept: text/markdown`).
 */
const SITE = "https://solana.com";
export const DOCS_LLMS_TXT = `${SITE}/developers/docs/llms.txt`;

/**
 * `text/markdown` with `Vary: Accept` (the page URL also answers HTML) and
 * RFC 8288 links to the HTML page and the docs index. A page gets an ETag
 * and answers a matching If-None-Match with 304.
 */
export function markdownResponse(
  request: Request,
  body: string,
  { status = 200, canonical }: { status?: number; canonical?: string } = {},
): Response {
  const links = [`<${DOCS_LLMS_TXT}>; rel="describedby"; type="text/plain"`];
  if (canonical) {
    links.unshift(`<${SITE}${canonical}>; rel="canonical"; type="text/html"`);
  }
  const headers = new Headers({
    "Content-Type": "text/markdown; charset=utf-8",
    Vary: "Accept",
    Link: links.join(", "),
  });
  if (status !== 200) {
    headers.set("X-Robots-Tag", "noindex");
    return new Response(body, { status, headers });
  }
  headers.set(
    "Cache-Control",
    "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  );
  const tag = `"${createHash("sha1").update(body).digest("base64url")}"`;
  headers.set("ETag", `W/${tag}`);
  const matches = (request.headers.get("if-none-match") ?? "")
    .split(",")
    .some((t) => t.trim().replace(/^W\//, "") === tag);
  if (matches) return new Response(null, { status: 304, headers });
  return new Response(body, { headers });
}

interface PageHit {
  url: string;
  title: string;
  description?: string;
  breadcrumbs: string[];
}

/** Docs pages whose title, description or section match `query`. */
async function searchPages(
  query: string,
  locale: string,
  limit: number,
): Promise<PageHit[]> {
  const results = await docsSearchServer.search(query, { locale });
  const descriptions = new Map<string, string>();
  for (const r of results) {
    const url = r.url.split("#")[0]!;
    if (r.type === "text" && !descriptions.has(url))
      descriptions.set(url, r.content);
  }
  return results
    .filter((r) => r.type === "page")
    .slice(0, limit)
    .map((r) => ({
      url: r.url,
      title: r.content,
      description: descriptions.get(r.url),
      breadcrumbs: r.breadcrumbs ?? [],
    }));
}

function hitLine(hit: PageHit): string {
  const section = hit.breadcrumbs.length
    ? ` (${hit.breadcrumbs.join(" > ")})`
    : "";
  const line = `- [${hit.title}](${SITE}${hit.url}.md)${section}`;
  return hit.description ? `${line}: ${hit.description}` : line;
}

/** Search words of a path: ["developers", "docs", "core", "acounts"] -> "core acounts". */
function pathWords(slugs: string[]): string {
  return slugs
    .filter((s) => !["developers", "docs", "cookbook", "learn"].includes(s))
    .join(" ")
    .replace(/[-_]+/g, " ")
    .trim();
}

const INDEX_LINKS = [
  `- Start from the docs home: ${SITE}/developers/docs.md`,
  `- Index of every page, linked as Markdown: ${SITE}/llms.txt`,
  `- Sitemap: ${SITE}/sitemap.xml`,
];

/**
 * The 404 of a missing page: `path` is the public path asked for, `slugs`
 * its segments after the locale.
 */
export async function notFoundMarkdown(
  path: string,
  slugs: string[],
  locale: string,
): Promise<string> {
  const query = pathWords(slugs);
  const hits = query ? await searchPages(query, locale, 3) : [];
  return [
    "# Page not found",
    "",
    `No docs page exists at ${SITE}${path}. Check the URL, or find the page with the links below.`,
    "",
    ...(hits.length
      ? ["## Pages with similar titles", "", ...hits.map(hitLine), ""]
      : []),
    "## Find a page",
    "",
    `- Search the docs: ${SITE}/developers/docs?q=${query ? encodeURIComponent(query) : "<search terms>"}. Send \`Accept: text/markdown\` to get the results as Markdown.`,
    ...INDEX_LINKS,
    "",
  ].join("\n");
}

/** Docs search results, for agents that send `?q=` without JavaScript. */
export async function searchMarkdown(
  query: string,
  locale: string,
): Promise<string> {
  const hits = await searchPages(query, locale, 10);
  return [
    `# Search results for "${query}"`,
    "",
    "> Solana developer docs pages whose title, description or section match the search.",
    "",
    ...(hits.length
      ? [...hits.map(hitLine), ""]
      : [`No pages match "${query}". Try other words.`, ""]),
    "## Browse the docs",
    "",
    ...INDEX_LINKS,
    "",
  ].join("\n");
}
