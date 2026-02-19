// Client-safe podcast utility functions

import type { PodcastShow } from "./podcast-types";

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
