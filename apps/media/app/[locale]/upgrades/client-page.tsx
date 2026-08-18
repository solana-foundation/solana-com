"use client";

import { useMemo, useState } from "react";
import { Link } from "@workspace/i18n/routing";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STAGE_BADGE_CLASSES, STAGE_LABELS } from "@/lib/upgrades/stage";
import type {
  ReleaseGroup,
  UpgradeListItem,
} from "@/lib/upgrades/group-by-release";

type View = "table" | "cards";

interface UpgradesClientPageProps {
  groups: ReleaseGroup[];
}

function formatReleaseDate(group: ReleaseGroup): string | null {
  if (!group.expectedDate) {
    return null;
  }

  const formatted = new Date(group.expectedDate).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return group.status === "planned" ? `Expected ${formatted}` : formatted;
}

function StageBadge({ stage }: { stage: UpgradeListItem["stage"] }) {
  return (
    <span
      className={cn(
        "whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium",
        STAGE_BADGE_CLASSES[stage],
      )}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}

function UpgradeCard({ upgrade }: { upgrade: UpgradeListItem }) {
  return (
    <Link
      href={`/upgrades/${upgrade.slug}`}
      className="group flex min-h-[320px] flex-col justify-between border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/25 hover:bg-white/[0.06] md:p-7"
    >
      <div>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <StageBadge stage={upgrade.stage} />
        </div>
        <h3 className="text-2xl font-semibold tracking-[-0.48px] md:text-3xl">
          {upgrade.title}
        </h3>
        {(upgrade.subtitle || upgrade.description) && (
          <p className="mt-4 line-clamp-3 text-base leading-7 text-[#ABABBA]">
            {upgrade.subtitle || upgrade.description}
          </p>
        )}
        {upgrade.metrics.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {upgrade.metrics.slice(0, 2).map((metric) => (
              <div
                key={`${upgrade.slug}-${metric.value}-${metric.label}`}
                className="border border-white/10 bg-black/30 p-4"
              >
                <div className="text-2xl font-semibold text-white">
                  {metric.value}
                </div>
                <div className="mt-1 text-xs leading-5 text-white/55">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-8 flex items-center justify-end gap-4 border-t border-white/10 pt-5">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
          View details
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function OverviewCallout({ overview }: { overview: UpgradeListItem }) {
  return (
    <Link
      href={`/upgrades/${overview.slug}`}
      className="mb-4 block border border-[#14F195]/35 bg-[#14F195]/5 p-6 transition-colors hover:border-[#14F195]/55 hover:bg-[#14F195]/[0.08]"
    >
      <div className="mb-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#14F195]">
        Release overview
      </div>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="max-w-xl">
          <p className="text-sm leading-6 text-[#ABABBA] md:text-[14.5px]">
            {overview.subtitle || overview.description}
          </p>
        </div>
        {overview.metrics.length > 0 && (
          <div className="flex flex-wrap gap-6">
            {overview.metrics.slice(0, 3).map((metric) => (
              <div key={`${overview.slug}-${metric.value}-${metric.label}`}>
                <div className="text-xl font-semibold tabular-nums text-white">
                  {metric.value}
                </div>
                <div className="mt-1 max-w-[11rem] text-[11px] text-white/55">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

function ReleaseHeader({ group }: { group: ReleaseGroup }) {
  const dateLabel = formatReleaseDate(group);

  return (
    <div className="mb-4 flex flex-wrap items-baseline gap-3">
      <h2 className="m-0 text-[22px] font-semibold tracking-[-0.3px]">
        {group.name}
      </h2>
      {group.status === "planned" && (
        <span className="rounded-full border border-[#14F195]/35 bg-[#14F195]/[0.08] px-2.5 py-0.5 text-[11.5px] font-semibold text-[#14F195]">
          Planned
        </span>
      )}
      {group.status === "shipped" && (
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11.5px] font-semibold text-white/70">
          Shipped
        </span>
      )}
      {dateLabel && <span className="text-sm text-white/50">{dateLabel}</span>}
    </div>
  );
}

function TableView({ groups }: { groups: ReleaseGroup[] }) {
  return (
    <>
      {groups.map((group) => (
        <section key={group.key} className="mb-12 last:mb-0">
          <ReleaseHeader group={group} />
          {group.overview && <OverviewCallout overview={group.overview} />}
          <div className="overflow-x-auto border border-white/10">
            <table className="w-full min-w-[480px] table-fixed border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="w-[45%] p-3 px-5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-white/50">
                    Upgrade
                  </th>
                  <th className="w-[27%] p-3 px-5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-white/50">
                    Key metric
                  </th>
                  <th className="w-[28%] py-3 pl-12 pr-5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-white/50">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.upgrades.map((upgrade) => {
                  const metric = upgrade.metrics[0];
                  return (
                    <tr
                      key={upgrade.slug}
                      className="group relative border-b border-white/10 transition-colors last:border-b-0 hover:bg-white/[0.06]"
                    >
                      <td className="p-4 px-5 align-top">
                        <Link
                          href={`/upgrades/${upgrade.slug}`}
                          className="absolute inset-0"
                          aria-label={upgrade.title}
                        />
                        <div className="text-[15px] font-semibold group-hover:underline">
                          {upgrade.title}
                        </div>
                        <div className="mt-1 text-[13px] leading-5 text-[#ABABBA]">
                          {upgrade.subtitle || upgrade.description}
                        </div>
                      </td>
                      <td className="p-4 px-5 align-top">
                        {metric && (
                          <>
                            <div className="font-semibold tabular-nums">
                              {metric.value}
                            </div>
                            <div className="mt-0.5 text-xs text-white/50">
                              {metric.label}
                            </div>
                          </>
                        )}
                      </td>
                      <td className="py-4 pl-12 pr-5 align-top">
                        <StageBadge stage={upgrade.stage} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </>
  );
}

function CardsView({ groups }: { groups: ReleaseGroup[] }) {
  return (
    <>
      {groups.map((group) => {
        const items = group.overview
          ? [group.overview, ...group.upgrades]
          : group.upgrades;

        return (
          <section key={group.key} className="mb-12 last:mb-0">
            <ReleaseHeader group={group} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
              {items.map((upgrade) => (
                <UpgradeCard key={upgrade.slug} upgrade={upgrade} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

export default function UpgradesClientPage({
  groups,
}: UpgradesClientPageProps) {
  const [view, setView] = useState<View>("table");
  const [selectedRelease, setSelectedRelease] = useState("all");

  const releaseOptions = useMemo(
    () =>
      groups
        .filter((group) => group.status !== null)
        .map((group) => ({
          key: group.key,
          label: `${group.name} — ${group.status === "planned" ? "Planned" : "Shipped"}`,
        })),
    [groups],
  );

  const visibleGroups =
    selectedRelease === "all"
      ? groups
      : groups.filter((group) => group.key === selectedRelease);

  if (groups.length === 0) {
    return (
      <div className="py-20 text-center text-lg tracking-[-0.18px] text-white/60">
        No published upgrades found.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="release-select"
            className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50"
          >
            Release
          </label>
          <Select value={selectedRelease} onValueChange={setSelectedRelease}>
            <SelectTrigger
              id="release-select"
              className="min-w-[220px] rounded-lg border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-[14.5px] font-medium text-white ring-offset-0 hover:border-white/25 focus:ring-0 focus:ring-offset-0"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-[220px] rounded-lg border-white/10 bg-black text-white shadow-xl">
              <SelectItem
                value="all"
                className="text-[14.5px] focus:bg-white/10 focus:text-white"
              >
                All releases
              </SelectItem>
              {releaseOptions.map((option) => (
                <SelectItem
                  key={option.key}
                  value={option.key}
                  className="text-[14.5px] focus:bg-white/10 focus:text-white"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="hidden flex-shrink-0 gap-0.5 rounded-lg border border-white/10 p-[3px] md:inline-flex">
          <button
            type="button"
            aria-pressed={view === "table"}
            onClick={() => setView("table")}
            className={cn(
              "rounded-md px-4 py-1.5 text-[13.5px] font-medium",
              view === "table" ? "bg-white text-black" : "text-white/70",
            )}
          >
            List
          </button>
          <button
            type="button"
            aria-pressed={view === "cards"}
            onClick={() => setView("cards")}
            className={cn(
              "rounded-md px-4 py-1.5 text-[13.5px] font-medium",
              view === "cards" ? "bg-white text-black" : "text-white/70",
            )}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Mobile always gets Grid — the table's horizontal scroll doesn't work well at that width. */}
      <div className="md:hidden">
        <CardsView groups={visibleGroups} />
      </div>
      <div className="hidden md:block">
        {view === "table" ? (
          <TableView groups={visibleGroups} />
        ) : (
          <CardsView groups={visibleGroups} />
        )}
      </div>
    </div>
  );
}
