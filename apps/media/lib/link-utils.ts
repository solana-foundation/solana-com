import { LinkItem, LinkMetadata, LinkType } from "./link-types";
import { format } from "date-fns";

// Type for the TinaCMS link connection edge
interface LinkConnectionEdge {
  cursor?: string;
  node?: {
    id: string;
    title: string;
    url: string;
    linkType: string;
    description?: any;
    thumbnailImage?: string | null;
    source?: string;
    publishedAt?: string;
    featured?: boolean;
    categories?: Array<{ category?: { name?: string } }>;
    tags?: Array<{ tag?: { name?: string } }>;
    _sys?: { breadcrumbs?: string[] };
  };
}

/**
 * Transform TinaCMS link data to LinkItem
 */
export function transformLink(linkData: LinkConnectionEdge): LinkItem | null {
  const link = linkData?.node;
  if (!link) return null;

  const date = link.publishedAt ? new Date(link.publishedAt) : null;
  const formattedDate =
    date && !Number.isNaN(date.getTime()) ? format(date, "dd MMM yyyy") : "";

  return {
    id: link.id,
    title: link.title,
    url: link.url,
    linkType: (link.linkType as LinkType) || "other",
    description: link.description,
    thumbnailImage: link.thumbnailImage,
    source: link.source || getSourceFromUrl(link.url),
    publishedAt: formattedDate,
    categories:
      link.categories
        ?.map((category) => category?.category?.name)
        .filter((name): name is string => name !== undefined) || [],
    tags:
      link.tags
        ?.map((tag) => tag?.tag?.name)
        .filter((name): name is string => name !== undefined) || [],
    featured: link.featured || false,
    cursor: linkData.cursor,
  };
}

/**
 * Check if a link needs metadata enrichment
 */
function needsMetadataEnrichment(link: LinkItem): boolean {
  const hasDescription =
    link.description &&
    (typeof link.description === "string"
      ? link.description.trim().length > 0
      : link.description.children?.length > 0);

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

    const hasDescription =
      link.description &&
      (typeof link.description === "string"
        ? link.description.trim().length > 0
        : link.description.children?.length > 0);

    return {
      ...link,
      thumbnailImage: link.thumbnailImage || metadata.image || null,
      description: hasDescription
        ? link.description
        : metadata.description
          ? {
              type: "root",
              children: [
                {
                  type: "p",
                  children: [{ type: "text", text: metadata.description }],
                },
              ],
            }
          : link.description,
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
 * Fetch Open Graph metadata from a URL
 * This can be used to auto-populate link fields
 */
export async function fetchLinkMetadata(url: string): Promise<LinkMetadata> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SolanaBot/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();
    const metadata: LinkMetadata = {};

    // Extract Open Graph tags
    const ogTitleMatch = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i
    );
    if (ogTitleMatch) metadata.title = ogTitleMatch[1];

    const ogDescMatch = html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i
    );
    if (ogDescMatch) metadata.description = ogDescMatch[1];

    const ogImageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    );
    if (ogImageMatch) metadata.image = ogImageMatch[1];

    const ogSiteNameMatch = html.match(
      /<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i
    );
    if (ogSiteNameMatch) metadata.siteName = ogSiteNameMatch[1];

    const ogTypeMatch = html.match(
      /<meta[^>]*property=["']og:type["'][^>]*content=["']([^"']+)["']/i
    );
    if (ogTypeMatch) metadata.type = ogTypeMatch[1];

    // Fallback to standard meta tags if OG tags not found
    if (!metadata.title) {
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch) metadata.title = titleMatch[1];
    }

    if (!metadata.description) {
      const descMatch = html.match(
        /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
      );
      if (descMatch) metadata.description = descMatch[1];
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
