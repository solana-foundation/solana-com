import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchPodcastBySlug,
  fetchEpisodeById,
  fetchEpisodesForPodcast,
} from "@/lib/podcast-data";
import EpisodeClientPage from "./client-page";
import { config } from "@/lib/config";

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

  return (
    <EpisodeClientPage
      podcast={podcast}
      episode={episode}
      relatedEpisodes={relatedEpisodes.slice(0, 3)}
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
  const canonicalUrl = `${config.publicUrl}/podcasts/${resolvedParams.podcastSlug}/episodes/${resolvedParams.episodeId}`;
  const image = episode.thumbnailUrl || podcast.coverImage || null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: config.siteMetadata.title,
      images: image
        ? [image]
        : [
            {
              url: config.siteMetadata.socialShare,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
      audio: episode.audioUrl ? [episode.audioUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [config.siteMetadata.socialShare],
      creator: `@${config.social.twitter.name}`,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
