import React from "react";
import type { Metadata } from "next";
import {
  fetchAllPodcasts,
  filterAndSortPodcasts,
  fetchLatestEpisodeForPodcast,
} from "@/lib/podcast-data";
import PodcastsClientPage from "./client-page";
import { podcastsListingMetadata } from "@/lib/metadata";

export const revalidate = 1800; // 30 minutes

export const metadata: Metadata = podcastsListingMetadata();

export default async function PodcastsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const allPodcasts = await fetchAllPodcasts();

  // Filter for active podcasts only
  const activePodcasts = filterAndSortPodcasts(allPodcasts, {
    status: "active",
  });

  // Fetch latest episodes for all podcasts to determine the most recent upload
  const podcastsWithEpisodes = await Promise.all(
    activePodcasts.map(async (podcast) => {
      const latestEpisode = await fetchLatestEpisodeForPodcast(podcast);
      return {
        ...podcast,
        latestEpisode: latestEpisode || undefined,
      };
    })
  );

  return <PodcastsClientPage podcasts={podcastsWithEpisodes} />;
}
