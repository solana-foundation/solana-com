import React from "react";
import type { Metadata } from "next";
import {
  fetchAllPodcasts,
  filterAndSortPodcasts,
  fetchLatestEpisodeForPodcast,
  fetchEpisodesForPodcast,
} from "@/lib/podcast-data";
import PodcastsClientPage from "./client-page";
import { podcastsListingMetadata } from "@/lib/metadata";

export const revalidate = 1800; // 30 minutes

export const metadata: Metadata = podcastsListingMetadata();

export default async function PodcastsPage({
  params: _,
}: {
  params: Promise<{ locale: string }>;
}) {
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

  return <PodcastsClientPage podcasts={podcastsWithEpisodes} />;
}
