import type { UpgradeItem } from "@/lib/upgrade-types";
import { UpgradeListItem } from "./upgrade-list-item";

export function UpgradesList({
  title,
  items,
}: {
  title: string;
  items: UpgradeItem[];
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between gap-4 border-b border-[rgba(236,228,253,0.12)] pb-3">
        <h2 className="text-lg font-medium text-white">{title}</h2>
        <div className="text-xs uppercase tracking-[0.2em] text-[#66667a]">
          {items.length} items
        </div>
      </div>
      {items.length > 0 ? (
        <ol>
          {items.map((upgrade) => (
            <UpgradeListItem key={upgrade.id} upgrade={upgrade} />
          ))}
        </ol>
      ) : (
        <div className="rounded-2xl border border-[rgba(236,228,253,0.12)] bg-[rgba(236,228,253,0.03)] p-6 text-sm text-[#a8a8ba]">
          No upgrades match the current filters.
        </div>
      )}
    </section>
  );
}
