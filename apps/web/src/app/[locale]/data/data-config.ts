export const rangeOptions = [
  { label: "30D", value: 30 },
  { label: "90D", value: 90 },
  { label: "180D", value: 180 },
  { label: "1Y", value: 365 },
] as const;

export const rpcTimeframeOptions = [
  { durationSeconds: 30 * 60, label: "30m", stepSeconds: 60, value: "30m" },
  { durationSeconds: 60 * 60, label: "1h", stepSeconds: 60, value: "1h" },
  {
    durationSeconds: 6 * 60 * 60,
    label: "6h",
    stepSeconds: 5 * 60,
    value: "6h",
  },
  {
    durationSeconds: 24 * 60 * 60,
    label: "24h",
    stepSeconds: 15 * 60,
    value: "24h",
  },
  {
    durationSeconds: 7 * 24 * 60 * 60,
    label: "7d",
    stepSeconds: 60 * 60,
    value: "7d",
  },
  {
    durationSeconds: 30 * 24 * 60 * 60,
    label: "30d",
    stepSeconds: 4 * 60 * 60,
    value: "30d",
  },
  {
    durationSeconds: 90 * 24 * 60 * 60,
    label: "90d",
    stepSeconds: 12 * 60 * 60,
    value: "90d",
  },
  {
    durationSeconds: 365 * 24 * 60 * 60,
    label: "1y",
    stepSeconds: 2 * 24 * 60 * 60,
    value: "1y",
  },
] as const;

export const rpcRegionOptions = [
  { label: "us-east", value: "us-east" },
  { label: "us-west", value: "us-west" },
  { label: "eu-central", value: "eu-central" },
  { label: "eu-west", value: "eu-west" },
  { label: "ap-northeast", value: "ap-northeast" },
  { label: "ap-southeast", value: "ap-southeast" },
] as const;

export const rpcInfraOptions = [
  { label: "TSW", sourceValue: "tsw", value: "tsw" },
  { label: "LAT", sourceValue: "latitude", value: "lat" },
  { label: "AWS", sourceValue: "aws", value: "aws" },
  { label: "GCP", sourceValue: "gcp", value: "gcp" },
] as const;

export const rpcMethodOptions = [
  { label: "getHealth", value: "getHealth" },
  { label: "getSlot", value: "getSlot" },
  { label: "getLatestBlockhash", value: "getLatestBlockhash" },
  { label: "getAccountInfo", value: "getAccountInfo" },
  { label: "getMultipleAccounts", value: "getMultipleAccounts" },
  { label: "getProgramAccounts", value: "getProgramAccounts" },
  {
    label: "getTokenAccountsByOwner",
    value: "getTokenAccountsByOwner",
  },
  { label: "getBlock_recent", value: "getBlock_recent" },
  { label: "getBlock_archival", value: "getBlock_archival" },
  { label: "getTransaction_recent", value: "getTransaction_recent" },
  { label: "getTransaction_archival", value: "getTransaction_archival" },
  { label: "getTransactionRecent", value: "getTransactionRecent" },
  { label: "getSignaturesForAddress", value: "getSignaturesForAddress" },
] as const;

export const defaultRpcInfra = "tsw";
export const defaultRpcRegion = "us-west";
export const defaultRpcMethod = "getLatestBlockhash";
export const defaultRpcTimeframe = "6h";

export type RpcLatencyInfra = (typeof rpcInfraOptions)[number]["value"];
export type RpcLatencyRegion = (typeof rpcRegionOptions)[number]["value"];
export type RpcLatencyMethod = (typeof rpcMethodOptions)[number]["value"];
export type RpcTimeframe = (typeof rpcTimeframeOptions)[number]["value"];
export type ProviderName = string;

export function getRpcTimeframeOption(value?: RpcTimeframe) {
  return (
    rpcTimeframeOptions.find((option) => option.value === value) ??
    rpcTimeframeOptions.find((option) => option.value === defaultRpcTimeframe)!
  );
}

