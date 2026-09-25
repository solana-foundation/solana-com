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

/** Tower-era diagnostic values for one monitored validator. */
export interface ValidatorSnapshot {
  nodekey: string;
  votekey: string;
  lastVote: number | null;
  rootSlot: number | null;
  voteRootLag: number | null;
  delinquent: boolean | null;
  activeStake: number | null;
  voteTransactionsPerBlock: number | null;
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
  readonly recentAverageFinalityLatencySeconds: number | null;
  readonly transactionsPerSecond: number | null;
  readonly warnings: readonly string[];
}

/** Historical charts and validator diagnostics read from Prometheus. */
export interface AlpenglowDashboardDetailData {
  readonly generatedAt: string;
  readonly network: AlpenglowDashboardNetwork;
  readonly range: AlpenglowDashboardRange;
  readonly status: {
    readonly trackedValidatorCount: number | null;
    readonly delinquentValidatorCount: number | null;
  };
  readonly charts: AlpenglowDashboardCharts;
  readonly validators: readonly ValidatorSnapshot[];
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
    readonly recentAverageFinalityLatencySeconds: number | null;
    readonly trackedValidatorCount: number | null;
    readonly delinquentValidatorCount: number | null;
  };
  readonly charts: AlpenglowDashboardCharts;
  readonly validators: readonly ValidatorSnapshot[];
  readonly warnings: readonly string[];
}
