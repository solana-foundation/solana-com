export const rangeOptions = [
  { label: "30D", value: 30 },
  { label: "90D", value: 90 },
  { label: "180D", value: 180 },
  { label: "1Y", value: 365 },
] as const;

export const providers = [
  "Allium",
  "Artemis",
  "Blockworks",
  "DefiLama",
  "Dune",
  "Token Terminal",
] as const;

export type ProviderName = (typeof providers)[number];
export type DashboardTab = "stablecoins" | "overview" | "defi";
export type Aggregation = "avg" | "sum";
export type SeriesField = "provider" | "metric";

export type ChartDefinition = {
  id: string;
  tab: DashboardTab;
  title: string;
  valueLabel: string;
  metrics: readonly string[];
  aggregation: Aggregation;
  seriesField: SeriesField;
  providers?: readonly ProviderName[];
};

export type MetricRow = {
  date: string;
  metricName: string;
  unit: string;
  providerName: string;
  value: number;
};

export type DataApiResponse = {
  generatedAt: string;
  rangeDays: number;
  truncated: boolean;
  rows: MetricRow[];
};

export const providerColors: Record<ProviderName, string> = {
  Allium: "#9945FF",
  Artemis: "#14F195",
  Blockworks: "#00D4FF",
  DefiLama: "#DC1FFF",
  Dune: "#CFF15E",
  "Token Terminal": "#FFB000",
};

const dexVolumeProviders = [
  "Allium",
  "Artemis",
  "Blockworks",
  "Dune",
  "Token Terminal",
] as const satisfies readonly ProviderName[];

const dexActivityProviders = [
  "Allium",
  "Dune",
] as const satisfies readonly ProviderName[];

const dexCountProviders = [
  "Allium",
  "Blockworks",
  "Dune",
] as const satisfies readonly ProviderName[];

export const metricColors: Record<string, string> = {
  "Base Fees": "#9945FF",
  "Priority Fees": "#14F195",
  "Successful Transactions": "#14F195",
  "Failed Transactions": "#DC1FFF",
};

export const chartDefinitions = [
  {
    id: "stablecoin-supply",
    tab: "stablecoins",
    title: "Supply",
    valueLabel: "USD",
    metrics: ["Supply"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "stablecoin-transfer-count",
    tab: "stablecoins",
    title: "Transfer Count",
    valueLabel: "Count",
    metrics: ["Transfer Count"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "stablecoin-active-addresses",
    tab: "stablecoins",
    title: "Active Addresses",
    valueLabel: "Count",
    metrics: ["Active Addresses"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "stablecoin-transfer-volume",
    tab: "stablecoins",
    title: "Transfer Volume",
    valueLabel: "USD",
    metrics: ["Transfer Volume"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "transaction-count",
    tab: "overview",
    title: "Transaction Count",
    valueLabel: "Count",
    metrics: ["Transaction Count"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "sol-price",
    tab: "overview",
    title: "SOL Price (USD)",
    valueLabel: "USD",
    metrics: ["SOL Price"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "avg-cost-units",
    tab: "overview",
    title: "Avg Cost Units per Block",
    valueLabel: "Compute Units",
    metrics: ["Average Cost Units"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "daily-fees",
    tab: "overview",
    title: "Daily Fees (SOL)",
    valueLabel: "Fees (SOL)",
    metrics: ["Base Fees", "Priority Fees"],
    aggregation: "avg",
    seriesField: "metric",
  },
  {
    id: "success-fail",
    tab: "overview",
    title: "Successful vs Failed Transactions",
    valueLabel: "Count",
    metrics: ["Successful Transactions", "Failed Transactions"],
    aggregation: "avg",
    seriesField: "metric",
  },
  {
    id: "vote-transactions",
    tab: "overview",
    title: "Vote Transactions",
    valueLabel: "Count",
    metrics: ["Vote Transactions"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "slots",
    tab: "overview",
    title: "Slots per Day",
    valueLabel: "Count",
    metrics: ["Slots"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "fee-payers",
    tab: "overview",
    title: "Fee Payers",
    valueLabel: "Count",
    metrics: ["Fee Payers"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "dex-volume",
    tab: "defi",
    title: "DEX Volume",
    valueLabel: "USD",
    metrics: ["DEX Volume"],
    aggregation: "avg",
    seriesField: "provider",
    providers: dexVolumeProviders,
  },
  {
    id: "dex-transactions",
    tab: "defi",
    title: "DEX Transactions",
    valueLabel: "Count",
    metrics: ["DEX Transactions"],
    aggregation: "avg",
    seriesField: "provider",
    providers: dexActivityProviders,
  },
  {
    id: "dex-count",
    tab: "defi",
    title: "DEX Count",
    valueLabel: "Count",
    metrics: ["DEX Count"],
    aggregation: "avg",
    seriesField: "provider",
    providers: dexCountProviders,
  },
  {
    id: "dex-traders",
    tab: "defi",
    title: "DEX Traders",
    valueLabel: "Count",
    metrics: ["DEX Traders"],
    aggregation: "avg",
    seriesField: "provider",
    providers: dexActivityProviders,
  },
] as const satisfies readonly ChartDefinition[];

export const metricNames = Array.from(
  new Set(chartDefinitions.flatMap((chart) => chart.metrics)),
);
