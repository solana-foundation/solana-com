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
  { label: "iad", value: "iad" },
  { label: "nyc", value: "nyc" },
  { label: "ewr", value: "ewr" },
  { label: "pit", value: "pit" },
  { label: "lax", value: "lax" },
  { label: "sfo", value: "sfo" },
  { label: "lon", value: "lon" },
  { label: "fra", value: "fra" },
  { label: "ams", value: "ams" },
  { label: "dub", value: "dub" },
  { label: "tyo", value: "tyo" },
  { label: "sgp", value: "sgp" },
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

export type RpcLatencyInfra = (typeof rpcInfraOptions)[number]["value"];
export type RpcLatencyRegion = (typeof rpcRegionOptions)[number]["value"];
export type RpcLatencyMethod = (typeof rpcMethodOptions)[number]["value"];
export type RpcTimeframe = (typeof rpcTimeframeOptions)[number]["value"];
export type ProviderName = string;

export const defaultRpcInfra = "tsw" satisfies RpcLatencyInfra;
export const defaultRpcRegion = "lax" satisfies RpcLatencyRegion;
export const defaultRpcMethod = "getLatestBlockhash" satisfies RpcLatencyMethod;
export const defaultRpcTimeframe = "6h" satisfies RpcTimeframe;

export function isRpcLatencyInfra(
  value: string | null | undefined,
): value is RpcLatencyInfra {
  return rpcInfraOptions.some((option) => option.value === value);
}

export function isRpcLatencyRegion(
  value: string | null | undefined,
): value is RpcLatencyRegion {
  return rpcRegionOptions.some((option) => option.value === value);
}

export function getRpcTimeframeOption(value?: RpcTimeframe) {
  return (
    rpcTimeframeOptions.find((option) => option.value === value) ??
    rpcTimeframeOptions.find((option) => option.value === defaultRpcTimeframe)!
  );
}

export type RpcLatencyFiltersResponse = {
  regionsByInfra: Record<RpcLatencyInfra, RpcLatencyRegion[]>;
};

type RpcRegionSourceValues = Partial<
  Record<RpcLatencyRegion, readonly string[]>
>;

// Canonical UI colos mapped to the region labels emitted by each infra.
const rpcRegionSourceValuesByInfra: Record<
  RpcLatencyInfra,
  RpcRegionSourceValues
> = {
  tsw: {
    ewr: ["ewr2"],
    pit: ["pit1", "pitt1"],
    lax: ["lax1"],
    lon: ["lon1"],
    fra: ["fra2"],
    ams: ["ams3"],
    tyo: ["tyo2"],
    sgp: ["sgp2"],
  },
  lat: {
    nyc: ["nyc"],
    lax: ["lax"],
    lon: ["lon"],
    fra: ["fra"],
    ams: ["ams"],
    tyo: ["tyo"],
    sgp: ["sgp"],
  },
  aws: {
    iad: ["us-east-1"],
    sfo: ["us-west-1"],
    lon: ["eu-west-2"],
    fra: ["eu-central-1"],
    dub: ["eu-west-1"],
    tyo: ["ap-northeast-1"],
    sgp: ["ap-southeast-1"],
  },
  gcp: {
    iad: ["us-east4"],
    lax: ["us-west2"],
    lon: ["europe-west2"],
    fra: ["europe-west3"],
    ams: ["europe-west4"],
    tyo: ["asia-northeast1"],
    sgp: ["asia-southeast1"],
  },
};

function getConfiguredRpcRegions(infra: RpcLatencyInfra) {
  const sourceValues = rpcRegionSourceValuesByInfra[infra];

  return rpcRegionOptions
    .filter(({ value }) => sourceValues[value])
    .map(({ value }) => value);
}

export const fallbackRpcRegionsByInfra: RpcLatencyFiltersResponse["regionsByInfra"] =
  {
    tsw: getConfiguredRpcRegions("tsw"),
    lat: getConfiguredRpcRegions("lat"),
    aws: getConfiguredRpcRegions("aws"),
    gcp: getConfiguredRpcRegions("gcp"),
  };

export function isRpcLatencyFiltersResponse(
  value: unknown,
): value is RpcLatencyFiltersResponse {
  if (!value || typeof value !== "object" || !("regionsByInfra" in value)) {
    return false;
  }

  const regionsByInfra = value.regionsByInfra;

  if (!regionsByInfra || typeof regionsByInfra !== "object") {
    return false;
  }

  return rpcInfraOptions.every(({ value: infra }) => {
    const regions = (regionsByInfra as Record<string, unknown>)[infra];

    return (
      Array.isArray(regions) &&
      regions.every(
        (region) => typeof region === "string" && isRpcLatencyRegion(region),
      )
    );
  });
}

export function getRpcRegionsByInfra(
  filters?: RpcLatencyFiltersResponse,
): RpcLatencyFiltersResponse["regionsByInfra"] {
  function getRegions(infra: RpcLatencyInfra) {
    const regions = filters?.regionsByInfra[infra];

    return regions?.length ? regions : fallbackRpcRegionsByInfra[infra];
  }

  return {
    tsw: getRegions("tsw"),
    lat: getRegions("lat"),
    aws: getRegions("aws"),
    gcp: getRegions("gcp"),
  };
}

