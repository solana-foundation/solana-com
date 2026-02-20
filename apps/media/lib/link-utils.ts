import { LinkItem, LinkMetadata, LinkType } from "./link-types";
import { ContentDocument } from "./post-types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

// Type for link data from Keystatic
interface LinkData {
  slug: string;
  title: string;
  url: string;
  linkType: string;
  description?: ContentDocument;
  thumbnailImage?: string | null;
  source?: string;
  publishedAt?: string;
  featured?: boolean;
  categories?: string[];
  tags?: string[];
}

/**
 * Transform Keystatic link data to LinkItem
 */
export function transformLink(
  linkData: LinkData,
  resolvedCategories?: string[],
  resolvedTags?: string[]
): LinkItem {
  // Format date in UTC to avoid timezone conversion issues
  const formattedDate = linkData.publishedAt
    ? dayjs.utc(linkData.publishedAt).format("DD MMM YYYY")
    : "";

  return {
    id: linkData.slug,
    title: linkData.title,
    url: linkData.url,
    linkType: (linkData.linkType as LinkType) || "other",
    description: linkData.description,
    thumbnailImage: linkData.thumbnailImage,
    source: linkData.source || getSourceFromUrl(linkData.url),
    publishedAt: formattedDate,
    categories: resolvedCategories || [],
    tags: resolvedTags || [],
    featured: linkData.featured || false,
    cursor: linkData.slug,
  };
}

/**
 * Check if a link needs metadata enrichment
 */
function needsMetadataEnrichment(link: LinkItem): boolean {
  if (!link.description) return true;

  const desc = link.description as ContentDocument | string;
  const hasDescription =
    typeof desc === "string"
      ? desc.trim().length > 0
      : Array.isArray(desc) && desc.length > 0;

  return !link.thumbnailImage || !hasDescription;
}

/**
 * Enrich a single link with fetched metadata if missing
 */
async function enrichLinkWithMetadata(link: LinkItem): Promise<LinkItem> {
  if (!needsMetadataEnrichment(link)) {
    return link;
  }

  try {
    const metadata = await fetchLinkMetadata(link.url);

    const desc = link.description as ContentDocument | string | undefined;
    const hasDescription = desc
      ? typeof desc === "string"
        ? desc.trim().length > 0
        : Array.isArray(desc) && desc.length > 0
      : false;

    let newDescription: ContentDocument | undefined = link.description;
    if (!hasDescription && metadata.description) {
      // Create a simple content document structure
      newDescription = [
        {
          type: "paragraph",
          children: [{ type: "text", text: metadata.description }],
        },
      ] as unknown as ContentDocument;
    }

    return {
      ...link,
      thumbnailImage: link.thumbnailImage || metadata.image || null,
      description: newDescription,
      source: link.source || metadata.siteName || getSourceFromUrl(link.url),
    };
  } catch (error) {
    console.error(`Failed to enrich link ${link.url}:`, error);
    return link;
  }
}

/**
 * Enrich multiple links with fetched metadata (parallel)
 */
export async function enrichLinksWithMetadata(
  links: LinkItem[]
): Promise<LinkItem[]> {
  const enrichedLinks = await Promise.all(
    links.map((link) => enrichLinkWithMetadata(link))
  );
  return enrichedLinks;
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
 * Fetch Open Graph metadata from a URL
 * This can be used to auto-populate link fields
 */
export async function fetchLinkMetadata(url: string): Promise<LinkMetadata> {
  try {
    // Special handling for YouTube - use direct thumbnail URL
    const youtubeId = extractYouTubeVideoId(url);
    if (youtubeId) {
      // YouTube thumbnails are predictable
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
    metadata.title = extractMeta("og:title");
    metadata.description = extractMeta("og:description");
    metadata.image = extractMeta("og:image");
    metadata.siteName = extractMeta("og:site_name");
    metadata.type = extractMeta("og:type");

    // Fallback to Twitter Card tags
    if (!metadata.image) {
      metadata.image = extractMeta("twitter:image", "name");
    }
    if (!metadata.description) {
      metadata.description = extractMeta("twitter:description", "name");
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
      metadata.description = extractMeta("description", "name");
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
  } catch (error) {
    console.error("Failed to fetch link metadata:", error);
    return {};
  }
}

/**
 * Detect link type from URL
 */
export function detectLinkType(url: string): LinkType {
  const lowerUrl = url.toLowerCase();

  if (
    lowerUrl.includes("twitter.com") ||
    lowerUrl.includes("x.com") ||
    lowerUrl.includes("/status/")
  ) {
    return "tweet";
  }

  if (
    lowerUrl.includes("youtube.com") ||
    lowerUrl.includes("youtu.be") ||
    lowerUrl.includes("vimeo.com")
  ) {
    return "video";
  }

  if (lowerUrl.includes("github.com")) {
    return "github";
  }

  // Common article/blog platforms
  if (
    lowerUrl.includes("medium.com") ||
    lowerUrl.includes("substack.com") ||
    lowerUrl.includes("blog.") ||
    lowerUrl.includes("/blog/") ||
    lowerUrl.includes("/article/") ||
    lowerUrl.includes("/news/")
  ) {
    return "article";
  }

  return "other";
}

/**
 * Get source name from URL
 */
export function getSourceFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace("www.", "");

    // Map common hostnames to friendly names
    const sourceMap: Record<string, string> = {
      "twitter.com": "Twitter",
      "x.com": "X",
      "youtube.com": "YouTube",
      "youtu.be": "YouTube",
      "github.com": "GitHub",
      "medium.com": "Medium",
      "substack.com": "Substack",
      "reddit.com": "Reddit",
      "linkedin.com": "LinkedIn",
      "facebook.com": "Facebook",
    };

    return sourceMap[hostname] || hostname;
  } catch {
    return "";
  }
}
