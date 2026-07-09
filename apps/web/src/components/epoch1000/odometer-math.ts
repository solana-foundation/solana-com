/** Digits 0–9 repeated so a wheel can roll through full revolutions. */
export const REPS = 4;
export const STRIP_LEN = REPS * 10;
/** First settle lands in the third repetition: two full spins on page load. */
const SETTLE_BASE = 20;

function digitOf(value: number, wheel: number, wheels: number): number {
  return Math.floor(value / 10 ** (wheels - 1 - wheel)) % 10;
}

/**
 * Strip offsets for each wheel. Wheels only ever roll forward, like a
 * mechanical counter: the first settle spins two revolutions; later epoch
 * ticks advance the shortest forward distance to the new digit.
 */
export function nextWheelTargets(
  prev: number[] | null,
  value: number,
  wheels: number,
): number[] {
  return Array.from({ length: wheels }, (_, w) => {
    const d = digitOf(value, w, wheels);
    if (!prev) return SETTLE_BASE + d;
    const cur = prev[w];
    return cur + ((d - (cur % 10) + 10) % 10);
  });
}

/** Fold an offset back one revolution — visually identical digit. */
export function normalizeTargets(targets: number[]): number[] {
  return targets.map((t) => (t > STRIP_LEN - 10 ? t - 10 : t));
}
