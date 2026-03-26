import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchPodcastBySlug,
  fetchEpisodeById,
  fetchEpisodesForPodcast,
} from "@/lib/podcast-data";
import EpisodeClientPage from "./client-page";
import { podcastEpisodeMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 1800; // 30 minutes

interface EpisodePageProps {
  params: Promise<{
    podcastSlug: string;
    episodeId: string;
    locale: string;
  }>;
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const resolvedParams = await params;
  const podcast = await fetchPodcastBySlug(resolvedParams.podcastSlug);

  if (!podcast) {
    notFound();
  }

  const episode = await fetchEpisodeById(
    resolvedParams.episodeId,
    resolvedParams.podcastSlug,
  );

  if (!episode) {
    notFound();
  }

  // Fetch enough episodes to find adjacent ones and related
  const allEpisodesData = await fetchEpisodesForPodcast(podcast, 50, 0);
  const allEpisodes = allEpisodesData.episodes;

  // Find current episode index to determine prev/next
  const currentIndex = allEpisodes.findIndex((ep) => ep.id === episode.id);

  // Episodes are sorted newest-first, so "previous" is older (index + 1)
  // and "next" is newer (index - 1)
  const previousEpisode =
    currentIndex >= 0 && currentIndex < allEpisodes.length - 1
      ? allEpisodes[currentIndex + 1]
      : null;
  const nextEpisode = currentIndex > 0 ? allEpisodes[currentIndex - 1] : null;

  // Related episodes: 3 most recent excluding current
  const relatedEpisodes = allEpisodes
    .filter((ep) => ep.id !== episode.id)
    .slice(0, 3);

  return (
    <EpisodeClientPage
      podcast={podcast}
      episode={episode}
      relatedEpisodes={relatedEpisodes}
      previousEpisode={previousEpisode}
      nextEpisode={nextEpisode}
    />
  );
}

// Generate pages on-demand with ISR
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: EpisodePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return podcastEpisodeMetadata(
    resolvedParams.podcastSlug,
    resolvedParams.episodeId,
  );
}
