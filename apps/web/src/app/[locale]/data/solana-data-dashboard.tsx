"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ExternalLink,
  Github,
  Info,
  Loader2,
  Network,
  RadioTower,
  type LucideIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useSWR from "swr";
import { Link } from "@solana-com/ui-chrome/link";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import { usePathname, useRouter } from "@workspace/i18n/routing";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { cn } from "@/app/components/utils";

import {
  chartDefinitions,
  defaultRpcInfra,
  defaultRpcMethod,
  defaultRpcTimeframe,
  fallbackRpcRegionsByInfra,
  getDefaultRpcRegion,
  getRpcRegionOptions,
  metricColors,
  normalizeRpcInfraParam,
  normalizeProviderName,
  normalizeRpcRegionParam,
  providerColors,
  rangeOptions,
  rpcInfraOptions,
  rpcMethodOptions,
  rpcRegionOptions,
  rpcTimeframeOptions,
  type Aggregation,
  type ChartDefinition,
  type DashboardTab,
  type DataApiResponse,
  type MethodologyComment,
  type MetricRow,
  type ProviderName,
  type RpcLatencyInfra,
  type RpcLatencyFiltersResponse,
  type RpcLatencyMethod,
  type RpcLatencyRegion,
  type RpcTimeframe,
} from "./data-config";
import {
  formatValue,
  TimeSeriesChart,
  type ChartSeries,
} from "./time-series-chart";

const tabOptions = [
  { labelKey: "tabs.overview.label", value: "overview" },
  { labelKey: "tabs.network.label", value: "network" },
  { labelKey: "tabs.stablecoins.label", value: "stablecoins" },
  { labelKey: "tabs.defi.label", value: "defi" },
  { labelKey: "tabs.rpc.label", value: "rpc" },
] as const satisfies readonly { labelKey: string; value: DashboardTab }[];

const tabIcons: Record<DashboardTab, LucideIcon> = {
  overview: Activity,
  network: Network,
  stablecoins: CircleDollarSign,
  defi: ArrowLeftRight,
  rpc: RadioTower,
};

const tabIndicatorSpring = {
  damping: 32,
  stiffness: 360,
  type: "spring",
} as const;

const emptyProvidersParam = "none";
const defaultRangeDays = 90;
const emptyRows: MetricRow[] = [];
const kpiCount = 4;
const chartHeight = 320;
const fallbackProviderColors = [
  "#FACC15",
  "#FB7185",
  "#2DD4BF",
  "#A78BFA",
  "#60A5FA",
  "#F97316",
  "#84CC16",
  "#F472B6",
] as const;
const dataRefreshIntervalMs = 12 * 60 * 60 * 1000;
const dataDedupingIntervalMs = 60 * 1000;
const rpcDataRefreshIntervalMs = 60 * 1000;
const rpcDataDedupingIntervalMs = 15 * 1000;
const rpcFiltersRefreshIntervalMs = 5 * 60 * 1000;
const dataAggregatorRepositoryUrl =
  "https://github.com/solana-foundation/solana-data-aggregator";
const rpcLatencyRepositoryUrl =
  "https://github.com/solana-foundation/rpc-latency-monitor";
const rpcLatencyProviderOnboardingUrl = `${rpcLatencyRepositoryUrl}#adding-your-rpc-for-providers`;
const rpcLatencyGrafanaUrl =
  "https://rpclatency.grafana.net/d/rpc-latency-monitor/rpc-latency-monitor?orgId=1";
const rpcSenderGrafanaUrl =
  "https://rpclatency.grafana.net/d/rpc-sender/sender?orgId=1";
const backfillRequestsUrl = `${dataAggregatorRepositoryUrl}/issues`;
const resourceCardStepFallback = 460;
const resourceCards = [
  {
    analyticsId: "sdp",
    backgroundClassName: "rotate-180 scale-[1.08]",
    backgroundSrc: "/src/img/solutions/sdp/feat-bg-1.webp",
    ctaKey: "buildSection.cards.sdp.cta",
    descriptionKey: "buildSection.cards.sdp.description",
    href: "/solutions/sdp",
    nodeId: "3:1096",
    titleKey: "buildSection.cards.sdp.title",
  },
  {
    analyticsId: "solana-data-aggregator",
    backgroundClassName: "",
    backgroundSrc: "/src/img/solutions/sdp/ai-advantages-visual-bg-2.webp",
    ctaKey: "buildSection.cards.aggregator.cta",
    descriptionKey: "buildSection.cards.aggregator.description",
    href: dataAggregatorRepositoryUrl,
    nodeId: "21:105",
    titleKey: "buildSection.cards.aggregator.title",
  },
  {
    analyticsId: "rpc-latency-monitor",
    backgroundClassName: "scale-[1.12]",
    backgroundSrc: "/src/img/solutions/sdp/feat-bg-3.webp",
    ctaKey: "buildSection.cards.rpcMonitor.cta",
    descriptionKey: "buildSection.cards.rpcMonitor.description",
    href: rpcLatencyRepositoryUrl,
    nodeId: "25:141",
    titleKey: "buildSection.cards.rpcMonitor.title",
  },
  {
    analyticsId: "rpc-sender-dashboard",
    backgroundClassName: "-scale-y-100",
    backgroundSrc: "/src/img/solutions/sdp/feat-bg-2.webp",
    ctaKey: "buildSection.cards.senderMetrics.cta",
    descriptionKey: "buildSection.cards.senderMetrics.description",
    href: rpcSenderGrafanaUrl,
    nodeId: "25:142",
    titleKey: "buildSection.cards.senderMetrics.title",
  },
  {
    analyticsId: "allium",
    backgroundClassName: "-scale-y-100 rotate-180",
    backgroundSrc: "/src/img/solutions/sdp/advantages-visual-bg.webp",
    ctaKey: "buildSection.cards.allium.cta",
    descriptionKey: "buildSection.cards.allium.description",
    href: "https://www.allium.so/solana",
    nodeId: "25:113",
    titleKey: "buildSection.cards.allium.title",
  },
  {
    analyticsId: "tokens",
    backgroundClassName: "rotate-180 scale-[1.08]",
    backgroundSrc: "/src/img/solutions/sdp/feat-bg-2.webp",
    ctaKey: "buildSection.cards.tokens.cta",
    descriptionKey: "buildSection.cards.tokens.description",
    href: "https://tokens.xyz",
    nodeId: "25:134",
    titleKey: "buildSection.cards.tokens.title",
  },
  {
    analyticsId: "lightspeed",
    backgroundClassName: "-scale-y-100",
    backgroundSrc: "/src/img/solutions/sdp/feat-bg-3.webp",
    ctaKey: "buildSection.cards.lightspeed.cta",
    descriptionKey: "buildSection.cards.lightspeed.description",
    href: "https://solanalightspeed.com/dashboards/",
    nodeId: "25:127",
    titleKey: "buildSection.cards.lightspeed.title",
  },
  {
    analyticsId: "dune",
    backgroundClassName: "scale-[1.18]",
    backgroundSrc: "/src/img/solutions/sdp/ai-advantages-visual-bg-1.webp",
    ctaKey: "buildSection.cards.dune.cta",
    descriptionKey: "buildSection.cards.dune.description",
    href: "https://docs.dune.com/data-catalog/solana/overview",
    nodeId: "25:120",
    titleKey: "buildSection.cards.dune.title",
  },
  {
    analyticsId: "pay-sh",
    backgroundClassName: "-scale-y-100",
    backgroundSrc: "/src/img/solutions/sdp/advantages-visual-bg.webp",
    ctaKey: "buildSection.cards.pay.cta",
    descriptionKey: "buildSection.cards.pay.description",
    href: "https://pay.sh",
    nodeId: "8:165",
    titleKey: "buildSection.cards.pay.title",
  },
  {
    analyticsId: "x402",
    backgroundClassName: "",
    backgroundSrc: "/src/img/data-dashboard/x402-card-bg.webp",
    ctaKey: "buildSection.cards.x402.cta",
    descriptionKey: "buildSection.cards.x402.description",
    href: "/x402",
    nodeId: "8:171",
    titleKey: "buildSection.cards.x402.title",
  },
] as const;
const dataSWRConfig = {
  dedupingInterval: dataDedupingIntervalMs,
  keepPreviousData: true,
  refreshInterval: dataRefreshIntervalMs,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
} as const;
const rpcDataSWRConfig = {
  ...dataSWRConfig,
  dedupingInterval: rpcDataDedupingIntervalMs,
  refreshInterval: rpcDataRefreshIntervalMs,
} as const;
const rpcFiltersSWRConfig = {
  dedupingInterval: rpcFiltersRefreshIntervalMs,
  keepPreviousData: true,
  refreshInterval: rpcFiltersRefreshIntervalMs,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
} as const;

