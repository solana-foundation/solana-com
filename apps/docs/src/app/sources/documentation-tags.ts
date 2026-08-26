export type DocumentationTagPage = {
  url: string;
  data: {
    title: string;
    description?: string;
    documentationTags?: readonly string[];
  };
};

export type DocumentationTag = {
  slug: string;
  label: string;
  summary?: string;
  pages: DocumentationTagPage[];
};

/**
 * Add an optional introduction for a tag page, keyed by its URL slug.
 * Documentation pages opt into the taxonomy with `documentationTags` in
 * frontmatter; the existing `tags` field remains available for legacy metadata.
 */
export const documentationTagSummaries: Readonly<Record<string, string>> = {};

export function toDocumentationTagSlug(tag: string) {
  return tag
    .trim()
    .normalize("NFKD")
    .toLocaleLowerCase("en")
    .replace(/\p{Mark}+/gu, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function getDocumentationTags(
  pages: readonly DocumentationTagPage[],
  summaries: Readonly<Record<string, string>> = documentationTagSummaries,
) {
  const tags = new Map<string, DocumentationTag>();
  const labelsBySlug = new Map<string, string>();

  for (const page of pages) {
    const pageTags = new Map<string, string>();
    for (const rawLabel of page.data.documentationTags ?? []) {
      const label = rawLabel.trim();
      const slug = toDocumentationTagSlug(label);
      if (!slug) continue;

      const existingLabel = labelsBySlug.get(slug);
      if (
        existingLabel &&
        existingLabel.normalize("NFKC").toLocaleLowerCase("en") !==
          label.normalize("NFKC").toLocaleLowerCase("en")
      ) {
        throw new Error(
          `Documentation tag labels "${existingLabel}" and "${label}" share the slug "${slug}". Rename one of the tags so each tag has a unique URL.`,
        );
      }

      const canonicalLabel = existingLabel ?? label;
      labelsBySlug.set(slug, canonicalLabel);
      if (!pageTags.has(slug)) pageTags.set(slug, canonicalLabel);
    }

    for (const [slug, label] of pageTags) {
      const tag = tags.get(slug) ?? {
        slug,
        label,
        summary: summaries[slug],
        pages: [],
      };

      tag.pages.push(page);
      tags.set(slug, tag);
    }
  }

  return [...tags.values()]
    .map((tag) => ({
      ...tag,
      pages: tag.pages.toSorted((a, b) =>
        a.data.title.localeCompare(b.data.title),
      ),
    }))
    .toSorted((a, b) => a.label.localeCompare(b.label));
}

export function getDocumentationTag(
  pages: readonly DocumentationTagPage[],
  slug: string,
) {
  return getDocumentationTags(pages).find((tag) => tag.slug === slug);
}

export function getDocumentationTagUrl(locale: string, slug?: string) {
  const localePrefix = locale === "en" ? "" : `/${locale}`;
  const tagPath = slug ? `/${slug}` : "";
  return `${localePrefix}/docs/tags${tagPath}`;
}
