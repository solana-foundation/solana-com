import { getAlternates } from "@workspace/i18n/alternates";
import { config } from "@/lib/config";
import type { PostItem } from "@/lib/post-types";

const CHANGELOG_PATH = "/changelog";

function toAbsoluteUrl(value?: string | null) {
  if (!value) return undefined;

  try {
    const url = new URL(value, config.publicUrl);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function extractText(node: unknown): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join(" ");

  if (typeof node === "object") {
    const value = node as {
      text?: unknown;
      children?: unknown;
      node?: unknown;
    };

    if (typeof value.text === "string") return value.text;
    return [extractText(value.children), extractText(value.node)]
      .filter(Boolean)
      .join(" ");
  }

  return "";
}

function getLatestPublishedAt(posts: PostItem[]) {
  return posts
    .map((post) => post.publishedAt)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);
}

export function buildChangelogJsonLd({
  posts,
  locale,
  title,
  description,
}: {
  posts: PostItem[];
  locale: string;
  title: string;
  description: string;
}) {
  const canonicalPath = getAlternates(CHANGELOG_PATH, locale).canonical;
  const pageUrl =
    toAbsoluteUrl(canonicalPath) || `${config.publicUrl}${CHANGELOG_PATH}`;
  const issueSchemas = posts.map((post) => {
    const issueUrl = toAbsoluteUrl(post.url) || pageUrl;
    const imageUrl = toAbsoluteUrl(post.heroImage);
    const summary = extractText(post.description).replace(/\s+/g, " ").trim();
    const authorName = post.author?.name?.trim();

    return {
      "@type": "BlogPosting",
      "@id": `${issueUrl}#article`,
      url: issueUrl,
      headline: post.title,
      description: summary || undefined,
      datePublished: post.publishedAt || undefined,
      image: imageUrl ? [imageUrl] : undefined,
      author: authorName
        ? {
            "@type":
              authorName === "Solana Foundation" ? "Organization" : "Person",
            name: authorName,
          }
        : undefined,
      publisher: {
        "@type": "Organization",
        name: "Solana Foundation",
        url: "https://solana.org",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": issueUrl,
      },
    };
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        description,
        inLanguage: locale,
        dateModified: getLatestPublishedAt(posts),
        isPartOf: {
          "@type": "WebSite",
          "@id": `${config.publicUrl}/#website`,
          name: "Solana",
          url: config.publicUrl,
        },
        about: {
          "@type": "Thing",
          name: "Solana developer releases and protocol updates",
        },
        mainEntity: {
          "@id": `${pageUrl}#issues`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Solana",
            item: config.publicUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Changelog",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#issues`,
        name: "Solana Changelog issues",
        numberOfItems: issueSchemas.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: issueSchemas.map((issue, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@id": issue["@id"],
          },
        })),
      },
      ...issueSchemas,
    ],
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