type QueryUpdates = {
  days?: number;
  infra?: RpcLatencyInfra;
  method?: RpcLatencyMethod;
  providers?: Set<ProviderName>;
  region?: RpcLatencyRegion;
  tab?: DashboardTab;
  timeframe?: RpcTimeframe;
};

export type KpiAggregation = "median" | "minimum";

type KpiItem = {
  chart: ChartDefinition;
  delta: number;
  value: number;
};

type DashboardTranslator = ReturnType<typeof useTranslations>;

type DataFetchErrorMessages = {
  defaultUnavailable: string;
  invalidResponse: string;
};

type DataErrorPayload = {
  detail?: string;
  error?: string;
};

export function SolanaDataDashboard() {
  const locale = useLocale();
  const t = useTranslations("dataDashboard");
  const showProviderControls = useMinWidth("(min-width: 768px)");
  const {
    activeTab,
    providerParam,
    rangeDays,
    rpcInfra,
    rpcMethod,
    rpcRegion,
    rpcTimeframe,
  } = useDashboardQueryParams();
  const isRpcTab = activeTab === "rpc";
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
    isRpcTab ? rpcDataSWRConfig : dataSWRConfig,
  );
  const rows = useMemo(
    () => filterRowsForCharts(data?.rows ?? emptyRows, activeCharts),
    [activeCharts, data?.rows],
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
  const updateQuery = useDashboardQueryUpdater(availableProviders);
  const availableRpcRegionOptions = useMemo(
    () => getRpcRegionOptions(rpcInfra, rpcRegionsByInfra),
    [rpcInfra, rpcRegionsByInfra],
  );

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
  const hasKpiGrid = !isRpcTab;
  const isInitialLoading = (isLoading || isValidating) && rows.length === 0;
  const isRefreshing = isValidating && rows.length > 0;
  const footerMetaItems = [
    <span key="cadence">
      {isRpcTab ? t("footer.rpcRefreshCadence") : t("footer.refreshCadence")}
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
    ) : (
      <span key="lag">{t("footer.lagNotice")}</span>
    ),
    isRpcTab ? null : <span key="backfill">{t("footer.backfillCadence")}</span>,
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
          className="sticky top-[65px] lg:top-[71px] z-40 mt-8 -mx-4 md:-mx-8 xl:-mx-10 bg-nd-inverse/90 backdrop-blur-md border-y border-nd-border-light"
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
            showProviderControls={showProviderControls}
            showRangeControl={!isRpcTab}
            showRpcControls={isRpcTab}
            onUpdateQuery={updateQuery}
          />
        </nav>

        {!isRpcTab ? (
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
        ) : null}

        <DataResourceCarousel />

        {error ? <DataError error={error} /> : null}

        {!error ? (
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
              hasKpiGrid={hasKpiGrid}
              isLoading={isInitialLoading}
              isRefreshing={isRefreshing}
              rows={rows}
              selectedProviders={selectedProviders}
              visibleCharts={visibleCharts}
            />
          </>
        ) : null}

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
              {isRpcTab
                ? t("footer.lastTimeframe", { timeframe: rpcTimeframe })
                : t("footer.lastDays", { days: rangeDays })}
            </span>
            <span className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:justify-end">
              {isRpcTab ? (
                <>
                  <a
                    className="inline-flex items-center gap-1.5 text-nd-high-em-text transition-colors hover:text-nd-primary"
                    href={rpcLatencyGrafanaUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <RadioTower aria-hidden="true" className="h-3.5 w-3.5" />
                    {t("footer.rpcSource")}
                    <ExternalLink aria-hidden="true" className="h-3 w-3" />
                  </a>
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
              ) : (
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

function DashboardControls({
  activeTab,
  availableProviders,
  isRefreshing,
  onUpdateQuery,
  rangeDays,
  rpcInfra,
  rpcMethod,
  rpcRegion,
  rpcRegionsByInfra,
  rpcTimeframe,
  selectedProviders,
  showProviderControls,
  showRangeControl,
  showRpcControls,
}: {
  activeTab: DashboardTab;
  availableProviders: ProviderName[];
  isRefreshing: boolean;
  onUpdateQuery: (_updates: QueryUpdates) => void;
  rangeDays: number;
  rpcInfra: RpcLatencyInfra;
  rpcMethod: RpcLatencyMethod;
  rpcRegion: RpcLatencyRegion;
  rpcRegionsByInfra: RpcLatencyFiltersResponse["regionsByInfra"];
  rpcTimeframe: RpcTimeframe;
  selectedProviders: Set<ProviderName>;
  showProviderControls: boolean;
  showRangeControl: boolean;
  showRpcControls: boolean;
}) {
  const t = useTranslations("dataDashboard");

  return (
    <div className="px-4 md:px-8 xl:px-10 py-2 grid gap-2">
      <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center md:gap-x-3">
        <div className="relative -mx-1 min-w-0 md:mx-0">
          <div className="flex items-center overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-0">
            <TabSwitcher
              activeTab={activeTab}
              onChange={(value) => onUpdateQuery({ tab: value })}
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-nd-inverse to-transparent md:hidden"
          />
        </div>
        {showRangeControl ? (
          <>
            <Separator />
            <div className="-mx-1 flex items-center overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0">
              <InlineControl
                ariaLabel={t("controls.rangeAriaLabel")}
                options={rangeOptions}
                value={rangeDays}
                onChange={(value) => onUpdateQuery({ days: value })}
              />
            </div>
          </>
        ) : null}
        {showRpcControls ? (
          <>
            <Separator />
            <div className="flex flex-wrap items-center gap-2">
              <FilterSelect
                ariaLabel={t("controls.rpcTimeframeAriaLabel")}
                label={t("controls.rpcTimeframeLabel")}
                options={rpcTimeframeOptions}
                value={rpcTimeframe}
                onChange={(value) => onUpdateQuery({ timeframe: value })}
              />
              <FilterSelect
                ariaLabel={t("controls.rpcRegionAriaLabel")}
                label={t("controls.rpcRegionLabel")}
                options={getRpcRegionOptions(rpcInfra, rpcRegionsByInfra)}
                value={rpcRegion}
                onChange={(value) => onUpdateQuery({ region: value })}
              />
              <FilterSelect
                ariaLabel={t("controls.rpcInfraAriaLabel")}
                label={t("controls.rpcInfraLabel")}
                options={rpcInfraOptions}
                value={rpcInfra}
                onChange={(value) => {
                  const nextRegionOptions = getRpcRegionOptions(
                    value,
                    rpcRegionsByInfra,
                  );
                  const nextRegion = nextRegionOptions.some(
                    (option) => option.value === rpcRegion,
                  )
                    ? rpcRegion
                    : getDefaultRpcRegion(value, rpcRegionsByInfra);

                  onUpdateQuery({ infra: value, region: nextRegion });
                }}
              />
              <FilterSelect
                ariaLabel={t("controls.rpcMethodAriaLabel")}
                label={t("controls.rpcMethodLabel")}
                options={rpcMethodOptions}
                value={rpcMethod}
                onChange={(value) => onUpdateQuery({ method: value })}
              />
            </div>
          </>
        ) : null}
      </div>

      {isRefreshing ||
      (showProviderControls && availableProviders.length > 0) ? (
        <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center md:gap-x-4">
          {isRefreshing ? <RefreshingIndicator /> : null}
          {showProviderControls && availableProviders.length > 0 ? (
            <ProviderControls
              availableProviders={availableProviders}
              selectedProviders={selectedProviders}
              onChange={(nextProviders) =>
                onUpdateQuery({ providers: nextProviders })
              }
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function RefreshingIndicator() {
  const t = useTranslations("dataDashboard");

  return (
    <div
      aria-live="polite"
      className="inline-flex shrink-0 items-center gap-2 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text"
      role="status"
    >
      <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
      <span>{t("loading.refreshing")}</span>
    </div>
  );
}

function TabSwitcher({
  activeTab,
  onChange,
}: {
  activeTab: DashboardTab;
  onChange: (_value: DashboardTab) => void;
}) {
  const t = useTranslations("dataDashboard");

  return (
    <div
      aria-label={t("controls.tabsAriaLabel")}
      className="flex shrink-0 items-center"
      role="tablist"
    >
      {tabOptions.map((option) => {
        const Icon = tabIcons[option.value];
        const isActive = option.value === activeTab;

        return (
          <button
            aria-selected={isActive}
            className={cn(
              "group relative flex shrink-0 items-center gap-2 px-3 py-2.5 font-brand-mono text-[12px] leading-none font-bold uppercase tracking-wide transition-colors",
              "focus-visible:outline-none focus-visible:text-nd-high-em-text",
              isActive
                ? "text-nd-high-em-text"
                : "text-nd-mid-em-text/60 hover:text-nd-high-em-text",
            )}
            key={option.value}
            onClick={() => onChange(option.value)}
            role="tab"
            type="button"
          >
            <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
            {t(option.labelKey)}
            {isActive ? (
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px bg-nd-high-em-text"
                layoutId="dataTabUnderline"
                transition={tabIndicatorSpring}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function Separator() {
  return (
    <span
      aria-hidden="true"
      className="hidden h-3 w-px shrink-0 bg-nd-border-prominent md:inline-block"
    />
  );
}

function ProviderControls({
  availableProviders,
  onChange,
  selectedProviders,
}: {
  availableProviders: ProviderName[];
  onChange: (_providers: Set<ProviderName>) => void;
  selectedProviders: Set<ProviderName>;
}) {
  const t = useTranslations("dataDashboard");
  const allProvidersSelected = hasAllProvidersSelected(
    selectedProviders,
    availableProviders,
  );

  return (
    <div className="-mx-1 flex items-center gap-x-3 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <span className="shrink-0 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text/70">
        {t("controls.providersLabel")}
      </span>
      {availableProviders.map((provider) => (
        <ProviderToggle
          active={selectedProviders.has(provider)}
          color={getProviderColor(provider)}
          key={provider}
          label={provider}
          onClick={() => onChange(toggleProvider(selectedProviders, provider))}
        />
      ))}
      <button
        className="shrink-0 border border-nd-border-prominent px-2.5 py-1 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text transition-colors hover:bg-nd-border-light/20 hover:text-nd-high-em-text"
        onClick={() =>
          onChange(
            allProvidersSelected
              ? new Set<ProviderName>()
              : new Set(availableProviders),
          )
        }
        type="button"
      >
        {allProvidersSelected ? t("legend.deselectAll") : t("legend.selectAll")}
      </button>
    </div>
  );
}

function KpiGrid({
  aggregation,
  isLoading,
  kpis,
}: {
  aggregation: KpiAggregation;
  isLoading: boolean;
  kpis: KpiItem[];
}) {
  const locale = useLocale();
  const t = useTranslations("dataDashboard");

  return (
    <TooltipProvider delayDuration={100}>
      <section
        aria-label={t("kpisAriaLabel")}
        className={cn(
          "mt-10 xl:mt-14 border-y border-nd-border-light relative",
          "before:absolute before:top-0 before:left-0 before:h-full before:w-px before:bg-gradient-to-b before:from-[#D884F0] before:to-[#44EBA6]",
          "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-nd-border-light",
          "[&>*]:border-nd-border-light",
        )}
      >
        {isLoading
          ? Array.from({ length: kpiCount }).map((_, index) => (
              <KpiSkeleton index={index} key={index} />
            ))
          : kpis.map((kpi, index) => (
              <KpiCell
                delta={kpi.delta}
                index={index}
                key={kpi.chart.id}
                label={getChartTitle(t, kpi.chart)}
                lowerIsBetter={kpi.chart.lowerIsBetter}
                summary={getKpiSummary(t, kpi.chart, aggregation)}
                unit={getValueLabel(t, kpi.chart.valueLabel)}
                value={formatValue(kpi.value, kpi.chart.valueLabel, locale)}
              />
            ))}
      </section>
    </TooltipProvider>
  );
}

function ChartGrid({
  activeCharts,
  activeTab,
  isLoading,
  isRefreshing,
  hasKpiGrid,
  rows,
  selectedProviders,
  visibleCharts,
}: {
  activeCharts: readonly ChartDefinition[];
  activeTab: DashboardTab;
  hasKpiGrid: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  rows: MetricRow[];
  selectedProviders: Set<ProviderName>;
  visibleCharts: readonly ChartDefinition[];
}) {
  const t = useTranslations("dataDashboard");

  return (
    <TooltipProvider delayDuration={100}>
      <section
        aria-label={t("chartsAriaLabel", {
          tab: getTabContent(t, activeTab).label,
        })}
        className={cn(
          "border-x border-b border-nd-border-light grid grid-cols-1 lg:grid-cols-2 divide-y divide-nd-border-light lg:divide-y-0",
          hasKpiGrid ? "" : "mt-10 border-t xl:mt-14",
          "[&>*]:border-nd-border-light lg:[&>*:nth-child(even)]:border-l lg:[&>*:nth-child(n+3)]:border-t",
        )}
      >
        {isLoading
          ? activeCharts.map((chart, index) => (
              <ChartSkeleton
                index={index}
                key={chart.id}
                title={getChartTitle(t, chart)}
              />
            ))
          : visibleCharts.map((chart, index) => (
              <ChartCard
                chart={chart}
                index={index}
                isRefreshing={isRefreshing}
                key={chart.id}
                rows={rows}
                selectedProviders={selectedProviders}
              />
            ))}
      </section>
    </TooltipProvider>
  );
}

function DataResourceCarousel() {
  const t = useTranslations("dataDashboard");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
  });

  const updateScrollState = useCallback(() => {
    const scrollElement = scrollRef.current;

    if (!scrollElement) {
      return;
    }

    const maxScrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth;
    const nextScrollState = {
      canScrollLeft: scrollElement.scrollLeft > 1,
      canScrollRight: scrollElement.scrollLeft < maxScrollLeft - 1,
    };

    setScrollState((currentScrollState) =>
      currentScrollState.canScrollLeft === nextScrollState.canScrollLeft &&
      currentScrollState.canScrollRight === nextScrollState.canScrollRight
        ? currentScrollState
        : nextScrollState,
    );
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;

    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    scrollElement?.addEventListener("scroll", updateScrollState, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", updateScrollState);
      scrollElement?.removeEventListener("scroll", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollCards = useCallback((direction: -1 | 1) => {
    const scrollElement = scrollRef.current;

    if (!scrollElement) {
      return;
    }

    const scrollStep = Math.max(
      resourceCardStepFallback,
      scrollElement.clientWidth,
    );

    scrollElement.scrollBy({
      behavior: "smooth",
      left: direction * scrollStep,
      top: 0,
    });
  }, []);

  return (
    <section
      aria-labelledby="data-resource-carousel-title"
      className="mt-10 -mx-4 bg-black px-4 py-8 md:-mx-8 md:px-8 md:py-10 xl:-mx-10 xl:px-10 xl:py-11"
      data-node-id="2:1090"
    >
      <div className="border border-nd-border-light bg-black">
        <div className="flex items-stretch border-b border-nd-border-light">
          <div className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-6 md:px-9 md:py-7">
            <h2
              className="text-[28px] leading-[1.25] font-medium tracking-normal text-nd-high-em-text md:text-[32px]"
              id="data-resource-carousel-title"
            >
              {t("buildSection.title")}
            </h2>
            <p className="nd-body-s max-w-[670px] text-nd-mid-em-text">
              {t("buildSection.description")}
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-3 bg-white/[0.02] px-6 py-6 sm:flex md:px-9">
            <DataResourceNavButton
              ariaLabel={t("buildSection.previous")}
              disabled={!scrollState.canScrollLeft}
              icon={<ChevronLeft aria-hidden="true" className="h-4 w-4" />}
              onClick={() => scrollCards(-1)}
            />
            <DataResourceNavButton
              ariaLabel={t("buildSection.next")}
              disabled={!scrollState.canScrollRight}
              icon={<ChevronRight aria-hidden="true" className="h-4 w-4" />}
              onClick={() => scrollCards(1)}
            />
          </div>
        </div>

        <div
          className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={scrollRef}
        >
          <div className="flex min-w-max xl:min-w-0">
            {resourceCards.map((card, index) => (
              <DataResourceCard card={card} index={index} key={card.titleKey} />
            ))}
          </div>
        </div>

        <DataResourceDecorGrid />
      </div>
    </section>
  );
}

function DataResourceNavButton({
  ariaLabel,
  disabled,
  icon,
  onClick,
}: {
  ariaLabel: string;
  disabled: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.08] text-nd-high-em-text transition-colors",
        "hover:bg-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        disabled ? "cursor-not-allowed opacity-50 hover:bg-white/[0.08]" : "",
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {icon}
    </button>
  );
}

function DataResourceCard({
  card,
  index,
}: {
  card: (typeof resourceCards)[number];
  index: number;
}) {
  const t = useTranslations("dataDashboard");
  const title = t(card.titleKey);
  const description = t(card.descriptionKey);
  const href = getResourceAnalyticsHref(card.href, card.analyticsId);
  const cardRef = useDataResourceImpression(card.analyticsId, title, href);

  return (
    <article
      className={cn(
        "relative flex min-h-[186px] shrink-0 basis-[min(84vw,460px)] flex-col items-start gap-7 overflow-hidden px-5 py-6 md:basis-[460px] md:px-9 md:py-7 xl:basis-1/3",
        index > 0 ? "border-l border-nd-border-light" : "",
      )}
      data-node-id={card.nodeId}
      ref={cardRef}
    >
      <img
        alt=""
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full object-cover object-top opacity-70",
          card.backgroundClassName,
        )}
        src={card.backgroundSrc}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/45"
      />

      <div className="relative flex min-w-0 flex-col gap-3">
        <h3 className="text-[20px] leading-[1.25] font-medium tracking-normal text-nd-high-em-text">
          {title}
        </h3>
        <p className="nd-body-s max-w-[390px] text-[#ABABBA]">{description}</p>
      </div>

      <Link
        className="relative inline-flex min-h-[31px] items-center justify-center border border-white/55 px-3 py-2 font-brand-mono text-[11px] leading-none font-bold uppercase text-nd-high-em-text transition-colors hover:border-white hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        href={href}
        onClick={() =>
          trackDataResourceEvent("data_resource_click", {
            destinationUrl: href,
            resourceId: card.analyticsId,
            resourceTitle: title,
          })
        }
        rel="noopener noreferrer"
        target="_blank"
      >
        {t(card.ctaKey)}
      </Link>
    </article>
  );
}

function getResourceAnalyticsHref(href: string, resourceId: string) {
  if (!/^https?:\/\//i.test(href)) {
    return href;
  }

  const url = new URL(href);

  url.searchParams.set("utm_source", "solana.com");
  url.searchParams.set("utm_medium", "data_dashboard");
  url.searchParams.set("utm_campaign", "solana_data_resources");
  url.searchParams.set("utm_content", resourceId);

  return url.toString();
}

function useDataResourceImpression(
  resourceId: string,
  resourceTitle: string,
  destinationUrl: string,
) {
  const cardRef = useRef<HTMLElement>(null);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    const card = cardRef.current;

    if (!card || hasTrackedRef.current) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      hasTrackedRef.current = true;
      trackDataResourceEvent("data_resource_view", {
        destinationUrl,
        resourceId,
        resourceTitle,
      });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || entry.intersectionRatio < 0.5) {
          return;
        }

        hasTrackedRef.current = true;
        trackDataResourceEvent("data_resource_view", {
          destinationUrl,
          resourceId,
          resourceTitle,
        });
        observer.disconnect();
      },
      { threshold: [0.5] },
    );

    observer.observe(card);

    return () => observer.disconnect();
  }, [destinationUrl, resourceId, resourceTitle]);

  return cardRef;
}

function trackDataResourceEvent(
  eventName: "data_resource_click" | "data_resource_view",
  {
    destinationUrl,
    resourceId,
    resourceTitle,
  }: {
    destinationUrl: string;
    resourceId: string;
    resourceTitle: string;
  },
) {
  if (typeof window === "undefined" || typeof window.gtag === "undefined") {
    return;
  }

  window.gtag("event", eventName, {
    destination_url: destinationUrl,
    event_category: "Solana Data",
    event_label: resourceTitle,
    origin_path: `${window.location.pathname}${window.location.search}`,
    resource_id: resourceId,
    resource_title: resourceTitle,
  });
}

function DataResourceDecorGrid() {
  return (
    <div
      aria-hidden="true"
      className="hidden h-14 grid-rows-2 border-t border-nd-border-light md:grid"
    >
      {Array.from({ length: 2 }).map((_, rowIndex) => (
        <div
          className={cn(
            "grid grid-cols-[minmax(80px,180px)_1fr_minmax(80px,180px)]",
            rowIndex > 0 ? "border-t border-nd-border-light" : "",
          )}
          key={rowIndex}
        >
          {Array.from({ length: 3 }).map((__, columnIndex) => (
            <span
              className={cn(
                "border-nd-border-light",
                columnIndex < 2 ? "border-r" : "",
              )}
              key={columnIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function ChartCard({
  chart,
  index,
  isRefreshing,
  rows,
  selectedProviders,
}: {
  chart: ChartDefinition;
  index: number;
  isRefreshing: boolean;
  rows: MetricRow[];
  selectedProviders: Set<ProviderName>;
}) {
  const t = useTranslations("dataDashboard");
  const series = useMemo(
    () => buildSeries(chart, rows, selectedProviders),
    [chart, rows, selectedProviders],
  );
  const valueLabel = getValueLabel(t, chart.valueLabel);
  const title = getChartTitle(t, chart);
  const caption = getChartCaption(t, chart);
  const methodologyNotes = getMethodologyNotes(chart, selectedProviders);

  return (
    <article className="relative p-3 md:p-6 xl:p-8 flex flex-col gap-4 md:gap-5">
      <div className="grid gap-1.5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="m-0 text-[20px] xl:text-[24px] leading-[1.25] font-medium tracking-normal">
              {title}
            </h2>
            {methodologyNotes.length > 0 ? (
              <MethodologyTooltip label={title} notes={methodologyNotes} />
            ) : null}
          </div>
          <span className="font-brand-mono text-[12px] leading-[1.42] font-bold uppercase text-nd-mid-em-text shrink-0">
            {valueLabel}
          </span>
        </div>
        {caption ? (
          <p className="m-0 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text/70">
            {caption}
          </p>
        ) : null}
      </div>

      <ChartWatermarkFrame>
        {series.length > 0 ? (
          chart.visualization === "bar" ? (
            <ProviderBarChart
              height={chartHeight}
              lowerIsBetter={chart.lowerIsBetter}
              series={series}
              valueLabel={chart.valueLabel}
            />
          ) : (
            <TimeSeriesChart
              height={chartHeight}
              series={series}
              timeGranularity={chart.timeGranularity}
              valueLabel={chart.valueLabel}
            />
          )
        ) : (
          <div className="flex h-[320px] items-center justify-center border border-dashed border-nd-border-light text-sm text-nd-mid-em-text font-brand-mono uppercase tracking-normal">
            {t("empty.noDataForSelection")}
          </div>
        )}
      </ChartWatermarkFrame>

      {chart.visualization === "bar" ? null : <ChartOrdinal index={index} />}
      {isRefreshing ? <ChartRefreshingOverlay /> : null}
    </article>
  );
}

function ChartWatermarkFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex h-[320px] items-center justify-center overflow-hidden"
      >
        <img
          alt=""
          className="h-auto w-[45%] min-w-[220px] max-w-[300px] opacity-[0.1] mix-blend-screen brightness-0 invert"
          src="/src/img/branding/solanaLogo.svg"
        />
      </div>
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

function ProviderBarChart({
  height,
  lowerIsBetter = false,
  series,
  valueLabel,
}: {
  height: number;
  lowerIsBetter?: boolean;
  series: ChartSeries[];
  valueLabel: string;
}) {
  const locale = useLocale();
  const t = useTranslations("dataDashboard");
  const items = useMemo(
    () => getLatestSeriesValues(series, lowerIsBetter),
    [lowerIsBetter, series],
  );
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  if (items.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center border border-dashed border-nd-border-light text-sm text-nd-mid-em-text font-brand-mono uppercase tracking-normal">
        {t("empty.noDataForSelection")}
      </div>
    );
  }

  return (
    <div
      aria-label={t("barChart.ariaLabel")}
      className="flex min-w-0 flex-col justify-center gap-4"
      role="list"
      style={{ height }}
    >
      {items.map((item, index) => (
        <motion.div
          className="grid min-w-0 gap-2"
          key={item.id}
          layout
          role="listitem"
          transition={tabIndicatorSpring}
        >
          <div className="flex min-w-0 items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2">
              <span className="w-6 shrink-0 font-brand-mono text-[10px] leading-none font-bold uppercase text-nd-mid-em-text/60">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate font-brand-mono text-[12px] leading-[1.42] font-bold uppercase text-nd-high-em-text">
                {item.label}
              </span>
            </div>
            <span className="shrink-0 font-brand-mono text-[12px] leading-[1.42] font-bold tabular-nums text-nd-high-em-text">
              {formatValue(item.value, valueLabel, locale)}
            </span>
          </div>
          <div className="h-3 overflow-hidden bg-nd-border-light/30">
            <div
              className="h-full transition-[width] duration-500 ease-out"
              style={{
                backgroundColor: item.color,
                width: `${getBarWidth(item.value, maxValue)}%`,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function getLatestSeriesValues(series: ChartSeries[], lowerIsBetter: boolean) {
  return series
    .flatMap((item) => {
      const latestPoint = item.points.at(-1);

      return latestPoint
        ? [
            {
              color: item.color,
              id: item.id,
              label: item.label,
              value: latestPoint.value,
            },
          ]
        : [];
    })
    .sort((a, b) =>
      lowerIsBetter
        ? a.value - b.value || a.label.localeCompare(b.label)
        : b.value - a.value || a.label.localeCompare(b.label),
    );
}

function getBarWidth(value: number, maxValue: number) {
  if (maxValue <= 0) {
    return 0;
  }

  return Math.min(Math.max((value / maxValue) * 100, 2), 100);
}

function ChartRefreshingOverlay() {
  const t = useTranslations("dataDashboard");

  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/10"
      role="status"
    >
      <Loader2
        aria-hidden="true"
        className="h-8 w-8 animate-spin text-nd-high-em-text/80"
      />
      <span className="sr-only">{t("loading.refreshing")}</span>
    </div>
  );
}

function MethodologyTooltip({
  label,
  notes,
}: {
  label: string;
  notes: MethodologyComment[];
}) {
  const t = useTranslations("dataDashboard");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          aria-label={t("methodology.ariaLabel", { metric: label })}
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-nd-mid-em-text/70 transition-colors hover:text-nd-high-em-text focus-visible:outline-none focus-visible:text-nd-high-em-text"
          type="button"
        >
          <Info aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          className="max-w-[340px] border-nd-border-prominent bg-[#1D1D20] px-3 py-2.5 text-xs leading-[1.45] text-nd-high-em-text"
          side="top"
        >
          <span className="sr-only">{label}: </span>
          <div className="grid gap-2">
            {notes.map((note) => (
              <div className="grid gap-0.5" key={note.provider}>
                <span className="font-brand-mono text-[11px] font-bold uppercase text-nd-mid-em-text">
                  {note.provider}
                </span>
                <span>{note.description}</span>
              </div>
            ))}
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

function KpiCell({
  delta,
  index,
  label,
  lowerIsBetter,
  summary,
  unit,
  value,
}: {
  delta: number;
  index: number;
  label: string;
  lowerIsBetter?: boolean;
  summary: string;
  unit: string;
  value: string;
}) {
  const locale = useLocale();
  const isFavorableTrend = lowerIsBetter ? delta <= 0 : delta >= 0;

  return (
    <article className={getKpiCellClassName(index)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-1.5">
          <h2 className="font-brand-mono text-[12px] md:text-[14px] leading-[1.42] font-bold uppercase text-nd-mid-em-text">
            {label}
          </h2>
          <KpiSummaryTooltip label={label} summary={summary} />
        </div>
        <span className="hidden md:inline font-brand-mono text-[10px] leading-5 uppercase text-nd-mid-em-text/60 tracking-normal shrink-0">
          {unit}
        </span>
      </div>
      <div className="flex flex-col items-start gap-1 md:flex-row md:items-end md:justify-between md:gap-2">
        <p className="text-[28px] xl:text-[40px] leading-[1.0] font-light uppercase tabular-nums tracking-normal text-nd-high-em-text">
          {value}
        </p>
        <p
          className={cn(
            "shrink-0 whitespace-nowrap font-brand-mono text-[12px] md:text-[14px] leading-[1.42] font-bold uppercase tabular-nums",
            isFavorableTrend
              ? "text-nd-highlight-green"
              : "text-nd-highlight-orange",
          )}
        >
          {delta >= 0 ? "↑" : "↓"} {formatPercent(Math.abs(delta), locale)}
        </p>
      </div>
    </article>
  );
}

function KpiSummaryTooltip({
  label,
  summary,
}: {
  label: string;
  summary: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          aria-label={summary}
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-nd-mid-em-text/70 transition-colors hover:text-nd-high-em-text focus-visible:outline-none focus-visible:text-nd-high-em-text"
          type="button"
        >
          <Info aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
          <span className="sr-only">{summary}</span>
        </button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          className="max-w-[260px] border-nd-border-prominent bg-[#1D1D20] px-3 py-2 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-high-em-text"
          side="top"
        >
          <span className="sr-only">{label}: </span>
          {summary}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

function KpiSkeleton({ index }: { index: number }) {
  return (
    <div className={getKpiCellClassName(index)}>
      <div className="h-3 w-24 rounded-sm bg-nd-border-light animate-pulse" />
      <div className="h-8 w-32 rounded-sm bg-nd-border-light animate-pulse" />
    </div>
  );
}

function ChartSkeleton({ index, title }: { index: number; title: string }) {
  return (
    <article className="p-3 md:p-6 xl:p-8 flex flex-col gap-4 md:gap-5">
      <div className="flex items-baseline justify-between gap-4">
        <div className="h-5 w-40 rounded-sm bg-nd-border-light animate-pulse">
          <span className="sr-only">{title}</span>
        </div>
        <div className="h-3 w-12 rounded-sm bg-nd-border-light animate-pulse" />
      </div>
      <div className="h-[352px] animate-pulse bg-nd-border-light/40" />
      <ChartOrdinal index={index} />
    </article>
  );
}

function ChartOrdinal({ index }: { index: number }) {
  return (
    <span
      aria-hidden="true"
      className="font-brand-mono text-[10px] leading-none font-bold uppercase text-nd-mid-em-text/60 tracking-normal"
    >
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

function DataError({ error }: { error: Error }) {
  const t = useTranslations("dataDashboard");

  return (
    <section
      className="mt-10 border border-nd-highlight-orange/40 bg-nd-highlight-orange/10 p-6 text-sm text-nd-high-em-text"
      role="alert"
    >
      <h2 className="font-brand-mono text-[12px] leading-[1.42] font-bold uppercase text-nd-highlight-orange">
        {t("errors.title")}
      </h2>
      <p className="mt-3 nd-body-m text-nd-mid-em-text">{error.message}</p>
    </section>
  );
}

function InlineControl<T extends string | number>({
  ariaLabel,
  onChange,
  options,
  value,
}: {
  ariaLabel: string;
  onChange: (_value: T) => void;
  options: readonly { label: string; value: T }[];
  value: T;
}) {
  return (
    <div
      aria-label={ariaLabel}
      className="inline-flex shrink-0 items-center gap-1.5"
      role="group"
    >
      {options.map((option) => (
        <button
          aria-pressed={option.value === value}
          className={cn(
            "border px-2.5 py-1 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase transition-colors",
            option.value === value
              ? "border-nd-primary bg-nd-border-light/20 text-nd-high-em-text"
              : "border-nd-border-prominent text-nd-mid-em-text hover:bg-nd-border-light/20 hover:text-nd-high-em-text",
          )}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function FilterSelect<T extends string>({
  ariaLabel,
  label,
  onChange,
  options,
  value,
}: {
  ariaLabel: string;
  label: string;
  onChange: (_value: T) => void;
  options: readonly { label: string; value: T }[];
  value: T;
}) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => onChange(nextValue as T)}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className="h-auto w-auto shrink-0 gap-1.5 rounded-none border-nd-border-prominent bg-transparent px-2.5 py-1 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-high-em-text ring-offset-0 transition-colors hover:bg-nd-border-light/20 focus:ring-1 focus:ring-nd-primary focus:ring-offset-0 [&>svg]:h-3.5 [&>svg]:w-3.5"
      >
        <span className="text-nd-mid-em-text/70">{label}</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-none border-nd-border-prominent bg-[#1D1D20] text-nd-high-em-text">
        {options.map((option) => (
          <SelectItem
            className="rounded-none py-1.5 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text focus:bg-white/10 focus:text-nd-high-em-text data-[state=checked]:text-nd-high-em-text"
            key={option.value}
            value={option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ProviderToggle({
  active,
  color,
  label,
  onClick,
}: {
  active: boolean;
  color?: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 px-1.5 py-1 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase transition-colors",
        active
          ? "text-nd-high-em-text"
          : "text-nd-mid-em-text/60 hover:text-nd-high-em-text",
      )}
      onClick={onClick}
      type="button"
    >
      {color ? (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5"
          style={{ backgroundColor: active ? color : `${color}40` }}
        />
      ) : null}
      {label}
    </button>
  );
}

function useDashboardQueryParams() {
  const searchParams = useSearchParams();
  const rpcInfra = parseRpcInfra(searchParams.get("infra"));

  return {
    activeTab: parseTab(searchParams.get("tab")),
    providerParam: searchParams.get("providers"),
    rangeDays: parseRangeDays(searchParams.get("days")),
    rpcInfra,
    rpcMethod: parseRpcMethod(searchParams.get("method")),
    rpcRegion: parseRpcRegion(searchParams.get("region"), rpcInfra),
    rpcTimeframe: parseRpcTimeframe(searchParams.get("timeframe")),
  };
}

function useDashboardQueryUpdater(availableProviders: readonly ProviderName[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    (updates: QueryUpdates) => {
      const params = new URLSearchParams(searchParams.toString());

      applyQueryUpdates(params, updates, availableProviders);
      router.replace(getDashboardUrl(pathname, params), { scroll: false });
    },
    [availableProviders, pathname, router, searchParams],
  );
}

function applyQueryUpdates(
  params: URLSearchParams,
  updates: QueryUpdates,
  availableProviders: readonly ProviderName[],
) {
  if (updates.tab) {
    params.set("tab", updates.tab);
  }

  if (updates.days) {
    params.set("days", String(updates.days));
  }

  if (updates.infra) {
    params.set("infra", updates.infra);
  }

  if (updates.method) {
    params.set("method", updates.method);
  }

  if (updates.providers) {
    updateProvidersParam(params, updates.providers, availableProviders);
  }

  if (updates.region) {
    params.set("region", updates.region);
  }

  if (updates.timeframe) {
    params.set("timeframe", updates.timeframe);
  }
}

export function updateProvidersParam(
  params: URLSearchParams,
  selectedProviders: Set<ProviderName>,
  availableProviders: readonly ProviderName[],
) {
  const nextProviders = getOrderedSelectedProviders(
    selectedProviders,
    availableProviders,
  );

  if (nextProviders.length === 0) {
    params.set("providers", emptyProvidersParam);
  } else if (hasAllProvidersSelected(selectedProviders, availableProviders)) {
    params.delete("providers");
  } else {
    params.set("providers", nextProviders.join(","));
  }
}

function getDashboardUrl(pathname: string, params: URLSearchParams) {
  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

function getDashboardDataUrl({
  activeTab,
  rpcInfra,
  rangeDays,
  rpcMethod,
  rpcRegion,
  rpcTimeframe,
}: {
  activeTab: DashboardTab;
  rpcInfra: RpcLatencyInfra;
  rangeDays: number;
  rpcMethod: RpcLatencyMethod;
  rpcRegion: RpcLatencyRegion;
  rpcTimeframe: RpcTimeframe;
}) {
  if (activeTab !== "rpc") {
    return `/api/databricks/data?days=${rangeDays}`;
  }

  const params = new URLSearchParams({
    infra: rpcInfra,
    method: rpcMethod,
    region: rpcRegion,
    timeframe: rpcTimeframe,
  });

  return `/api/rpc/data?${params.toString()}`;
}

function toggleProvider(
  selectedProviders: Set<ProviderName>,
  provider: ProviderName,
) {
  const nextProviders = new Set(selectedProviders);

  if (nextProviders.has(provider)) {
    nextProviders.delete(provider);
  } else {
    nextProviders.add(provider);
  }

  return nextProviders;
}

function getFooterProvidersLabel(
  t: DashboardTranslator,
  selectedProviderList: ProviderName[],
  availableProviders: readonly ProviderName[],
  providerParam: string | null,
) {
  if (selectedProviderList.length === 0) {
    return providerParam ? t("footer.noProviders") : t("footer.allProviders");
  }

  if (selectedProviderList.length === availableProviders.length) {
    return t("footer.allProviders");
  }

  return selectedProviderList.join(t("footer.providerListSeparator"));
}

export function getSelectedProviderList(
  selectedProviders: ReadonlySet<ProviderName>,
  availableProviders: readonly ProviderName[],
) {
  return availableProviders.length > 0
    ? getOrderedSelectedProviders(selectedProviders, availableProviders)
    : getOrderedProviderNames(selectedProviders);
}

function getOrderedSelectedProviders(
  selectedProviders: ReadonlySet<ProviderName>,
  availableProviders: readonly ProviderName[],
) {
  return availableProviders.filter((provider) =>
    selectedProviders.has(provider),
  );
}

function getChartsForTab(tab: DashboardTab) {
  return chartDefinitions.filter((chart) => chart.tab === tab);
}

function getVisibleCharts(
  activeCharts: readonly ChartDefinition[],
  rows: MetricRow[],
) {
  return rows.length > 0
    ? activeCharts.filter((chart) => hasChartSourceData(chart, rows))
    : activeCharts;
}

function getKpiCharts(
  visibleCharts: readonly ChartDefinition[],
  isRpcTab: boolean,
) {
  return isRpcTab
    ? visibleCharts
        .filter((chart) => chart.valueLabel === "Milliseconds")
        .slice(0, kpiCount)
    : visibleCharts.slice(0, kpiCount);
}

function filterRowsForCharts(
  rows: readonly MetricRow[],
  charts: readonly ChartDefinition[],
) {
  const metricSet = new Set(charts.flatMap((chart) => chart.metrics));

  return rows.filter((row) => isChartDataRow(row, metricSet));
}

function getKpis(
  charts: readonly ChartDefinition[],
  rows: MetricRow[],
  selectedProviders: Set<ProviderName>,
  aggregation: KpiAggregation,
): KpiItem[] {
  return charts.map((chart) => ({
    chart,
    ...getKpiValue(chart, rows, selectedProviders, aggregation),
  }));
}

function getKpiSummary(
  t: DashboardTranslator,
  chart: ChartDefinition,
  aggregation: KpiAggregation,
) {
  if (chart.seriesField === "provider") {
    if (aggregation === "minimum") {
      return chart.timeGranularity === "hour"
        ? t("kpis.providerMinimumSampleTooltip")
        : t("kpis.providerMinimumTooltip");
    }

    return chart.timeGranularity === "hour"
      ? t("kpis.providerSampleTooltip")
      : t("kpis.providerTooltip");
  }

  if (chart.metrics.length > 1) {
    return t("kpis.compositeTooltip", {
      metrics: chart.metrics.join(t("kpis.metricListSeparator")),
    });
  }

  return chart.timeGranularity === "hour"
    ? t("kpis.metricSampleTooltip", {
        metric: chart.metrics[0] ?? getChartTitle(t, chart),
      })
    : t("kpis.metricTooltip", {
        metric: chart.metrics[0] ?? getChartTitle(t, chart),
      });
}

function getKpiCellClassName(index: number) {
  return cn(
    "py-5 px-4 md:py-8 md:px-8 xl:py-10 xl:px-10 flex flex-col gap-5 border-nd-border-light",
    index > 0 ? "border-t" : "",
    index === 1 ? "sm:border-t-0" : "",
    index % 2 === 1 ? "sm:border-l" : "",
    index >= 2 ? "xl:border-t-0" : "",
    index > 0 ? "xl:border-l" : "",
  );
}

function hasChartSourceData(chart: ChartDefinition, rows: MetricRow[]) {
  const metricSet = new Set<string>(chart.metrics);

  return rows.some((row) => isChartDataRow(row, metricSet));
}

function buildSeries(
  chart: ChartDefinition,
  rows: MetricRow[],
  selectedProviders: Set<ProviderName>,
): ChartSeries[] {
  const metricSet = new Set<string>(chart.metrics);
  const buckets = new Map<
    string,
    Map<string, { color: string; count: number; label: string; sum: number }>
  >();

  for (const row of rows) {
    const providerName = getRowProviderName(row);

    if (
      !isChartDataRow(row, metricSet) ||
      !selectedProviders.has(providerName)
    ) {
      continue;
    }

    const seriesId =
      chart.seriesField === "provider" ? providerName : row.metricName;
    const seriesLabel = seriesId;
    const color =
      chart.seriesField === "provider"
        ? getProviderColor(providerName)
        : (metricColors[row.metricName] ?? "#A78BFA");
    const seriesBucket = buckets.get(seriesId) ?? new Map();
    const bucket = seriesBucket.get(row.date) ?? {
      color,
      count: 0,
      label: seriesLabel,
      sum: 0,
    };

    bucket.sum += row.value;
    bucket.count += 1;
    seriesBucket.set(row.date, bucket);
    buckets.set(seriesId, seriesBucket);
  }

  const orderedSeriesIds =
    chart.seriesField === "provider"
      ? getOrderedProviderNames(Array.from(buckets.keys()))
      : chart.metrics.filter((metric) => buckets.has(metric));

  return orderedSeriesIds.map((seriesId) => {
    const seriesBucket = buckets.get(seriesId) ?? new Map();

    return {
      id: seriesId,
      label: seriesId,
      color:
        chart.seriesField === "provider"
          ? getProviderColor(seriesId)
          : (metricColors[seriesId] ?? "#A78BFA"),
      points: Array.from(seriesBucket.entries())
        .flatMap(([date, bucket]) => {
          const parsedDate = parseMetricRowDate(date);

          return parsedDate
            ? [
                {
                  date: parsedDate,
                  value: aggregate(bucket.sum, bucket.count, chart.aggregation),
                },
              ]
            : [];
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    };
  });
}

function parseMetricRowDate(value: string) {
  const parsedDate = value.includes("T")
    ? new Date(value)
    : new Date(`${value}T00:00:00.000Z`);

  return Number.isFinite(parsedDate.getTime()) ? parsedDate : undefined;
}

function getMethodologyNotes(
  chart: ChartDefinition,
  selectedProviders: ReadonlySet<ProviderName>,
) {
  return (chart.methodology ?? []).filter((note) =>
    selectedProviders.has(note.provider),
  );
}

function isChartDataRow(
  row: MetricRow,
  metricSet: ReadonlySet<string>,
): row is MetricRow & { providerName: ProviderName } {
  return metricSet.has(row.metricName) && getRowProviderName(row).length > 0;
}

export function getKpiValue(
  chart: ChartDefinition,
  rows: MetricRow[],
  selectedProviders: Set<ProviderName>,
  aggregation: KpiAggregation = "median",
) {
  const series = buildSeries(chart, rows, selectedProviders);
  const dates = Array.from(
    new Set(
      series.flatMap((item) =>
        item.points.map((point) => point.date.getTime()),
      ),
    ),
  ).sort((a, b) => a - b);
  const latestDate = dates.at(-1);
  const previousDate = dates.at(-2);
  const latestValue = latestDate
    ? getAggregateSeriesValue(
        series,
        latestDate,
        chart.seriesField,
        aggregation,
      )
    : 0;
  const previousValue = previousDate
    ? getAggregateSeriesValue(
        series,
        previousDate,
        chart.seriesField,
        aggregation,
      )
    : latestValue;

  return {
    value: latestValue,
    delta:
      previousValue === 0 ? 0 : (latestValue - previousValue) / previousValue,
  };
}

function getAggregateSeriesValue(
  series: ChartSeries[],
  date: number,
  seriesField: ChartDefinition["seriesField"],
  aggregation: KpiAggregation,
) {
  const values = series
    .map(
      (item) =>
        item.points.find((point) => point.date.getTime() === date)?.value,
    )
    .filter((value): value is number => typeof value === "number");

  if (values.length === 0) {
    return 0;
  }

  if (seriesField === "provider") {
    return aggregation === "minimum" ? Math.min(...values) : getMedian(values);
  }

  return values.reduce((sum, value) => sum + value, 0);
}

export function getMedian(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function aggregate(sum: number, count: number, aggregation: Aggregation) {
  return aggregation === "avg" && count > 0 ? sum / count : sum;
}

async function fetchData(url: string, errorMessages: DataFetchErrorMessages) {
  const response = await fetch(url);
  const payload = await readDataPayload(response, errorMessages);

  if (!response.ok) {
    throw new Error(getDataFetchErrorMessage(payload, errorMessages));
  }

  if (!isDataApiResponse(payload)) {
    throw new Error(errorMessages.invalidResponse);
  }

  return payload;
}

async function fetchRpcFilters(url: string) {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("RPC latency filters are unavailable");
  }

  const payload = (await response.json()) as unknown;

  if (!isRpcLatencyFiltersResponse(payload)) {
    throw new Error("RPC latency filters returned an invalid response");
  }

  return payload;
}

function isRpcLatencyFiltersResponse(
  value: unknown,
): value is RpcLatencyFiltersResponse {
  if (!value || typeof value !== "object" || !("regionsByInfra" in value)) {
    return false;
  }

  const regionsByInfra = value.regionsByInfra;
  const validRegions = new Set<string>(
    rpcRegionOptions.map((regionOption) => regionOption.value),
  );

  return (
    !!regionsByInfra &&
    typeof regionsByInfra === "object" &&
    rpcInfraOptions.every((infraOption) => {
      const regions = (regionsByInfra as Record<string, unknown>)[
        infraOption.value
      ];

      return (
        Array.isArray(regions) &&
        regions.every(
          (region) => typeof region === "string" && validRegions.has(region),
        )
      );
    })
  );
}

function getRpcRegionsByInfra(
  filters?: RpcLatencyFiltersResponse,
): RpcLatencyFiltersResponse["regionsByInfra"] {
  return Object.fromEntries(
    rpcInfraOptions.map((infraOption) => {
      const regions = filters?.regionsByInfra[infraOption.value];

      return [
        infraOption.value,
        regions && regions.length > 0
          ? regions
          : fallbackRpcRegionsByInfra[infraOption.value],
      ];
    }),
  ) as RpcLatencyFiltersResponse["regionsByInfra"];
}

async function readDataPayload(
  response: Response,
  errorMessages: DataFetchErrorMessages,
) {
  try {
    return (await response.json()) as DataErrorPayload | DataApiResponse | null;
  } catch {
    if (response.ok) {
      throw new Error(errorMessages.invalidResponse);
    }

    return null;
  }
}

function getDataFetchErrorMessage(
  payload: DataErrorPayload | DataApiResponse | null,
  errorMessages: DataFetchErrorMessages,
) {
  if (payload && "detail" in payload && payload.detail) {
    return `${errorMessages.defaultUnavailable} ${payload.detail}`;
  }

  return errorMessages.defaultUnavailable;
}

function isDataApiResponse(value: unknown): value is DataApiResponse {
  return (
    !!value &&
    typeof value === "object" &&
    "rows" in value &&
    Array.isArray(value.rows)
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

function parseTab(value: string | null): DashboardTab {
  return value === "network" ||
    value === "stablecoins" ||
    value === "defi" ||
    value === "rpc"
    ? value
    : "overview";
}

function parseRangeDays(value: string | null) {
  const parsed = value ? Number(value) : defaultRangeDays;
  return rangeOptions.some((option) => option.value === parsed)
    ? parsed
    : defaultRangeDays;
}

function parseRpcInfra(value: string | null): RpcLatencyInfra {
  const normalizedValue = normalizeRpcInfraParam(value);

  return rpcInfraOptions.some((option) => option.value === normalizedValue)
    ? (normalizedValue as RpcLatencyInfra)
    : defaultRpcInfra;
}

function parseRpcMethod(value: string | null): RpcLatencyMethod {
  return rpcMethodOptions.some((option) => option.value === value)
    ? (value as RpcLatencyMethod)
    : defaultRpcMethod;
}

function parseRpcTimeframe(value: string | null): RpcTimeframe {
  return rpcTimeframeOptions.some((option) => option.value === value)
    ? (value as RpcTimeframe)
    : defaultRpcTimeframe;
}

function parseRpcRegion(
  value: string | null,
  infra: RpcLatencyInfra,
): RpcLatencyRegion {
  const normalizedValue = normalizeRpcRegionParam(value);

  return rpcRegionOptions.some((option) => option.value === normalizedValue)
    ? (normalizedValue as RpcLatencyRegion)
    : getDefaultRpcRegion(infra);
}

export function getAvailableProviders(rows: readonly MetricRow[]) {
  return getOrderedProviderNames(rows.map((row) => row.providerName));
}

function getRowProviderName(row: MetricRow) {
  return normalizeProviderName(row.providerName).trim();
}

function getOrderedProviderNames(providerNames: Iterable<string>) {
  const providerSet = new Set<ProviderName>();

  for (const providerName of providerNames) {
    const normalizedProviderName = normalizeProviderName(providerName).trim();

    if (normalizedProviderName) {
      providerSet.add(normalizedProviderName);
    }
  }

  return Array.from(providerSet).sort((a, b) => a.localeCompare(b));
}

export function parseProviders(
  value: string | null,
  availableProviders: readonly ProviderName[] = [],
) {
  if (!value) {
    return new Set(availableProviders);
  }

  if (value === emptyProvidersParam) {
    return new Set<ProviderName>();
  }

  const parsedProviders = getOrderedProviderNames(value.split(","));

  if (parsedProviders.length === 0 || availableProviders.length === 0) {
    return new Set(
      parsedProviders.length > 0 ? parsedProviders : availableProviders,
    );
  }

  const availableProviderSet = new Set(availableProviders);
  const selectedProviders = parsedProviders.filter((provider) =>
    availableProviderSet.has(provider),
  );

  return selectedProviders.length > 0
    ? new Set(selectedProviders)
    : new Set(availableProviders);
}

function hasAllProvidersSelected(
  selectedProviders: ReadonlySet<ProviderName>,
  availableProviders: readonly ProviderName[],
) {
  return (
    availableProviders.length > 0 &&
    availableProviders.every((provider) => selectedProviders.has(provider))
  );
}

function getProviderColor(providerName: ProviderName) {
  return (
    providerColors[providerName] ??
    fallbackProviderColors[getStableColorIndex(providerName)]
  );
}

function getRpcInfraLabel(value: RpcLatencyInfra) {
  return (
    rpcInfraOptions.find((option) => option.value === value)?.label ?? value
  );
}

function getRpcRegionLabel(value: RpcLatencyRegion) {
  return (
    rpcRegionOptions.find((option) => option.value === value)?.label ?? value
  );
}

function getStableColorIndex(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash % fallbackProviderColors.length;
}

function formatPercent(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    style: "percent",
  }).format(value);
}

function formatTimestamp(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getTabContent(t: DashboardTranslator, tab: DashboardTab) {
  return {
    label: t(`tabs.${tab}.label`),
    description: t(`tabs.${tab}.description`),
    clarification: getTabClarification(t, tab),
  };
}

function getTabClarification(t: DashboardTranslator, tab: DashboardTab) {
  const clarificationKey = `tabs.${tab}.clarification`;

  return t.has(clarificationKey) ? t(clarificationKey) : undefined;
}

function getChartTitle(t: DashboardTranslator, chart: ChartDefinition) {
  const titleKey = `charts.${chart.id}.title`;

  return t.has(titleKey) ? t(titleKey) : chart.title;
}

function getChartCaption(t: DashboardTranslator, chart: ChartDefinition) {
  const captionKey = `charts.${chart.id}.caption`;

  return t.has(captionKey) ? t(captionKey) : undefined;
}

function getValueLabel(t: DashboardTranslator, valueLabel: string) {
  switch (valueLabel) {
    case "Count":
      return t("valueLabels.count");
    case "Compute Units":
      return t("valueLabels.computeUnits");
    case "Fees (SOL)":
      return t("valueLabels.feesSol");
    case "Milliseconds":
      return t("valueLabels.milliseconds");
    case "Percent":
      return t("valueLabels.percent");
    case "SOL":
      return t("valueLabels.sol");
    case "USD":
      return t("valueLabels.usd");
    default:
      return valueLabel;
  }
}
