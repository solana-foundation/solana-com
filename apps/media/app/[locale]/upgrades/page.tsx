import type { Metadata } from "next";
import UpgradesClientPage from "./client-page";
import { UpgradesOverview } from "@/components/upgrades/upgrades-overview";
import { UpgradesStatusGuide } from "@/components/upgrades/upgrades-status-guide";
import {
  fetchFeaturedUpgrades,
  fetchUpgradeOverview,
  fetchUpgrades,
} from "@/lib/upgrade-data";
import { upgradesListingMetadata } from "@/lib/metadata";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return upgradesListingMetadata();
}

export default async function UpgradesPage() {
  const [overview, featured, upgrades] = await Promise.all([
    fetchUpgradeOverview(),
    fetchFeaturedUpgrades(),
    fetchUpgrades({ sort: "updated-desc" }),
  ]);

  return (
    <section className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_0%_0%,rgba(153,69,255,0.18),transparent_60%),radial-gradient(ellipse_55%_50%_at_100%_0%,rgba(20,241,149,0.08),transparent_50%),linear-gradient(180deg,rgba(7,8,14,1),rgba(9,11,18,0.96))]" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-5 pb-16 pt-12 md:px-8 md:pb-20 md:pt-16 xl:px-10 xl:pt-[110px]">
        <UpgradesOverview overview={overview} featured={featured} />
        <UpgradesStatusGuide body={overview?.statusGuide} />
        <UpgradesClientPage upgrades={upgrades.items} />
      </div>
    </section>
  );
}
