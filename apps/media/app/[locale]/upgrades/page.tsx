import type { Metadata } from "next";
import Link from "next/link";
import UpgradesClientPage from "./client-page";
import { UpgradesStatusGuide } from "@/components/upgrades/upgrades-status-guide";
import {
  fetchFeaturedUpgrades,
  fetchLatestNotes,
  fetchUpgradeNotes,
  fetchUpgradeOverview,
  fetchUpgrades,
} from "@/lib/upgrade-data";
import type { UpgradeNote } from "@/lib/upgrade-types";
import { upgradesListingMetadata } from "@/lib/metadata";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return upgradesListingMetadata();
}

export default async function UpgradesPage() {
  const [overview, featured, upgrades, latestNotes, allNotes] =
    await Promise.all([
      fetchUpgradeOverview(),
      fetchFeaturedUpgrades(),
      fetchUpgrades({ sort: "updated-desc" }),
      fetchLatestNotes(9),
      fetchUpgradeNotes(),
    ]);

  // Build a map of upgradeSlug → notes[] for the detail panel
  const notesMap: Record<string, UpgradeNote[]> = {};
  for (const note of allNotes) {
    if (!notesMap[note.upgradeSlug]) {
      notesMap[note.upgradeSlug] = [];
    }
    notesMap[note.upgradeSlug].push(note);
  }

  // Remove featured from the main list to avoid duplicates
  const featuredIds = new Set(featured.map((f) => f.id));
  const listUpgrades = upgrades.items.filter((u) => !featuredIds.has(u.id));

  return (
    <section className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_0%_0%,rgba(153,69,255,0.18),transparent_60%),radial-gradient(ellipse_55%_50%_at_100%_0%,rgba(20,241,149,0.08),transparent_50%),linear-gradient(180deg,rgba(7,8,14,1),rgba(9,11,18,0.96))]" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-5 pb-16 pt-12 md:px-8 md:pb-20 md:pt-16 xl:px-10 xl:pt-[110px]">
        {/* ─── Hero ─── */}
        <header className="space-y-5">
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#ca9ff5]">
              {overview?.eyebrow || "Solana Upgrades"}
            </p>
            <h1 className="max-w-5xl text-[clamp(2.6rem,5vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.03em] text-white">
              {overview?.title || "Protocol upgrades, tracked with context."}
            </h1>
          </div>

          {(overview?.intro || "")
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map((paragraph, index) => (
              <p
                key={index}
                className="max-w-4xl text-base leading-8 text-[#c5c5d1] md:text-lg"
              >
                {paragraph.trim()}
              </p>
            ))}

          <div className="flex flex-wrap items-center gap-6">
            {overview?.lastReviewed ? (
              <span className="text-sm uppercase tracking-[0.22em] text-[#76768c]">
                Last reviewed {overview.lastReviewed}
              </span>
            ) : null}

            {overview?.resources && overview.resources.length > 0 ? (
              <div className="flex flex-wrap gap-4 text-sm">
                {overview.resources.map((resource) => (
                  <Link
                    key={resource.url}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#a8a8ba] underline decoration-white/15 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
                  >
                    {resource.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </header>

        {/* ─── Status Guide ─── */}
        <UpgradesStatusGuide body={overview?.statusGuide} />

        {/* ─── Interactive Content ─── */}
        <UpgradesClientPage
          featured={featured}
          upgrades={listUpgrades}
          latestNotes={latestNotes}
          notesMap={notesMap}
        />
      </div>
    </section>
  );
}
