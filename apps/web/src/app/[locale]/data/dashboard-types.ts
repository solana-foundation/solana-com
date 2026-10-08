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

export type DashboardTranslator = ReturnType<typeof useTranslations>;
export type DataFetchErrorMessages = {
  defaultUnavailable: string;
  invalidResponse: string;
};

export type QueryUpdates = {
  days?: number;
  infra?: RpcLatencyInfra;
  method?: RpcLatencyMethod;
  providers?: Set<ProviderName>;
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
