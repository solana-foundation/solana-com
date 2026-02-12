import { reader } from "../reader";
import {
  fetchEpisodesFromRSSCached,
  fetchEpisodeByIdFromRSS,
} from "../podcast-rss";
import { contentDocumentToPlainText } from "../content-renderer";
import type {
  PodcastShow,
  PodcastEpisode,
  PodcastHost,
  PaginatedEpisodes,
} from "../podcast-types";

/**
 * Transform Keystatic podcast entry to PodcastShow
 */
async function transformPodcast(
  slug: string,
  podcast: Awaited<ReturnType<typeof reader.collections.podcasts.read>>
): Promise<PodcastShow | null> {
  if (!podcast) return null;

  // Transform hosts from references to host objects
  const hosts: PodcastHost[] = [];
  if (podcast.hosts) {
    for (const hostRef of podcast.hosts) {
      if (hostRef.host) {
        const hostData = await reader.collections.authors.read(hostRef.host);
        if (hostData) {
          hosts.push({
            name: String(hostData.name) || "Unknown Host",
            ...(hostData.avatar && { avatar: hostData.avatar }),
          });
        }
      }
    }
  }

  // Resolve category name
  let categoryName: string | undefined;
  if (podcast.category) {
    const catData = await reader.collections.categories.read(podcast.category);
    if (catData?.name) {
      categoryName = String(catData.name);
    }
  }

  // Get tags array (copy to mutable array)
  const tags: string[] = podcast.tags ? [...podcast.tags] : [];

  // Resolve description content (Keystatic returns an async function for MDX contentField)
  let rawDescription = podcast.description;
  if (typeof rawDescription === "function") {
    rawDescription = await rawDescription();
  }
  const descriptionString = contentDocumentToPlainText(rawDescription as any);

  return {
    id: slug,
    title: String(podcast.title) || "Untitled Podcast",
    slug: podcast.slug || slug,
    description: descriptionString, // Converted to string for serialization
    coverImage: podcast.coverImage || "/uploads/podcasts/default-cover.png",
    category: categoryName,
    featured: podcast.featured || false,
    tags,
    displayOrder: podcast.displayOrder || 999,
    status: (podcast.status as PodcastShow["status"]) || "active",
    hosts,
    riversideProjectId: podcast.riversideProjectId || "",
    riversideStudioId: podcast.riversideStudioId || undefined,
    applePodcastsUrl: podcast.applePodcastsUrl || undefined,
    spotifyUrl: podcast.spotifyUrl || undefined,
    rssFeedUrl: podcast.rssFeedUrl || undefined,
    releaseFrequency: podcast.releaseFrequency || undefined,
    firstEpisodeDate: podcast.firstEpisodeDate || undefined,
  };
}

/**
 * Fetch all podcasts from Keystatic
 */
export const fetchAllPodcasts = async (): Promise<PodcastShow[]> => {
  try {
    const allSlugs = await reader.collections.podcasts.list();
    const podcasts: PodcastShow[] = [];

    for (const slug of allSlugs) {
      try {
        const podcast = await reader.collections.podcasts.read(slug);
        const transformed = await transformPodcast(slug, podcast);
        if (transformed) {
          podcasts.push(transformed);
        }
      } catch (slugError) {
        console.error(`Failed to read/transform podcast ${slug}:`, slugError);
      }
    }

    // Sort by display order
    podcasts.sort((a, b) => a.displayOrder - b.displayOrder);

    return podcasts;
  } catch (error) {
    console.error("Failed to fetch podcasts from Keystatic:", error);
    return [];
  }
};

/**
 * Fetch a single podcast by slug
 */
export const fetchPodcastBySlug = async (
  slug: string
): Promise<PodcastShow | null> => {
  try {
    const podcast = await reader.collections.podcasts.read(slug);
    return transformPodcast(slug, podcast);
  } catch (error) {
    console.error(`Failed to fetch podcast ${slug}:`, error);
    return null;
  }
};

/**
 * Fetch episodes for a podcast from RSS feed
 */
export const fetchEpisodesForPodcast = async (
  podcast: PodcastShow,
  limit: number = 12,
  offset: number = 0
): Promise<PaginatedEpisodes> => {
  if (!podcast.rssFeedUrl) {
    console.warn(`No RSS feed URL configured for podcast: ${podcast.slug}`);
    return {
      episodes: [],
      hasMore: false,
    };
  }

  try {
    const allEpisodes = await fetchEpisodesFromRSSCached(
      podcast.rssFeedUrl,
      podcast.slug
    );

    const paginatedEpisodes = allEpisodes.slice(offset, offset + limit);
    const hasMore = offset + limit < allEpisodes.length;

    return {
      episodes: paginatedEpisodes,
      hasMore,
      nextCursor: hasMore ? String(offset + limit) : undefined,
    };
  } catch (error) {
    console.error(
      `Failed to fetch episodes for podcast ${podcast.slug}:`,
      error
    );
    return {
      episodes: [],
      hasMore: false,
    };
  }
};

/**
 * Fetch a single episode by ID from RSS feed
 */
export const fetchEpisodeById = async (
  episodeId: string,
  podcastSlug: string
): Promise<PodcastEpisode | null> => {
  try {
    const podcast = await fetchPodcastBySlug(podcastSlug);

    if (!podcast || !podcast.rssFeedUrl) {
      console.warn(`No RSS feed URL for podcast: ${podcastSlug}`);
      return null;
    }

    const episode = await fetchEpisodeByIdFromRSS(
      episodeId,
      podcast.rssFeedUrl,
      podcastSlug
    );

    return episode;
  } catch (error) {
    console.error(`Failed to fetch episode ${episodeId}:`, error);
    return null;
  }
};

/**
 * Filter and sort podcasts
 */
export const filterAndSortPodcasts = (
  podcasts: PodcastShow[],
  options: {
    status?: PodcastShow["status"];
    category?: string;
    featured?: boolean;
  } = {}
): PodcastShow[] => {
  let filtered = [...podcasts];

  if (options.status) {
    filtered = filtered.filter((p) => p.status === options.status);
  }

  if (options.category) {
    filtered = filtered.filter((p) => p.category === options.category);
  }

  if (options.featured !== undefined) {
    filtered = filtered.filter((p) => p.featured === options.featured);
  }

  filtered.sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return a.title.localeCompare(b.title);
  });

  return filtered;
};

/**
 * Get unique categories from podcasts
 */
export const getPodcastCategories = (podcasts: PodcastShow[]): string[] => {
  const categories = new Set<string>();

  podcasts.forEach((podcast) => {
    if (podcast.category) {
      categories.add(podcast.category);
    }
  });

  return Array.from(categories).sort();
};

/**
 * Format duration in seconds to readable string
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Format date for display
 */
export const formatEpisodeDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

/**
 * Fetch the most recent episode for a podcast
 */
export const fetchLatestEpisodeForPodcast = async (
  podcast: PodcastShow
): Promise<PodcastEpisode | null> => {
  if (!podcast.rssFeedUrl) {
    return null;
  }

  try {
    const allEpisodes = await fetchEpisodesFromRSSCached(
      podcast.rssFeedUrl,
      podcast.slug
    );

    return allEpisodes.length > 0 ? allEpisodes[0] : null;
  } catch (error) {
    console.error(
      `Failed to fetch latest episode for podcast ${podcast.slug}:`,
      error
    );
    return null;
  }
};
