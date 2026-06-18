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
  "DeFiLlama",
  "Dune",
  "RWA",
  "Stakewiz",
  "Token Terminal",
  "Validators App",
] as const;

export type ProviderName = (typeof providers)[number];
export type DashboardTab = "stablecoins" | "overview" | "network" | "defi";
export type Aggregation = "avg" | "sum";
export type SeriesField = "provider" | "metric";

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
  providers?: readonly ProviderName[];
  methodology?: readonly MethodologyComment[];
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
  Allium: "#DFA3DA",
  Artemis: "#14F195",
  Blockworks: "#E32EE9",
  DeFiLlama: "#3B8CFF",
  Dune: "#F75F47",
  RWA: "#A1B9E3",
  Stakewiz: "#f6b486",
  "Token Terminal": "#45A88E",
  "Validators App": "#38BDF8",
};

const providerAliases: Record<string, ProviderName> = {
  DefiLama: "DeFiLlama",
  DefiLlama: "DeFiLlama",
};

export function normalizeProviderName(value: string) {
  return providerAliases[value] ?? value;
}

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
  "DeFiLlama",
  "Dune",
] as const satisfies readonly ProviderName[];

const stablecoinCountProviders = [
  "Allium",
  "Dune",
] as const satisfies readonly ProviderName[];

const networkStakeProviders = [
  "Blockworks",
  "Stakewiz",
  "Validators App",
] as const satisfies readonly ProviderName[];

const networkValidatorProviders = [
  "Stakewiz",
  "Validators App",
] as const satisfies readonly ProviderName[];

const networkPriceProviders = [
  "Blockworks",
  "Validators App",
] as const satisfies readonly ProviderName[];

const networkAsnProviders = [
  "Stakewiz",
  "Validators App",
] as const satisfies readonly ProviderName[];

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
    providers: stablecoinCountProviders,
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
  },
  {
    id: "total-stake",
    tab: "network",
    title: "Total Stake",
    valueLabel: "SOL",
    metrics: ["Total Stake"],
    aggregation: "avg",
    seriesField: "provider",
    providers: networkStakeProviders,
  },
  {
    id: "validator-count",
    tab: "network",
    title: "Validator Count",
    valueLabel: "Count",
    metrics: ["Validator Count"],
    aggregation: "avg",
    seriesField: "provider",
    providers: networkValidatorProviders,
  },
  {
    id: "top-asn-share",
    tab: "network",
    title: "Top 3 ASN Share",
    valueLabel: "Percent",
    metrics: ["Top 3 ASN Share"],
    aggregation: "avg",
    seriesField: "provider",
    providers: networkAsnProviders,
  },
  {
    id: "sol-price-network",
    tab: "network",
    title: "SOL Price (Network)",
    valueLabel: "USD",
    metrics: ["SOL Price (Network)"],
    aggregation: "avg",
    seriesField: "provider",
    providers: networkPriceProviders,
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
    providers: dexActivityProviders,
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
    providers: dexCountProviders,
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
    providers: dexActivityProviders,
    methodology: [
      {
        provider: "Allium",
        description:
          "Unique Solana DEX swap initiators; no bot filter applied.",
      },
    ],
  },
] as const satisfies readonly ChartDefinition[];

export const metricNames = Array.from(
  new Set(chartDefinitions.flatMap((chart) => chart.metrics)),
);
