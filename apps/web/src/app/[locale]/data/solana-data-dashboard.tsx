"use client";

import { Github } from "@boxicons/react/Github";
import { ArrowOutUpRightSquare as ExternalLink } from "@boxicons/react/ArrowOutUpRightSquare";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import {
  getDefaultRpcRegion,
  getRpcRegionOptions,
  getRpcRegionsByInfra,
  senderEconomicsMetricNames,
  type DataApiResponse,
  type MetricRow,
  type ProviderName,
  type RpcLatencyFiltersResponse,
} from "./data-config";
import {
  dataAggregatorRepositoryUrl,
  dataSWRConfig,
  rpcDataSWRConfig,
  rpcFiltersSWRConfig,
  rpcLatencyProviderOnboardingUrl,
  rpcLatencyRepositoryUrl,
  backfillRequestsUrl,
} from "./dashboard-constants";
import { formatTimestamp, getTabContent } from "./dashboard-copy";
import { DashboardControls } from "./dashboard-controls";
import { ChartGrid, DataError, KpiGrid } from "./dashboard-charts";
import { fetchData, fetchRpcFilters } from "./dashboard-fetch";
import {
  filterRowsForCharts,
  getChartsForTab,
  getKpiCharts,
  getKpis,
  getVisibleCharts,
} from "./dashboard-metrics";
import {
  getAvailableProviders,
  getFooterProvidersLabel,
  getRpcInfraLabel,
  getRpcRegionLabel,
  getSelectedProviderList,
  hasInvalidProviderParam,
  parseProviders,
} from "./dashboard-providers";
import { getDashboardDataUrl } from "./dashboard-query";
import {
  useDashboardQueryParams,
  useDashboardQueryUpdater,
} from "./dashboard-query-state";
import { DataResourceCarousel } from "./dashboard-resources";
import { SenderProviderExperience } from "./sender-provider-experience";

export { getSenderEconomicsItems } from "./sender-provider-experience";
export { applyQueryUpdates } from "./dashboard-query";
export { getChartsForTab, getKpiValue, getMedian } from "./dashboard-metrics";
export {
  getAvailableProviders,
  getSelectedProviderList,
  parseProviders,
  updateProvidersParam,
} from "./dashboard-providers";
export type { KpiAggregation } from "./dashboard-types";

const emptyRows: MetricRow[] = [];

