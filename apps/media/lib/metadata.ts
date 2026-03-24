/**
 * Centralized metadata generation for all pages.
 *
 * This module is deliberately free of React component imports so it
 * can be unit-tested without mocking the entire rendering stack.
 */

import type { Metadata } from "next";
import type { SeoMetadataInput } from "@workspace/seo";
import { config } from "@/lib/config";
import { reader } from "@/lib/reader";
import { fetchCategoryByPath } from "@/lib/category-data";
import { fetchPodcastBySlug, fetchEpisodeById } from "@/lib/podcast-data";
import { isPublishedPost } from "@/lib/keystatic/post-status";
import { isPublishedReport } from "@/lib/keystatic/report-status";
import { mediaSeo } from "@/lib/seo";

const { siteMetadata } = config;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fallbackImage() {
  return {
    url: siteMetadata.socialShare,
    width: 1200,
    height: 630,
    alt: siteMetadata.title,
  };
}

function listingMetadata({
  path,
  title,
  description,
  image = fallbackImage(),
}: {
  path: string;
  title: string;
  description: string;
  image?: string | ReturnType<typeof fallbackImage>;
}) {
  return mediaSeo.getPageMetadata({
    path,
    title,
    description,
    image,
  });
}

function contentMetadata({
  path,
  title,
  description,
  image,
  type,
  authors,
  openGraph,
}: {
  path: string;
  title: string;
  description?: string;
  image?: string | ReturnType<typeof fallbackImage>;
  type: "website" | "article";
  authors?: Metadata["authors"];
  openGraph?: SeoMetadataInput["openGraph"];
}) {
  return mediaSeo.getPageMetadata({
    path,
    title,
    description,
    image,
    type,
    authors,
    openGraph,
  });
}

// ---------------------------------------------------------------------------
// News listing  /news
// ---------------------------------------------------------------------------

export async function newsListingMetadata(): Promise<Metadata> {
  const title = "Solana News";
  const description =
    "Latest news and updates from the Solana ecosystem. Breaking coverage on DeFi, NFTs, developer updates, and Web3 innovation.";

  return listingMetadata({ path: "/news", title, description });
}

// ---------------------------------------------------------------------------
// News post  /news/[slug]
// ---------------------------------------------------------------------------

export async function newsPostMetadata(slug: string): Promise<Metadata> {
  const post = await reader.collections.posts.read(slug);

  if (!isPublishedPost(post)) {
    return { title: "Post Not Found", description: "" };
  }

  let authorName: string | undefined;
  if (post.author) {
    const author = await reader.collections.authors.read(post.author);
    if (author) authorName = String(author.name);
  }

  let categoryName: string | undefined;
  if (post.category) {
    const category = await reader.collections.categories.read(post.category);
    if (category) categoryName = String(category.name);
  }

  const tagNames: string[] = [];
  if (post.tags && Array.isArray(post.tags)) {
    for (const tagRef of post.tags) {
      if (tagRef) {
        const tag = await reader.collections.tags.read(tagRef);
        if (tag) tagNames.push(String(tag.name));
      }
    }
  }

  const title = String(post.title);
  const description = post.description
    ? String(post.description).trim()
    : undefined;
  const ogImage = post.heroImage || siteMetadata.socialShare;

  return contentMetadata({
    path: `/news/${slug}`,
    title,
    description,
    image: ogImage,
    type: "article",
    authors: authorName ? [{ name: authorName }] : undefined,
    openGraph: {
      publishedTime: post.publishedAt || undefined,
      authors: authorName ? [authorName] : undefined,
      section: categoryName,
      tags: tagNames.length > 0 ? tagNames : undefined,
    },
  });
}

// ---------------------------------------------------------------------------
// Category listing  /news/category/[category]
// ---------------------------------------------------------------------------

