import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import {
  fetchPodcastBySlug,
  fetchEpisodeById,
  fetchEpisodesForPodcast,
} from "@/lib/podcast-data";
import EpisodeClientPage from "./client-page";

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
    resolvedParams.podcastSlug
  );

  if (!episode) {
    notFound();
  }

  // Fetch related episodes from RSS feed (next 3 from the same podcast)
  const relatedEpisodesData = await fetchEpisodesForPodcast(podcast, 4, 0);
  const relatedEpisodes = relatedEpisodesData.episodes.filter(
    (ep) => ep.id !== episode!.id
  );

  // Construct absolute URL for social sharing (works on server and client)
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const locale =
    resolvedParams.locale === "en" ? "" : `/${resolvedParams.locale}`;
  const episodeUrl = `${protocol}://${host}${locale}/media/listen/${resolvedParams.podcastSlug}/episodes/${resolvedParams.episodeId}`;

  return (
    <EpisodeClientPage
      podcast={podcast}
      episode={episode}
      relatedEpisodes={relatedEpisodes.slice(0, 3)}
      episodeUrl={episodeUrl}
    />
  );
}

// Generate pages on-demand with ISR
export const dynamicParams = true; // Allow all dynamic params

export async function generateStaticParams() {
  // Return empty array to generate pages on-demand
  // Pages will be cached after first visit (ISR)
  return [];
}

export async function generateMetadata({
  params,
}: EpisodePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const podcast = await fetchPodcastBySlug(resolvedParams.podcastSlug);
  const episode = await fetchEpisodeById(
    resolvedParams.episodeId,
    resolvedParams.podcastSlug
  );

  if (!podcast || !episode) {
    return {
      title: "Episode Not Found",
    };
  }

  const title = `${episode.title} | ${podcast.title}`;
  const description = episode.description || `Listen to ${episode.title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "music.song",
      images: episode.thumbnailUrl
        ? [episode.thumbnailUrl]
        : podcast.coverImage
          ? [podcast.coverImage]
          : undefined,
      audio: episode.audioUrl ? [episode.audioUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: episode.thumbnailUrl
        ? [episode.thumbnailUrl]
        : podcast.coverImage
          ? [podcast.coverImage]
          : undefined,
    },
  };
}
