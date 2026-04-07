"use client";

import type { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import type { SIMDCategory, SIMDStatus, SIMDType } from "@/lib/upgrade-types";

const STATUSES: Array<{ label: string; value: SIMDStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Idea", value: "idea" },
  { label: "Draft", value: "draft" },
  { label: "Review", value: "review" },
  { label: "Accepted", value: "accepted" },
  { label: "Implemented", value: "implemented" },
  { label: "Activated", value: "activated" },
];

interface UpgradeFiltersProps {
  status: SIMDStatus | "all";
  category: SIMDCategory | "all";
  type: SIMDType | "all";
  search: string;
  onStatusChange: Dispatch<SetStateAction<SIMDStatus | "all">>;
  onCategoryChange: Dispatch<SetStateAction<SIMDCategory | "all">>;
  onTypeChange: Dispatch<SetStateAction<SIMDType | "all">>;
  onSearchChange: Dispatch<SetStateAction<string>>;
}

export function UpgradeFilters({
  status,
  category,
  type,
  search,
  onStatusChange,
  onCategoryChange,
  onTypeChange,
  onSearchChange,
}: UpgradeFiltersProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-[rgba(236,228,253,0.12)] bg-[rgba(9,11,20,0.7)] p-5 md:p-6">
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onStatusChange(item.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] transition-colors",
              status === item.value
                ? "border-white bg-white text-black"
                : "border-[rgba(236,228,253,0.14)] text-[#b3b3c2] hover:border-[rgba(236,228,253,0.3)] hover:text-white",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px]">
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by SIMD number or title"
          className="h-11 rounded-2xl border border-[rgba(236,228,253,0.14)] bg-transparent px-4 text-sm text-white outline-hidden placeholder:text-[#77778b]"
        />

        <select
          value={category}
          onChange={(event) =>
            onCategoryChange(event.target.value as SIMDCategory | "all")
          }
          className="h-11 rounded-2xl border border-[rgba(236,228,253,0.14)] bg-[#0d0f18] px-4 text-sm text-white outline-hidden"
        >
          <option value="all">All categories</option>
          <option value="standard">Standard</option>
          <option value="meta">Meta</option>
          <option value="advisory">Advisory</option>
        </select>

        <select
          value={type}
          onChange={(event) =>
            onTypeChange(event.target.value as SIMDType | "all")
          }
          className="h-11 rounded-2xl border border-[rgba(236,228,253,0.14)] bg-[#0d0f18] px-4 text-sm text-white outline-hidden"
        >
          <option value="all">All types</option>
          <option value="core">Core</option>
          <option value="networking">Networking</option>
          <option value="interfaces">Interfaces</option>
        </select>
      </div>
    </section>
  );
}
