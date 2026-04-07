import { cn } from "@/lib/utils";
import type { SIMDStatus } from "@/lib/upgrade-types";

const STATUS_STYLES: Record<SIMDStatus, string> = {
  idea: "border-zinc-500/50 bg-zinc-500/10 text-zinc-200",
  draft: "border-zinc-500/50 bg-zinc-500/10 text-zinc-200",
  review: "border-amber-400/40 bg-amber-400/12 text-amber-200",
  accepted: "border-violet-400/40 bg-violet-400/12 text-violet-200",
  implemented: "border-sky-400/40 bg-sky-400/12 text-sky-200",
  activated: "border-emerald-400/40 bg-emerald-400/12 text-emerald-200",
  withdrawn: "border-rose-400/40 bg-rose-400/12 text-rose-200",
  stagnant: "border-zinc-700/70 bg-zinc-700/20 text-zinc-400",
  living: "border-cyan-400/40 bg-cyan-400/12 text-cyan-200",
};

export function statusLabel(status: SIMDStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function StatusBadge({ status }: { status: SIMDStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.22em]",
        STATUS_STYLES[status],
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
