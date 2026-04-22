import type { Metadata } from "next";
import { UpgradesPageContent } from "./upgrades-page-content";
import { proposalsListingMetadata } from "@/lib/metadata";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return proposalsListingMetadata();
}

export default async function UpgradesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  return <UpgradesPageContent />;
}
