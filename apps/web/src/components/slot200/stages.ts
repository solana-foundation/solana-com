/**
 * The SIMD-0525 rollout model: four 50 ms reductions from the 400 ms genesis
 * clock, each behind its own feature gate, activating at epoch boundaries
 * (solana.com/news/lowering-slot-time-and-validators-economic). The page
 * derives which step is live from measured averages. Epoch data only repairs
 * a stale stream seed; it never promotes an unscheduled reduction.
 */

export const STEPS = [400, 350, 300, 250, 200] as const;
type Step = (typeof STEPS)[number];

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

function stepIndex(step: number): number {
  return STEPS.indexOf(step as Step);
}

function confirmedEpochFor(step: number | null): number | null {
  return step === null ? null : (CONFIRMED_EPOCHS[step] ?? null);
}

function shouldRebaseExpiredSeed(
  from: number,
  observed: number,
  epoch: number | null | undefined,
): boolean {
  const target = nextStep(from);
  const targetEpoch = confirmedEpochFor(target);

  // Only repair the known 400 ms fallback seed, and advance exactly one
  // stage. A transient one-minute reading must not promote later reductions.
  return (
    from === STEPS[0] &&
    epoch !== null &&
    epoch !== undefined &&
    target !== null &&
    targetEpoch !== null &&
    epoch > targetEpoch &&
    stepIndex(observed) >= stepIndex(target)
  );
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
  epoch?: number | null,
): RolloutState {
  const stable = avg10m ?? avg1m;
  const stableFrom = stable ? settledStep(stable) : STEPS[0];
  const observed = avg1m ? settledStep(avg1m) : stableFrom;
  const from = shouldRebaseExpiredSeed(stableFrom, observed, epoch)
    ? nextStep(stableFrom)!
    : stableFrom;
  const fromIdx = stepIndex(from);
  const to = nextStep(from);

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
    targetEpoch: confirmedEpochFor(to),
  };
}

/**
 * A scheduled epoch has started, but mainnet timing has not yet provided
 * enough evidence to call the reduction in progress. Keeping this separate
 * from `pre` prevents the hero from falling back to an "unscheduled" state
 * in the short gap between an epoch boundary and the measured flip.
 */
export function isActivationWindow(
  rollout: Pick<RolloutState, "phase" | "targetEpoch">,
  epoch: number | null,
  slot?: number,
  epochEndSlot?: number | null,
): boolean {
  const targetHasStarted =
    epoch !== null &&
    rollout.targetEpoch !== null &&
    (epoch >= rollout.targetEpoch ||
      (epoch === rollout.targetEpoch - 1 &&
        epochEndSlot !== null &&
        epochEndSlot !== undefined &&
        slot !== undefined &&
        slot >= epochEndSlot));

  return rollout.phase === "pre" && targetHasStarted;
}

/** Percent more blocks per second after a from→to step (e.g. 14.3). */
export function pctFaster(from: number, to: number): string {
  return ((from / to - 1) * 100).toFixed(1);
}

/** The reduction after `ms`, or null at the end of the path. */
export function nextStep(ms: number): number | null {
  const i = stepIndex(ms);
  return i >= 0 && i < STEPS.length - 1 ? STEPS[i + 1] : null;
}
