import { reader } from "../reader";
import { LinkItem } from "../link-types";
import { format } from "date-fns";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export interface LatestLinksParams {
  limit?: number;
  cursor?: string;
  category?: string;
}

export interface LatestLinksResponse {
  links: LinkItem[];
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor?: string;
    startCursor?: string;
  };
}

/**
 * Transform Keystatic link entry to LinkItem
 */
async function transformLink(
  slug: string,
  link: Awaited<ReturnType<typeof reader.collections.links.read>>
): Promise<LinkItem | null> {
  if (!link) return null;

  const date = link.publishedAt ? new Date(link.publishedAt) : null;
  const formattedDate =
    date && !Number.isNaN(date.getTime()) ? format(date, "dd MMM yyyy") : "";

  // Resolve category names
  const categoryNames: string[] = [];
  if (link.categories) {
    for (const catRef of link.categories) {
      if (catRef.category) {
        const catData = await reader.collections.categories.read(
          catRef.category
        );
        if (catData?.name) {
          categoryNames.push(String(catData.name));
        }
      }
    }
  }

  // Resolve tag names
  const tagNames: string[] = [];
  if (link.tags) {
    for (const tagRef of link.tags) {
      if (tagRef.tag) {
        const tagData = await reader.collections.tags.read(tagRef.tag);
        if (tagData?.name) {
          tagNames.push(String(tagData.name));
        }
      }
    }
  }

  return {
    id: slug,
    title: String(link.title),
    url: link.url,
    linkType: link.linkType as LinkItem["linkType"],
    description: link.description as any, // Content document type
    thumbnailImage: link.thumbnailImage || null,
    source: link.source || null,
    publishedAt: formattedDate,
    categories: categoryNames,
    tags: tagNames,
    featured: link.featured || false,
    cursor: slug,
  };
}

/**
 * Fetch latest links from Keystatic
 */
export const fetchLatestLinks = async (
  params: LatestLinksParams
): Promise<LatestLinksResponse> => {
  try {
    const allSlugs = await reader.collections.links.list();
    const limit = params.limit ?? 10;

    // Fetch all links to sort by date
    const linksWithDates: Array<{
      slug: string;
      date: Date | null;
      link: Awaited<ReturnType<typeof reader.collections.links.read>>;
    }> = [];

    for (const slug of allSlugs) {
      const link = await reader.collections.links.read(slug);
      if (link) {
        linksWithDates.push({
          slug,
          date: link.publishedAt ? new Date(link.publishedAt) : null,
          link,
        });
      }
    }

    // Sort by date descending
    linksWithDates.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return dayjs.utc(b.date).valueOf() - dayjs.utc(a.date).valueOf();
    });

    // Filter by category if specified
    let filteredLinks = linksWithDates;
    if (params.category) {
      filteredLinks = [];
      for (const item of linksWithDates) {
        if (item.link?.categories) {
          for (const catRef of item.link.categories) {
            if (catRef.category) {
              const catData = await reader.collections.categories.read(
                catRef.category
              );
              if (String(catData?.name) === params.category) {
                filteredLinks.push(item);
                break;
              }
            }
          }
        }
      }
    }

    // Apply cursor-based pagination
    let startIndex = 0;
    if (params.cursor) {
      const cursorIndex = filteredLinks.findIndex(
        (l) => l.slug === params.cursor
      );
      if (cursorIndex >= 0) {
        startIndex = cursorIndex + 1;
      }
    }

    const paginatedLinks = filteredLinks.slice(startIndex, startIndex + limit);

    // Transform links
    const links: LinkItem[] = [];
    for (const item of paginatedLinks) {
      const transformed = await transformLink(item.slug, item.link);
      if (transformed) {
        links.push(transformed);
      }
    }

    return {
      links,
      pageInfo: {
        hasNextPage: startIndex + limit < filteredLinks.length,
        hasPreviousPage: startIndex > 0,
        endCursor: paginatedLinks[paginatedLinks.length - 1]?.slug,
        startCursor: paginatedLinks[0]?.slug,
      },
    };
  } catch (error) {
    console.error("Failed to fetch latest links from Keystatic:", error);
    return { links: [] };
  }
};

export interface FeaturedLinksResponse {
  links: LinkItem[];
}

/**
 * Fetch featured links from Keystatic
 */
export const fetchFeaturedLinks = async (
  limit: number = 5
): Promise<FeaturedLinksResponse> => {
  try {
    const allSlugs = await reader.collections.links.list();

    // Fetch featured links
    const featuredLinks: Array<{
      slug: string;
      date: Date | null;
      link: Awaited<ReturnType<typeof reader.collections.links.read>>;
    }> = [];

    for (const slug of allSlugs) {
      const link = await reader.collections.links.read(slug);
      if (link?.featured) {
        featuredLinks.push({
          slug,
          date: link.publishedAt ? new Date(link.publishedAt) : null,
          link,
        });
      }
    }

    // Sort by date descending
    featuredLinks.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return dayjs.utc(b.date).valueOf() - dayjs.utc(a.date).valueOf();
    });

    // Transform links
    const links: LinkItem[] = [];
    for (const item of featuredLinks.slice(0, limit)) {
      const transformed = await transformLink(item.slug, item.link);
      if (transformed) {
        links.push(transformed);
      }
    }

    return { links };
  } catch (error) {
    console.error("Failed to fetch featured links from Keystatic:", error);
    return { links: [] };
  }
};

/**
 * Fetch links by tag
 */
export const fetchLinksByTag = async (
  tagName: string,
  limit: number = 10
): Promise<LatestLinksResponse> => {
  try {
    const allSlugs = await reader.collections.links.list();

    // Find links with matching tag
    const matchingLinks: Array<{
      slug: string;
      date: Date | null;
      link: Awaited<ReturnType<typeof reader.collections.links.read>>;
    }> = [];

    for (const slug of allSlugs) {
      const link = await reader.collections.links.read(slug);
      if (link?.tags) {
        for (const tagRef of link.tags) {
          if (tagRef.tag) {
            const tagData = await reader.collections.tags.read(tagRef.tag);
            if (String(tagData?.name) === tagName) {
              matchingLinks.push({
                slug,
                date: link.publishedAt ? new Date(link.publishedAt) : null,
                link,
              });
              break;
            }
          }
        }
      }
    }

    // Sort by date descending
    matchingLinks.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return dayjs.utc(b.date).valueOf() - dayjs.utc(a.date).valueOf();
    });

    // Transform links
    const links: LinkItem[] = [];
    for (const item of matchingLinks.slice(0, limit)) {
      const transformed = await transformLink(item.slug, item.link);
      if (transformed) {
        links.push(transformed);
      }
    }

    return {
      links,
      pageInfo: {
        hasNextPage: matchingLinks.length > limit,
        hasPreviousPage: false,
      },
    };
  } catch (error) {
    console.error("Failed to fetch links by tag from Keystatic:", error);
    return { links: [] };
  }
};