export type RpcLatencyFiltersResponse = {
  regionsByInfra: Record<RpcLatencyInfra, RpcLatencyRegion[]>;
};

export const fallbackRpcRegionsByInfra: RpcLatencyFiltersResponse["regionsByInfra"] =
  {
    tsw: ["us-west", "eu-central", "eu-west", "ap-northeast"],
    lat: rpcRegionOptions.map((option) => option.value),
    aws: rpcRegionOptions.map((option) => option.value),
    gcp: rpcRegionOptions.map((option) => option.value),
  };

const rpcRegionParamAliases: Partial<Record<string, RpcLatencyRegion>> = {
  "us-east4": "us-east",
  "us-east-1": "us-east",
  nyc: "us-east",
  ewr: "us-east",
  ewr2: "us-east",
  pit: "us-east",
  pit1: "us-east",
  "us-west2": "us-west",
  "us-west-1": "us-west",
  lax: "us-west",
  lax1: "us-west",
  "europe-west3": "eu-central",
  "eu-central-1": "eu-central",
  fra: "eu-central",
  fra2: "eu-central",
  "europe-west4": "eu-central",
  ams: "eu-central",
  ams3: "eu-central",
  "europe-west2": "eu-west",
  "eu-west-2": "eu-west",
  "eu-west-1": "eu-west",
  lon: "eu-west",
  lon1: "eu-west",
  "asia-northeast1": "ap-northeast",
  "ap-northeast-1": "ap-northeast",
  tyo: "ap-northeast",
  tyo2: "ap-northeast",
  "asia-southeast1": "ap-southeast",
  "ap-southeast-1": "ap-southeast",
  sgp: "ap-southeast",
  sgp2: "ap-southeast",
};

const rpcInfraParamAliases: Partial<Record<string, RpcLatencyInfra>> = {
  latitude: "lat",
  terraswitch: "tsw",
};

export function normalizeRpcRegionParam(value: string | null | undefined) {
  return value ? (rpcRegionParamAliases[value] ?? value) : value;
}

export function normalizeRpcInfraParam(value: string | null | undefined) {
  return value ? (rpcInfraParamAliases[value] ?? value) : value;
}

export function getRpcRegionSourceValue(value: RpcLatencyRegion) {
  return value;
}

export function getRpcInfraSourceValue(value: RpcLatencyInfra) {
  return (
    rpcInfraOptions.find((option) => option.value === value)?.sourceValue ??
    value
  );
}

export function getRpcRegionOptions(
  infra: RpcLatencyInfra,
  regionsByInfra = fallbackRpcRegionsByInfra,
) {
  const availableRegions = new Set(regionsByInfra[infra]);

  return rpcRegionOptions.filter((option) =>
    availableRegions.has(option.value),
  );
}

export function getDefaultRpcRegion(
  infra: RpcLatencyInfra,
  regionsByInfra = fallbackRpcRegionsByInfra,
): RpcLatencyRegion {
  return (
    getRpcRegionOptions(infra, regionsByInfra)[0]?.value ?? defaultRpcRegion
  );
}

export type DashboardTab =
  | "stablecoins"
  | "overview"
  | "network"
  | "defi"
  | "rpc";
export type Aggregation = "avg" | "sum";
export type SeriesField = "provider" | "metric";
export type TimeGranularity = "day" | "hour";
export type ChartVisualization = "line" | "bar";

export type MethodologyComment = {
  provider: ProviderName;
  description: string;
};

export type ChartDefinition = {
  id: string;
  tab: DashboardTab;
  title: string;
  valueLabel: string;
  metrics: readonly string[];
  aggregation: Aggregation;
  seriesField: SeriesField;
  lowerIsBetter?: boolean;
  methodology?: readonly MethodologyComment[];
  timeGranularity?: TimeGranularity;
  visualization?: ChartVisualization;
};

