/**
 * Centralized metadata generation for all pages.
 *
 * This module is deliberately free of React component imports so it
 * can be unit-tested without mocking the entire rendering stack.
 */

import type { Metadata } from "next";
import { loadMergedMessages, resolveLocale } from "@workspace/i18n/messages";
import { getAlternates } from "@workspace/i18n/alternates";
import { config } from "@/lib/config";
import { reader } from "@/lib/reader";
import { fetchCategoryByPath } from "@/lib/category-data";
import { fetchPublishedPostBySlug } from "@/lib/post-data";
import { fetchPodcastBySlug, fetchEpisodeById } from "@/lib/podcast-data";
import { isPublishedReport } from "@/lib/keystatic/report-status";
import { contentDocumentToPlainText } from "@/lib/content-renderer";
import { createUpgradeSocialImage } from "@/lib/upgrades/social-image";
import { isPublishedUpgrade } from "@/lib/keystatic/upgrade-status";
import { createDefaultSocialImage } from "@solana-com/ui-chrome/social-image";

const { publicUrl, siteMetadata, social } = config;

function toPublicUrl(path: string) {
  return new URL(path, publicUrl).toString();
}

function getPublicAlternates(path: string, locale: string) {
  const alternates = getAlternates(path, locale);

  return {
    canonical: toPublicUrl(String(alternates.canonical)),
    languages: Object.fromEntries(
      Object.entries(alternates.languages ?? {}).map(([language, value]) => [
        language,
        toPublicUrl(String(value)),
      ]),
    ),
  };
}

function getPublicPageUrls(path: string, locale: string) {
  const alternates = getPublicAlternates(path, locale);

  return {
    alternates,
    canonicalUrl: String(alternates.canonical),
  };
}

