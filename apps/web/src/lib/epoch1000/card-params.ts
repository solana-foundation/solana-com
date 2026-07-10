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
  logoUrl?: string | null;
}

export type CardVariant = "wallet" | "validator";

/** Query string shared by the OG image route and share pages. */
export function cardParams(
  result: CheckResult,
  showAddress: boolean,
  variant: CardVariant = "wallet",
): string {
  const p = new URLSearchParams({
    s: String(result.epochsSurvived),
    fe: String(result.firstEpoch),
    c: String(result.currentEpoch),
  });
  if (result.firstBlockTime) p.set("t", String(result.firstBlockTime));
  if (result.capped) p.set("x", "1");
  if (showAddress) p.set("w", shortAddress(result.address));
  if (variant === "validator") p.set("k", "validator");
  if (result.logoUrl) p.set("vl", result.logoUrl);
  return p.toString();
}
