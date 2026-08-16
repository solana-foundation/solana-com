import type { UpgradeStage } from "./group-by-release";

export type { UpgradeStage };

export const STAGE_LABELS: Record<UpgradeStage, string> = {
  planned: "Planned",
  in_development: "In Development",
  pending_activation: "Pending Feature Activation",
  live: "Live on Mainnet",
  action_required: "Action Required",
};

export const STAGE_BADGE_CLASSES: Record<UpgradeStage, string> = {
  planned: "border-white/25 bg-white/5 text-white/70",
  in_development: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  pending_activation: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  live: "border-[#14F195]/30 bg-[#14F195]/10 text-[#14F195]",
  action_required: "border-red-500/30 bg-red-500/10 text-red-300",
};

export function isUpgradeStage(value: unknown): value is UpgradeStage {
  return (
    value === "planned" ||
    value === "in_development" ||
    value === "pending_activation" ||
    value === "live" ||
    value === "action_required"
  );
}
