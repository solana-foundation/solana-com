import type {
  ChartDefinition,
  DashboardTab,
  ProviderName,
  RpcLatencyInfra,
  RpcLatencyMethod,
  RpcLatencyRegion,
  RpcTimeframe,
} from "./data-config";
import { useTranslations } from "@workspace/i18n/client";
import type { DateBounds } from "./date-range";
import type { GrpcStream, GrpcCommitment } from "./grpc-config";

export type DashboardTranslator = ReturnType<typeof useTranslations>;
export type DataFetchErrorMessages = {
  defaultUnavailable: string;
  invalidResponse: string;
};

export type QueryUpdates = {
  grpcRegion?: string;
  grpcCloudProvider?: string;
  grpcStream?: GrpcStream;
  grpcCommitment?: GrpcCommitment;
  days?: number;
  infra?: RpcLatencyInfra;
  method?: RpcLatencyMethod;
  providers?: Set<ProviderName>;
  /** A custom From/To range; replaces `days` in the URL. */
  range?: DateBounds;
  region?: RpcLatencyRegion;
  tab?: DashboardTab;
  timeframe?: RpcTimeframe;
};

export type KpiAggregation = "median" | "minimum";

export type KpiItem = {
  chart: ChartDefinition;
  delta: number;
  value: number;
};
