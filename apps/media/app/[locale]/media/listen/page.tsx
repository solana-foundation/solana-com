import React from "react";
import type { Metadata } from "next";
import {
  fetchAllPodcasts,
  filterAndSortPodcasts,
  fetchLatestEpisodeForPodcast,
} from "@/lib/podcast-data";
import PodcastsClientPage from "./client-page";

export const revalidate = 1800; // 30 minutes

export const metadata: Metadata = {
  title: "Podcasts | Solana Media",
  description:
    "Explore our collection of podcasts covering blockchain technology, web3, and the Solana ecosystem.",
  openGraph: {
    title: "Podcasts | Solana Media",
    description:
      "Explore our collection of podcasts covering blockchain technology, web3, and the Solana ecosystem.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Podcasts | Solana Media",
    description:
      "Explore our collection of podcasts covering blockchain technology, web3, and the Solana ecosystem.",
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

  // Find featured podcast (one with "Featured" tag) and fetch its latest episode
  const featuredPodcast = activePodcasts.find((p) =>
    p.tags?.some((tag) => tag.toLowerCase() === "featured")
  );

  if (featuredPodcast) {
    const latestEpisode = await fetchLatestEpisodeForPodcast(featuredPodcast);
    if (latestEpisode) {
      featuredPodcast.latestEpisode = latestEpisode;
    }
  }

  return <PodcastsClientPage podcasts={activePodcasts} />;
}
