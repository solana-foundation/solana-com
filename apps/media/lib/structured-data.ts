import { getAlternates } from "@workspace/i18n/alternates";
import { config } from "@/lib/config";
import { contentDocumentToPlainText } from "@/lib/content-renderer";

export type JsonLdEntity = Record<string, unknown> & {
  "@type": string;
  "@id": string;
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

const WEBSITE_ID = `${config.publicUrl}/#website`;
const PUBLISHER_ID = "https://solana.org/#organization";

export function toPublicUrl(value?: string | null) {
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

export function getLocalizedPageUrl(path: string, locale: string) {
  return (
    toPublicUrl(String(getAlternates(path, locale).canonical)) ||
    toPublicUrl(path) ||
    config.publicUrl
  );
}

export function toPlainText(value: unknown) {
  return contentDocumentToPlainText(value).replace(/\s+/g, " ").trim();
}

export function createWebsiteReference() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "Solana",
    url: config.publicUrl,
    publisher: createPublisherReference(),
  };
}

export function createPublisherReference() {
  return {
    "@type": "Organization",
    "@id": PUBLISHER_ID,
    name: "Solana Foundation",
    url: "https://solana.org",
    logo: {
      "@type": "ImageObject",
      url: `${config.publicUrl}/img/logomark-color.svg`,
    },
  };
}

export function createAuthorReference(name?: string | null) {
  const normalizedName = name?.trim();
  if (!normalizedName) return undefined;

  return {
    "@type": normalizedName === "Solana Foundation" ? "Organization" : "Person",
    name: normalizedName,
  };
}

export function getLatestDate(values: Array<string | null | undefined>) {
  return values
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);
}

export function createArticleEntity({
  type = "BlogPosting",
  path,
  locale,
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  section,
  keywords,
}: {
  type?: "Article" | "BlogPosting" | "Report" | "TechArticle";
  path: string;
  locale: string;
  title: string;
  description?: string | null;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string | null;
  section?: string | null;
  keywords?: string[];
}): JsonLdEntity {
  const url = getLocalizedPageUrl(path, locale);
  const imageUrl = toPublicUrl(image);

  return {
    "@type": type,
    "@id": `${url}#article`,
    url,
    headline: title,
    name: title,
    description: description || undefined,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished: datePublished || undefined,
    dateModified: dateModified || datePublished || undefined,
    inLanguage: locale,
    author: createAuthorReference(authorName),
    publisher: createPublisherReference(),
    articleSection: section || undefined,
    keywords: keywords?.filter(Boolean).join(", ") || undefined,
  };
}

export function createPodcastSeriesEntity({
  path,
  locale,
  name,
  description,
  image,
  hosts = [],
  sameAs = [],
  episodeIds = [],
}: {
  path: string;
  locale: string;
  name: string;
  description?: string | null;
  image?: string | null;
  hosts?: string[];
  sameAs?: Array<string | null | undefined>;
  episodeIds?: string[];
}): JsonLdEntity {
  const url = getLocalizedPageUrl(path, locale);
  const safeSameAs = sameAs.map(toPublicUrl).filter(Boolean);
  const webFeed = safeSameAs.find(
    (value) => value?.includes("rss") || value?.includes("feed"),
  );

  return {
    "@type": "PodcastSeries",
    "@id": `${url}#podcast`,
    url,
    name,
    description: description || undefined,
    image: toPublicUrl(image),
    inLanguage: locale,
    author: createPublisherReference(),
    webFeed,
    sameAs: safeSameAs.filter((value) => value !== webFeed),
    actor: hosts.filter(Boolean).map((host) => ({
      "@type": "Person",
      name: host,
    })),
    episode: episodeIds.map((id) => ({ "@id": id })),
  };
}

export function createPodcastEpisodeEntity({
  path,
  locale,
  name,
  description,
  image,
  datePublished,
  durationSeconds,
  audioUrl,
  seriesId,
}: {
  path: string;
  locale: string;
  name: string;
  description?: string | null;
  image?: string | null;
  datePublished?: string | null;
  durationSeconds?: number | null;
  audioUrl?: string | null;
  seriesId?: string;
}): JsonLdEntity {
  const url = getLocalizedPageUrl(path, locale);
  const safeAudioUrl = toPublicUrl(audioUrl);

  return {
    "@type": "PodcastEpisode",
    "@id": `${url}#episode`,
    url,
    name,
    description: description || undefined,
    image: toPublicUrl(image),
    datePublished: datePublished || undefined,
    inLanguage: locale,
    duration:
      durationSeconds && durationSeconds > 0
        ? `PT${Math.round(durationSeconds)}S`
        : undefined,
    author: createPublisherReference(),
    associatedMedia: safeAudioUrl
      ? {
          "@type": "AudioObject",
          contentUrl: safeAudioUrl,
          encodingFormat: "audio/mpeg",
        }
      : undefined,
    partOfSeries: seriesId ? { "@id": seriesId } : undefined,
  };
}

export function createBreadcrumbList(
  pageUrl: string,
  items: BreadcrumbItem[],
  locale: string,
) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getLocalizedPageUrl(item.path, locale),
    })),
  };
}

export function buildCollectionJsonLd({
  path,
  locale,
  title,
  description,
  listName,
  listFragment = "items",
  itemListOrder = "https://schema.org/ItemListOrderDescending",
  entities,
  dateModified,
  aboutName,
  breadcrumbs,
}: {
  path: string;
  locale: string;
  title: string;
  description: string;
  listName: string;
  listFragment?: string;
  itemListOrder?: string;
  entities: JsonLdEntity[];
  dateModified?: string | null;
  aboutName?: string;
  breadcrumbs?: BreadcrumbItem[];
}) {
  const pageUrl = getLocalizedPageUrl(path, locale);
  const listId = `${pageUrl}#${listFragment}`;

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
        dateModified: dateModified || undefined,
        isPartOf: createWebsiteReference(),
        about: aboutName
          ? {
              "@type": "Thing",
              name: aboutName,
            }
          : undefined,
        mainEntity: {
          "@id": listId,
        },
      },
      createBreadcrumbList(
        pageUrl,
        breadcrumbs ?? [
          { name: "Solana", path: "/" },
          { name: title, path },
        ],
        locale,
      ),
      {
        "@type": "ItemList",
        "@id": listId,
        name: listName,
        numberOfItems: entities.length,
        itemListOrder,
        itemListElement: entities.map((entity, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@id": entity["@id"],
          },
        })),
      },
      ...entities,
    ],
  };
}

export function buildDetailJsonLd({
  path,
  locale,
  entity,
  breadcrumbs,
  additionalEntities = [],
}: {
  path: string;
  locale: string;
  entity: JsonLdEntity;
  breadcrumbs: BreadcrumbItem[];
  additionalEntities?: JsonLdEntity[];
}) {
  const pageUrl = getLocalizedPageUrl(path, locale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...entity,
        url: pageUrl,
        inLanguage: locale,
        isPartOf: createWebsiteReference(),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageUrl,
        },
      },
      createBreadcrumbList(pageUrl, breadcrumbs, locale),
      ...additionalEntities,
    ],
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
