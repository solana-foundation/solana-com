import { Feed } from "feed";
import { NextResponse } from "next/server";
import { reader } from "@/lib/reader";
import { contentDocumentToPlainText } from "@/lib/content-renderer";

const BASE_URL = "https://solana.com";
const NEWS_URL = `${BASE_URL}/news`;
const RSS_CANONICAL_PATH = "/news/rss.xml";

export const NEWS_RSS_CANONICAL_URL = `${BASE_URL}${RSS_CANONICAL_PATH}`;

const RSS_CONTENT_TYPE = "application/rss+xml; charset=utf-8";
const RSS_CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=600";

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
  return mimeTypes[extension || ""] || "image/webp";
}

async function buildNewsFeed(feedUrl: string) {
  const allSlugs = await reader.collections.posts.list();

  const postsWithDates: Array<{
    slug: string;
    date: Date | null;
    post: Awaited<ReturnType<typeof reader.collections.posts.read>>;
  }> = [];

  for (const slug of allSlugs) {
    const post = await reader.collections.posts.read(slug);
    if (post) {
      postsWithDates.push({
        slug,
        date: post.date ? new Date(post.date) : null,
        post,
      });
    }
  }

  // Sort by date descending and take top 20
  postsWithDates.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.getTime() - a.date.getTime();
  });

  const posts = postsWithDates.slice(0, 20);

  const feed = new Feed({
    title: "Solana News Feed",
    description: "Stay up to date with the latest Solana News",
    id: feedUrl,
    link: NEWS_URL,
    language: "en",
    image: `${BASE_URL}/favicon.png`,
    favicon: `${BASE_URL}/favicon.png`,
    copyright: `© ${new Date().getFullYear()} Solana Foundation. All rights reserved.`,
    updated: posts.length > 0 && posts[0]?.date ? posts[0].date : new Date(),
    feedLinks: {
      rss: feedUrl,
    },
  });

  for (const postEntry of posts) {
    const post = postEntry?.post;
    if (!post) continue;

    const postUrl = `${NEWS_URL}/${postEntry.slug}`;
    const description = contentDocumentToPlainText(post.description) || "";

    // Resolve author
    let authorName: string | null = null;
    let authorAvatar: string | null = null;
    if (post.author) {
      const author = await reader.collections.authors.read(post.author);
      if (author) {
        authorName = String(author.name);
        authorAvatar = author.avatar || null;
      }
    }

    const feedItem: Parameters<typeof feed.addItem>[0] = {
      title: String(post.title) || "Untitled",
      id: postEntry.slug,
      link: postUrl,
      description,
      date: postEntry.date || new Date(),
    };

    if (authorName) {
      feedItem.author = [
        {
          name: authorName,
          ...(authorAvatar && { link: authorAvatar }),
        },
      ];
    }

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
  }

  return feed;
}

export async function getNewsRssResponse(
  feedUrl: string = NEWS_RSS_CANONICAL_URL
) {
  try {
    const feed = await buildNewsFeed(feedUrl);
    const rss = feed.rss2();

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