export type MetricRow = {
  /** ISO date for daily data, or ISO timestamp for intraday data. */
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

export const providerColors: Record<string, string> = {
  Allium: "#DFA3DA",
  Alchemy: "#2196F3",
  Artemis: "#14F195",
  Blockworks: "#E32EE9",
  DeFiLlama: "#3B8CFF",
  Dune: "#F75F47",
  Helius: "#E84125",
  QuickNode: "#6CFF75",
  RWA: "#A1B9E3",
  Stakewiz: "#f6b486",
  "Token Terminal": "#45A88E",
  Triton: "#A12CFF",
  "Validators App": "#38BDF8",
};

const providerAliases: Record<string, ProviderName> = {
  alchemy: "Alchemy",
  DefiLama: "DeFiLlama",
  DefiLlama: "DeFiLlama",
  helius: "Helius",
  Quicknode: "QuickNode",
  quicknode: "QuickNode",
  triton: "Triton",
};

export function normalizeProviderName(value: string) {
  return providerAliases[value] ?? value;
}

export const metricColors: Record<string, string> = {
  "Base Fees": "#9945FF",
  Fees: "#9945FF",
  "Priority Fees": "#14F195",
  "Non Vote Transaction Count (Success)": "#14F195",
  "Non Vote Transaction Count (Failed)": "#DC1FFF",
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
    methodology: [
      {
        provider: "Allium",
        description:
          "Net mints minus burns, excluding treasury and locked balances.",
      },
      {
        provider: "DeFiLlama",
        description:
          "Bridge-aware circulating supply, priced and aggregated across stablecoins and peg types.",
      },
      {
        provider: "Token Terminal",
        description:
          "Circulating supply excludes issuer treasury and pre-minted, not-yet-issued balances.",
      },
      {
        provider: "RWA",
        description:
          "Net minted supply minus burned supply and treasury or premint address balances.",
      },
    ],
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
    methodology: [
      {
        provider: "Allium",
        description:
          "Unique stablecoin transfer senders and receivers, excluding inorganic activity.",
      },
      {
        provider: "Blockworks",
        description:
          "Unique signer addresses that execute a transaction involving a stablecoin.",
      },
      {
        provider: "RWA",
        description:
          "Count of token accounts sending a stablecoin transfer, unique per token.",
      },
    ],
  },
  {
    id: "stablecoin-transfer-volume",
    tab: "stablecoins",
    title: "Transfer Volume",
    valueLabel: "USD",
    metrics: ["Transfer Volume"],
    aggregation: "avg",
    seriesField: "provider",
    methodology: [
      {
        provider: "Allium",
        description:
          "USD transfer volume, deduplicated and filtered per Visa methodology.",
      },
      {
        provider: "DeFiLlama",
        description:
          "USD value of stablecoin transfers using adjusted single-direction transfer methodologies.",
      },
      {
        provider: "RWA",
        description: "No filtering applied to volume.",
      },
    ],
  },
  {
    id: "stablecoin-count",
    tab: "stablecoins",
    title: "Stablecoin Count",
    valueLabel: "Count",
    metrics: ["Stablecoin Count"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "transaction-count",
    tab: "overview",
    title: "Transaction Count (Total)",
    valueLabel: "Count",
    metrics: ["Transaction Count (Total)"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "sol-price",
    tab: "overview",
    title: "SOL Price",
    valueLabel: "USD",
    metrics: ["SOL Price"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "avg-cost-units",
    tab: "overview",
    title: "Compute Units",
    valueLabel: "Compute Units",
    metrics: ["Compute Units"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "daily-fees",
    tab: "overview",
    title: "Fees",
    valueLabel: "SOL",
    metrics: ["Fees"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "successful-transactions",
    tab: "overview",
    title: "Non Vote Transaction Count (Success)",
    valueLabel: "Count",
    metrics: ["Non Vote Transaction Count (Success)"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "failed-transactions",
    tab: "overview",
    title: "Non Vote Transaction Count (Failed)",
    valueLabel: "Count",
    metrics: ["Non Vote Transaction Count (Failed)"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "vote-transactions",
    tab: "overview",
    title: "Transaction Count (Vote)",
    valueLabel: "Count",
    metrics: ["Transaction Count (Vote)"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "slots",
    tab: "overview",
    title: "Slots",
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
    methodology: [
      {
        provider: "Artemis",
        description:
          "Distinct signers of successful transactions, not just fee payers, capturing fee-sponsored users.",
      },
    ],
  },
  {
    id: "total-stake",
    tab: "network",
    title: "Total Stake",
    valueLabel: "SOL",
    metrics: ["Total Stake"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "validator-count",
    tab: "network",
    title: "Validator Count",
    valueLabel: "Count",
    metrics: ["Validator Count"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "top-asn-share",
    tab: "network",
    title: "Top 3 ASN Share",
    valueLabel: "Percent",
    metrics: ["Top 3 ASN Share"],
    aggregation: "avg",
    seriesField: "provider",
  },
  {
    id: "sol-price-network",
    tab: "network",
    title: "SOL Price (Network)",
    valueLabel: "USD",
    metrics: ["SOL Price (Network)"],
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
    methodology: [
      {
        provider: "Allium",
        description: "USD notional value of all Solana spot DEX trades.",
      },
      {
        provider: "DeFiLlama",
        description:
          "Daily USD DEX trade value, sourced from adapters after bad-volume filtering.",
      },
      {
        provider: "Token Terminal",
        description:
          "DEX trade volume varies by indexed venues, pricing, and filtering methodology.",
      },
    ],
  },
  {
    id: "dex-transactions",
    tab: "defi",
    title: "DEX Transactions",
    valueLabel: "Count",
    metrics: ["DEX Transactions"],
    aggregation: "avg",
    seriesField: "provider",
    methodology: [
      {
        provider: "Allium",
        description:
          "Unique Solana DEX swap transactions; multi-hop swaps count once.",
      },
    ],
  },
  {
    id: "dex-count",
    tab: "defi",
    title: "DEX Count",
    valueLabel: "Count",
    metrics: ["DEX Count"],
    aggregation: "avg",
    seriesField: "provider",
    methodology: [
      {
        provider: "Allium",
        description:
          "Unique Solana DEX protocols by project and protocol version.",
      },
      {
        provider: "Blockworks",
        description: "Top spot DEXs that aggregators route to.",
      },
      {
        provider: "DeFiLlama",
        description:
          "Spot DEX protocols with volume adapters and non-zero Solana trading activity.",
      },
    ],
  },
  {
    id: "dex-traders",
    tab: "defi",
    title: "DEX Traders",
    valueLabel: "Count",
    metrics: ["DEX Traders"],
    aggregation: "avg",
    seriesField: "provider",
    methodology: [
      {
        provider: "Allium",
        description:
          "Unique Solana DEX swap initiators; no bot filter applied.",
      },
    ],
  },
  {
    id: "rpc-success-rate",
    tab: "rpc",
    title: "Success Rate",
    valueLabel: "Percent",
    metrics: ["RPC Success Rate"],
    aggregation: "avg",
    seriesField: "provider",
    timeGranularity: "hour",
    methodology: [
      {
        provider: "Alchemy",
        description:
          "Successful rpc_requests_total divided by all rpc_requests_total for the selected RPC method, region, and infrastructure filter.",
      },
      {
        provider: "Helius",
        description:
          "Successful rpc_requests_total divided by all rpc_requests_total for the selected RPC method, region, and infrastructure filter.",
      },
      {
        provider: "QuickNode",
        description:
          "Successful rpc_requests_total divided by all rpc_requests_total for the selected RPC method, region, and infrastructure filter.",
      },
      {
        provider: "Triton",
        description:
          "Successful rpc_requests_total divided by all rpc_requests_total for the selected RPC method, region, and infrastructure filter.",
      },
    ],
  },
  {
    id: "rpc-avg-latency",
    tab: "rpc",
    title: "Avg Latency",
    valueLabel: "Milliseconds",
    metrics: ["RPC Avg Latency"],
    aggregation: "avg",
    seriesField: "provider",
    lowerIsBetter: true,
    timeGranularity: "hour",
    visualization: "bar",
    methodology: [
      {
        provider: "Alchemy",
        description:
          "Prometheus rate over 5 minutes for the selected RPC method, region, and infrastructure filter.",
      },
      {
        provider: "Helius",
        description:
          "Prometheus rate over 5 minutes for the selected RPC method, region, and infrastructure filter.",
      },
      {
        provider: "QuickNode",
        description:
          "Prometheus rate over 5 minutes for the selected RPC method, region, and infrastructure filter.",
      },
      {
        provider: "Triton",
        description:
          "Prometheus rate over 5 minutes for the selected RPC method, region, and infrastructure filter.",
      },
    ],
  },
  {
    id: "rpc-p50-latency",
    tab: "rpc",
    title: "P50 Latency",
    valueLabel: "Milliseconds",
    metrics: ["RPC P50 Latency"],
    aggregation: "avg",
    seriesField: "provider",
    lowerIsBetter: true,
    timeGranularity: "hour",
    methodology: [
      {
        provider: "Alchemy",
        description:
          "Prometheus histogram p50 over 1 hour for the selected RPC method, region, and infrastructure filter.",
      },
      {
        provider: "Helius",
        description:
          "Prometheus histogram p50 over 1 hour for the selected RPC method, region, and infrastructure filter.",
      },
      {
        provider: "QuickNode",
        description:
          "Prometheus histogram p50 over 1 hour for the selected RPC method, region, and infrastructure filter.",
      },
      {
        provider: "Triton",
        description:
          "Prometheus histogram p50 over 1 hour for the selected RPC method, region, and infrastructure filter.",
      },
    ],
  },
  {
    id: "rpc-p95-latency",
    tab: "rpc",
    title: "P95 Latency",
    valueLabel: "Milliseconds",
    metrics: ["RPC P95 Latency"],
    aggregation: "avg",
    seriesField: "provider",
    lowerIsBetter: true,
    timeGranularity: "hour",
    methodology: [
      {
        provider: "Alchemy",
        description:
          "Prometheus histogram p95 over 1 hour for the selected RPC method, region, and infrastructure filter.",
      },
      {
        provider: "Helius",
        description:
          "Prometheus histogram p95 over 1 hour for the selected RPC method, region, and infrastructure filter.",
      },
      {
        provider: "QuickNode",
        description:
          "Prometheus histogram p95 over 1 hour for the selected RPC method, region, and infrastructure filter.",
      },
      {
        provider: "Triton",
        description:
          "Prometheus histogram p95 over 1 hour for the selected RPC method, region, and infrastructure filter.",
      },
    ],
  },
  {
    id: "rpc-p99-latency",
    tab: "rpc",
    title: "P99 Latency",
    valueLabel: "Milliseconds",
    metrics: ["RPC P99 Latency"],
    aggregation: "avg",
    seriesField: "provider",
    lowerIsBetter: true,
    timeGranularity: "hour",
    methodology: [
      {
        provider: "Alchemy",
        description:
          "Prometheus histogram p99 over 1 hour for the selected RPC method, region, and infrastructure filter.",
      },
      {
        provider: "Helius",
        description:
          "Prometheus histogram p99 over 1 hour for the selected RPC method, region, and infrastructure filter.",
      },
      {
        provider: "QuickNode",
        description:
          "Prometheus histogram p99 over 1 hour for the selected RPC method, region, and infrastructure filter.",
      },
      {
        provider: "Triton",
        description:
          "Prometheus histogram p99 over 1 hour for the selected RPC method, region, and infrastructure filter.",
      },
    ],
  },
] as const satisfies readonly ChartDefinition[];

export const metricNames = Array.from(
  new Set(chartDefinitions.flatMap((chart) => chart.metrics)),
);
