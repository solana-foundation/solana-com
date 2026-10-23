/** Mainnet epoch scheduled for Alpenglow feature activation. */
export const ALPENGLOW_MAINNET_ACTIVATION_EPOCH = 1064;

/** Feature gate enabling Alpenglow on Mainnet. */
export const ALPENGLOW_MAINNET_FEATURE_ADDRESS =
  "A1pengvuM6JEcyNuTnMqepBKhwHE3N6PmUrdATGawhJS";

/** Slots after feature activation before Mainnet switches consensus. */
export const ALPENGLOW_MAINNET_CONSENSUS_DELAY_SLOTS = 5_000;

/** Observed Mainnet activation milestones and their estimated times. */
export interface AlpenglowActivationEstimate {
  readonly currentEpoch: number;
  readonly featureActivated: boolean;
  readonly consensusActivated: boolean;
  readonly estimatedFeatureActivationAt: string | null;
  readonly estimatedConsensusActivationAt: string | null;
}

/** Supported historical windows for Alpenglow dashboard charts. */
export const ALPENGLOW_DASHBOARD_RANGES = ["1h", "6h", "24h", "7d"] as const;

/** Solana clusters available in the Alpenglow dashboard. */
export const ALPENGLOW_DASHBOARD_NETWORKS = [
  "mainnet",
  "testnet",
  "devnet",
] as const;

/** Historical window selected for dashboard charts. */
export type AlpenglowDashboardRange =
  (typeof ALPENGLOW_DASHBOARD_RANGES)[number];

/** Solana cluster selected in the dashboard. */
export type AlpenglowDashboardNetwork =
  (typeof ALPENGLOW_DASHBOARD_NETWORKS)[number];

/** Timestamp and numeric value returned for a chart sample. */
export type MetricPoint = [timestamp: number, value: number];

/** Named time series displayed by a dashboard chart. */
export interface MetricSeries {
  label: string;
  points: MetricPoint[];
}

/** Historical series displayed by the Alpenglow dashboard. */
export interface AlpenglowDashboardCharts {
  readonly p95FinalityLatencySeconds: MetricSeries[];
  readonly transactionsPerSecond: MetricSeries[];
  readonly towerVoteSlotsPerSecond: MetricSeries[];
  readonly averageVoteRootLag: MetricSeries[];
  readonly blockTransactions: MetricSeries[];
}

/** Canonical Alpenglow activation state read from Solana RPC. */
export interface AlpenglowDashboardActivationData {
  readonly generatedAt: string;
  readonly network: AlpenglowDashboardNetwork;
  readonly activationEstimate: AlpenglowActivationEstimate | null;
  readonly alpenglowRpcSupported: boolean | null;
  readonly alpenglowActive: boolean | null;
  readonly genesisSlot: number | null;
  readonly certificateValidatorCount: number | null;
  readonly warnings: readonly string[];
}

/** Fast-changing dashboard values read from Prometheus. */
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

/** Historical charts read from Prometheus. */
export interface AlpenglowDashboardDetailData {
  readonly generatedAt: string;
  readonly network: AlpenglowDashboardNetwork;
  readonly range: AlpenglowDashboardRange;
  readonly charts: AlpenglowDashboardCharts;
  readonly warnings: readonly string[];
}

/** Legacy combined response retained while clients migrate to split routes. */
export interface AlpenglowDashboardData {
  readonly generatedAt: string;
  readonly network: AlpenglowDashboardNetwork;
  readonly range: AlpenglowDashboardRange;
  readonly status: {
    readonly alpenglowRpcSupported: boolean | null;
    readonly alpenglowActive: boolean | null;
    readonly genesisSlot: number | null;
    readonly certificateValidatorCount: number | null;
    readonly latestFinalityLatencySeconds: number | null;
  };
  readonly charts: AlpenglowDashboardCharts;
  readonly warnings: readonly string[];
}