function buildRpcRegionParamAliases() {
  const aliases: Partial<Record<string, RpcLatencyRegion>> = {
    pitt: "pit",
  };

  for (const { value: infra } of rpcInfraOptions) {
    for (const { value: region } of rpcRegionOptions) {
      const sourceValues = rpcRegionSourceValuesByInfra[infra][region] ?? [];

      for (const sourceValue of sourceValues) {
        aliases[sourceValue] = region;
      }
    }
  }

  return aliases;
}

const rpcRegionParamAliases = buildRpcRegionParamAliases();
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

export function getRpcRegionSourceValue(
  infra: RpcLatencyInfra,
  value: RpcLatencyRegion,
) {
  return rpcRegionSourceValuesByInfra[infra][value]?.join("|") ?? value;
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
  const options = getRpcRegionOptions(infra, regionsByInfra);

  return options.some((option) => option.value === defaultRpcRegion)
    ? defaultRpcRegion
    : (options[0]?.value ?? defaultRpcRegion);
}

export function parseRpcInfra(value: string | null | undefined) {
  const normalizedValue = normalizeRpcInfraParam(value);

  return isRpcLatencyInfra(normalizedValue) ? normalizedValue : defaultRpcInfra;
}

export function parseRpcMethod(value: string | null | undefined) {
  return (
    rpcMethodOptions.find((option) => option.value === value)?.value ??
    defaultRpcMethod
  );
}

export function parseRpcRegion(
  value: string | null | undefined,
  infra: RpcLatencyInfra,
) {
  const normalizedValue = normalizeRpcRegionParam(value);
  const matchingRegion = getRpcRegionOptions(infra).find(
    (option) => option.value === normalizedValue,
  );

  return matchingRegion?.value ?? getDefaultRpcRegion(infra);
}

export function parseRpcTimeframe(value: string | null | undefined) {
  return (
    rpcTimeframeOptions.find((option) => option.value === value)?.value ??
    defaultRpcTimeframe
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
  details?: MetricRowDetail[];
  metricName: string;
  unit: string;
  providerName: string;
  value: number;
};

export type MetricRowDetail = {
  description: string;
  id: string;
  label: string;
  value: number;
};

export const rpcErrorKindOptions = [
  {
    value: "timeout",
    label: "Timeout",
    description: "No response within the 10-second deadline.",
  },
  {
    value: "transport",
    label: "Connection failed",
    description: "DNS, TLS, or connection-level failure.",
  },
  {
    value: "http_5xx",
    label: "Server error",
    description: "The provider returned HTTP 500–599.",
  },
  {
    value: "http_429",
    label: "Rate limited",
    description:
      "The provider returned HTTP 429. This is normally treated as a neutral skipped outcome.",
  },
  {
    value: "http_4xx",
    label: "Client error",
    description:
      "The provider returned another HTTP 4xx. This is normally treated as a neutral skipped outcome.",
  },
  {
    value: "rpc_block_unavailable",
    label: "Block unavailable",
    description: "The node does not have the requested block (-32004).",
  },
  {
    value: "rpc_node_unhealthy",
    label: "Node behind",
    description: "The node is unhealthy or behind the cluster (-32005).",
  },
  {
    value: "rpc_slot_skipped",
    label: "Slot skipped",
    description:
      "A skipped slot was returned for a method that should not hit one (-32007/-32009).",
  },
  {
    value: "rpc_tx_history_unavailable",
    label: "History unavailable",
    description: "Transaction history is not available (-32011).",
  },
  {
    value: "rpc_method_not_found",
    label: "Method not supported",
    description: "The provider does not support this method (-32601).",
  },
  {
    value: "rpc_invalid_params",
    label: "Invalid params",
    description: "The provider rejected the request parameters (-32602).",
  },
  {
    value: "rpc_error",
    label: "RPC error",
    description: "Another JSON-RPC error was returned.",
  },
  {
    value: "decode",
    label: "Malformed response",
    description: "The HTTP 200 response was not valid JSON-RPC.",
  },
  {
    value: "empty",
    label: "Empty result",
    description: "The HTTP 200 response did not contain usable data.",
  },
  {
    value: "stale",
    label: "Stale data",
    description: "The response slot trailed the chain tip beyond its budget.",
  },
] as const;

export function getRpcErrorKindOption(value: string) {
  return rpcErrorKindOptions.find((option) => option.value === value);
}

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
    id: "rpc-error-rate",
    tab: "rpc",
    title: "Error Rate",
    valueLabel: "Percent",
    metrics: ["RPC Error Rate"],
    aggregation: "avg",
    seriesField: "provider",
    lowerIsBetter: true,
    timeGranularity: "hour",
    methodology: [
      {
        provider: "Alchemy",
        description:
          "Errored rpc_requests_total divided by successful and errored requests for the selected filters. Skipped outcomes are neutral. Hover the chart for error types.",
      },
      {
        provider: "Helius",
        description:
          "Errored rpc_requests_total divided by successful and errored requests for the selected filters. Skipped outcomes are neutral. Hover the chart for error types.",
      },
      {
        provider: "QuickNode",
        description:
          "Errored rpc_requests_total divided by successful and errored requests for the selected filters. Skipped outcomes are neutral. Hover the chart for error types.",
      },
      {
        provider: "Triton",
        description:
          "Errored rpc_requests_total divided by successful and errored requests for the selected filters. Skipped outcomes are neutral. Hover the chart for error types.",
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
