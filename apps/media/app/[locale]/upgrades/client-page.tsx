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
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#ca9ff5]">
          Latest updates
        </h2>
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#66667a]">
          {notes.length} note{notes.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <button
            key={note.slug}
            type="button"
            onClick={() => onSelectSimd(note.upgradeSlug)}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-left transition-all hover:border-[#ca9ff5]/30 hover:bg-white/[0.04]"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ca9ff5]/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#ca9ff5]">
                SIMD-{note.simdNumber}
              </span>
              <span className="text-[10px] text-[#555568]">
                {formatDate(note.publishedAt)}
              </span>
            </div>
            <div className="mt-1.5 text-sm font-medium text-white">
              {note.upgradeTitle}
            </div>
            <p className="mt-1.5 line-clamp-3 text-[13px] leading-[1.6] text-[#a8a8ba]">
              {note.body}
            </p>
          </button>
        ))}
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
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[linear-gradient(160deg,rgba(153,69,255,0.06),transparent_50%)] p-5 text-left transition-all hover:border-[#ca9ff5]/25"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ca9ff5]/30 to-transparent" />

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#ca9ff5]">
            SIMD-{upgrade.simdNumber}
          </span>
          <StatusBadge status={upgrade.status} />
        </div>

        <h3 className="text-lg font-medium leading-snug text-white">
          {upgrade.title}
        </h3>

        {upgrade.expectedRelease ? (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] tracking-wide text-[#a8a8ba]">
            <svg
              className="h-3 w-3 text-[#8f8fa3]"
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

        <p className="line-clamp-3 text-sm leading-6 text-[#a8a8ba]">
          {upgrade.description || upgrade.editorialNote || upgrade.summary}
        </p>

        <div className="pt-1">
          <StatusProgress status={upgrade.status} />
        </div>
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
    <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-[rgba(9,11,20,0.7)] p-4 md:p-5">
      {/* Status tabs */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onStatusChange(opt.value)}
            className={`rounded-full border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] transition-colors ${
              status === opt.value
                ? "border-white bg-white text-black"
                : "border-white/[0.1] text-[#b3b3c2] hover:border-white/[0.25] hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Search + dropdowns */}
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_160px]">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search SIMD number or title..."
          className="h-10 w-full rounded-xl border border-white/[0.1] bg-transparent px-3.5 text-sm text-white placeholder:text-[#555568] focus:border-[#ca9ff5]/40 focus:outline-none"
        />
        <select
          value={category}
          onChange={(e) =>
            onCategoryChange(e.target.value as SIMDCategory | "all")
          }
          className="h-10 rounded-xl border border-white/[0.1] bg-[#0d0f18] px-3 text-sm text-white focus:border-[#ca9ff5]/40 focus:outline-none"
        >
          <option value="all">All categories</option>
          <option value="standard">Standard</option>
          <option value="meta">Meta</option>
          <option value="advisory">Advisory</option>
        </select>
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value as SIMDType | "all")}
          className="h-10 rounded-xl border border-white/[0.1] bg-[#0d0f18] px-3 text-sm text-white focus:border-[#ca9ff5]/40 focus:outline-none"
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
      className="group grid w-full gap-3 border-b border-white/[0.06] py-4 text-left transition-colors hover:bg-white/[0.01] md:grid-cols-[90px_minmax(0,1fr)_180px_200px] md:gap-4 md:px-2"
    >
      {/* SIMD number + badge */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#ca9ff5]">
          SIMD-{upgrade.simdNumber}
        </div>
        <StatusBadge status={upgrade.status} />
      </div>

      {/* Title + description */}
      <div className="min-w-0 space-y-1">
        <h3 className="truncate text-[15px] font-medium text-white group-hover:text-[#e8e0f8]">
          {upgrade.title}
        </h3>
        <p className="line-clamp-1 text-[13px] leading-relaxed text-[#8f8fa3]">
          {upgrade.description || upgrade.editorialNote || upgrade.summary}
        </p>
        {upgrade.expectedRelease ? (
          <span className="text-[11px] tracking-wide text-[#66667a]">
            {upgrade.expectedRelease}
          </span>
        ) : null}
      </div>

      {/* Progress */}
      <div className="flex items-center">
        <StatusProgress status={upgrade.status} compact />
      </div>

      {/* Date */}
      <div className="flex items-center justify-end text-right">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#555568]">
            Updated
          </div>
          <div className="text-xs text-[#8f8fa3]">
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

      {/* Featured */}
      {!isFiltered && featured.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#ca9ff5]">
            Featured upgrades
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((upgrade) => (
              <FeaturedCard
                key={upgrade.id}
                upgrade={upgrade}
                onClick={() => setSelectedSlug(upgrade.slug)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Filters + List */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#ca9ff5]">
          All tracked SIMDs
        </h2>

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

        <div>
          <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs text-[#8f8fa3]">
              {filteredUpgrades.length} result
              {filteredUpgrades.length !== 1 ? "s" : ""}
            </span>
          </div>

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
            <div className="flex items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.01] py-16">
              <p className="text-sm text-[#66667a]">
                No SIMDs match the current filters.
              </p>
            </div>
          )}
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
