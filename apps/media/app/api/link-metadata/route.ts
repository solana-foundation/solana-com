import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache for 1 hour

const requestSchema = z.object({
  url: z.url(),
});

interface LinkMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  type?: string;
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Extract GitHub repo path from URL
 */
function extractGitHubRepo(url: string): string | null {
  const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
  return match ? match[1] : null;
}

/**
 * Fetch metadata for a given URL
 */
async function fetchMetadataForUrl(url: string): Promise<LinkMetadata> {
  // Special handling for YouTube - use direct thumbnail URL
  const youtubeId = extractYouTubeVideoId(url);
  if (youtubeId) {
    const metadata: LinkMetadata = {
      image: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
      siteName: "YouTube",
    };

    // Try to fetch page for title/description
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const html = await response.text();
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch) {
          metadata.title = titleMatch[1]
            .replace(" - YouTube", "")
            .replace(/&amp;/g, "&")
            .replace(/&#39;/g, "'");
        }
        const descMatch = html.match(
          /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
        );
        if (descMatch) {
          metadata.description = descMatch[1]
            .replace(/&amp;/g, "&")
            .replace(/&#39;/g, "'");
        }
      }
    } catch {
      // Ignore fetch errors for YouTube metadata, we have the thumbnail
    }

    return metadata;
  }

  // Special handling for GitHub - use OpenGraph image API
  const githubRepo = extractGitHubRepo(url);
  if (githubRepo) {
    return {
      image: `https://opengraph.githubassets.com/1/${githubRepo}`,
      siteName: "GitHub",
    };
  }

  // Generic fetch with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: controller.signal,
  });
  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }

  const html = await response.text();
  const metadata: LinkMetadata = {};

  // Helper to extract meta content (handles both property/content orders)
  const extractMeta = (
    property: string,
    attrName: string = "property"
  ): string | null => {
    // Try property="..." content="..."
    let match = html.match(
      new RegExp(
        `<meta[^>]*${attrName}=["']${property}["'][^>]*content=["']([^"']+)["']`,
        "i"
      )
    );
    if (match) return match[1];

    // Try content="..." property="..."
    match = html.match(
      new RegExp(
        `<meta[^>]*content=["']([^"']+)["'][^>]*${attrName}=["']${property}["']`,
        "i"
      )
    );
    return match ? match[1] : null;
  };

  // Extract Open Graph tags
  metadata.title = extractMeta("og:title") ?? undefined;
  metadata.description = extractMeta("og:description") ?? undefined;
  metadata.image = extractMeta("og:image") ?? undefined;
  metadata.siteName = extractMeta("og:site_name") ?? undefined;
  metadata.type = extractMeta("og:type") ?? undefined;

  // Fallback to Twitter Card tags
  if (!metadata.image) {
    metadata.image = extractMeta("twitter:image", "name") ?? undefined;
  }
  if (!metadata.description) {
    metadata.description =
      extractMeta("twitter:description", "name") ?? undefined;
  }

  // Fallback to standard meta tags if OG tags not found
  if (!metadata.title) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      metadata.title = titleMatch[1]
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'");
    }
  }

  if (!metadata.description) {
    metadata.description = extractMeta("description", "name") ?? undefined;
  }

  // Decode HTML entities
  if (metadata.description) {
    metadata.description = metadata.description
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }

  return metadata;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    const parsed = requestSchema.safeParse({ url });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid URL parameter" },
        { status: 400 }
      );
    }

    const metadata = await fetchMetadataForUrl(parsed.data.url);

    return NextResponse.json(metadata, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Failed to fetch link metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}
