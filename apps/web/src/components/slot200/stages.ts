/**
 * SIMD-0525 stages the page reasons about: the 400 ms genesis clock and the
 * 350 ms first step. The dashboard never hardcodes "which side of the flip
 * we're on" — it derives that from measured averages so it stays correct
 * before, during, and after the epoch-1020 activation.
 */

export const START_MS = 400;
export const STEP1_MS = 350;

export type FlipPhase = "pre" | "flipping" | "flipped";

/**
 * Where the 400 → 350 flip stands, from measured averages only. Thresholds
 * mirror the perp200 dashboard's jitter guard: a one-minute average alone
 * dips to ~380 on ordinary mainnet jitter, so "flipping" needs a sustained
 * minute under 378 and "flipped" needs the ten-minute average along too.
 */
export function flipPhase(
  avg1m: number | null,
  avg10m: number | null,
): FlipPhase {
  if (avg1m && avg1m < 372 && avg10m && avg10m < 385) return "flipped";
  if (avg1m && avg1m < 378) return "flipping";
  return "pre";
}
