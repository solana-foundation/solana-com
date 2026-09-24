import type { UpgradeStage } from "./group-by-release";

export type { UpgradeStage };

export const STAGE_BADGE_CLASSES: Record<UpgradeStage, string> = {
  planned: "border-white/25 bg-white/5 text-white/70",
  in_development: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  pending_activation: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  partially_active: "border-teal-400/30 bg-teal-400/10 text-teal-300",
  live: "border-[#14F195]/30 bg-[#14F195]/10 text-[#14F195]",
};

export function isUpgradeStage(value: unknown): value is UpgradeStage {
  return (
    value === "planned" ||
    value === "in_development" ||
    value === "pending_activation" ||
    value === "partially_active" ||
    value === "live"
  );
}
