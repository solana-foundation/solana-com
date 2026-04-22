import type { Metadata } from "next";
import { UpgradesLanding } from "./upgrades-landing";
import { upgradesLandingMetadata } from "@/lib/metadata";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return upgradesLandingMetadata();
}

export default async function UpgradesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  return <UpgradesLanding />;
}
