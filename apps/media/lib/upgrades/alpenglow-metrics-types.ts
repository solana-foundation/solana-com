export const ALPENGLOW_DASHBOARD_RANGES = ["1h", "6h", "24h", "7d"] as const;

export const ALPENGLOW_DASHBOARD_NETWORKS = [
  "mainnet",
  "testnet",
  "devnet",
] as const;

export type AlpenglowDashboardRange =
  (typeof ALPENGLOW_DASHBOARD_RANGES)[number];

export type AlpenglowDashboardNetwork =
  (typeof ALPENGLOW_DASHBOARD_NETWORKS)[number];

export type MetricPoint = [timestamp: number, value: number];

export interface MetricSeries {
  label: string;
  points: MetricPoint[];
}

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

export interface AlpenglowDashboardData {
  generatedAt: string;
  network: AlpenglowDashboardNetwork;
  range: AlpenglowDashboardRange;
  status: {
    alpenglowRpcSupported: boolean | null;
    alpenglowActive: boolean | null;
    genesisSlot: number | null;
    certificateValidatorCount: number | null;
    recentAverageFinalityLatencySeconds: number | null;
    trackedValidatorCount: number | null;
    delinquentValidatorCount: number | null;
  };
  charts: {
    p95FinalityLatencySeconds: MetricSeries[];
    transactionsPerSecond: MetricSeries[];
    towerVoteSlotsPerSecond: MetricSeries[];
    averageVoteRootLag: MetricSeries[];
    blockTransactions: MetricSeries[];
  };
  validators: ValidatorSnapshot[];
  warnings: string[];
}
