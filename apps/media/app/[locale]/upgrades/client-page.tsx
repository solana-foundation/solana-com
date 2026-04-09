"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "@workspace/i18n/routing";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type {
  SIMDCategory,
  SIMDStatus,
  SIMDType,
  UpgradeItem,
  UpgradeNote,
} from "@/lib/upgrade-types";
import { StatusProgress } from "@/components/upgrades/status-progress";
import { StatusBadge } from "@/components/upgrades/status-badge";
import { SIMDDetailPanel } from "@/components/upgrades/simd-detail-panel";

/* ─── helpers ─── */

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function relativeDate(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

function matchesSearch(
  upgrade: UpgradeItem,
  search: string,
  expectedRelease?: string,
) {
  if (!search) return true;
  const haystack = [
    upgrade.simdNumber,
    upgrade.title,
    upgrade.summary,
    upgrade.description || "",
    upgrade.editorialNote || "",
    expectedRelease || "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(search);
}

/* ─── Status Guide (collapsible) ─── */

const STATUS_GUIDE_ITEMS = [
  { status: "idea" as const, body: "Early proposals and concept-stage work" },
  {
    status: "review" as const,
    body: "Active proposals under technical review",
  },
  {
    status: "accepted" as const,
    body: "Approved proposals moving toward implementation",
  },
  {
    status: "implemented" as const,
    body: "Protocol work has landed but may not be broadly activated",
  },
  {
    status: "activated" as const,
    body: "The upgrade is live or broadly available to the network",
  },
];

function StatusGuideToggle({ body }: { body?: string }) {
  return (
    <Disclosure>
      <DisclosureButton className="group flex w-full cursor-pointer items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.015] px-3.5 py-2.5 text-left text-[12px] font-medium text-[#8A8A9A] transition-colors hover:border-white/[0.1] hover:bg-white/[0.03] hover:text-white">
        <svg
          className="h-3.5 w-3.5 shrink-0 text-[#555568] transition-transform group-data-[open]:rotate-90"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m9 5 7 7-7 7"
          />
        </svg>
        <span className="uppercase tracking-[0.18em]">Status guide</span>
      </DisclosureButton>
      <DisclosurePanel
        transition
        className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-2 data-[closed]:opacity-0"
      >
        <div className="mt-2 rounded-lg border border-white/[0.06] bg-white/[0.015] p-4">
          {body ? (
            <p className="mb-3 text-[13px] leading-relaxed text-[#6B6B7B]">
              {body.split(/\n\s*\n/)[0]?.trim()}
            </p>
          ) : null}
          <table className="w-full border-collapse">
            <tbody>
              {STATUS_GUIDE_ITEMS.map((item) => (
                <tr key={item.status}>
                  <td className="w-0 whitespace-nowrap py-1.5 pr-3 align-middle">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-1.5 align-middle text-[12px] leading-snug text-[#6B6B7B]">
                    {item.body}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

/* ─── Compact Featured Strip ─── */

function FeaturedStrip({
  items,
  expectedReleaseByUpgradeSlug,
  onSelect,
}: {
  items: UpgradeItem[];
  expectedReleaseByUpgradeSlug: Record<string, string>;
  onSelect: (_slug: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center gap-2">
        <h2 className="m-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#CA9FF5]">
          Pinned
        </h2>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((upgrade) => {
          const expectedRelease = expectedReleaseByUpgradeSlug[upgrade.slug];

          return (
            <button
              key={upgrade.id}
              type="button"
              onClick={() => onSelect(upgrade.slug)}
              className="group flex cursor-pointer items-start gap-3 rounded-lg border border-[#CA9FF5]/10 bg-[#CA9FF5]/[0.02] p-3 text-left transition-all hover:border-[#CA9FF5]/25 hover:bg-[#CA9FF5]/[0.05]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[12px] font-medium text-[#CA9FF5]">
                    {upgrade.simdNumber}
                  </span>
                  <StatusBadge status={upgrade.status} />
                </div>
                <p className="m-0 mt-1 text-[13px] font-medium leading-snug text-white group-hover:text-[#e8e0f8]">
                  {upgrade.title}
                </p>
                {expectedRelease ? (
                  <span className="mt-1 inline-block text-[11px] tracking-wide text-[#555568]">
                    {expectedRelease}
                  </span>
                ) : null}
              </div>
              <svg
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#555568] transition-colors group-hover:text-[#CA9FF5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="m9 5 7 7-7 7"
                />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Filters ─── */

const STATUS_OPTIONS: { label: string; value: SIMDStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Idea", value: "idea" },
  { label: "Draft", value: "draft" },
  { label: "Review", value: "review" },
  { label: "Accepted", value: "accepted" },
  { label: "Implemented", value: "implemented" },
  { label: "Activated", value: "activated" },
];

const STICKY_HEADER_OFFSET_CLASS = "top-[65px]";

function Filters({
  status,
  category,
  type,
  search,
  resultCount,
  onStatusChange,
  onCategoryChange,
  onTypeChange,
  onSearchChange,
}: {
  status: SIMDStatus | "all";
  category: SIMDCategory | "all";
  type: SIMDType | "all";
  search: string;
  resultCount: number;
  onStatusChange: (_value: SIMDStatus | "all") => void;
  onCategoryChange: (_value: SIMDCategory | "all") => void;
  onTypeChange: (_value: SIMDType | "all") => void;
  onSearchChange: (_value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4">
        {/* Status pills */}
        <div className="flex flex-wrap gap-1">
          {STATUS_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              type="button"
              onClick={() => onStatusChange(opt.value)}
              aria-pressed={status === opt.value}
              variant="ghost"
              size="sm"
              className={`h-auto px-2.5 py-1.5 text-[12px] font-medium tracking-[-0.12px] ${
                status === opt.value
                  ? "bg-white text-black"
                  : "text-[#6B6B7B] hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {opt.label}
            </Button>
          ))}
        </div>

        <div className="hidden h-4 w-px bg-white/[0.08] md:block" />

        {/* Category + Type dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={category}
            aria-label="Filter by category"
            onChange={(e) =>
              onCategoryChange(e.target.value as SIMDCategory | "all")
            }
            className="h-8 cursor-pointer rounded-md border border-white/[0.08] bg-transparent px-2.5 text-[12px] text-[#8A8A9A] focus:border-[#CA9FF5]/30 focus:outline-none"
          >
            <option value="all">All categories</option>
            <option value="standard">Standard</option>
            <option value="meta">Meta</option>
            <option value="advisory">Advisory</option>
          </select>
          <select
            value={type}
            aria-label="Filter by type"
            onChange={(e) => onTypeChange(e.target.value as SIMDType | "all")}
            className="h-8 cursor-pointer rounded-md border border-white/[0.08] bg-transparent px-2.5 text-[12px] text-[#8A8A9A] focus:border-[#CA9FF5]/30 focus:outline-none"
          >
            <option value="all">All types</option>
            <option value="core">Core</option>
            <option value="networking">Networking</option>
            <option value="interfaces">Interfaces</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#555568]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search SIMDs"
            placeholder="Search by SIMD number, title, or keyword..."
            className="h-8 w-full rounded-md border border-white/[0.08] bg-transparent pl-9 pr-3 text-[13px] text-white placeholder:text-[#444454] focus:border-[#CA9FF5]/30 focus:outline-none"
          />
        </div>
        <span className="shrink-0 text-[11px] font-medium tracking-wide text-[#555568]">
          {resultCount} result{resultCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

/* ─── Mobile List Row ─── */

function MobileRow({
  upgrade,
  onClick,
}: {
  upgrade: UpgradeItem;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full cursor-pointer border-b border-white/[0.04] px-2 py-3 text-left transition-colors hover:bg-white/[0.02]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="shrink-0 font-mono text-[12px] font-medium tabular-nums text-[#CA9FF5]">
            {upgrade.simdNumber}
          </span>
          <StatusBadge status={upgrade.status} />
        </div>
        <span className="shrink-0 pt-0.5 text-right font-mono text-[11px] tabular-nums text-[#555568]">
          {relativeDate(upgrade.updatedDate || upgrade.createdDate)}
        </span>
      </div>

      <div className="mt-2 min-w-0">
        <p className="m-0 line-clamp-2 text-[14px] font-medium leading-snug text-white group-hover:text-[#e8e0f8]">
          {upgrade.title}
        </p>
      </div>
    </button>
  );
}

/* ─── Desktop Table ─── */

function UpgradeTable({
  upgrades,
  expectedReleaseByUpgradeSlug,
  onSelect,
}: {
  upgrades: UpgradeItem[];
  expectedReleaseByUpgradeSlug: Record<string, string>;
  onSelect: (_slug: string) => void;
}) {
  return (
    <div className="hidden overflow-x-auto lg:block">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[72px]" />
          <col className="w-[120px]" />
          <col />
          <col className="w-[132px]" />
          <col className="w-[84px]" />
          <col className="w-[28px]" />
        </colgroup>
        <thead>
          <tr className="border-b border-white/[0.08] text-[10px] font-semibold uppercase tracking-[0.16em] text-[#444454]">
            <th className="px-2 py-2 text-left">SIMD</th>
            <th className="px-2 py-2 text-left">Status</th>
            <th className="px-2 py-2 text-left">Title</th>
            <th className="px-2 py-2 text-right">Progress</th>
            <th className="px-2 py-2 text-right">Updated</th>
            <th className="px-2 py-2" aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {upgrades.map((upgrade) => {
            const expectedRelease = expectedReleaseByUpgradeSlug[upgrade.slug];

            return (
              <tr
                key={upgrade.id}
                tabIndex={0}
                role="link"
                aria-label={`View SIMD-${upgrade.simdNumber}: ${upgrade.title}`}
                onClick={() => onSelect(upgrade.slug)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(upgrade.slug);
                  }
                }}
                className="group cursor-pointer border-b border-white/[0.04] text-left transition-colors hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CA9FF5]/40"
              >
                <td className="px-2 py-3 align-top font-mono text-[12px] font-medium tabular-nums text-[#CA9FF5]">
                  {upgrade.simdNumber}
                </td>
                <td className="px-2 py-3 align-top">
                  <StatusBadge status={upgrade.status} />
                </td>
                <td className="min-w-0 px-2 lg:pr-6 py-3 align-top">
                  <p className="m-0 truncate text-[13px] font-medium leading-snug text-white group-hover:text-[#e8e0f8]">
                    {upgrade.title}
                  </p>
                  <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
                    <span className="uppercase tracking-[0.12em] text-[#444454]">
                      {upgrade.category}
                      {upgrade.type ? `/${upgrade.type.slice(0, 4)}` : ""}
                    </span>
                    {expectedRelease ? (
                      <span className="tracking-wide text-[#555568]">
                        {expectedRelease}
                      </span>
                    ) : null}
                  </div>
                  <p className="m-0 mt-0.5 truncate text-[12px] leading-snug text-[#6B6B7B]">
                    {upgrade.description ||
                      upgrade.editorialNote ||
                      upgrade.summary}
                  </p>
                </td>
                <td className="px-2 py-3 align-top">
                  <div className="flex justify-end">
                    <StatusProgress status={upgrade.status} compact />
                  </div>
                </td>
                <td className="px-2 py-3 align-top text-right font-mono text-[11px] tabular-nums text-[#555568]">
                  {relativeDate(upgrade.updatedDate || upgrade.createdDate)}
                </td>
                <td className="px-2 py-3 align-top" aria-hidden="true">
                  <svg
                    className="ml-auto h-3 w-3 shrink-0 text-[#333344] transition-colors group-hover:text-[#CA9FF5]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m9 5 7 7-7 7"
                    />
                  </svg>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Activity Sidebar ─── */

function ActivitySidebar({
  notes,
  onSelectSimd,
}: {
  notes: UpgradeNote[];
  onSelectSimd: (_slug: string) => void;
}) {
  if (notes.length === 0) return null;

  return (
    <aside
      aria-label="Recent activity"
      className="w-full shrink-0 lg:w-[280px] lg:pl-6 xl:w-[320px]"
    >
      <div className={`sticky ${STICKY_HEADER_OFFSET_CLASS} pt-1`}>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="m-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#CA9FF5]">
            Recent activity
          </h2>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        <div className="space-y-0 divide-y divide-white/[0.04]">
          {notes.map((note) => (
            <button
              key={note.slug}
              type="button"
              onClick={() => onSelectSimd(note.upgradeSlug)}
              className="group flex w-full cursor-pointer gap-3 py-3 text-left transition-colors first:pt-0"
            >
              <div
                className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#CA9FF5]/40 group-hover:bg-[#CA9FF5]"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-medium text-[#CA9FF5]">
                    {note.simdNumber}
                  </span>
                  <span className="text-[11px] text-[#555568]">
                    {formatDate(note.publishedAt)}
                  </span>
                </div>
                <p className="m-0 mt-0.5 text-[12px] font-medium leading-snug text-[#ABABBA] group-hover:text-white">
                  {note.upgradeTitle}
                </p>
                <p className="m-0 mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-[#6B6B7B]">
                  {note.body}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* ─── Main Client Page ─── */

export default function UpgradesClientPage({
  featured,
  upgrades,
  latestNotes,
  notesMap,
  expectedReleaseByUpgradeSlug,
  statusGuide,
  initialSelectedSlug = null,
}: {
  featured: UpgradeItem[];
  upgrades: UpgradeItem[];
  latestNotes: UpgradeNote[];
  notesMap: Record<string, UpgradeNote[]>;
  expectedReleaseByUpgradeSlug: Record<string, string>;
  statusGuide?: string;
  initialSelectedSlug?: string | null;
}) {
  const [status, setStatus] = useState<SIMDStatus | "all">("all");
  const [category, setCategory] = useState<SIMDCategory | "all">("all");
  const [type, setType] = useState<SIMDType | "all">("all");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    initialSelectedSlug,
  );

  const allItems = useMemo(
    () => [...featured, ...upgrades],
    [featured, upgrades],
  );
  const simdMetaByNumber = useMemo(
    () =>
      Object.fromEntries(
        allItems.map((item) => [
          item.simdNumber,
          {
            slug: item.slug,
            simdNumber: item.simdNumber,
            title: item.title,
          },
        ]),
      ),
    [allItems],
  );
  const basePath = "/upgrades";
  const selectedUpgrade = useMemo(
    () => allItems.find((u) => u.slug === selectedSlug) ?? null,
    [allItems, selectedSlug],
  );
  const selectedNotes = selectedSlug ? (notesMap[selectedSlug] ?? []) : [];

  const filteredUpgrades = useMemo(() => {
    return upgrades.filter((upgrade) => {
      if (status !== "all" && upgrade.status !== status) return false;
      if (category !== "all" && upgrade.category !== category) return false;
      if (type !== "all" && upgrade.type !== type) return false;
      return matchesSearch(
        upgrade,
        deferredSearch,
        expectedReleaseByUpgradeSlug[upgrade.slug],
      );
    });
  }, [
    upgrades,
    status,
    category,
    type,
    deferredSearch,
    expectedReleaseByUpgradeSlug,
  ]);

  const isFiltered =
    status !== "all" ||
    category !== "all" ||
    type !== "all" ||
    deferredSearch.length > 0;

  useEffect(() => {
    setSelectedSlug(initialSelectedSlug);
  }, [initialSelectedSlug]);

  useEffect(() => {
    const currentPath = pathname.replace(/\/$/, "") || "/";
    const detailPrefix = `${basePath}/`;

    if (currentPath.startsWith(detailPrefix)) {
      const nextSlug = decodeURIComponent(
        currentPath.slice(detailPrefix.length),
      );
      setSelectedSlug(
        allItems.some((item) => item.slug === nextSlug) ? nextSlug : null,
      );
      return;
    }

    setSelectedSlug(null);
  }, [allItems, pathname]);

  function selectSimd(slug: string) {
    setSelectedSlug(slug);

    const detailPath = `${basePath}/${slug}`;
    if (pathname !== detailPath) {
      router.push(detailPath, { scroll: false });
    }
  }

  function closePanel() {
    setSelectedSlug(null);

    if (pathname !== basePath) {
      router.push(basePath, { scroll: false });
    }
  }

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-5 md:px-8">
        <div className="flex gap-0 py-5 lg:gap-0">
          {/* ─── Main Column ─── */}
          <div className="min-w-0 flex-1">
            {/* Status guide toggle */}
            <div className="mb-4">
              <StatusGuideToggle body={statusGuide} />
            </div>

            {/* Sticky filter bar */}
            <div
              className={`sticky ${STICKY_HEADER_OFFSET_CLASS} z-20 -mx-5 bg-black/95 px-5 py-3 backdrop-blur-sm md:-mx-8 md:px-8`}
            >
              <Filters
                status={status}
                category={category}
                type={type}
                search={search}
                resultCount={
                  isFiltered ? filteredUpgrades.length : allItems.length
                }
                onStatusChange={setStatus}
                onCategoryChange={setCategory}
                onTypeChange={setType}
                onSearchChange={setSearch}
              />
            </div>

            {/* Featured strip (when not filtering) */}
            {!isFiltered && featured.length > 0 ? (
              <FeaturedStrip
                items={featured}
                expectedReleaseByUpgradeSlug={expectedReleaseByUpgradeSlug}
                onSelect={selectSimd}
              />
            ) : null}

            {/* List */}
            <div>
              {filteredUpgrades.length > 0 ? (
                <>
                  <UpgradeTable
                    upgrades={filteredUpgrades}
                    expectedReleaseByUpgradeSlug={expectedReleaseByUpgradeSlug}
                    onSelect={selectSimd}
                  />
                  <div className="lg:hidden">
                    {filteredUpgrades.map((upgrade) => (
                      <MobileRow
                        key={upgrade.id}
                        upgrade={upgrade}
                        onClick={() => selectSimd(upgrade.slug)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <Card className="my-6 border border-white/[0.06] bg-white/[0.02] py-0 text-white shadow-none">
                  <CardContent className="flex items-center justify-center px-6 py-16">
                    <p className="m-0 text-[13px] text-[#555568]">
                      No SIMDs match the current filters.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* ─── Activity Sidebar ─── */}
          <div className="hidden lg:block">
            <ActivitySidebar notes={latestNotes} onSelectSimd={selectSimd} />
          </div>
        </div>

        {/* Mobile: Activity section below list */}
        <div className="border-t border-white/[0.06] py-6 lg:hidden">
          <ActivitySidebar notes={latestNotes} onSelectSimd={selectSimd} />
        </div>
      </div>

      {/* Detail Panel */}
      <SIMDDetailPanel
        upgrade={selectedUpgrade}
        notes={selectedNotes}
        relatedSimdsByNumber={simdMetaByNumber}
        onClose={closePanel}
      />
    </>
  );
}
