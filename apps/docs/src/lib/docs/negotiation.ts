/**
 * Content negotiation for the docs pages (src/middleware.ts): a page URL
 * answers Markdown when the request's Accept header prefers `text/markdown`
 * to `text/html`, and HTML otherwise.
 *
 * Quality values count (RFC 9110 §12.5.1): `text/markdown` must be listed by
 * name with q > 0, at a q at least as high as HTML's. HTML's q comes from the
 * most specific range that covers it (`text/html`, else `text/*`, else
 * `*\/*`). Wildcards alone never select Markdown, so browsers (`text/html,
 * ...,*\/*;q=0.8`) and clients that send `*\/*` get HTML.
 */
const MARKDOWN_TYPES = new Set(["text/markdown", "text/x-markdown"]);

interface MediaRange {
  type: string;
  q: number;
}

function parseAccept(header: string): MediaRange[] {
  const ranges: MediaRange[] = [];
  for (const part of header.split(",")) {
    const [rawType, ...params] = part.split(";");
    const type = rawType?.trim().toLowerCase();
    if (!type) continue;
    let q = 1;
    for (const param of params) {
      const [key, value] = param.split("=").map((s) => s.trim());
      if (key?.toLowerCase() !== "q") continue;
      const parsed = Number(value);
      q = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 1) : 0;
    }
    ranges.push({ type, q });
  }
  return ranges;
}

/** q of the most specific range in `ranges` that covers `type`, or null. */
function qualityOf(ranges: MediaRange[], type: string): number | null {
  const major = `${type.split("/")[0]}/*`;
  for (const candidate of [type, major, "*/*"]) {
    const matches = ranges.filter((r) => r.type === candidate);
    if (matches.length) return Math.max(...matches.map((r) => r.q));
  }
  return null;
}

/** Whether a request with this Accept header should get the Markdown page. */
export function prefersMarkdown(accept: string | null | undefined): boolean {
  if (!accept) return false;
  const ranges = parseAccept(accept);
  const markdown = Math.max(
    0,
    ...ranges.filter((r) => MARKDOWN_TYPES.has(r.type)).map((r) => r.q),
  );
  if (markdown <= 0) return false;
  const html = qualityOf(ranges, "text/html") ?? 0;
  return markdown >= html;
}
