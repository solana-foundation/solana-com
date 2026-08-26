/**
 * The SIMD-0525 rollout model: four 50 ms reductions from the 400 ms genesis
 * clock, each behind its own feature gate, activating at epoch boundaries
 * (solana.com/news/lowering-slot-time-and-validators-economic). The page
 * derives which step is live from MEASURED averages only — never the
 * calendar — so it stays correct before, during, and after every activation.
 */

export const STEPS = [400, 350, 300, 250, 200] as const;

/**
 * Activation epochs confirmed by Anza, keyed by target ms. Later steps stay
 * absent until scheduled; the hero switches from countdown to "epoch not yet
 * scheduled" on its own.
 */
export const CONFIRMED_EPOCHS: Partial<Record<number, number>> = {
  350: 1020,
  300: 1024,
};

export type FlipPhase = "pre" | "flipping" | "flipped";

export interface RolloutState {
  /** The step the network measurably runs right now. */
  from: number;
  /** The next reduction target; null once 200 ms is reached. */
  to: number | null;
  /** 1-based index of the `to` step among the four reductions. */
  stepIndex: number;
  /** Reductions already measurably live (0 before the first flip). */
  stepsDone: number;
  phase: FlipPhase;
  /** Confirmed activation epoch for `to`, if Anza has scheduled it. */
  targetEpoch: number | null;
}

/**
 * The settled step, from a stable average: a step counts as reached once the
 * average falls under the midpoint to the previous step (mainnet jitter runs
 * a few ms above nominal, so 400 ms slots measure ~405–420).
 */
function settledStep(avg: number): number {
  for (let i = STEPS.length - 1; i > 0; i--) {
    if (avg < (STEPS[i] + STEPS[i - 1]) / 2) return STEPS[i];
  }
  return STEPS[0];
}

/**
 * Where the rollout stands. Transition thresholds mirror the perp200
 * dashboard's jitter guard, generalized to any 50 ms step: a one-minute
 * average alone dips deep on ordinary jitter, so "flipping" needs a sustained
 * minute under from−22 and "flipped" needs the longer average along too.
 */
export function rolloutState(
  avg1m: number | null,
  avg10m: number | null,
): RolloutState {
  const stable = avg10m ?? avg1m;
  const from = stable ? settledStep(stable) : STEPS[0];
  const fromIdx = STEPS.indexOf(from as (typeof STEPS)[number]);
  const to = fromIdx < STEPS.length - 1 ? STEPS[fromIdx + 1] : null;

  let phase: FlipPhase = "pre";
  if (to !== null && avg1m) {
    const gap = from - to;
    if (avg1m < to + gap * 0.44 && avg10m && avg10m < to + gap * 0.7)
      phase = "flipped";
    else if (avg1m < to + gap * 0.56) phase = "flipping";
  }

  return {
    from,
    to,
    stepIndex: Math.min(fromIdx + 1, STEPS.length - 1),
    stepsDone: fromIdx,
    phase,
    targetEpoch: to !== null ? (CONFIRMED_EPOCHS[to] ?? null) : null,
  };
}

/** Percent more blocks per second after a from→to step (e.g. 14.3). */
export function pctFaster(from: number, to: number): string {
  return ((from / to - 1) * 100).toFixed(1);
}

/** The reduction after `ms`, or null at the end of the path. */
export function nextStep(ms: number): number | null {
  const i = STEPS.indexOf(ms as (typeof STEPS)[number]);
  return i >= 0 && i < STEPS.length - 1 ? STEPS[i + 1] : null;
}
