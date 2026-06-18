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
  type LucideIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { Link } from "@solana-com/ui-chrome/link";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import { usePathname, useRouter } from "@workspace/i18n/routing";

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
  metricColors,
  normalizeProviderName,
  providerColors,
  providers,
  rangeOptions,
  type Aggregation,
  type ChartDefinition,
  type DashboardTab,
  type DataApiResponse,
  type MethodologyComment,
  type MetricRow,
  type ProviderName,
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
] as const satisfies readonly { labelKey: string; value: DashboardTab }[];

const tabIcons: Record<DashboardTab, LucideIcon> = {
  overview: Activity,
  network: Network,
  stablecoins: CircleDollarSign,
  defi: ArrowLeftRight,
};

const tabIndicatorSpring = {
  damping: 32,
  stiffness: 360,
  type: "spring",
} as const;

const defaultProviders = new Set<ProviderName>(providers);
const emptyProvidersParam = "none";
const defaultRangeDays = 90;
const emptyRows: MetricRow[] = [];
const kpiCount = 4;
const chartHeight = 320;
const dataRefreshIntervalMs = 24 * 60 * 60 * 1000;
const dataDedupingIntervalMs = 60 * 1000;
const dataAggregatorRepositoryUrl =
  "https://github.com/solana-foundation/solana-data-aggregator";
