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
  try {
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
  } catch (error) {
    console.error(`❌ Failed to parse duration "${duration}":`, error);
    return 0;
  }
}

/**
 * Generate a stable ID from episode data
 * Uses GUID if available, otherwise generates from URL
 */
function generateEpisodeId(item: any): string {
  try {
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
  } catch (error) {
    console.error("❌ Failed to generate episode ID:", error);
    // Return a fallback ID based on timestamp
    return `episode-${Date.now()}`;
  }
}

function isBuzzsproutFeed(rssFeedUrl: string): boolean {
  return /(?:^|\/\/)(?:feeds|rss)\.buzzsprout\.com\/\d+\.rss(?:$|\?)/i.test(
    rssFeedUrl,
  );
}

function extractBuzzsproutShowId(rssFeedUrl: string): string | null {
  const match = rssFeedUrl.match(
    /(?:^|\/\/)(?:feeds|rss)\.buzzsprout\.com\/(\d+)\.rss(?:$|\?)/i,
  );

  return match?.[1] ?? null;
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function stripHtml(value: string): string {
  return decodeHtmlEntities(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseBuzzsproutCount(html: string): number | null {
  const match = html.match(/>(\d+)\s+episodes<\/h2>/i);
  return match ? Number.parseInt(match[1], 10) : null;
}

function parseBuzzsproutEpisodesPage(
  html: string,
  podcastSlug: string,
): PodcastEpisode[] {
  const episodeBlocks = html.matchAll(
    /<div id="episode_(\d+)"[\s\S]*?<\/a><\/div>/g,
  );

  const episodes: PodcastEpisode[] = [];

  for (const match of episodeBlocks) {
    const episodeId = match[1];
    const block = match[0];

    const hrefMatch = block.match(
      /<a class="w-full" href="(\/\d+\/episodes\/[^"]+)"/,
    );
    const titleMatch = block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
    const descriptionMatch = block.match(
      /<div id="description_episode_[^"]+"[^>]*>([\s\S]*?)<\/div>/,
    );
    const dateMatch = block.match(
      /<time datetime="([^"]+)" class="whitespace-nowrap">/,
    );
    const durationMatch = block.match(/(?:<span\s*>•<\/span>\s*)(\d+:\d{2})/);
    const imageMatch = block.match(/<img[^>]+src="([^"]+)"/);

    if (!hrefMatch || !titleMatch) {
      continue;
    }

    const episodePath = hrefMatch[1];
    const publishedDate = dateMatch?.[1]
      ? new Date(dateMatch[1]).toISOString()
      : new Date().toISOString();

    episodes.push({
      id: episodeId,
      recordingId: episodeId,
      podcastSlug,
      title: stripHtml(titleMatch[1]),
      description: descriptionMatch
        ? stripHtml(descriptionMatch[1])
        : undefined,
      publishedDate,
      duration: parseDuration(durationMatch?.[1]),
      audioUrl: `https://www.buzzsprout.com${episodePath}.mp3?client_source=buzzsprout_website`,
      thumbnailUrl: imageMatch?.[1],
      status: "ready",
    });
  }

  return episodes;
}

async function fetchEpisodesFromBuzzsprout(
  rssFeedUrl: string,
  podcastSlug: string,
): Promise<PodcastEpisode[]> {
  const showId = extractBuzzsproutShowId(rssFeedUrl);

  if (!showId) {
    return [];
  }

  const baseUrl = `https://www.buzzsprout.com/${showId}/episodes`;
  const firstPageHtml = await fetchText(baseUrl);
  const totalEpisodes = parseBuzzsproutCount(firstPageHtml);
  const episodes = parseBuzzsproutEpisodesPage(firstPageHtml, podcastSlug);
  const seenIds = new Set(episodes.map((episode) => episode.id));

  let page = 2;
  while (
    (totalEpisodes === null || episodes.length < totalEpisodes) &&
    page <= 50
  ) {
    const pageHtml = await fetchText(`${baseUrl}?page=${page}`);
    const pageEpisodes = parseBuzzsproutEpisodesPage(
      pageHtml,
      podcastSlug,
    ).filter((episode) => !seenIds.has(episode.id));

    if (pageEpisodes.length === 0) {
      break;
    }

    for (const episode of pageEpisodes) {
      seenIds.add(episode.id);
      episodes.push(episode);
    }

    page += 1;
  }

  return episodes.sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
  );
}

/**
 * Fetch episodes from RSS feed
 */
export async function fetchEpisodesFromRSS(
  rssFeedUrl: string,
  podcastSlug: string,
): Promise<PodcastEpisode[]> {
  try {
    const feed = await parser.parseURL(rssFeedUrl);

    const episodes: PodcastEpisode[] = (feed.items || []).map((item: any) => {
      const duration = parseDuration(
        item.itunesDuration || item.itunes?.duration,
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
        new Date(a.publishedDate).getTime(),
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
  podcastSlug: string,
): Promise<PodcastEpisode | null> {
  try {
    const episodes = await fetchEpisodesFromRSS(rssFeedUrl, podcastSlug);
    return episodes.find((ep) => ep.id === episodeId) || null;
  } catch (error) {
    console.error(
      `❌ Failed to fetch episode ${episodeId} from ${rssFeedUrl}:`,
      error,
    );
    return null;
  }
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
  podcastSlug: string,
): Promise<PodcastEpisode[]> {
  try {
    const now = Date.now();
    const cached = rssCache.get(rssFeedUrl);

    if (cached && now - cached.timestamp < RSS_CACHE_TTL) {
      return cached.data;
    }

    let episodes = await fetchEpisodesFromRSS(rssFeedUrl, podcastSlug);

    if (episodes.length === 0 && isBuzzsproutFeed(rssFeedUrl)) {
      episodes = await fetchEpisodesFromBuzzsprout(rssFeedUrl, podcastSlug);
    }

    rssCache.set(rssFeedUrl, {
      data: episodes,
      timestamp: now,
    });

    return episodes;
  } catch (error) {
    console.error(
      `❌ Failed to fetch cached episodes from ${rssFeedUrl}:`,
      error,
    );
    return [];
  }
}

/**
 * Clear RSS cache
 */
export function clearRSSCache(): void {
  try {
    rssCache.clear();
  } catch (error) {
    console.error("❌ Failed to clear RSS cache:", error);
  }
}
