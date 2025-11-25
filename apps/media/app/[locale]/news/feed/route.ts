import { Feed } from "feed";
import { NextResponse } from "next/server";
import client from "@/tina/__generated__/client";
import type { TinaMarkdownContent } from "tinacms/dist/rich-text";

export const revalidate = 300; // Revalidate every 5 minutes

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

export async function GET(request: Request) {
  try {
    // Get the base URL from the request
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const newsUrl = `${baseUrl}/news`;

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
      id: newsUrl,
      link: newsUrl,
      language: "en",
      image: `${baseUrl}/favicon.png`,
      favicon: `${baseUrl}/favicon.png`,
      copyright: `© ${new Date().getFullYear()} Solana Foundation. All rights reserved.`,
      updated:
        posts.length > 0 && posts[0]?.node?.date
          ? new Date(posts[0].node.date)
          : new Date(),
    });

    // Add posts to feed
    posts.forEach((postEdge) => {
      const post = postEdge?.node;
      if (!post) return;

      const postUrl = `${newsUrl}/${post._sys.breadcrumbs.join("/")}`;
      const description = markdownToPlainText(post.description) || "";

      // Build feed item
      const feedItem: any = {
        title: post.title || "Untitled",
        id: post.id || postUrl,
        link: postUrl,
        description: description,
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
          : `${baseUrl}${post.heroImage}`;
        feedItem.image = {
          url: imageUrl,
          type: "image/webp", // Default to webp, adjust if needed
        };
      }

      feed.addItem(feedItem);
    });

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