const backfillRequestsUrl = `${dataAggregatorRepositoryUrl}/issues`;
const resourceCardStepFallback = 460;
const resourceCards = [
  {
    analyticsId: "sdp",
    backgroundClassName: "rotate-180 scale-[1.08]",
    backgroundSrc: "/src/img/solutions/sdp/feat-bg-1.jpg",
    ctaKey: "buildSection.cards.sdp.cta",
    descriptionKey: "buildSection.cards.sdp.description",
    href: "/solutions/sdp",
    nodeId: "3:1096",
    titleKey: "buildSection.cards.sdp.title",
  },
  {
    analyticsId: "solana-data-aggregator",
    backgroundClassName: "",
    backgroundSrc: "/src/img/solutions/sdp/ai-advantages-visual-bg-2.jpg",
    ctaKey: "buildSection.cards.aggregator.cta",
    descriptionKey: "buildSection.cards.aggregator.description",
    href: dataAggregatorRepositoryUrl,
    nodeId: "21:105",
    titleKey: "buildSection.cards.aggregator.title",
  },
  {
    analyticsId: "allium",
    backgroundClassName: "-scale-y-100 rotate-180",
    backgroundSrc: "/src/img/solutions/sdp/advantages-visual-bg.jpg",
    ctaKey: "buildSection.cards.allium.cta",
    descriptionKey: "buildSection.cards.allium.description",
    href: "https://www.allium.so/solana",
    nodeId: "25:113",
    titleKey: "buildSection.cards.allium.title",
  },
  {
    analyticsId: "tokens",
    backgroundClassName: "rotate-180 scale-[1.08]",
    backgroundSrc: "/src/img/solutions/sdp/feat-bg-2.jpg",
    ctaKey: "buildSection.cards.tokens.cta",
    descriptionKey: "buildSection.cards.tokens.description",
    href: "https://tokens.xyz",
    nodeId: "25:134",
    titleKey: "buildSection.cards.tokens.title",
  },
  {
    analyticsId: "lightspeed",
    backgroundClassName: "-scale-y-100",
    backgroundSrc: "/src/img/solutions/sdp/feat-bg-3.jpg",
    ctaKey: "buildSection.cards.lightspeed.cta",
    descriptionKey: "buildSection.cards.lightspeed.description",
    href: "https://solanalightspeed.com/dashboards/",
    nodeId: "25:127",
    titleKey: "buildSection.cards.lightspeed.title",
  },
  {
    analyticsId: "dune",
    backgroundClassName: "scale-[1.18]",
    backgroundSrc: "/src/img/solutions/sdp/ai-advantages-visual-bg-1.jpg",
    ctaKey: "buildSection.cards.dune.cta",
    descriptionKey: "buildSection.cards.dune.description",
    href: "https://docs.dune.com/data-catalog/solana/overview",
    nodeId: "25:120",
    titleKey: "buildSection.cards.dune.title",
  },
  {
    analyticsId: "pay-sh",
    backgroundClassName: "-scale-y-100",
    backgroundSrc: "/src/img/solutions/sdp/advantages-visual-bg.jpg",
    ctaKey: "buildSection.cards.pay.cta",
    descriptionKey: "buildSection.cards.pay.description",
    href: "https://pay.sh",
    nodeId: "8:165",
    titleKey: "buildSection.cards.pay.title",
  },
  {
    analyticsId: "x402",
    backgroundClassName: "",
    backgroundSrc: "/src/img/data-dashboard/x402-card-bg.png",
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

type QueryUpdates = {
  days?: number;
  providers?: Set<ProviderName>;
  tab?: DashboardTab;
};

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
    rangeDays,
    selectedProviderList,
    selectedProviders,
    updateQuery,
  } = useDashboardQueryState();
  const activeTabContent = getTabContent(t, activeTab);
  const dataUrl = `/api/databricks/data?days=${rangeDays}`;
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
    dataSWRConfig,
  );
  const rows = data?.rows ?? emptyRows;
  const activeCharts = useMemo(() => getChartsForTab(activeTab), [activeTab]);
  const visibleCharts = useMemo(
    () => getVisibleCharts(activeCharts, rows),
    [activeCharts, rows],
  );
  const kpis = useMemo(
    () => getKpis(visibleCharts, rows, selectedProviders),
    [visibleCharts, rows, selectedProviders],
  );
  const isInitialLoading = isLoading && rows.length === 0;
  const isRefreshing = isValidating && rows.length > 0;

  return (
    <main className="relative bg-nd-inverse text-nd-high-em-text font-brand">
      <div className="max-w-screen-2xl w-full mx-auto px-5 md:px-8 xl:px-10 py-10 xl:py-16">
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
          className="sticky top-[65px] lg:top-[71px] z-40 mt-8 -mx-5 md:-mx-8 xl:-mx-10 bg-nd-inverse/90 backdrop-blur-md border-y border-nd-border-light"
        >
          <DashboardControls
            activeTab={activeTab}
            isRefreshing={isRefreshing}
            rangeDays={rangeDays}
            selectedProviders={selectedProviders}
            showProviderControls={showProviderControls}
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

        <DataResourceCarousel />

        {error ? <DataError error={error} /> : null}

        {!error ? (
          <>
            <KpiGrid isLoading={isInitialLoading} kpis={kpis} />

            <ChartGrid
              activeCharts={activeCharts}
              activeTab={activeTab}
              isLoading={isInitialLoading}
              isRefreshing={isRefreshing}
              rows={rows}
              selectedProviders={selectedProviders}
              visibleCharts={visibleCharts}
            />
          </>
        ) : null}

        <footer className="mt-10 xl:mt-14 border-t border-nd-border-light pt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between font-brand-mono text-[12px] md:text-[14px] leading-[1.42] uppercase text-nd-mid-em-text">
          <span>
            {getFooterProvidersLabel(t, selectedProviderList)}
            <span className="mx-3 text-nd-border-prominent">·</span>
            {t("footer.lastDays", { days: rangeDays })}
          </span>
          <span className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
            <span>{t("footer.refreshCadence")}</span>
            {data?.generatedAt ? (
              <span>
                {t("footer.lastRefreshed")}{" "}
                <span className="text-nd-high-em-text">
                  {formatTimestamp(data.generatedAt, locale)}
                </span>
              </span>
            ) : null}
            <span>{t("footer.lagNotice")}</span>
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
            <span>{t("footer.backfillCadence")}</span>
          </span>
        </footer>
      </div>
    </main>
  );
}

