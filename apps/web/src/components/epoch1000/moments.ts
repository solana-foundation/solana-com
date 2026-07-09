/**
 * Annotated moments on the thousand-epoch timeline.
 *
 * Epoch numbers are interpolated from dates at runtime (genesis → now is a
 * near-linear ~2.2 days/epoch), so labels stay honest as the chain advances —
 * the readout always presents them with a "~".
 */

export const GENESIS_MS = Date.parse("2020-03-16T00:00:00Z");

export interface Moment {
  dateMs: number;
  label: string;
}

export const MOMENTS: Moment[] = [
  { dateMs: GENESIS_MS, label: "Mainnet-beta genesis" },
  {
    dateMs: Date.parse("2020-08-30T00:00:00Z"),
    label: "DeFi arrives on mainnet",
  },
  { dateMs: Date.parse("2021-08-15T00:00:00Z"), label: "NFT summer" },
  {
    dateMs: Date.parse("2021-11-08T00:00:00Z"),
    label: "Breakpoint Lisbon · all-time high",
  },
  { dateMs: Date.parse("2022-08-16T00:00:00Z"), label: "Firedancer announced" },
  {
    dateMs: Date.parse("2022-12-15T00:00:00Z"),
    label: "Bottom of the bear — still shipping",
  },
  {
    dateMs: Date.parse("2023-04-06T00:00:00Z"),
    label: "State compression ships",
  },
  { dateMs: Date.parse("2023-12-14T00:00:00Z"), label: "The comeback" },
  { dateMs: Date.parse("2024-09-20T00:00:00Z"), label: "Breakpoint Singapore" },
  { dateMs: Date.parse("2025-05-19T00:00:00Z"), label: "Alpenglow unveiled" },
];

/** Epoch a date falls in, interpolating genesis → (currentEpoch, now). */
export function epochOfDate(
  dateMs: number,
  currentEpoch: number,
  nowMs: number,
): number {
  if (nowMs <= GENESIS_MS || currentEpoch <= 0) return 0;
  const t = (dateMs - GENESIS_MS) / (nowMs - GENESIS_MS);
  return Math.min(currentEpoch, Math.max(0, Math.round(t * currentEpoch)));
}

/** Approximate wall-clock date an epoch closed, same interpolation. */
export function approxDateOfEpoch(
  epoch: number,
  currentEpoch: number,
  nowMs: number,
): Date {
  if (currentEpoch <= 0) return new Date(GENESIS_MS);
  const t = epoch / currentEpoch;
  return new Date(GENESIS_MS + t * (nowMs - GENESIS_MS));
}
