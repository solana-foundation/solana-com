import React from "react";
import type { Metadata } from "next";
import {
  fetchAllPodcasts,
  filterAndSortPodcasts,
  fetchLatestEpisodeForPodcast,
} from "@/lib/podcast-data";
import PodcastsClientPage from "./client-page";
import { config } from "@/lib/config";

export const revalidate = 1800; // 30 minutes

const title = "Podcasts";
const description =
  "Explore our collection of podcasts covering blockchain technology, web3, and the Solana ecosystem.";
const canonicalUrl = `${config.publicUrl}/podcasts`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | ${config.siteMetadata.title}`,
    description,
    url: canonicalUrl,
    type: "website",
    siteName: config.siteMetadata.title,
    images: [
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
    title: `${title} | ${config.siteMetadata.title}`,
    description,
    images: [config.siteMetadata.socialShare],
    creator: `@${config.social.twitter.name}`,
  },
  alternates: {
    canonical: canonicalUrl,
  },
};

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
