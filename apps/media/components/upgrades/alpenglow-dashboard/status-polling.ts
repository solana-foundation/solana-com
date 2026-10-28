import type { AlpenglowDashboardActivationData } from "@/lib/upgrades/alpenglow-metrics-types";

/** Interval between activation status checks while awaiting a certificate. */
export const STATUS_POLL_INTERVAL_MS = 2_000;

/** Returns the next polling interval, or stops once the genesis certificate is available. */
export function statusPollInterval(
  data: AlpenglowDashboardActivationData,
): number | null {
  if (data.alpenglowActive === true && data.genesisSlot !== null) return null;
  return STATUS_POLL_INTERVAL_MS;
}