export async function categoryListingMetadata(
  categoryParam: string
): Promise<Metadata> {
  let categoryName: string | null = null;
  try {
    const { category } = await fetchCategoryByPath(categoryParam);
    categoryName = category?.name || null;
  } catch {
    return { title: "Category Not Found" };
  }

  if (!categoryName) {
    return { title: "Category Not Found" };
  }

  const title = `${categoryName} News`;
  const description = `Latest ${categoryName} news and updates from the Solana ecosystem.`;
  return listingMetadata({
    path: `/news/category/${categoryParam}`,
    title,
    description,
  });
}

// ---------------------------------------------------------------------------
// Reports listing  /reports
// ---------------------------------------------------------------------------

export function reportsListingMetadata(): Metadata {
  const title = "Solana Reports";
  const description =
    "Research, market analysis, and ecosystem reports from the Solana Foundation.";

  return listingMetadata({ path: "/reports", title, description });
}

// ---------------------------------------------------------------------------
// Report detail  /reports/[slug]
// ---------------------------------------------------------------------------

export async function reportMetadata(slug: string): Promise<Metadata> {
  const report = await reader.collections.switchbacks.read(slug);

  if (!isPublishedReport(report)) {
    return { title: "Report Not Found", description: "" };
  }

  const title = String(report.headline || report.title);
  const description = report.description
    ? String(report.description).trim()
    : undefined;
  const ogImage = report.image?.src || siteMetadata.socialShare;

  const categoryNames: string[] = [];
  if (report.categories) {
    for (const categoryRef of report.categories) {
      if (!categoryRef?.category) continue;

      const category = await reader.collections.categories.read(
        String(categoryRef.category)
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

  return contentMetadata({
    path: `/reports/${slug}`,
    title,
    description,
    image: ogImage,
    type: "article",
    openGraph: {
      publishedTime: report.publishedAt || undefined,
      section: categoryNames[0],
      tags: tagNames.length > 0 ? tagNames : undefined,
    },
  });
}

// ---------------------------------------------------------------------------
// Podcasts listing  /podcasts
// ---------------------------------------------------------------------------

export function podcastsListingMetadata(): Metadata {
  const title = "Podcasts";
  const description =
    "Explore our collection of podcasts covering blockchain technology, web3, and the Solana ecosystem.";

  return listingMetadata({ path: "/podcasts", title, description });
}

// ---------------------------------------------------------------------------
// Podcast show  /podcasts/[slug]
// ---------------------------------------------------------------------------

export async function podcastShowMetadata(
  podcastSlug: string
): Promise<Metadata> {
  const podcast = await fetchPodcastBySlug(podcastSlug);

  if (!podcast) {
    return { title: "Podcast Not Found" };
  }

  const title = `${podcast.title} | Podcasts`;
  const description =
    podcast.descriptionPlainText || `Listen to ${podcast.title} podcast`;

  return contentMetadata({
    path: `/podcasts/${podcastSlug}`,
    title,
    description,
    image: podcast.coverImage || fallbackImage(),
    type: "website",
  });
}

// ---------------------------------------------------------------------------
// Podcast episode  /podcasts/[slug]/episodes/[id]
// ---------------------------------------------------------------------------

export async function podcastEpisodeMetadata(
  podcastSlug: string,
  episodeId: string
): Promise<Metadata> {
  const podcast = await fetchPodcastBySlug(podcastSlug);
  const episode = await fetchEpisodeById(episodeId, podcastSlug);

  if (!podcast || !episode) {
    return { title: "Episode Not Found" };
  }

  const title = `${episode.title} | ${podcast.title}`;
  const description = episode.description || `Listen to ${episode.title}`;
  const image = episode.thumbnailUrl || podcast.coverImage || null;

  return contentMetadata({
    path: `/podcasts/${podcastSlug}/episodes/${episodeId}`,
    title,
    description,
    image: image || fallbackImage(),
    type: "article",
    openGraph: {
      audio: episode.audioUrl ? [episode.audioUrl] : undefined,
    },
  });
}
