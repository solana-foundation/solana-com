import type { Metadata } from "next";
import { UpgradesPageContent } from "../upgrades-page-content";
import { upgradeDetailMetadata } from "@/lib/metadata";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return upgradeDetailMetadata(slug);
}

export default async function UpgradeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  return <UpgradesPageContent initialSelectedSlug={slug} />;
}
