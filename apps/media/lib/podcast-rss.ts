/**
 * RSS Feed Parser for Podcasts
 *
 * This replaces Riverside API calls with RSS feed parsing.
 * Benefits:
 * - No rate limits
 * - Free CDN (Apple/Spotify host the audio)
 * - Standard podcast format
 * - Designed for high traffic
 */

import Parser from "rss-parser";
import type { PodcastEpisode } from "./podcast-types";

// Initialize RSS parser with podcast extensions
const parser = new Parser({
  customFields: {
    item: [
      ["itunes:duration", "itunesDuration"],
      ["itunes:image", "itunesImage"],
      ["itunes:explicit", "itunesExplicit"],
      ["itunes:episode", "itunesEpisode"],
      ["itunes:season", "itunesSeason"],
    ],
  },
});

/**
 * Parse duration string to seconds
 * Handles formats: "1:23:45", "23:45", "1234"
 */
function parseDuration(duration?: string): number {
  if (!duration) return 0;

  // If it's already a number in seconds
  if (/^\d+$/.test(duration)) {
    return parseInt(duration, 10);
  }

  // Parse HH:MM:SS or MM:SS format
  const parts = duration.split(":").map((p) => parseInt(p, 10));

  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  }

  return 0;
}

/**
 * Generate a stable ID from episode data
 * Uses GUID if available, otherwise generates from URL
 */
function generateEpisodeId(item: any): string {
  // Prefer GUID
  if (item.guid) {
    return item.guid;
  }

  // Use enclosure URL as fallback
  if (item.enclosure?.url) {
    // Extract a stable ID from the URL
    const url = new URL(item.enclosure.url);
    const pathParts = url.pathname.split("/");
    return pathParts[pathParts.length - 1].replace(/\.[^/.]+$/, "");
  }

  // Last resort: hash the title
  return Buffer.from(item.title || "untitled")
    .toString("base64")
    .slice(0, 16);
}

/**
 * Fetch episodes from RSS feed
 */
export async function fetchEpisodesFromRSS(
  rssFeedUrl: string,
  podcastSlug: string
): Promise<PodcastEpisode[]> {
  try {
    const feed = await parser.parseURL(rssFeedUrl);

    const episodes: PodcastEpisode[] = (feed.items || []).map((item: any) => {
      const duration = parseDuration(
        item.itunesDuration || item.itunes?.duration
      );

      return {
        id: generateEpisodeId(item),
        recordingId: generateEpisodeId(item),
        podcastSlug,
        title: item.title || "Untitled Episode",
        description: item.contentSnippet || item.content || item.description,
        publishedDate: item.pubDate || item.isoDate || new Date().toISOString(),
        duration,
        audioUrl: item.enclosure?.url || "",
        thumbnailUrl: item.itunesImage?.href || item.itunes?.image || undefined,
        status: "ready" as const,
      };
    });

    // Sort by published date (newest first)
    episodes.sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
    );

    return episodes;
  } catch (error) {
    console.error(`❌ Failed to fetch RSS feed ${rssFeedUrl}:`, error);
    return [];
  }
}

/**
 * Fetch a single episode by ID from RSS feed
 */
export async function fetchEpisodeByIdFromRSS(
  episodeId: string,
  rssFeedUrl: string,
  podcastSlug: string
): Promise<PodcastEpisode | null> {
  const episodes = await fetchEpisodesFromRSS(rssFeedUrl, podcastSlug);
  return episodes.find((ep) => ep.id === episodeId) || null;
}

/**
 * Cache RSS data to reduce network requests
 * Stores in memory with TTL of 30 minutes
 */
const rssCache: Map<string, { data: PodcastEpisode[]; timestamp: number }> =
  new Map();
const RSS_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function fetchEpisodesFromRSSCached(
  rssFeedUrl: string,
  podcastSlug: string
): Promise<PodcastEpisode[]> {
  const now = Date.now();
  const cached = rssCache.get(rssFeedUrl);

  if (cached && now - cached.timestamp < RSS_CACHE_TTL) {
    return cached.data;
  }

  const episodes = await fetchEpisodesFromRSS(rssFeedUrl, podcastSlug);

  rssCache.set(rssFeedUrl, {
    data: episodes,
    timestamp: now,
  });

  return episodes;
}

/**
 * Clear RSS cache
 */
export function clearRSSCache(): void {
  rssCache.clear();
}
