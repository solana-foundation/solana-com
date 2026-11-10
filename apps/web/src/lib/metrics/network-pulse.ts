import "server-only";

import { unstable_cache } from "next/cache";
import { computeNakamotoCoefficient } from "./nakamoto";
import { callSolanaRpc, type VoteAccounts } from "./solana-rpc";

/**
 * Real-time counters (TPS, total transactions) change every second, but every
 * visitor shares one RPC read per window. The browser extrapolates between
 * reads, so a 30-second window still animates smoothly.
 */
export const NETWORK_PULSE_REVALIDATE_SECONDS = 30;

export type NetworkPulse = {
  avgTps: number;
  totalTransactionCount: number;
  validators: number;
  nakamotoCoefficient: number | null;
  /** When RPC was read (ISO); clients extrapolate the count from here. */
  fetchedAt: string;
};

async function readNetworkPulse(): Promise<NetworkPulse> {
  const [samples, totalTransactionCount, voteAccounts] = await Promise.all([
    callSolanaRpc<{ numTransactions: number; samplePeriodSecs: number }[]>(
      "getRecentPerformanceSamples",
      [5],
    ),
    callSolanaRpc<number>("getTransactionCount"),
    callSolanaRpc<VoteAccounts>("getVoteAccounts"),
  ]);
  const latest = samples.find((sample) => sample.numTransactions > 0);

  return {
    avgTps: latest
      ? Math.round(latest.numTransactions / latest.samplePeriodSecs)
      : 0,
    totalTransactionCount,
    validators: voteAccounts.current.length,
    nakamotoCoefficient:
      computeNakamotoCoefficient(
        voteAccounts.current.map((account) => account.activatedStake),
      ) ?? null,
    fetchedAt: new Date().toISOString(),
  };
}

export const getNetworkPulse = unstable_cache(
  readNetworkPulse,
  ["network-pulse-v1"],
  { revalidate: NETWORK_PULSE_REVALIDATE_SECONDS, tags: ["network-pulse"] },
);
