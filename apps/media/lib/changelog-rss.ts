import { Feed } from "feed";
import { NextResponse } from "next/server";
import faviconPng from "@solana-com/ui-chrome/assets/favicon.png";
import { CHANGELOG_CATEGORY, CHANGELOG_PAGE_SIZE } from "@/lib/changelog";
import { contentDocumentToPlainText } from "@/lib/content-renderer";
import { parsePublishedAt } from "@/lib/keystatic/publishing";
import { fetchLatestPosts } from "@/lib/post-data";

const BASE_URL = "https://solana.com";
const CHANGELOG_URL = `${BASE_URL}/changelog`;
const RSS_CONTENT_TYPE = "application/rss+xml; charset=utf-8";
const RSS_CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=600";

export const CHANGELOG_RSS_CANONICAL_URL = `${CHANGELOG_URL}/rss.xml`;

function getImageMimeType(imageUrl: string): string {
  const extension = imageUrl.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    avif: "image/avif",
    gif: "image/gif",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    svg: "image/svg+xml",
    webp: "image/webp",
  };

  return mimeTypes[extension || ""] || "image/webp";
}

export async function buildChangelogFeed(
  feedUrl: string = CHANGELOG_RSS_CANONICAL_URL,
) {
  const { posts } = await fetchLatestPosts({
    category: CHANGELOG_CATEGORY,
    limit: Math.max(20, CHANGELOG_PAGE_SIZE),
  });
  const latestPublishedAt = posts[0]?.publishedAt
    ? parsePublishedAt(posts[0].publishedAt)
    : null;

  const feed = new Feed({
    title: "Solana Changelog",
    description:
      "Weekly Solana engineering releases, protocol updates, and developer tooling news.",
    id: feedUrl,
    link: CHANGELOG_URL,
    language: "en",
    image: `${BASE_URL}${faviconPng.src}`,
    favicon: `${BASE_URL}${faviconPng.src}`,
    copyright: `© ${new Date().getFullYear()} Solana Foundation. All rights reserved.`,
    updated: latestPublishedAt ?? new Date(),
    feedLinks: {
      rss: feedUrl,
    },
  });

  for (const post of posts) {
    const postUrl = new URL(post.url, BASE_URL).toString();
    const publishedAt = parsePublishedAt(post.publishedAt) ?? new Date();
    const imageUrl = post.heroImage
      ? new URL(post.heroImage, BASE_URL).toString()
      : null;

    feed.addItem({
      title: post.title,
      id: post.id,
      link: postUrl,
      description: contentDocumentToPlainText(post.description),
      date: publishedAt,
      author: [{ name: post.author.name }],
      ...(imageUrl && {
        image: {
          url: imageUrl,
          type: getImageMimeType(imageUrl),
        },
      }),
    });
  }

  return feed;
}

export async function getChangelogRssResponse(
  feedUrl: string = CHANGELOG_RSS_CANONICAL_URL,
) {
  try {
    const feed = await buildChangelogFeed(feedUrl);

    return new NextResponse(feed.rss2(), {
      status: 200,
      headers: {
        "Content-Type": RSS_CONTENT_TYPE,
        "Cache-Control": RSS_CACHE_CONTROL,
      },
    });
  } catch (error) {
    console.error("Error generating changelog RSS feed:", error);
    return new NextResponse("Error generating changelog RSS feed", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