async function getNewsMetadataMessages(locale?: string) {
  const resolvedLocale = resolveLocale(locale);
  const messages = await loadMergedMessages({
    app: "media",
    locale: resolvedLocale,
  });

  function t(key: string, values: Record<string, string> = {}) {
    const path = ["news", "metadata", ...key.split(".")];
    const template = path.reduce<unknown>((value, part) => {
      if (value && typeof value === "object" && part in value) {
        return (value as Record<string, unknown>)[part];
      }

      return undefined;
    }, messages);

    if (typeof template !== "string") {
      return path.join(".");
    }

    return Object.entries(values).reduce(
      (result, [name, value]) => result.replaceAll(`{${name}}`, value),
      template,
    );
  }

  return { locale: resolvedLocale, t };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fallbackImage() {
  return createDefaultSocialImage(siteMetadata.title);
}

function twitterBase() {
  return {
    card: "summary_large_image" as const,
    site: `@${social.twitter.name}`,
    creator: `@${social.twitter.name}`,
  };
}

function indexableRobots(): Metadata["robots"] {
  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

function notFoundMetadata(title: string): Metadata {
  return {
    title,
    description: "",
    robots: {
      index: false,
      follow: false,
    },
  };
}

function seoDescription(value: unknown, fallback?: string) {
  const normalizedValue = contentDocumentToPlainText(value)
    .replace(/\s+/g, " ")
    .trim();
  const description =
    normalizedValue ||
    contentDocumentToPlainText(fallback).replace(/\s+/g, " ").trim();

  if (description.length <= 160) {
    return description || undefined;
  }

  const candidate = description.slice(0, 159);
  const lastWordBoundary = candidate.lastIndexOf(" ");
  const shortened =
    lastWordBoundary >= 120
      ? candidate.slice(0, lastWordBoundary)
      : candidate.trimEnd();

  return `${shortened}…`;
}

function getTaxonomySlug(item: unknown, key: "category" | "tag") {
  if (typeof item === "string") return item;
  if (item && typeof item === "object" && key in item) {
    const value = (item as Record<string, unknown>)[key];
    return value ? String(value) : null;
  }
  return null;
}

// ---------------------------------------------------------------------------
// News listing  /news
// ---------------------------------------------------------------------------

export const NEWS_SEO_TITLE = "Solana News: Ecosystem and Developer Updates";
export const NEWS_SEO_DESCRIPTION =
  "Read the latest Solana news, ecosystem updates, developer releases, DeFi coverage, institutional adoption, and community stories from across the network.";

export async function newsListingMetadata(locale?: string): Promise<Metadata> {
  const { locale: resolvedLocale } = await getNewsMetadataMessages(locale);
  const { alternates, canonicalUrl } = getPublicPageUrls(
    "/news",
    resolvedLocale,
  );
  const title = NEWS_SEO_TITLE;
  const description = NEWS_SEO_DESCRIPTION;

  return {
    title,
    description,
    robots: indexableRobots(),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: siteMetadata.title,
      locale: resolvedLocale,
      images: [fallbackImage()],
    },
    twitter: {
      ...twitterBase(),
      title,
      description,
      images: [siteMetadata.socialShare],
    },
    alternates: {
      ...alternates,
      types: {
        "application/rss+xml": `${publicUrl}/news/rss.xml`,
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Changelog listing  /changelog
// ---------------------------------------------------------------------------

export const CHANGELOG_SEO_TITLE = "Solana Changelog: Weekly Developer Updates";
export const CHANGELOG_SEO_DESCRIPTION =
  "Read the Solana Changelog for weekly updates on validator clients, protocol changes, SDK releases, RPC improvements, and developer tooling across the ecosystem.";

export function changelogListingMetadata(locale?: string): Metadata {
  const resolvedLocale = resolveLocale(locale);
  const { alternates, canonicalUrl } = getPublicPageUrls(
    "/changelog",
    resolvedLocale,
  );
  const title = CHANGELOG_SEO_TITLE;
  const description = CHANGELOG_SEO_DESCRIPTION;

  return {
    title,
    description,
    robots: indexableRobots(),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: siteMetadata.title,
      locale: resolvedLocale,
      images: [fallbackImage()],
    },
    twitter: {
      ...twitterBase(),
      title,
      description,
      images: [siteMetadata.socialShare],
    },
    alternates: {
      ...alternates,
      types: {
        "application/rss+xml": `${publicUrl}/changelog/rss.xml`,
      },
    },
  };
}

// ---------------------------------------------------------------------------
// News post  /news/[slug]
// ---------------------------------------------------------------------------

export async function newsPostMetadata(
  slug: string,
  locale?: string,
): Promise<Metadata> {
  const { locale: resolvedLocale, t } = await getNewsMetadataMessages(locale);
  const post = await fetchPublishedPostBySlug(slug);

  if (!post) {
    return notFoundMetadata(t("postNotFound.title"));
  }

  let authorName: string | undefined;
  if (post.author) {
    const author = await reader.collections.authors.read(post.author);
    if (author) authorName = String(author.name);
  }

  const postRecord = post as typeof post & {
    category?: unknown;
  };
  const categoryRefs =
    post.categories ??
    (postRecord.category !== undefined ? [postRecord.category] : []);
  const categoryNames: string[] = [];
  if (categoryRefs) {
    for (const categoryRef of categoryRefs) {
      const categorySlug = getTaxonomySlug(categoryRef, "category");
      if (!categorySlug) continue;

      const category = await reader.collections.categories.read(categorySlug);
      if (category?.name) categoryNames.push(String(category.name));
    }
  }

  const tagNames: string[] = [];
  if (post.tags && Array.isArray(post.tags)) {
    for (const tagRef of post.tags) {
      const tagSlug = getTaxonomySlug(tagRef, "tag");
      if (!tagSlug) continue;

      const tag = await reader.collections.tags.read(tagSlug);
      if (tag?.name) tagNames.push(String(tag.name));
    }
  }

  const title = String(post.title);
  const description = seoDescription(post.description);
  const ogImage = post.heroImage || siteMetadata.socialShare;
  const { alternates, canonicalUrl } = getPublicPageUrls(
    `/news/${slug}`,
    resolvedLocale,
  );

  return {
    title,
    description: description || undefined,
    robots: indexableRobots(),
    openGraph: {
      title,
      description: description || undefined,
      url: canonicalUrl,
      type: "article",
      siteName: siteMetadata.title,
      locale: resolvedLocale,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
        : undefined,
      publishedTime: post.publishedAt || undefined,
      authors: authorName ? [authorName] : undefined,
      section: categoryNames[0],
      tags: tagNames.length > 0 ? tagNames : undefined,
    },
    twitter: {
      ...twitterBase(),
      title,
      description: description || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
    authors: authorName ? [{ name: authorName }] : undefined,
    alternates,
  };
}

// ---------------------------------------------------------------------------
// Category listing  /news/category/[category]
// ---------------------------------------------------------------------------

export async function categoryListingMetadata(
  categoryParam: string,
  locale?: string,
): Promise<Metadata> {
  const { locale: resolvedLocale, t } = await getNewsMetadataMessages(locale);
  let categoryName: string | null = null;
  try {
    const { category } = await fetchCategoryByPath(categoryParam);
    categoryName = category?.name || null;
  } catch {
    return notFoundMetadata(t("categoryNotFound.title"));
  }

  if (!categoryName) {
    return notFoundMetadata(t("categoryNotFound.title"));
  }

  const title = t("category.title", { category: categoryName });
  const description = t("category.description", { category: categoryName });
  const { alternates, canonicalUrl } = getPublicPageUrls(
    `/news/category/${categoryParam}`,
    resolvedLocale,
  );

  return {
    title,
    description,
    robots: indexableRobots(),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: siteMetadata.title,
      locale: resolvedLocale,
      images: [fallbackImage()],
    },
    twitter: {
      ...twitterBase(),
      title,
      description,
      images: [siteMetadata.socialShare],
    },
    alternates,
  };
}

// ---------------------------------------------------------------------------
// Reports listing  /reports
// ---------------------------------------------------------------------------

export const REPORTS_SEO_TITLE = "Solana Reports: Research and Market Insights";
export const REPORTS_SEO_DESCRIPTION =
  "Explore Solana reports featuring original ecosystem research, market analysis, institutional insights, network data, and long-form industry perspectives.";

export function reportsListingMetadata(locale?: string): Metadata {
  const resolvedLocale = resolveLocale(locale);
  const { alternates, canonicalUrl } = getPublicPageUrls(
    "/reports",
    resolvedLocale,
  );
  const title = REPORTS_SEO_TITLE;
  const description = REPORTS_SEO_DESCRIPTION;

  return {
    title,
    description,
    robots: indexableRobots(),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: siteMetadata.title,
      locale: resolvedLocale,
      images: [fallbackImage()],
    },
    twitter: {
      ...twitterBase(),
      title,
      description,
      images: [siteMetadata.socialShare],
    },
    alternates,
  };
}

// ---------------------------------------------------------------------------
// Report detail  /reports/[slug]
// ---------------------------------------------------------------------------

export async function reportMetadata(
  slug: string,
  locale?: string,
): Promise<Metadata> {
  const resolvedLocale = resolveLocale(locale);
  const report = await reader.collections.switchbacks.read(slug);

  if (!isPublishedReport(report)) {
    return notFoundMetadata("Report Not Found");
  }

  const title = String(report.headline || report.title);
  const description = seoDescription(report.description);
  const { alternates, canonicalUrl } = getPublicPageUrls(
    `/reports/${slug}`,
    resolvedLocale,
  );
  const ogImage = report.image?.src || siteMetadata.socialShare;

  const categoryNames: string[] = [];
  if (report.categories) {
    for (const categoryRef of report.categories) {
      if (!categoryRef?.category) continue;

      const category = await reader.collections.categories.read(
        String(categoryRef.category),
      );

      if (category?.name) {
        categoryNames.push(String(category.name));
      }
    }
  }

  const tagNames: string[] = [];
  if (report.tags) {
    for (const tagRef of report.tags) {
      if (!tagRef?.tag) continue;

      const tag = await reader.collections.tags.read(String(tagRef.tag));
      if (tag?.name) {
        tagNames.push(String(tag.name));
      }
    }
  }

  return {
    title,
    description,
    robots: indexableRobots(),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: siteMetadata.title,
      locale: resolvedLocale,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
        : undefined,
      publishedTime: report.publishedAt || undefined,
      section: categoryNames[0],
      tags: tagNames.length > 0 ? tagNames : undefined,
    },
    twitter: {
      ...twitterBase(),
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates,
  };
}

// ---------------------------------------------------------------------------
// Podcasts listing  /podcasts
// ---------------------------------------------------------------------------

export const PODCASTS_SEO_TITLE = "Solana Podcasts: Builders, Markets and Web3";
export const PODCASTS_SEO_DESCRIPTION =
  "Listen to Solana podcasts featuring builders, founders, researchers, and ecosystem leaders discussing blockchain development, markets, and internet capital.";

export function podcastsListingMetadata(locale?: string): Metadata {
  const resolvedLocale = resolveLocale(locale);
  const title = PODCASTS_SEO_TITLE;
  const description = PODCASTS_SEO_DESCRIPTION;
  const { alternates, canonicalUrl } = getPublicPageUrls(
    "/podcasts",
    resolvedLocale,
  );

  return {
    title,
    description,
    robots: indexableRobots(),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: siteMetadata.title,
      locale: resolvedLocale,
      images: [fallbackImage()],
    },
    twitter: {
      ...twitterBase(),
      title,
      description,
      images: [siteMetadata.socialShare],
    },
    alternates,
  };
}

// ---------------------------------------------------------------------------
// Podcast show  /podcasts/[slug]
// ---------------------------------------------------------------------------

export async function podcastShowMetadata(
  podcastSlug: string,
  locale?: string,
): Promise<Metadata> {
  const resolvedLocale = resolveLocale(locale);
  const podcast = await fetchPodcastBySlug(podcastSlug);

  if (!podcast) {
    return notFoundMetadata("Podcast Not Found");
  }

  const title = `${podcast.title} | Podcasts`;
  const description = seoDescription(
    podcast.descriptionPlainText,
    `Listen to ${podcast.title} podcast`,
  );
  const { alternates, canonicalUrl } = getPublicPageUrls(
    `/podcasts/${podcastSlug}`,
    resolvedLocale,
  );

  return {
    title,
    description,
    robots: indexableRobots(),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: siteMetadata.title,
      locale: resolvedLocale,
      images: podcast.coverImage ? [podcast.coverImage] : [fallbackImage()],
    },
    twitter: {
      ...twitterBase(),
      title,
      description,
      images: podcast.coverImage
        ? [podcast.coverImage]
        : [siteMetadata.socialShare],
    },
    alternates: {
      ...alternates,
      ...(podcast.rssFeedUrl
        ? {
            types: {
              "application/rss+xml": podcast.rssFeedUrl,
            },
          }
        : {}),
    },
  };
}

// ---------------------------------------------------------------------------
// Podcast episode  /podcasts/[slug]/episodes/[episode-slug]
// ---------------------------------------------------------------------------

export async function podcastEpisodeMetadata(
  podcastSlug: string,
  episodeId: string,
  locale?: string,
): Promise<Metadata> {
  const resolvedLocale = resolveLocale(locale);
  const podcast = await fetchPodcastBySlug(podcastSlug);
  const episode = await fetchEpisodeById(episodeId, podcastSlug);

  if (!podcast || !episode) {
    return notFoundMetadata("Episode Not Found");
  }

  const title = `${episode.title} | ${podcast.title}`;
  const description = seoDescription(
    episode.description,
    `Listen to ${episode.title}`,
  );
  const episodePath = `/podcasts/${podcastSlug}/episodes/${episode.slug}`;
  const { alternates, canonicalUrl } = getPublicPageUrls(
    episodePath,
    resolvedLocale,
  );
  const image = episode.thumbnailUrl || podcast.coverImage || null;

  return {
    title,
    description,
    robots: indexableRobots(),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: siteMetadata.title,
      locale: resolvedLocale,
      images: image ? [image] : [fallbackImage()],
      audio: episode.audioUrl ? [episode.audioUrl] : undefined,
      publishedTime: episode.publishedDate || undefined,
      authors:
        podcast.hosts?.length > 0
          ? podcast.hosts.map((host) => host.name)
          : undefined,
    },
    twitter: {
      ...twitterBase(),
      title,
      description,
      images: image ? [image] : [siteMetadata.socialShare],
    },
    alternates,
  };
}

