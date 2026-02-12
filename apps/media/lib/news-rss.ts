import { Feed } from "feed";
import { NextResponse } from "next/server";
import client from "@/tina/__generated__/client";
import type { TinaMarkdownContent } from "tinacms/dist/rich-text";

const BASE_URL = "https://solana.com";
const NEWS_URL = `${BASE_URL}/news`;
const RSS_CANONICAL_PATH = "/news/rss.xml";

export const NEWS_RSS_CANONICAL_URL = `${BASE_URL}${RSS_CANONICAL_PATH}`;

const RSS_CONTENT_TYPE = "application/rss+xml; charset=utf-8";
const RSS_CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=600";

// Helper function to convert TinaMarkdown content to plain text
function markdownToPlainText(
  content: TinaMarkdownContent | null | undefined
): string {
  if (!content) return "";

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item && typeof item === "object") {
          // Handle various markdown node types
          if (item.type === "p" && item.children) {
            return markdownToPlainText(item.children);
          }
          if (item.type === "text" && item.text) {
            return item.text;
          }
          if (item.children) {
            return markdownToPlainText(item.children);
          }
        }
        return "";
      })
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  return "";
}

// Helper function to get image MIME type from file extension
function getImageMimeType(imageUrl: string): string {
  const extension = imageUrl.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    webp: "image/webp",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    svg: "image/svg+xml",
    avif: "image/avif",
    ico: "image/x-icon",
  };
  return mimeTypes[extension || ""] || "image/webp"; // Default to webp if unknown
}

async function buildNewsFeed(feedUrl: string) {
  // Fetch posts (limit to 20 most recent)
  const postsResponse = await client.queries.postConnection({
    last: 20,
    sort: "date",
  });

  const posts = postsResponse.data.postConnection.edges || [];

  // Create feed instance
  const feed = new Feed({
    title: "Solana News Feed",
    description: "Stay up to date with the latest Solana News",
    id: feedUrl,
    link: NEWS_URL,
    language: "en",
    image: `${BASE_URL}/favicon.png`,
    favicon: `${BASE_URL}/favicon.png`,
    copyright: `© ${new Date().getFullYear()} Solana Foundation. All rights reserved.`,
    updated:
      posts.length > 0 && posts[0]?.node?.date
        ? new Date(posts[0].node.date)
        : new Date(),
    feedLinks: {
      rss: feedUrl,
    },
  });

  // Add posts to feed
  posts.forEach((postEdge) => {
    const post = postEdge?.node;
    if (!post) return;

    const postUrl = `${NEWS_URL}/${post._sys.breadcrumbs.join("/")}`;
    const description = markdownToPlainText(post.description) || "";

    // Build feed item
    const feedItem: {
      title: string;
      id: string;
      link: string;
      description: string;
      date: Date;
      author?: { name: string; link?: string }[];
      image?: { url: string; type: string };
    } = {
      title: post.title || "Untitled",
      id: post.id || postUrl,
      link: postUrl,
      description,
      date: post.date ? new Date(post.date) : new Date(),
    };

    // Add author if available
    if (post.author?.name) {
      feedItem.author = [
        {
          name: post.author.name,
          ...(post.author.avatar && { link: post.author.avatar }),
        },
      ];
    }

    // Add image if available
    if (post.heroImage) {
      const imageUrl = post.heroImage.startsWith("http")
        ? post.heroImage
        : `${BASE_URL}${post.heroImage}`;
      feedItem.image = {
        url: imageUrl,
        type: getImageMimeType(imageUrl),
      };
    }

    feed.addItem(feedItem);
  });

  return feed;
}

export async function getNewsRssResponse(
  feedUrl: string = NEWS_RSS_CANONICAL_URL
) {
  try {
    const feed = await buildNewsFeed(feedUrl);

    // Generate RSS XML
    const rss = feed.rss2();

    // Return RSS feed with proper content type
    return new NextResponse(rss, {
      status: 200,
      headers: {
        "Content-Type": RSS_CONTENT_TYPE,
        "Cache-Control": RSS_CACHE_CONTROL,
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new NextResponse("Error generating RSS feed", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
