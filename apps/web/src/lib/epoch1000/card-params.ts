import { shortAddress } from "./solana";

export interface CheckResult {
  address: string;
  firstEpoch: number;
  firstSlot: number;
  firstBlockTime: number | null;
  firstSignature: string;
  currentEpoch: number;
  epochsSurvived: number;
  tier: string;
  capped: boolean;
  scanned: number;
}

/** Query string shared by the OG image route and the /epoch1000/card share page. */
export function cardParams(result: CheckResult, showAddress: boolean): string {
  const p = new URLSearchParams({
    s: String(result.epochsSurvived),
    fe: String(result.firstEpoch),
    c: String(result.currentEpoch),
  });
  if (result.firstBlockTime) p.set("t", String(result.firstBlockTime));
  if (result.capped) p.set("x", "1");
  if (showAddress) p.set("w", shortAddress(result.address));
  return p.toString();
}
