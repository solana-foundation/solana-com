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

const RSS_CACHE_TTL_SECONDS = 30 * 60; // 30 minutes
const RSS_CACHE_TAG = "podcast-rss";

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

function slugifySegment(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function buildEpisodeSlug(
  title: string | undefined,
  fallbackValue: string,
  publishedDate?: string,
): string {
  const baseSlug =
    slugifySegment(title || "") || slugifySegment(fallbackValue) || "episode";
  const publishedDay = publishedDate
    ? new Date(publishedDate).toISOString().slice(0, 10)
    : null;

  return publishedDay ? `${baseSlug}-${publishedDay}` : baseSlug;
}

function extractSlugFromEpisodePath(episodePath: string): string | null {
  const episodeSegment = episodePath.match(/\/episodes\/([^/?#]+)/i)?.[1];
  if (!episodeSegment) {
    return null;
  }

  const slug = slugifySegment(decodeURIComponent(episodeSegment));
  return slug || null;
}

function ensureUniqueEpisodeSlugs(
  episodes: PodcastEpisode[],
): PodcastEpisode[] {
  const slugCounts = new Map<string, number>();

  return episodes.map((episode) => {
    const count = slugCounts.get(episode.slug) ?? 0;
    slugCounts.set(episode.slug, count + 1);

    if (count === 0) {
      return episode;
    }

    const suffix = slugifySegment(episode.id).slice(-8) || String(count + 1);
    return {
      ...episode,
      slug: `${episode.slug}-${suffix}`,
    };
  });
}

function extractEpisodeThumbnail(item: any): string | undefined {
  const candidates = [
    item.itunesImage?.href,
    item.itunesImage?.$?.href,
    item.itunes?.image,
    item.image?.url,
    item.image?.href,
    item.mediaThumbnail?.url,
    item.mediaThumbnail?.$?.url,
    item.mediaContent?.url,
    item.mediaContent?.$?.url,
  ];

  return candidates.find(
    (candidate): candidate is string =>
      typeof candidate === "string" && candidate.length > 0,
  );
}

function resolveAudioUrl(enclosureUrl?: string): string {
  if (!enclosureUrl) {
    return "";
  }

  try {
    const url = new URL(enclosureUrl);

    // Anchor/Spotify enclosure URLs often wrap the real media URL in the last
    // path segment. Using the final media URL directly avoids browser-specific
    // issues with redirected audio playback.
    if (
      url.hostname === "anchor.fm" &&
      /\/podcast\/play\//.test(url.pathname) &&
      enclosureUrl.includes("https%3A%2F%2F")
    ) {
      const encodedTarget = url.pathname.split("/").pop();

      if (encodedTarget) {
        const decodedTarget = decodeURIComponent(encodedTarget);
        if (/^https:\/\/.+/i.test(decodedTarget)) {
          return decodedTarget;
        }
      }
    }
  } catch {
    return enclosureUrl;
  }

  return enclosureUrl;
}

function extractEpisodeDescriptionHtml(item: any): string | undefined {
  const candidates = [
    item.content,
    item["content:encoded"],
    item.contentEncoded,
    item.description,
  ];

  return candidates.find(
    (candidate): candidate is string =>
      typeof candidate === "string" &&
      candidate.trim().length > 0 &&
      /<[^>]+>/.test(candidate),
  );
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
    next: {
      revalidate: RSS_CACHE_TTL_SECONDS,
      tags: [RSS_CACHE_TAG],
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
      slug:
        extractSlugFromEpisodePath(episodePath) ||
        buildEpisodeSlug(titleMatch[1], episodeId, publishedDate),
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

  const sortedEpisodes = episodes.sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
  );

  return ensureUniqueEpisodeSlugs(sortedEpisodes);
}

/**
 * Fetch episodes from RSS feed
 */
export async function fetchEpisodesFromRSS(
  rssFeedUrl: string,
  podcastSlug: string,
): Promise<PodcastEpisode[]> {
  try {
    const feedXml = await fetchText(rssFeedUrl);
    const feed = await parser.parseString(feedXml);

    const episodes: PodcastEpisode[] = (feed.items || []).map((item: any) => {
      const duration = parseDuration(
        item.itunesDuration || item.itunes?.duration,
      );
      const id = generateEpisodeId(item);
      const publishedDate =
        item.pubDate || item.isoDate || new Date().toISOString();
      const linkSlug =
        typeof item.link === "string"
          ? extractSlugFromEpisodePath(item.link)
          : null;

      return {
        id,
        slug: linkSlug || buildEpisodeSlug(item.title, id, publishedDate),
        recordingId: id,
        podcastSlug,
        title: item.title || "Untitled Episode",
        description: item.contentSnippet || item.content || item.description,
        descriptionHtml: extractEpisodeDescriptionHtml(item),
        publishedDate,
        duration,
        audioUrl: resolveAudioUrl(item.enclosure?.url),
        thumbnailUrl: extractEpisodeThumbnail(item),
        status: "ready" as const,
      };
    });

    // Sort by published date (newest first)
    episodes.sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime(),
    );

    return ensureUniqueEpisodeSlugs(episodes);
  } catch (error) {
    console.error(`❌ Failed to fetch RSS feed ${rssFeedUrl}:`, error);
    return [];
  }
}

/**
 * Fetch a single episode by slug or ID from RSS feed
 */
export async function fetchEpisodeByIdFromRSS(
  episodeIdOrSlug: string,
  rssFeedUrl: string,
  podcastSlug: string,
): Promise<PodcastEpisode | null> {
  try {
    const episodes = await fetchEpisodesFromRSS(rssFeedUrl, podcastSlug);
    return (
      episodes.find(
        (ep) => ep.id === episodeIdOrSlug || ep.slug === episodeIdOrSlug,
      ) || null
    );
  } catch (error) {
    console.error(
      `❌ Failed to fetch episode ${episodeIdOrSlug} from ${rssFeedUrl}:`,
      error,
    );
    return null;
  }
}

export async function fetchEpisodesFromRSSCached(
  rssFeedUrl: string,
  podcastSlug: string,
): Promise<PodcastEpisode[]> {
  try {
    if (isBuzzsproutFeed(rssFeedUrl)) {
      return await fetchEpisodesFromBuzzsprout(rssFeedUrl, podcastSlug);
    }

    const episodes = await fetchEpisodesFromRSS(rssFeedUrl, podcastSlug);

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
 * Legacy no-op. Podcast RSS now uses fetch-level Next.js data caching.
 */
export function clearRSSCache(): void {
  return;
}