function DashboardControls({
  activeTab,
  isRefreshing,
  onUpdateQuery,
  rangeDays,
  selectedProviders,
  showProviderControls,
}: {
  activeTab: DashboardTab;
  isRefreshing: boolean;
  onUpdateQuery: (_updates: QueryUpdates) => void;
  rangeDays: number;
  selectedProviders: Set<ProviderName>;
  showProviderControls: boolean;
}) {
  const t = useTranslations("dataDashboard");

  return (
    <div className="px-5 md:px-8 xl:px-10 py-2 grid gap-2">
      <div className="-mx-1 flex items-center gap-x-3 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TabSwitcher
          activeTab={activeTab}
          onChange={(value) => onUpdateQuery({ tab: value })}
        />
        <Separator />
        <InlineControl
          ariaLabel={t("controls.rangeAriaLabel")}
          options={rangeOptions}
          value={rangeDays}
          onChange={(value) => onUpdateQuery({ days: value })}
        />
      </div>

      {isRefreshing || showProviderControls ? (
        <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center md:gap-x-4">
          {isRefreshing ? <RefreshingIndicator /> : null}
          {showProviderControls ? (
            <ProviderControls
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
  onChange,
  selectedProviders,
}: {
  onChange: (_providers: Set<ProviderName>) => void;
  selectedProviders: Set<ProviderName>;
}) {
  const t = useTranslations("dataDashboard");
  const allProvidersSelected = selectedProviders.size === providers.length;

  return (
    <div className="-mx-1 flex items-center gap-x-3 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <span className="shrink-0 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text/70">
        {t("controls.providersLabel")}
      </span>
      {providers.map((provider) => (
        <ProviderToggle
          active={selectedProviders.has(provider)}
          color={providerColors[provider]}
          key={provider}
          label={provider}
          onClick={() => onChange(toggleProvider(selectedProviders, provider))}
        />
      ))}
      <button
        className="shrink-0 border border-nd-border-prominent px-2.5 py-1 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text transition-colors hover:bg-nd-border-light/20 hover:text-nd-high-em-text"
        onClick={() =>
          onChange(
            allProvidersSelected ? new Set<ProviderName>() : new Set(providers),
          )
        }
        type="button"
      >
        {allProvidersSelected ? t("legend.deselectAll") : t("legend.selectAll")}
      </button>
    </div>
  );
}

function KpiGrid({ isLoading, kpis }: { isLoading: boolean; kpis: KpiItem[] }) {
  const locale = useLocale();
  const t = useTranslations("dataDashboard");

  return (
    <TooltipProvider delayDuration={100}>
      <section
        aria-label={t("kpisAriaLabel")}
        className={cn(
          "mt-10 xl:mt-14 border-y border-nd-border-light relative",
          "before:absolute before:top-0 before:left-0 before:h-full before:w-px before:bg-gradient-to-b before:from-[#D884F0] before:to-[#44EBA6]",
          "grid grid-cols-2 xl:grid-cols-4 divide-nd-border-light",
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
                summary={getKpiSummary(t, kpi.chart)}
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
  rows,
  selectedProviders,
  visibleCharts,
}: {
  activeCharts: readonly ChartDefinition[];
  activeTab: DashboardTab;
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
      className="mt-10 -mx-5 bg-black px-5 py-10 md:-mx-8 md:px-8 xl:-mx-10 xl:px-10 xl:py-11"
      data-node-id="2:1090"
    >
      <div className="border border-nd-border-light bg-black">
        <div className="flex items-stretch border-b border-nd-border-light">
          <div className="flex min-w-0 flex-1 flex-col gap-3 px-6 py-7 md:px-9">
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
        "relative flex min-h-[186px] shrink-0 basis-[min(84vw,460px)] flex-col items-start gap-7 overflow-hidden px-6 py-7 md:basis-[460px] md:px-9 xl:basis-1/3",
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
  const methodologyNotes = getMethodologyNotes(chart, selectedProviders);

  return (
    <article className="relative p-6 xl:p-8 flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-2">
          <h2 className="text-[20px] xl:text-[24px] leading-[1.25] font-medium tracking-normal">
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

      {series.length > 0 ? (
        <TimeSeriesChart
          height={chartHeight}
          series={series}
          valueLabel={chart.valueLabel}
        />
      ) : (
        <div className="flex h-[320px] items-center justify-center border border-dashed border-nd-border-light text-sm text-nd-mid-em-text font-brand-mono uppercase tracking-normal">
          {t("empty.noDataForSelection")}
        </div>
      )}

      <ChartOrdinal index={index} />
      {isRefreshing ? <ChartRefreshingOverlay /> : null}
    </article>
  );
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
  summary,
  unit,
  value,
}: {
  delta: number;
  index: number;
  label: string;
  summary: string;
  unit: string;
  value: string;
}) {
  const locale = useLocale();

  return (
    <article className={getKpiCellClassName(index)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-1.5">
          <h2 className="font-brand-mono text-[12px] md:text-[14px] leading-[1.42] font-bold uppercase text-nd-mid-em-text">
            {label}
          </h2>
          <KpiSummaryTooltip label={label} summary={summary} />
        </div>
        <span className="font-brand-mono text-[10px] leading-5 uppercase text-nd-mid-em-text/60 tracking-normal shrink-0">
          {unit}
        </span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <p className="text-[28px] xl:text-[40px] leading-[1.0] font-light uppercase tabular-nums tracking-normal text-nd-high-em-text">
          {value}
        </p>
        <p
          className={cn(
            "font-brand-mono text-[12px] md:text-[14px] leading-[1.42] font-bold uppercase tabular-nums",
            delta >= 0 ? "text-nd-highlight-green" : "text-nd-highlight-orange",
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
    <article className="p-6 xl:p-8 flex flex-col gap-5">
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

function useDashboardQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const providerParam = searchParams.get("providers");
  const selectedProviders = useMemo(
    () => parseProviders(providerParam),
    [providerParam],
  );
  const selectedProviderList = useMemo(
    () => getOrderedSelectedProviders(selectedProviders),
    [selectedProviders],
  );

  const updateQuery = useCallback(
    (updates: QueryUpdates) => {
      const params = new URLSearchParams(searchParams.toString());

      applyQueryUpdates(params, updates);
      router.replace(getDashboardUrl(pathname, params), { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return {
    activeTab: parseTab(searchParams.get("tab")),
    rangeDays: parseRangeDays(searchParams.get("days")),
    selectedProviderList,
    selectedProviders,
    updateQuery,
  };
}

function applyQueryUpdates(params: URLSearchParams, updates: QueryUpdates) {
  if (updates.tab) {
    params.set("tab", updates.tab);
  }

  if (updates.days) {
    params.set("days", String(updates.days));
  }

  if (updates.providers) {
    updateProvidersParam(params, updates.providers);
  }
}

export function updateProvidersParam(
  params: URLSearchParams,
  selectedProviders: Set<ProviderName>,
) {
  const nextProviders = getOrderedSelectedProviders(selectedProviders);

  if (nextProviders.length === 0) {
    params.set("providers", emptyProvidersParam);
  } else if (nextProviders.length === providers.length) {
    params.delete("providers");
  } else {
    params.set("providers", nextProviders.join(","));
  }
}

function getDashboardUrl(pathname: string, params: URLSearchParams) {
  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
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
) {
  if (selectedProviderList.length === providers.length) {
    return t("footer.allProviders");
  }

  if (selectedProviderList.length === 0) {
    return t("footer.noProviders");
  }

  return selectedProviderList.join(t("footer.providerListSeparator"));
}

function getOrderedSelectedProviders(
  selectedProviders: ReadonlySet<ProviderName>,
) {
  return providers.filter((provider) => selectedProviders.has(provider));
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

function getKpis(
  charts: readonly ChartDefinition[],
  rows: MetricRow[],
  selectedProviders: Set<ProviderName>,
): KpiItem[] {
  return charts.slice(0, kpiCount).map((chart) => ({
    chart,
    ...getKpiValue(chart, rows, selectedProviders),
  }));
}

function getKpiSummary(t: DashboardTranslator, chart: ChartDefinition) {
  if (chart.seriesField === "provider") {
    return t("kpis.providerTooltip");
  }

  if (chart.metrics.length > 1) {
    return t("kpis.compositeTooltip", {
      metrics: chart.metrics.join(t("kpis.metricListSeparator")),
    });
  }

  return t("kpis.metricTooltip", {
    metric: chart.metrics[0] ?? getChartTitle(t, chart),
  });
}

function getKpiCellClassName(index: number) {
  return cn(
    "py-6 px-5 md:py-8 md:px-8 xl:py-10 xl:px-10 flex flex-col gap-5 border-nd-border-light",
    index > 0 ? "border-l" : "",
    index >= 2 ? "border-t xl:border-t-0" : "",
    index === 2 ? "xl:border-l" : "",
  );
}

function hasChartSourceData(chart: ChartDefinition, rows: MetricRow[]) {
  const metricSet = new Set<string>(chart.metrics);
  const chartProviderSet = new Set<ProviderName>(getChartProviders(chart));

  return rows.some((row) => isChartDataRow(row, metricSet, chartProviderSet));
}

function buildSeries(
  chart: ChartDefinition,
  rows: MetricRow[],
  selectedProviders: Set<ProviderName>,
): ChartSeries[] {
  const metricSet = new Set<string>(chart.metrics);
  const chartProviders = getChartProviders(chart);
  const chartProviderSet = new Set<ProviderName>(chartProviders);
  const buckets = new Map<
    string,
    Map<string, { color: string; count: number; label: string; sum: number }>
  >();

  for (const row of rows) {
    if (
      !isChartDataRow(row, metricSet, chartProviderSet) ||
      !selectedProviders.has(row.providerName)
    ) {
      continue;
    }

    const seriesId =
      chart.seriesField === "provider" ? row.providerName : row.metricName;
    const seriesLabel = seriesId;
    const color =
      chart.seriesField === "provider"
        ? providerColors[row.providerName]
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
      ? chartProviders.filter((provider) => buckets.has(provider))
      : chart.metrics.filter((metric) => buckets.has(metric));

  return orderedSeriesIds.map((seriesId) => {
    const seriesBucket = buckets.get(seriesId) ?? new Map();

    return {
      id: seriesId,
      label: seriesId,
      color:
        chart.seriesField === "provider" && isProviderName(seriesId)
          ? providerColors[seriesId]
          : (metricColors[seriesId] ?? "#A78BFA"),
      points: Array.from(seriesBucket.entries())
        .map(([date, bucket]) => ({
          date: new Date(`${date}T00:00:00.000Z`),
          value: aggregate(bucket.sum, bucket.count, chart.aggregation),
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    };
  });
}

function getChartProviders(chart: ChartDefinition) {
  return chart.providers ?? providers;
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
  chartProviderSet: ReadonlySet<ProviderName>,
): row is MetricRow & { providerName: ProviderName } {
  return (
    metricSet.has(row.metricName) &&
    isProviderName(row.providerName) &&
    chartProviderSet.has(row.providerName)
  );
}

function getKpiValue(
  chart: ChartDefinition,
  rows: MetricRow[],
  selectedProviders: Set<ProviderName>,
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
    ? getAggregateSeriesValue(series, latestDate, chart.seriesField)
    : 0;
  const previousValue = previousDate
    ? getAggregateSeriesValue(series, previousDate, chart.seriesField)
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
    return getMedian(values);
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
  const response = await fetch(url, { cache: "no-store" });
  const payload = await readDataPayload(response, errorMessages);

  if (!response.ok) {
    throw new Error(getDataFetchErrorMessage(payload, errorMessages));
  }

  if (!isDataApiResponse(payload)) {
    throw new Error(errorMessages.invalidResponse);
  }

  return payload;
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
  return value === "network" || value === "stablecoins" || value === "defi"
    ? value
    : "overview";
}

function parseRangeDays(value: string | null) {
  const parsed = value ? Number(value) : defaultRangeDays;
  return rangeOptions.some((option) => option.value === parsed)
    ? parsed
    : defaultRangeDays;
}

export function parseProviders(value: string | null) {
  if (!value) {
    return new Set(defaultProviders);
  }

  if (value === emptyProvidersParam) {
    return new Set<ProviderName>();
  }

  const parsedProviders = value
    .split(",")
    .map((provider) => normalizeProviderName(provider))
    .filter((provider): provider is ProviderName => isProviderName(provider));

  return parsedProviders.length > 0
    ? new Set(parsedProviders)
    : new Set(defaultProviders);
}

function isProviderName(value: string): value is ProviderName {
  return providers.includes(value as ProviderName);
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

function getValueLabel(t: DashboardTranslator, valueLabel: string) {
  switch (valueLabel) {
    case "Count":
      return t("valueLabels.count");
    case "Compute Units":
      return t("valueLabels.computeUnits");
    case "Fees (SOL)":
      return t("valueLabels.feesSol");
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
