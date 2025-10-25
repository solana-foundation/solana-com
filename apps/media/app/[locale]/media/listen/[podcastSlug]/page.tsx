import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchAllPodcasts,
  fetchPodcastBySlug,
  fetchEpisodesForPodcast,
} from "@/lib/podcast-data";
import PodcastShowClientPage from "./client-page";
import { pathsWithLocales } from "@workspace/i18n/routing";

export const revalidate = 1800; // 30 minutes - cache to avoid rate limits

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

  const params = podcasts.map((podcast) => ({
    params: {
      podcastSlug: podcast.slug,
    },
  }));

  return pathsWithLocales(params);
}

export async function generateMetadata({
  params,
}: PodcastShowPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const podcast = await fetchPodcastBySlug(resolvedParams.podcastSlug);

  if (!podcast) {
    return {
      title: "Podcast Not Found",
    };
  }

  const title = `${podcast.title} | Podcasts`;
  const description =
    typeof podcast.description === "string"
      ? podcast.description
      : `Listen to ${podcast.title} podcast`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: podcast.coverImage ? [podcast.coverImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: podcast.coverImage ? [podcast.coverImage] : undefined,
    },
  };
}
