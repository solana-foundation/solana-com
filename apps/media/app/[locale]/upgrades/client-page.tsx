"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { UpgradeFilters } from "@/components/upgrades/upgrade-filters";
import { UpgradesList } from "@/components/upgrades/upgrades-list";
import type {
  SIMDCategory,
  SIMDStatus,
  SIMDType,
  UpgradeItem,
} from "@/lib/upgrade-types";

function matchesSearch(upgrade: UpgradeItem, search: string) {
  if (!search) {
    return true;
  }

  const haystack = [
    upgrade.simdNumber,
    upgrade.title,
    upgrade.summary,
    upgrade.editorialNote || "",
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(search);
}

export default function UpgradesClientPage({
  upgrades,
}: {
  upgrades: UpgradeItem[];
}) {
  const [status, setStatus] = useState<SIMDStatus | "all">("all");
  const [category, setCategory] = useState<SIMDCategory | "all">("all");
  const [type, setType] = useState<SIMDType | "all">("all");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const filteredUpgrades = useMemo(() => {
    return upgrades.filter((upgrade) => {
      if (status !== "all" && upgrade.status !== status) return false;
      if (category !== "all" && upgrade.category !== category) return false;
      if (type !== "all" && upgrade.type !== type) return false;
      return matchesSearch(upgrade, deferredSearch);
    });
  }, [upgrades, status, category, type, deferredSearch]);

  const showFeatured =
    status === "all" &&
    category === "all" &&
    type === "all" &&
    deferredSearch.length === 0;
  const featuredIds = new Set(
    showFeatured
      ? filteredUpgrades
          .filter((upgrade) => upgrade.featured)
          .map((item) => item.id)
      : [],
  );
  const featured = showFeatured
    ? filteredUpgrades.filter((upgrade) => featuredIds.has(upgrade.id))
    : [];
  const listItems = showFeatured
    ? filteredUpgrades.filter((upgrade) => !featuredIds.has(upgrade.id))
    : filteredUpgrades;

  return (
    <div className="space-y-8">
      <UpgradeFilters
        status={status}
        category={category}
        type={type}
        search={search}
        onStatusChange={setStatus}
        onCategoryChange={setCategory}
        onTypeChange={setType}
        onSearchChange={setSearch}
      />

      {featured.length > 0 ? (
        <UpgradesList title="Featured upgrades" items={featured} />
      ) : null}

      <UpgradesList
        title={showFeatured ? "All tracked upgrades" : "Filtered upgrades"}
        items={listItems}
      />
    </div>
  );
}
