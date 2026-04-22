import type { SIMDStatus } from "./upgrade-types";

export const STATUS_LABELS: Record<SIMDStatus, string> = {
  idea: "Idea",
  draft: "Draft",
  review: "Review",
  accepted: "Approved",
  implemented: "Implemented",
  activated: "Active",
  withdrawn: "Withdrawn",
  stagnant: "Stagnant",
  living: "Living",
};

export const STATUS_OPTIONS = (
  Object.entries(STATUS_LABELS) as Array<[SIMDStatus, string]>
).map(([value, label]) => ({
  label,
  value,
}));

export function statusLabel(status: SIMDStatus) {
  return STATUS_LABELS[status];
}
