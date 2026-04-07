import Link from "next/link";
import type { UpgradeItem } from "@/lib/upgrade-types";
import { RelatedSIMDs } from "./related-simds";
import { StatusBadge } from "./status-badge";

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatTypeLabel(value: string | undefined) {
  if (!value) {
    return null;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function UpgradeListItem({ upgrade }: { upgrade: UpgradeItem }) {
  return (
    <li className="grid gap-4 border-b border-[rgba(236,228,253,0.12)] py-5 md:grid-cols-[120px_minmax(0,1fr)_220px] md:gap-6">
      <div className="space-y-2">
        <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#ca9ff5]">
          SIMD-{upgrade.simdNumber}
        </div>
        <StatusBadge status={upgrade.status} />
      </div>

      <div className="min-w-0 space-y-3">
        <div className="space-y-2">
          <h3 className="text-xl font-medium leading-tight text-white">
            {upgrade.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#8f8fa3]">
            <span>{upgrade.category}</span>
            {upgrade.type ? (
              <>
                <span className="text-[#555568]">/</span>
                <span>{formatTypeLabel(upgrade.type)}</span>
              </>
            ) : null}
          </div>
        </div>

        <p className="max-w-3xl text-sm leading-7 text-[#c5c5d1]">
          {upgrade.editorialNote || upgrade.summary}
        </p>

        <RelatedSIMDs relatedSimds={upgrade.relatedSimds} />
      </div>

      <div className="space-y-3 text-sm text-[#a8a8ba] md:text-right">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#66667a]">
            Updated
          </div>
          <div>{formatDate(upgrade.updatedDate || upgrade.createdDate)}</div>
        </div>

        <div className="flex flex-wrap gap-4 md:justify-end">
          <Link
            href={upgrade.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="text-white underline decoration-white/25 underline-offset-4 hover:decoration-white"
          >
            Proposal
          </Link>
          {upgrade.discussionUrl ? (
            <Link
              href={upgrade.discussionUrl}
              target="_blank"
              rel="noreferrer"
              className="text-white underline decoration-white/25 underline-offset-4 hover:decoration-white"
            >
              Discussion
            </Link>
          ) : null}
        </div>
      </div>
    </li>
  );
}
