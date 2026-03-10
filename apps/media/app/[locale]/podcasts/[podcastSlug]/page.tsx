import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchAllPodcasts,
  fetchPodcastBySlug,
  fetchEpisodesForPodcast,
} from "@/lib/podcast-data";
import PodcastShowClientPage from "./client-page";
import { podcastShowMetadata } from "@/lib/metadata";

export const revalidate = 1800; // 30 minutes - cache to avoid rate limits
export const dynamicParams = true;

interface PodcastShowPageProps {
  params: Promise<{ podcastSlug: string; locale: string }>;
}

export default async function PodcastShowPage({
  params,
}: PodcastShowPageProps) {
  const resolvedParams = await params;
  const podcast = await fetchPodcastBySlug(resolvedParams.podcastSlug);

  if (!podcast) {
    notFound();
  }

  // Fetch initial episodes from RSS feed
  const episodesData = await fetchEpisodesForPodcast(podcast, 12, 0);

  return (
    <PodcastShowClientPage
      podcast={podcast}
      initialEpisodes={episodesData.episodes}
      initialHasMore={episodesData.hasMore}
    />
  );
}

export async function generateStaticParams() {
  const podcasts = await fetchAllPodcasts();

  return podcasts.map((podcast) => ({
    podcastSlug: podcast.slug,
  }));
}

export async function generateMetadata({
  params,
}: PodcastShowPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return podcastShowMetadata(resolvedParams.podcastSlug);
}
