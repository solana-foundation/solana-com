import { Feed } from "feed";
import { NextResponse } from "next/server";
import { reader } from "@/lib/reader";
import { MarkdocDocument } from "@/lib/post-types";

export const revalidate = 300;

// Helper function to convert Markdoc content to plain text
function markdocToPlainText(
  content: MarkdocDocument | null | undefined
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
          const node = item as Record<string, unknown>;
          // Handle various markdoc node types
          if (node.type === "paragraph" && node.children) {
            return markdocToPlainText(node.children as MarkdocDocument);
          }
          if (node.type === "text" && node.text) {
            return node.text;
          }
          if (node.children) {
            return markdocToPlainText(node.children as MarkdocDocument);
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

export async function GET() {
  try {
    // Use solana.com as the base URL for feed links
    const baseUrl = `https://solana.com`;
    const newsUrl = `${baseUrl}/news`;

    // Fetch posts (limit to 20 most recent)
    const allSlugs = await reader.collections.posts.list();

    // Fetch all posts to sort by date
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

    // Create feed instance
    const feed = new Feed({
      title: "Solana News Feed",
      description: "Stay up to date with the latest Solana News",
      id: newsUrl,
      link: newsUrl,
      language: "en",
      image: `${baseUrl}/favicon.png`,
      favicon: `${baseUrl}/favicon.png`,
      copyright: `© ${new Date().getFullYear()} Solana Foundation. All rights reserved.`,
      updated: posts.length > 0 && posts[0]?.date ? posts[0].date : new Date(),
    });

    // Add posts to feed
    for (const postEntry of posts) {
      const post = postEntry?.post;
      if (!post) continue;

      const postUrl = `${newsUrl}/${postEntry.slug}`;
      const description = markdocToPlainText(post.description) || "";

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

      // Build feed item
      const feedItem: Parameters<typeof feed.addItem>[0] = {
        title: String(post.title) || "Untitled",
        id: postEntry.slug,
        link: postUrl,
        description: description,
        date: postEntry.date || new Date(),
      };

      // Add author if available
      if (authorName) {
        feedItem.author = [
          {
            name: authorName,
            ...(authorAvatar && { link: authorAvatar }),
          },
        ];
      }

      // Add image if available
      if (post.heroImage) {
        const imageUrl = post.heroImage.startsWith("http")
          ? post.heroImage
          : `${baseUrl}${post.heroImage}`;
        feedItem.image = {
          url: imageUrl,
          type: getImageMimeType(imageUrl),
        };
      }

      feed.addItem(feedItem);
    }

    // Generate RSS XML
    const rss = feed.rss2();

    // Return RSS feed with proper content type
    return new NextResponse(rss, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new NextResponse("Error generating RSS feed", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