// ---------------------------------------------------------------------------
// Upgrades listing  /upgrades
// ---------------------------------------------------------------------------

export const UPGRADES_SEO_TITLE =
  "Solana Network Upgrades and Validator Actions";
export const UPGRADES_SEO_DESCRIPTION =
  "Track Solana network upgrades, validator actions, client support, protocol changes, rollout status, and performance improvements across the ecosystem.";

export function upgradesListingMetadata(locale?: string): Metadata {
  const resolvedLocale = resolveLocale(locale);
  const title = UPGRADES_SEO_TITLE;
  const description = UPGRADES_SEO_DESCRIPTION;
  const { alternates, canonicalUrl } = getPublicPageUrls(
    "/upgrades",
    resolvedLocale,
  );

  return {
    title,
    description,
    robots: indexableRobots(),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: siteMetadata.title,
      locale: resolvedLocale,
      images: [fallbackImage()],
    },
    twitter: {
      ...twitterBase(),
      title,
      description,
      images: [siteMetadata.socialShare],
    },
    alternates,
  };
}

// ---------------------------------------------------------------------------
// Upgrade detail  /upgrades/[slug]
// ---------------------------------------------------------------------------

export async function upgradeMetadata(
  slug: string,
  locale?: string,
): Promise<Metadata> {
  const resolvedLocale = resolveLocale(locale);
  const entry = await reader.collections.upgrades.read(slug);

  if (!isPublishedUpgrade(entry)) {
    return notFoundMetadata("Upgrade Not Found");
  }

  const title = String(entry.title);
  const description = seoDescription(entry.description ?? entry.subtitle);
  const { alternates, canonicalUrl } = getPublicPageUrls(
    `/upgrades/${slug}`,
    resolvedLocale,
  );
  const socialImage = createUpgradeSocialImage(slug, title, publicUrl);
  const authorEntry = entry.author
    ? await reader.collections.authors.read(entry.author)
    : null;
  const authorName = String(authorEntry?.name ?? "Solana Foundation");

  return {
    title,
    description,
    robots: indexableRobots(),
    authors: [{ name: authorName }],
    alternates,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: siteMetadata.title,
      locale: resolvedLocale,
      publishedTime: entry.publishedAt ?? undefined,
      authors: [authorName],
      images: [socialImage],
    },
    twitter: {
      ...twitterBase(),
      title,
      description,
      images: [socialImage.url],
    },
  };
}
