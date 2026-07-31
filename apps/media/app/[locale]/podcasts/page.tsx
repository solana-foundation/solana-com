import React from "react";
import type { Metadata } from "next";
import {
  fetchAllPodcasts,
  filterAndSortPodcasts,
  fetchLatestEpisodeForPodcast,
  fetchEpisodesForPodcast,
} from "@/lib/podcast-data";
import PodcastsClientPage from "./client-page";
import {
  PODCASTS_SEO_DESCRIPTION,
  PODCASTS_SEO_TITLE,
  podcastsListingMetadata,
} from "@/lib/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPodcastCollectionJsonLd } from "@/lib/content-structured-data";

export const revalidate = 1800; // 30 minutes

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return podcastsListingMetadata(locale);
}

export default async function PodcastsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const allPodcasts = await fetchAllPodcasts();

  // Filter for active podcasts only
  const activePodcasts = filterAndSortPodcasts(allPodcasts, {
    status: "active",
  });

  // Fetch latest episodes and episode counts for all podcasts
  const podcastsWithEpisodes = await Promise.all(
    activePodcasts.map(async (podcast) => {
      const [latestEpisode, allEpisodesData] = await Promise.all([
        fetchLatestEpisodeForPodcast(podcast),
        fetchEpisodesForPodcast(podcast, 999, 0),
      ]);
      return {
        ...podcast,
        latestEpisode: latestEpisode || undefined,
        episodeCount: allEpisodesData.episodes.length,
      };
    }),
  );
  const structuredData = buildPodcastCollectionJsonLd({
    podcasts: podcastsWithEpisodes,
    locale,
    title: PODCASTS_SEO_TITLE,
    description: PODCASTS_SEO_DESCRIPTION,
  });

  return (
    <>
      <JsonLd data={structuredData} />
      <PodcastsClientPage podcasts={podcastsWithEpisodes} />
    </>
  );
}
