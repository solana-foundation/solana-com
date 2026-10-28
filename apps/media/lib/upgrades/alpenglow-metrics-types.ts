/** Solana clusters with live Alpenglow metrics. */
export const ALPENGLOW_DASHBOARD_NETWORKS = [
  "mainnet",
  "testnet",
  "devnet",
] as const;

/** Solana cluster selected for live Alpenglow metrics. */
export type AlpenglowDashboardNetwork =
  (typeof ALPENGLOW_DASHBOARD_NETWORKS)[number];

/** Fast-changing Alpenglow values read from Prometheus. */
export interface AlpenglowDashboardLiveData {
  readonly generatedAt: string;
  readonly network: AlpenglowDashboardNetwork;
  readonly latestFinalityLatencySeconds: number | null;
  readonly transactionsPerSecond: number | null;
  readonly voteAccountProgressSlotsPerSecond: number | null;
  readonly totalTransactionsPerBlock: number | null;
  readonly voteTransactionsPerBlock: number | null;
  readonly nonVoteTransactionsPerBlock: number | null;
  readonly warnings: readonly string[];
}
