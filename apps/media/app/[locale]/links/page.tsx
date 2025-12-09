import React from "react";
import type { Metadata } from "next";
import LinksClientPage from "./client-page";
import { fetchLatestLinks, fetchFeaturedLinks } from "@/lib/link-data";
import { enrichLinksWithMetadata } from "@/lib/link-utils";

export const revalidate = 300; // 5 minutes

export const metadata: Metadata = {
  title: "Links",
  description:
    "Curated links to articles, tweets, videos, and more from across the Solana ecosystem.",
  openGraph: {
    title: "Links | Solana Media",
    description:
      "Curated links to articles, tweets, videos, and more from across the Solana ecosystem.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Links | Solana Media",
    description:
      "Curated links to articles, tweets, videos, and more from across the Solana ecosystem.",
  },
};

export default async function LinksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [latestLinksResponse, featuredLinksResponse] = await Promise.all([
    fetchLatestLinks({ limit: 12 }),
    fetchFeaturedLinks(3),
  ]);

  // Enrich links with Open Graph metadata for missing thumbnails/descriptions
  const [enrichedLatestLinks, enrichedFeaturedLinks] = await Promise.all([
    enrichLinksWithMetadata(latestLinksResponse.links),
    enrichLinksWithMetadata(featuredLinksResponse.links),
  ]);

  return (
    <LinksClientPage
      latestLinks={enrichedLatestLinks}
      featuredLinks={enrichedFeaturedLinks}
      initialPageInfo={latestLinksResponse.pageInfo}
    />
  );
}
