/**
 * Source-level preprocessing applied to editor MDX before it is compiled.
 *
 * MDX v3 treats lowercase tags as HTML, so custom blocks such as <tweet> are
 * capitalised here and resolved from the components map. Legacy
 * `<Gallery images={…}>` content is rewritten to a string prop so the
 * compiler never sees a JavaScript expression; `components/ui/gallery.tsx`
 * turns it back into data with a literal parser, not `eval`.
 */

const CUSTOM_COMPONENT_TAGS = [
  "tweet",
  "video",
  "postcard",
  "iframe",
  "gallery",
  "stats",
  "blockquote",
  "datetime",
  "newslettersignup",
  "footnotes",
  "sup",
] as const;

function readJsExpression(
  input: string,
  start: number,
): { expression: string; end: number } | null {
  let depth = 0;
  let quote: '"' | "'" | "`" | null = null;
  let escaped = false;

  for (let i = start; i < input.length; i++) {
    const char = input[i];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "{" || char === "[" || char === "(") {
      depth++;
      continue;
    }

    if (char === "}" || char === "]" || char === ")") {
      if (depth === 0) {
        return {
          expression: input.slice(start, i),
          end: i,
        };
      }
      depth--;
    }
  }

  return null;
}

function serializeLegacyGalleryProps(source: string): string {
  return source.replace(/<Gallery\b[\s\S]*?\/>/g, (tag) => {
    const imagesPropIndex = tag.indexOf("images={");
    if (imagesPropIndex === -1) {
      return tag;
    }

    const expressionStart = imagesPropIndex + "images={".length;
    const parsedExpression = readJsExpression(tag, expressionStart);
    if (!parsedExpression) {
      return tag;
    }

    const backgroundMatch = tag.match(/\sbackground="([^"]+)"/);
    const backgroundProp = backgroundMatch
      ? ` background="${backgroundMatch[1]}"`
      : "";

    const serializedImages = Buffer.from(
      parsedExpression.expression.trim(),
      "utf8",
    ).toString("base64");

    return `<Gallery${backgroundProp} imagesRaw="${serializedImages}" />`;
  });
}

/**
 * Pre-processes MDX source to capitalize custom component tags so that
 * MDX v3 compiles them as component references (resolved from scope)
 * rather than literal HTML elements.
 */
export function preprocessMDX(source: string): string {
  let result = source;
  for (const tag of CUSTOM_COMPONENT_TAGS) {
    const capitalized = tag.charAt(0).toUpperCase() + tag.slice(1);
    // Match opening and closing tags: <tag, </tag
    // Followed by whitespace, >, or / to avoid matching partial names
    result = result.replace(
      new RegExp(`<(/?)(${tag})(\\s|>|/)`, "g"),
      (_, slash, _name, after) => `<${slash}${capitalized}${after}`,
    );
  }
  return serializeLegacyGalleryProps(result);
}
