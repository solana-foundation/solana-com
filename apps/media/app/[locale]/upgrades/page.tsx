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
    <div className="bg-black">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden text-left text-white">
        <div className="mx-auto max-w-[1440px] px-[20px] py-[64px] md:px-[32px] md:py-[112px] xl:px-[40px] xl:py-[160px]">
          <div className="max-w-5xl">
            <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.35em] text-[#CA9FF5]">
              {overview?.eyebrow || "Solana Upgrades"}
            </p>
            <h1 className="m-0 font-sans font-medium leading-[1.1] md:leading-none text-[40px] md:text-[56px] xl:text-[88px] tracking-[-1.6px] md:tracking-[-2.24px] xl:tracking-[-3.52px]">
              {overview?.title || "Protocol upgrades, tracked with context."}
            </h1>

            <div className="mt-[12px] xl:mt-[24px] space-y-3">
              {(overview?.intro || "")
                .split(/\n\s*\n/)
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p
                    key={index}
                    className="m-0 max-w-xl text-[#ABABBA] text-lg md:text-2xl tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]"
                  >
                    {paragraph.trim()}
                  </p>
                ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              {overview?.lastReviewed ? (
                <span className="text-[13px] font-medium uppercase tracking-[0.22em] text-[#555568]">
                  Last reviewed {overview.lastReviewed}
                </span>
              ) : null}

              {overview?.resources && overview.resources.length > 0 ? (
                <div className="flex flex-wrap gap-5 text-sm">
                  {overview.resources.map((resource) => (
                    <Link
                      key={resource.url}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#ABABBA] underline decoration-white/15 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
                    >
                      {resource.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Divider ─── */}
      <hr className="m-0 border-t border-white/10" />

      {/* ─── Status Guide ─── */}
      <UpgradesStatusGuide body={overview?.statusGuide} />

      {/* ─── Divider ─── */}
      <hr className="m-0 border-t border-white/10" />

      {/* ─── Interactive Content ─── */}
      <UpgradesClientPage
        featured={featured}
        upgrades={listUpgrades}
        latestNotes={latestNotes}
        notesMap={notesMap}
      />
    </div>
  );
}
