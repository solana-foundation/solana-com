/**
 * The staged path of SIMD-0525: four 50 ms decrements, each behind its own
 * feature gate, activating one at a time at epoch boundaries. The page never
 * hardcodes "which step is live" — it derives that from the measured average
 * slot time so it stays correct before and after every activation.
 */

export const START_MS = 400;
export const TARGET_MS = 200;

export const STAGE_STEPS = [400, 350, 300, 250, 200] as const;

export type StageStep = (typeof STAGE_STEPS)[number];

/**
 * Which step the network is currently running, from a measured average.
 * Mainnet jitter runs a few ms above nominal (400 ms slots measure ~405–420),
 * so a step counts as reached once the average falls inside its band:
 * anything under the midpoint to the previous step belongs to this step.
 */
export function activeStage(avgSlotMs: number): StageStep {
  for (let i = STAGE_STEPS.length - 1; i > 0; i--) {
    const step = STAGE_STEPS[i];
    const prev = STAGE_STEPS[i - 1];
    if (avgSlotMs < (step + prev) / 2) return step;
  }
  return START_MS;
}

export function slotsPerDay(slotMs: number): number {
  return Math.round(86_400_000 / slotMs);
}

/** Hours of a 400 ms-paced day that fit inside one real day at `slotMs`. */
export function hoursRecut(slotMs: number): number {
  return (START_MS / slotMs) * 24;
}
