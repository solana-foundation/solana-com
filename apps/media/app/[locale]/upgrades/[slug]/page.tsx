import type { Metadata } from "next";
import { UpgradesPageContent } from "../upgrades-page-content";
import { upgradesListingMetadata } from "@/lib/metadata";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return upgradesListingMetadata();
}

export default async function UpgradeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  return <UpgradesPageContent initialSelectedSlug={slug} />;
}
