/**
 * Centralized metadata generation for all pages.
 *
 * This module is deliberately free of React component imports so it
 * can be unit-tested without mocking the entire rendering stack.
 */

import type { Metadata } from "next";
import { config } from "@/lib/config";
import { reader } from "@/lib/reader";
import { fetchCategoryByPath } from "@/lib/category-data";
import { fetchPodcastBySlug, fetchEpisodeById } from "@/lib/podcast-data";
import { isPublishedPost } from "@/lib/keystatic/post-status";

const { publicUrl, siteMetadata, social } = config;

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

function twitterBase() {
  return {
    card: "summary_large_image" as const,
    creator: `@${social.twitter.name}`,
  };
}

// ---------------------------------------------------------------------------
// News listing  /news
// ---------------------------------------------------------------------------

export async function newsListingMetadata(): Promise<Metadata> {
  const canonicalUrl = `${publicUrl}/news`;
  const title = "Solana News";
  const description =
    "Latest news and updates from the Solana ecosystem. Breaking coverage on DeFi, NFTs, developer updates, and Web3 innovation.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: siteMetadata.title,
      images: [fallbackImage()],
    },
    twitter: {
      ...twitterBase(),
      title,
      description,
      images: [siteMetadata.socialShare],
    },
    alternates: { canonical: canonicalUrl },
  };
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
  const canonicalUrl = `${publicUrl}/news/${slug}`;

  return {
    title,
    description: description || undefined,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description: description || undefined,
      url: canonicalUrl,
      type: "article",
      siteName: siteMetadata.title,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
        : undefined,
      publishedTime: post.date || undefined,
      authors: authorName ? [authorName] : undefined,
      section: categoryName,
      tags: tagNames.length > 0 ? tagNames : undefined,
    },
    twitter: {
      ...twitterBase(),
      title,
      description: description || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
    authors: authorName ? [{ name: authorName }] : undefined,
    alternates: { canonical: canonicalUrl },
  };
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
  const canonicalUrl = `${publicUrl}/news/category/${categoryParam}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: siteMetadata.title,
      images: [fallbackImage()],
    },
    twitter: {
      ...twitterBase(),
      title,
      description,
      images: [siteMetadata.socialShare],
    },
    alternates: { canonical: canonicalUrl },
  };
}

// ---------------------------------------------------------------------------
// Podcasts listing  /podcasts
// ---------------------------------------------------------------------------

export function podcastsListingMetadata(): Metadata {
  const title = "Podcasts";
  const description =
    "Explore our collection of podcasts covering blockchain technology, web3, and the Solana ecosystem.";
  const canonicalUrl = `${publicUrl}/podcasts`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: siteMetadata.title,
      images: [fallbackImage()],
    },
    twitter: {
      ...twitterBase(),
      title: `${title} | ${siteMetadata.title}`,
      description,
      images: [siteMetadata.socialShare],
    },
    alternates: { canonical: canonicalUrl },
  };
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
    typeof podcast.description === "string"
      ? podcast.description
      : `Listen to ${podcast.title} podcast`;
  const canonicalUrl = `${publicUrl}/podcasts/${podcastSlug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: siteMetadata.title,
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
    alternates: { canonical: canonicalUrl },
  };
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
  const canonicalUrl = `${publicUrl}/podcasts/${podcastSlug}/episodes/${episodeId}`;
  const image = episode.thumbnailUrl || podcast.coverImage || null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: siteMetadata.title,
      images: image ? [image] : [fallbackImage()],
      audio: episode.audioUrl ? [episode.audioUrl] : undefined,
    },
    twitter: {
      ...twitterBase(),
      title,
      description,
      images: image ? [image] : [siteMetadata.socialShare],
    },
    alternates: { canonical: canonicalUrl },
  };
}
