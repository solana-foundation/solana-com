import client from "@/tina/__generated__/client";
import {
  fetchEpisodesFromRSSCached,
  fetchEpisodeByIdFromRSS,
} from "./podcast-rss";
import type {
  PodcastShow,
  PodcastEpisode,
  PodcastHost,
  PaginatedEpisodes,
} from "./podcast-types";

/**
 * Fetch all podcasts from TinaCMS
 */
export const fetchAllPodcasts = async (): Promise<PodcastShow[]> => {
  try {
    const response = await client.queries.podcastConnection({
      sort: "displayOrder",
    });

    if (!response.data.podcastConnection.edges) {
      return [];
    }

    const podcasts: PodcastShow[] = [];

    for (const edge of response.data.podcastConnection.edges) {
      const podcast = edge?.node;
      if (!podcast) continue;

      // Transform hosts from references to host objects
      const hosts: PodcastHost[] = (podcast.hosts || [])
        .map((hostRef: any) => {
          const hostData = hostRef?.host;
          if (!hostData) return null;
          return {
            name: hostData.name || "Unknown Host",
            ...(hostData.avatar && { avatar: hostData.avatar }),
          };
        })
        .filter((host) => host !== null);

      // Get tags array (stored as strings)
      const podcastWithTags = podcast as any;
      const tags: string[] = Array.isArray(podcastWithTags.tags)
        ? (podcastWithTags.tags as string[]).filter(
            (tag: string) => tag !== null && tag !== undefined
          )
        : [];

      podcasts.push({
        id: podcast.id,
        title: podcast.title || "Untitled Podcast",
        slug: podcast.slug || podcast._sys.filename,
        description: podcast.description || "",
        coverImage: podcast.coverImage || "/uploads/podcasts/default-cover.png",
        category: podcast.category?.name || undefined,
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
      });
    }

    return podcasts;
  } catch (error) {
    console.error("Failed to fetch podcasts from TinaCMS:", error);
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
    const response = await client.queries.podcast({
      relativePath: `${slug}.mdx`,
    });

    const podcast = response.data.podcast;
    if (!podcast) return null;

    // Transform hosts from references to host objects
    const hosts: PodcastHost[] = (podcast.hosts || [])
      .map((hostRef: any) => {
        const hostData = hostRef?.host;
        if (!hostData) return null;
        return {
          name: hostData.name || "Unknown Host",
          ...(hostData.avatar && { avatar: hostData.avatar }),
        };
      })
      .filter((host) => host !== null);

    // Get tags array (stored as strings)
    const podcastWithTags = podcast as any;
    const tags: string[] = Array.isArray(podcastWithTags.tags)
      ? (podcastWithTags.tags as string[]).filter(
          (tag: string) => tag !== null && tag !== undefined
        )
      : [];

    return {
      id: podcast.id,
      title: podcast.title || "Untitled Podcast",
      slug: podcast.slug || podcast._sys.filename,
      description: podcast.description || "",
      coverImage: podcast.coverImage || "/uploads/podcasts/default-cover.png",
      category: podcast.category?.name || undefined,
      featured: podcast.featured || false,
      tags,
      displayOrder: podcast.displayOrder || 999,
      status: (podcast.status as PodcastShow["status"]) || "active",
      hosts,
      riversideProjectId: podcast.riversideProjectId || undefined,
      riversideStudioId: podcast.riversideStudioId || undefined,
      applePodcastsUrl: podcast.applePodcastsUrl || undefined,
      spotifyUrl: podcast.spotifyUrl || undefined,
      rssFeedUrl: podcast.rssFeedUrl || undefined,
      releaseFrequency: podcast.releaseFrequency || undefined,
      firstEpisodeDate: podcast.firstEpisodeDate || undefined,
    };
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
    // Fetch all episodes from RSS feed (with caching)
    const allEpisodes = await fetchEpisodesFromRSSCached(
      podcast.rssFeedUrl,
      podcast.slug
    );

    // Apply pagination
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
    // First get the podcast to access its RSS feed URL
    const podcast = await fetchPodcastBySlug(podcastSlug);

    if (!podcast || !podcast.rssFeedUrl) {
      console.warn(`No RSS feed URL for podcast: ${podcastSlug}`);
      return null;
    }

    // Fetch episode from RSS feed
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

  // Sort by display order, then by featured status
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
 * Format duration in seconds to readable string (e.g., "1:23:45")
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
    // Fetch episodes from RSS feed
    const allEpisodes = await fetchEpisodesFromRSSCached(
      podcast.rssFeedUrl,
      podcast.slug
    );

    // Return the first episode (they are already sorted by date, newest first)
    return allEpisodes.length > 0 ? allEpisodes[0] : null;
  } catch (error) {
    console.error(
      `Failed to fetch latest episode for podcast ${podcast.slug}:`,
      error
    );
    return null;
  }
};
