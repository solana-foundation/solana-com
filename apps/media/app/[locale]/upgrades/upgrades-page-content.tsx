import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Github } from "lucide-react";
import UpgradesClientPage from "./client-page";
import {
  fetchFeaturedUpgrades,
  fetchLatestNotes,
  fetchUpgradeNotes,
  fetchUpgradeOverview,
  fetchUpgrades,
} from "@/lib/upgrade-data";
import type { SIMDStatus, UpgradeNote } from "@/lib/upgrade-types";

export async function UpgradesPageContent({
  locale,
  initialSelectedSlug = null,
}: {
  locale: string;
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
  for (const note of allNotes) {
    if (!notesMap[note.upgradeSlug]) {
      notesMap[note.upgradeSlug] = [];
    }
    notesMap[note.upgradeSlug].push(note);
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

  const statusCounts: Record<string, number> = {};
  for (const item of allItems) {
    statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
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
                {overview?.lastReviewed ? (
                  <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#444454]">
                    / Updated {overview.lastReviewed}
                  </span>
                ) : null}
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
                <Link
                  key={resource.url}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium text-[#b9b9c8] transition-colors hover:border-[#ca9ff5]/30 hover:bg-white/[0.06] hover:text-white"
                >
                  {resource.url.includes("github.com") ? (
                    <Github className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {resource.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 border-t border-white/[0.06] py-2.5">
            <span className="mr-1.5 text-[11px] font-semibold tabular-nums tracking-wide text-[#555568]">
              {allItems.length} tracked
            </span>
            {(
              [
                "review",
                "accepted",
                "implemented",
                "activated",
                "draft",
                "idea",
              ] as SIMDStatus[]
            ).map((s) =>
              statusCounts[s] ? (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px] tabular-nums tracking-wide text-[#6B6B7B]"
                >
                  <span
                    className={`inline-block h-[5px] w-[5px] rounded-full ${
                      s === "review"
                        ? "bg-amber-400"
                        : s === "accepted"
                          ? "bg-violet-400"
                          : s === "implemented"
                            ? "bg-sky-400"
                            : s === "activated"
                              ? "bg-emerald-400"
                              : s === "draft"
                                ? "bg-zinc-400"
                                : "bg-zinc-600"
                    }`}
                  />
                  {statusCounts[s]} {s}
                </span>
              ) : null,
            )}
          </div>
        </div>
      </header>

      <UpgradesClientPage
        locale={locale}
        featured={featured}
        upgrades={listUpgrades}
        latestNotes={latestNotes}
        notesMap={notesMap}
        statusGuide={overview?.statusGuide}
        initialSelectedSlug={initialSelectedSlug}
      />
    </div>
  );
}
