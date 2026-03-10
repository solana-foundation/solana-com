import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchAllPodcasts,
  fetchPodcastBySlug,
  fetchEpisodesForPodcast,
} from "@/lib/podcast-data";
import PodcastShowClientPage from "./client-page";
import { config } from "@/lib/config";

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
  const canonicalUrl = `${config.publicUrl}/podcasts/${resolvedParams.podcastSlug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: config.siteMetadata.title,
      images: podcast.coverImage
        ? [podcast.coverImage]
        : [
            {
              url: config.siteMetadata.socialShare,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: podcast.coverImage
        ? [podcast.coverImage]
        : [config.siteMetadata.socialShare],
      creator: `@${config.social.twitter.name}`,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
