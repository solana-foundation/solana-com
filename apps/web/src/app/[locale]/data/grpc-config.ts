import { rpcTimeframeOptions } from "./data-config";

export const grpcTimeframeOptions = rpcTimeframeOptions.filter(
  (option) => option.durationSeconds <= 30 * 24 * 60 * 60,
);
export const grpcStreamOptions = [
  { label: "All streams", value: "all" },
  { label: "Account", value: "account" },
  { label: "Transaction", value: "transaction" },
  { label: "Slot", value: "slot" },
] as const;
export const grpcCommitmentOptions = [
  { label: "Processed", value: "processed" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Finalized", value: "finalized" },
] as const;

export type GrpcStream = (typeof grpcStreamOptions)[number]["value"];
export type GrpcCommitment = (typeof grpcCommitmentOptions)[number]["value"];
export type GrpcFiltersResponse = {
  regions: string[];
  cloudProviders: string[];
  cloudProvidersByRegion: Record<string, string[]>;
  streams: string[];
  commitments: string[];
  providers: string[];
};

export const grpcPercentiles = ["P50", "P95", "P99", "P99.9"] as const;
export type GrpcPercentile = (typeof grpcPercentiles)[number];
export const grpcChartMetrics = [
  ...grpcPercentiles,
  "Missed Updates",
  "Uptime",
] as const;
export type GrpcChartMetric = (typeof grpcChartMetrics)[number];
export const grpcMetricNames = [
  ...[...grpcPercentiles, "Avg"].flatMap((label) => [
    `gRPC ${label} Lag`,
    `gRPC ${label} Lag Entire Period`,
  ]),
  "gRPC Missed Updates",
  "gRPC Missed Updates Trend",
  "gRPC Downtime",
  "gRPC Reconnects",
  "gRPC Downtime Trend",
  "gRPC Reconnects Trend",
  "gRPC Reconnect Event",
];

export function parseGrpcStream(value: string | null) {
  return (
    grpcStreamOptions.find((option) => option.value === value)?.value ??
    "transaction"
  );
}

export function parseGrpcCommitment(value: string | null) {
  return (
    grpcCommitmentOptions.find((option) => option.value === value)?.value ??
    "processed"
  );
}

export function parseGrpcTimeframe(value: string | null) {
  return (
    grpcTimeframeOptions.find((option) => option.value === value)?.value ?? "6h"
  );
}

export function isGrpcFiltersResponse(
  value: unknown,
): value is GrpcFiltersResponse {
  if (!value || typeof value !== "object") return false;
  const filter = value as Record<string, unknown>;
  const isStringArray = (items: unknown): items is string[] =>
    Array.isArray(items) && items.every((item) => typeof item === "string");
  return (
    ["regions", "cloudProviders", "streams", "commitments", "providers"].every(
      (key) => isStringArray(filter[key]),
    ) &&
    !!filter.cloudProvidersByRegion &&
    typeof filter.cloudProvidersByRegion === "object" &&
    !Array.isArray(filter.cloudProvidersByRegion) &&
    Object.values(filter.cloudProvidersByRegion).every(isStringArray)
  );
}

export function getGrpcCloudProviders(
  filters: GrpcFiltersResponse | undefined,
  region: string,
): string[] {
  if (!filters) return [];
  if (region === "all") return filters.cloudProviders;
  return Object.hasOwn(filters.cloudProvidersByRegion, region)
    ? filters.cloudProvidersByRegion[region]
    : [];
}
