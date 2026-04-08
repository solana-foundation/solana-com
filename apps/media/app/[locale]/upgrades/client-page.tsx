"use client";

import { useDeferredValue, useMemo, useState } from "react";
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
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function matchesSearch(upgrade: UpgradeItem, search: string) {
  if (!search) return true;
  const haystack = [
    upgrade.simdNumber,
    upgrade.title,
    upgrade.summary,
    upgrade.description || "",
    upgrade.editorialNote || "",
    upgrade.expectedRelease || "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(search);
}

/* ─── Divider ─── */

function Divider() {
  return <hr className="m-0 border-t border-white/10" />;
}

/* ─── Notes Feed ─── */

function NotesFeed({
  notes,
  onSelectSimd,
}: {
  notes: UpgradeNote[];
  onSelectSimd: (slug: string) => void;
}) {
  if (notes.length === 0) return null;

  return (
    <section className="relative text-left text-white">
      <div className="mx-auto max-w-[1440px] px-[20px] py-[64px] md:px-[32px] md:py-[112px] xl:px-[40px] xl:py-[160px]">
        <div className="mb-[32px] xl:mb-[48px]">
          <h2 className="m-0 font-sans font-medium leading-[1.25] md:leading-[1.1] xl:leading-[1.125] text-[32px] md:text-[40px] xl:text-[64px] tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.56px]">
            Latest updates
          </h2>
          <p className="m-0 mt-2 text-[#ABABBA] text-lg md:text-2xl tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
            {notes.length} recent note{notes.length !== 1 ? "s" : ""} across
            tracked SIMDs
          </p>
        </div>

        <ul className="m-0 list-none p-0 divide-y divide-white/10">
          {notes.map((note) => (
            <li key={note.slug} className="p-0">
              <button
                type="button"
                onClick={() => onSelectSimd(note.upgradeSlug)}
                className="group flex w-full flex-row items-start gap-4 p-[24px_0] xl:p-[24px_12px] text-left transition-colors"
              >
                <div className="shrink-0 leading-4 md:leading-6 text-[#CA9FF5] group-hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path d="M8 0V8H16V16H8V8H0V0H8Z" fill="currentColor" />
                  </svg>
                </div>
                <div className="min-w-0 grow">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-medium uppercase tracking-[0.22em] text-[#CA9FF5]">
                      SIMD-{note.simdNumber}
                    </span>
                    <span className="text-[13px] text-[#555568]">
                      {formatDate(note.publishedAt)}
                    </span>
                  </div>
                  <p className="m-0 mt-1 font-medium text-base md:text-2xl tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.5] md:leading-[1.33]">
                    {note.upgradeTitle}
                  </p>
                  <p className="m-0 mt-1 line-clamp-2 text-[#ABABBA] text-base md:text-lg tracking-[-0.16px] md:tracking-[-0.18px] leading-[1.5] md:leading-[1.77]">
                    {note.body}
                  </p>
                </div>
                <div className="shrink-0 leading-4 md:leading-6">
                  <svg
                    className="text-[#ABABBA] group-hover:text-white transition-colors"
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─── Featured Card ─── */

function FeaturedCard({
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
      className="group flex w-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8 text-left transition-all hover:border-[#CA9FF5]/30 hover:bg-white/[0.04]"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] font-medium uppercase tracking-[0.28em] text-[#CA9FF5]">
            SIMD-{upgrade.simdNumber}
          </span>
          <StatusBadge status={upgrade.status} />
        </div>

        <h3 className="m-0 font-sans font-medium text-[18px] md:text-[24px] leading-[1.33] tracking-[-0.54px] md:tracking-[-0.48px] text-white">
          {upgrade.title}
        </h3>

        {upgrade.expectedRelease ? (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[13px] tracking-wide text-[#ABABBA]">
            <svg
              className="h-3.5 w-3.5 text-[#555568]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {upgrade.expectedRelease}
          </div>
        ) : null}

        <p className="m-0 line-clamp-3 text-[#ABABBA] text-base md:text-lg tracking-[-0.16px] md:tracking-[-0.18px] leading-[1.5] md:leading-[1.77]">
          {upgrade.description || upgrade.editorialNote || upgrade.summary}
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <StatusProgress status={upgrade.status} />
      </div>
    </button>
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

function Filters({
  status,
  category,
  type,
  search,
  onStatusChange,
  onCategoryChange,
  onTypeChange,
  onSearchChange,
}: {
  status: SIMDStatus | "all";
  category: SIMDCategory | "all";
  type: SIMDType | "all";
  search: string;
  onStatusChange: (v: SIMDStatus | "all") => void;
  onCategoryChange: (v: SIMDCategory | "all") => void;
  onTypeChange: (v: SIMDType | "all") => void;
  onSearchChange: (v: string) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onStatusChange(opt.value)}
            className={`rounded-full border px-4 py-2 text-[13px] font-medium tracking-[-0.13px] transition-colors ${
              status === opt.value
                ? "border-white bg-white text-black"
                : "border-white/10 text-[#ABABBA] hover:border-white/25 hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Search + dropdowns */}
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px]">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search SIMD number or title..."
          className="h-11 w-full rounded-xl border border-white/10 bg-transparent px-4 text-[15px] text-white placeholder:text-[#555568] focus:border-[#CA9FF5]/40 focus:outline-none transition-colors"
        />
        <select
          value={category}
          onChange={(e) =>
            onCategoryChange(e.target.value as SIMDCategory | "all")
          }
          className="h-11 rounded-xl border border-white/10 bg-black px-4 text-[15px] text-white focus:border-[#CA9FF5]/40 focus:outline-none transition-colors"
        >
          <option value="all">All categories</option>
          <option value="standard">Standard</option>
          <option value="meta">Meta</option>
          <option value="advisory">Advisory</option>
        </select>
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value as SIMDType | "all")}
          className="h-11 rounded-xl border border-white/10 bg-black px-4 text-[15px] text-white focus:border-[#CA9FF5]/40 focus:outline-none transition-colors"
        >
          <option value="all">All types</option>
          <option value="core">Core</option>
          <option value="networking">Networking</option>
          <option value="interfaces">Interfaces</option>
        </select>
      </div>
    </div>
  );
}

/* ─── List Item ─── */

function SIMDListItem({
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
      className="group flex w-full flex-row items-start gap-4 border-b border-white/10 p-[24px_0] xl:p-[24px_12px] text-left transition-colors"
    >
      {/* Cross icon */}
      <div className="hidden shrink-0 pt-1 md:block leading-6 text-[#555568] group-hover:text-[#CA9FF5] transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path d="M8 0V8H16V16H8V8H0V0H8Z" fill="currentColor" />
        </svg>
      </div>

      {/* Content */}
      <div className="min-w-0 grow">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[13px] font-medium uppercase tracking-[0.25em] text-[#CA9FF5]">
            SIMD-{upgrade.simdNumber}
          </span>
          <StatusBadge status={upgrade.status} />
          {upgrade.expectedRelease ? (
            <span className="text-[13px] tracking-wide text-[#555568]">
              {upgrade.expectedRelease}
            </span>
          ) : null}
        </div>
        <p className="m-0 mt-1 font-medium text-base md:text-xl tracking-[-0.16px] md:tracking-[-0.2px] leading-[1.5] md:leading-[1.4] text-white group-hover:text-[#e8e0f8] transition-colors">
          {upgrade.title}
        </p>
        <p className="m-0 mt-1 line-clamp-1 text-[#ABABBA] text-base tracking-[-0.16px] leading-[1.5]">
          {upgrade.description || upgrade.editorialNote || upgrade.summary}
        </p>
      </div>

      {/* Progress + Date */}
      <div className="hidden shrink-0 flex-col items-end gap-3 md:flex">
        <StatusProgress status={upgrade.status} compact />
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#555568]">
            Updated
          </div>
          <div className="text-[13px] text-[#ABABBA]">
            {formatDate(upgrade.updatedDate || upgrade.createdDate)}
          </div>
        </div>
      </div>
    </button>
  );
}

/* ─── Main Client Page ─── */

export default function UpgradesClientPage({
  featured,
  upgrades,
  latestNotes,
  notesMap,
}: {
  featured: UpgradeItem[];
  upgrades: UpgradeItem[];
  latestNotes: UpgradeNote[];
  notesMap: Record<string, UpgradeNote[]>;
}) {
  const [status, setStatus] = useState<SIMDStatus | "all">("all");
  const [category, setCategory] = useState<SIMDCategory | "all">("all");
  const [type, setType] = useState<SIMDType | "all">("all");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const allItems = useMemo(
    () => [...featured, ...upgrades],
    [featured, upgrades],
  );
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
      return matchesSearch(upgrade, deferredSearch);
    });
  }, [upgrades, status, category, type, deferredSearch]);

  const isFiltered =
    status !== "all" ||
    category !== "all" ||
    type !== "all" ||
    deferredSearch.length > 0;

  return (
    <>
      {/* Latest notes */}
      <NotesFeed
        notes={latestNotes}
        onSelectSimd={(slug) => setSelectedSlug(slug)}
      />

      <Divider />

      {/* Featured */}
      {!isFiltered && featured.length > 0 ? (
        <>
          <section className="relative text-left text-white">
            <div className="mx-auto max-w-[1440px] px-[20px] py-[64px] md:px-[32px] md:py-[112px] xl:px-[40px] xl:py-[160px]">
              <div className="mb-[32px] xl:mb-[48px]">
                <h2 className="m-0 font-sans font-medium leading-[1.25] md:leading-[1.1] xl:leading-[1.125] text-[32px] md:text-[40px] xl:text-[64px] tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.56px]">
                  Featured upgrades
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {featured.map((upgrade) => (
                  <FeaturedCard
                    key={upgrade.id}
                    upgrade={upgrade}
                    onClick={() => setSelectedSlug(upgrade.slug)}
                  />
                ))}
              </div>
            </div>
          </section>

          <Divider />
        </>
      ) : null}

      {/* Filters + List */}
      <section className="relative text-left text-white">
        <div className="mx-auto max-w-[1440px] px-[20px] py-[64px] md:px-[32px] md:py-[112px] xl:px-[40px] xl:py-[160px]">
          <div className="mb-[32px] xl:mb-[48px]">
            <h2 className="m-0 font-sans font-medium leading-[1.25] md:leading-[1.1] xl:leading-[1.125] text-[32px] md:text-[40px] xl:text-[64px] tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.56px]">
              All tracked SIMDs
            </h2>
            <p className="m-0 mt-2 text-[#ABABBA] text-lg md:text-2xl tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
              {filteredUpgrades.length} result
              {filteredUpgrades.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Filters
            status={status}
            category={category}
            type={type}
            search={search}
            onStatusChange={setStatus}
            onCategoryChange={setCategory}
            onTypeChange={setType}
            onSearchChange={setSearch}
          />

          <div className="mt-8">
            {filteredUpgrades.length > 0 ? (
              <div>
                {filteredUpgrades.map((upgrade) => (
                  <SIMDListItem
                    key={upgrade.id}
                    upgrade={upgrade}
                    onClick={() => setSelectedSlug(upgrade.slug)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-2xl border border-white/10 py-24">
                <p className="m-0 text-[#555568] text-lg">
                  No SIMDs match the current filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Detail Panel */}
      <SIMDDetailPanel
        upgrade={selectedUpgrade}
        notes={selectedNotes}
        onClose={() => setSelectedSlug(null)}
      />
    </>
  );
}
