import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Github } from "lucide-react";
import UpgradesClientPage from "./client-page";
import { Button } from "@/components/ui/button";
import {
  fetchFeaturedUpgrades,
  fetchLatestNotes,
  fetchUpgradeNotes,
  fetchUpgradeOverview,
  fetchUpgrades,
} from "@/lib/upgrade-data";
import type { UpgradeNote } from "@/lib/upgrade-types";

export async function UpgradesPageContent({
  initialSelectedSlug = null,
}: {
  initialSelectedSlug?: string | null;
}) {
  const [overview, featured, upgrades, latestNotes, allNotes] =
    await Promise.all([
      fetchUpgradeOverview(),
      fetchFeaturedUpgrades(),
      fetchUpgrades({ sort: "updated-desc" }),
      fetchLatestNotes(9),
      fetchUpgradeNotes(),
    ]);

  const notesMap: Record<string, UpgradeNote[]> = {};
  const expectedReleaseByUpgradeSlug: Record<string, string> = {};
  for (const note of allNotes) {
    if (!notesMap[note.upgradeSlug]) {
      notesMap[note.upgradeSlug] = [];
    }
    notesMap[note.upgradeSlug].push(note);

    if (
      !expectedReleaseByUpgradeSlug[note.upgradeSlug] &&
      note.expectedRelease
    ) {
      expectedReleaseByUpgradeSlug[note.upgradeSlug] = note.expectedRelease;
    }
  }

  const featuredIds = new Set(featured.map((f) => f.id));
  const listUpgrades = upgrades.items.filter((u) => !featuredIds.has(u.id));

  const allItems = [...featured, ...listUpgrades];
  if (
    initialSelectedSlug &&
    !allItems.some((item) => item.slug === initialSelectedSlug)
  ) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8">
          <div className="flex flex-col gap-3 py-5 md:flex-row md:items-end md:justify-between md:py-6">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-3">
                <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#CA9FF5]">
                  {overview?.eyebrow || "Solana Upgrades"}
                </p>
              </div>
              <h1 className="m-0 font-sans text-[20px] font-medium leading-snug tracking-[-0.3px] text-white md:text-[26px] md:tracking-[-0.52px]">
                {overview?.title || "Protocol upgrades, tracked with context."}
              </h1>
              {overview?.intro ? (
                <p className="m-0 mt-1 max-w-2xl text-[13px] leading-relaxed text-[#6B6B7B]">
                  {overview.intro.split(/\n\s*\n/)[0]?.trim()}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-4">
              {overview?.resources?.map((resource) => (
                <Button
                  key={resource.url}
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-auto rounded-full border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium text-[#b9b9c8] hover:border-[#ca9ff5]/30 hover:bg-white/[0.06] hover:text-white dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                >
                  <Link href={resource.url} target="_blank" rel="noreferrer">
                    {resource.url.includes("github.com") ? (
                      <Github className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <ArrowUpRight
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                    )}
                    {resource.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <UpgradesClientPage
        featured={featured}
        upgrades={listUpgrades}
        latestNotes={latestNotes}
        notesMap={notesMap}
        expectedReleaseByUpgradeSlug={expectedReleaseByUpgradeSlug}
        statusGuide={overview?.statusGuide}
        initialSelectedSlug={initialSelectedSlug}
      />
    </div>
  );
}
