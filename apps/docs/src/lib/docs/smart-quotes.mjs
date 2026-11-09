/**
 * Typographic quotes, as the docs have always been rendered: straight ' and "
 * in prose become ‘ ’ “ ”, and the apostrophe ’. Applied to the HTML only
 * (rehype-docs-compat) and to heading slugs; the Markdown twins keep the
 * source text.
 *
 * `before` is the character preceding `text` (for text split by inline
 * elements, e.g. a quote right after bold text).
 */
const OPENING = /[\s([{—–/-]/;

export function smartQuotes(text, before = "") {
  let out = "";
  let prev = before;
  for (const ch of text) {
    if (ch === "'") out += !prev || OPENING.test(prev) ? "‘" : "’";
    else if (ch === '"') out += !prev || OPENING.test(prev) ? "“" : "”";
    else out += ch;
    prev = ch;
  }
  return out;
}

/**
 * The rest of the docs' typography, applied with the quotes in prose:
 * `...` becomes … and `--` an em dash, except where it starts a word after
 * a space (a CLI flag such as --rpc-url). `before` as for smartQuotes.
 */
export function smartPunctuation(text, before = "") {
  return text.replace(/\.\.\./g, "…").replace(/--/g, (match, offset, all) => {
    const prev = offset ? all[offset - 1] : before;
    const next = all[offset + 2] ?? "";
    const flag = (!prev || /\s/.test(prev)) && /[\p{L}\p{N}]/u.test(next);
    return flag ? match : "—";
  });
}
