import { NextResponse } from "next/server";
import { fetchAllPodcasts, fetchEpisodesForPodcast } from "@/lib/podcast-data";

const BASE_URL = "https://solana.com";
const MAX_SITEMAP_URLS = 50_000;
const XML_CONTENT_TYPE = "application/xml; charset=utf-8";
const XML_CACHE_CONTROL = "public, s-maxage=1800, stale-while-revalidate=3600";

export const PODCAST_SITEMAP_CANONICAL_URL = `${BASE_URL}/podcasts/sitemap.xml`;

export type PodcastSitemapEntry = {
  podcastSlug: string;
  episodeSlug: string;
  publishedDate?: string | null;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildPodcastSitemapXml(entries: PodcastSitemapEntry[]) {
  const urls = entries.slice(0, MAX_SITEMAP_URLS).map((entry) => {
    const path = `/podcasts/${encodeURIComponent(entry.podcastSlug)}/episodes/${encodeURIComponent(entry.episodeSlug)}`;
    const lines = ["<url>", `<loc>${escapeXml(`${BASE_URL}${path}`)}</loc>`];

    if (entry.publishedDate) {
      lines.push(`<lastmod>${escapeXml(entry.publishedDate)}</lastmod>`);
    }

    lines.push("</url>");
    return lines.join("");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

async function getPodcastSitemapEntries(now: Date) {
  const podcasts = (await fetchAllPodcasts()).filter(
    (podcast) => podcast.status === "active" || podcast.status === "archived",
  );
  const episodeGroups = await Promise.all(
    podcasts.map(async (podcast) => {
      const { episodes } = await fetchEpisodesForPodcast(
        podcast,
        MAX_SITEMAP_URLS,
        0,
      );

      return episodes.flatMap((episode) => {
        const publishedAt = new Date(episode.publishedDate);
        if (
          Number.isNaN(publishedAt.getTime()) ||
          publishedAt.getTime() > now.getTime()
        ) {
          return [];
        }

        return {
          podcastSlug: podcast.slug,
          episodeSlug: episode.slug,
          publishedDate: publishedAt.toISOString(),
        };
      });
    }),
  );

  return episodeGroups
    .flat()
    .sort((left, right) =>
      String(right.publishedDate).localeCompare(String(left.publishedDate)),
    );
}

export async function getPodcastSitemapResponse(now: Date = new Date()) {
  try {
    const entries = await getPodcastSitemapEntries(now);
    return new NextResponse(buildPodcastSitemapXml(entries), {
      status: 200,
      headers: {
        "Content-Type": XML_CONTENT_TYPE,
        "Cache-Control": XML_CACHE_CONTROL,
      },
    });
  } catch (error) {
    console.error("Error generating podcast sitemap:", error);
    return new NextResponse("Error generating podcast sitemap", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