export function SolanaDataDashboard() {
  const locale = useLocale();
  const t = useTranslations("dataDashboard");
  const showProviderControls = useMinWidth("(min-width: 768px)");
  const {
    activeTab,
    providerParam,
    queryString,
    rangeDays,
    rpcInfra,
    rpcMethod,
    rpcRegion,
    rpcTimeframe,
    setQueryString,
  } = useDashboardQueryParams();
  const isRpcTab = activeTab === "rpc";
  const isSendersTab = activeTab === "senders";
  const isLiveInfrastructureTab = isRpcTab || isSendersTab;
  const { data: rpcFilters } = useSWR<RpcLatencyFiltersResponse>(
    isRpcTab ? "/api/rpc/filters" : null,
    fetchRpcFilters,
    rpcFiltersSWRConfig,
  );
  const rpcRegionsByInfra = useMemo(
    () => getRpcRegionsByInfra(rpcFilters),
    [rpcFilters],
  );
  const activeTabContent = getTabContent(t, activeTab);
  const activeCharts = useMemo(() => getChartsForTab(activeTab), [activeTab]);
  const dataUrl = getDashboardDataUrl({
    activeTab,
    rpcInfra,
    rangeDays,
    rpcMethod,
    rpcRegion,
    rpcTimeframe,
  });
  const errorMessages = useMemo(
    () => ({
      defaultUnavailable: t("errors.defaultUnavailable"),
      invalidResponse: t("errors.invalidResponse"),
    }),
    [t],
  );
  const fetchDashboardData = useCallback(
    (url: string) => fetchData(url, errorMessages),
    [errorMessages],
  );
  const { data, error, isLoading, isValidating } = useSWR<DataApiResponse>(
    dataUrl,
    fetchDashboardData,
    isLiveInfrastructureTab ? rpcDataSWRConfig : dataSWRConfig,
  );
  const rows = useMemo(
    () =>
      filterRowsForCharts(
        data?.rows ?? emptyRows,
        activeCharts,
        isSendersTab ? senderEconomicsMetricNames : [],
      ),
    [activeCharts, data?.rows, isSendersTab],
  );
  const availableProviders = useMemo(() => getAvailableProviders(rows), [rows]);
  const selectedProviders = useMemo(
    () => parseProviders(providerParam, availableProviders),
    [availableProviders, providerParam],
  );
  const selectedProviderList = useMemo(
    () => getSelectedProviderList(selectedProviders, availableProviders),
    [availableProviders, selectedProviders],
  );
  const updateQuery = useDashboardQueryUpdater(
    availableProviders,
    queryString,
    setQueryString,
  );
  const availableRpcRegionOptions = useMemo(
    () => getRpcRegionOptions(rpcInfra, rpcRegionsByInfra),
    [rpcInfra, rpcRegionsByInfra],
  );

  useEffect(() => {
    if (
      !providerParam ||
      availableProviders.length === 0 ||
      !hasInvalidProviderParam(providerParam, availableProviders)
    ) {
      return;
    }

    updateQuery({ providers: new Set(availableProviders) });
  }, [availableProviders, providerParam, updateQuery]);

  useEffect(() => {
    if (
      !isRpcTab ||
      availableRpcRegionOptions.some((option) => option.value === rpcRegion)
    ) {
      return;
    }

    updateQuery({
      region: getDefaultRpcRegion(rpcInfra, rpcRegionsByInfra),
    });
  }, [
    availableRpcRegionOptions,
    isRpcTab,
    rpcInfra,
    rpcRegion,
    rpcRegionsByInfra,
    updateQuery,
  ]);
  const visibleCharts = useMemo(
    () => getVisibleCharts(activeCharts, rows),
    [activeCharts, rows],
  );
  const kpiCharts = useMemo(
    () => getKpiCharts(visibleCharts, isRpcTab),
    [isRpcTab, visibleCharts],
  );
  const kpiAggregation = isRpcTab ? "minimum" : "median";
  const kpis = useMemo(
    () => getKpis(kpiCharts, rows, selectedProviders, kpiAggregation),
    [kpiAggregation, kpiCharts, rows, selectedProviders],
  );
  const hasKpiGrid = !isLiveInfrastructureTab;
  const isInitialLoading = (isLoading || isValidating) && rows.length === 0;
  const isRefreshing = isValidating && rows.length > 0;
  const footerMetaItems = [
    <span key="cadence">
      {isRpcTab
        ? t("footer.rpcRefreshCadence")
        : isSendersTab
          ? t("footer.senderRefreshCadence")
          : t("footer.refreshCadence")}
    </span>,
    data?.generatedAt ? (
      <span key="refreshed">
        {t("footer.lastRefreshed")}{" "}
        <span className="text-nd-high-em-text">
          {formatTimestamp(data.generatedAt, locale)}
        </span>
      </span>
    ) : null,
    isRpcTab ? (
      <span key="filter">
        {t("footer.rpcFilter", {
          infra: getRpcInfraLabel(rpcInfra),
          method: rpcMethod,
          region: getRpcRegionLabel(rpcRegion),
        })}
      </span>
    ) : isSendersTab ? null : (
      <span key="lag">{t("footer.lagNotice")}</span>
    ),
    isLiveInfrastructureTab ? null : (
      <span key="backfill">{t("footer.backfillCadence")}</span>
    ),
  ].filter((item): item is React.ReactElement => item !== null);

  return (
    <main className="relative bg-nd-inverse text-nd-high-em-text font-brand">
      <div className="max-w-screen-2xl w-full mx-auto px-4 md:px-8 xl:px-10 py-8 md:py-10 xl:py-16">
        <header>
          <div>
            <span className="font-brand-mono text-[11px] md:text-[12px] leading-[1.42] font-bold uppercase text-nd-mid-em-text inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-nd-highlight-green"
              />
              {t("header.eyebrow")}
            </span>
            <h1 className="nd-heading-l mt-3">{t("header.title")}</h1>
            <p className="nd-body-m text-nd-mid-em-text mt-3 max-w-[560px]">
              {t("header.description")}
            </p>
          </div>
        </header>

        <nav
          aria-label={t("controls.ariaLabel")}
          className="sticky top-14 z-40 mt-8 -mx-4 md:-mx-8 xl:-mx-10 bg-nd-inverse/90 backdrop-blur-md border-y border-nd-border-light"
        >
          <DashboardControls
            activeTab={activeTab}
            availableProviders={availableProviders}
            isRefreshing={isRefreshing}
            rangeDays={rangeDays}
            rpcInfra={rpcInfra}
            rpcMethod={rpcMethod}
            rpcRegion={rpcRegion}
            rpcRegionsByInfra={rpcRegionsByInfra}
            rpcTimeframe={rpcTimeframe}
            selectedProviders={selectedProviders}
            showProviderControls={showProviderControls && !isSendersTab}
            showRangeControl={!isLiveInfrastructureTab}
            showRpcFilterControls={isRpcTab}
            showTimeframeControl={isLiveInfrastructureTab}
            onUpdateQuery={updateQuery}
          />
        </nav>

        <section
          aria-label={t("summaryAriaLabel", {
            tab: activeTabContent.label,
          })}
          className="mt-8 max-w-[720px]"
        >
          <h2 className="sr-only">{activeTabContent.label}</h2>
          <p className="nd-body-m text-nd-mid-em-text">
            {activeTabContent.description}
          </p>
          {activeTabContent.clarification ? (
            <p className="mt-3 nd-body-s text-nd-mid-em-text/80">
              {activeTabContent.clarification}
            </p>
          ) : null}
        </section>

        {error ? <DataError error={error} /> : null}

        {!error ? (
          isSendersTab ? (
            <SenderProviderExperience
              availableProviders={availableProviders}
              comparisonProviders={
                providerParam === null
                  ? new Set<ProviderName>()
                  : selectedProviders
              }
              hasExplicitComparison={providerParam !== null}
              isLoading={isInitialLoading}
              isRefreshing={isRefreshing}
              rows={rows}
              onComparisonChange={(providers) =>
                updateQuery({
                  providers: providers ?? new Set(availableProviders),
                })
              }
            />
          ) : (
            <>
              {hasKpiGrid ? (
                <KpiGrid
                  aggregation={kpiAggregation}
                  isLoading={isInitialLoading}
                  kpis={kpis}
                />
              ) : null}

              <ChartGrid
                activeCharts={activeCharts}
                activeTab={activeTab}
                isConnectedToPrevious={hasKpiGrid}
                isLoading={isInitialLoading}
                isRefreshing={isRefreshing}
                rows={rows}
                rpcTimeframe={rpcTimeframe}
                selectedProviders={selectedProviders}
                visibleCharts={visibleCharts}
              />
            </>
          )
        ) : null}

        <DataResourceCarousel />

        <footer className="mt-10 xl:mt-14 border-t border-nd-border-light pt-6 flex flex-col gap-5 font-brand-mono text-[12px] md:text-[13px] leading-[1.42] uppercase text-nd-mid-em-text">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-nd-high-em-text">
              {getFooterProvidersLabel(
                t,
                selectedProviderList,
                availableProviders,
                providerParam,
              )}
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-nd-border-prominent"
              />
              {isLiveInfrastructureTab
                ? t("footer.lastTimeframe", { timeframe: rpcTimeframe })
                : t("footer.lastDays", { days: rangeDays })}
            </span>
            <span className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:justify-end">
              {isRpcTab ? (
                <>
                  <a
                    className="inline-flex items-center gap-1.5 text-nd-high-em-text transition-colors hover:text-nd-primary"
                    href={rpcLatencyRepositoryUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Github aria-hidden="true" className="h-3.5 w-3.5" />
                    {t("footer.ossRepo")}
                    <ExternalLink aria-hidden="true" className="h-3 w-3" />
                  </a>
                  <a
                    className="inline-flex items-center gap-1.5 text-nd-high-em-text transition-colors hover:text-nd-primary"
                    href={rpcLatencyProviderOnboardingUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {t("footer.addRpcProvider")}
                    <ExternalLink aria-hidden="true" className="h-3 w-3" />
                  </a>
                </>
              ) : isSendersTab ? null : (
                <>
                  <a
                    className="inline-flex items-center gap-1.5 text-nd-high-em-text transition-colors hover:text-nd-primary"
                    href={dataAggregatorRepositoryUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Github aria-hidden="true" className="h-3.5 w-3.5" />
                    {t("footer.source")}
                    <ExternalLink aria-hidden="true" className="h-3 w-3" />
                  </a>
                  <a
                    className="inline-flex items-center gap-1.5 text-nd-high-em-text transition-colors hover:text-nd-primary"
                    href={backfillRequestsUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {t("footer.backfillRequests")}
                    <ExternalLink aria-hidden="true" className="h-3 w-3" />
                  </a>
                </>
              )}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 text-[11px] leading-[1.5] text-nd-mid-em-text/55 sm:flex-row sm:flex-wrap sm:items-center">
            {footerMetaItems.map((item, index) => (
              <Fragment key={item.key}>
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className="mx-3 hidden text-nd-border-prominent sm:inline"
                  >
                    ·
                  </span>
                ) : null}
                {item}
              </Fragment>
            ))}
          </div>
        </footer>
      </div>
    </main>
  );
}

function useMinWidth(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);

    updateMatches();
    mediaQuery.addEventListener("change", updateMatches);

    return () => mediaQuery.removeEventListener("change", updateMatches);
  }, [query]);

  return matches;
}
