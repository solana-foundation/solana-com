import { Pulse as Activity } from "@boxicons/react/Pulse";
import { ArrowLeftRight } from "@boxicons/react/ArrowLeftRight";
import { DollarCircle as CircleDollarSign } from "@boxicons/react/DollarCircle";
import { NetworkChart as Network } from "@boxicons/react/NetworkChart";
import { Broadcast as RadioTower } from "@boxicons/react/Broadcast";
import { Send } from "@boxicons/react/Send";
import type { DashboardTab } from "./data-config";

export const tabOptions = [
  { labelKey: "tabs.overview.label", value: "overview" },
  { labelKey: "tabs.network.label", value: "network" },
  { labelKey: "tabs.stablecoins.label", value: "stablecoins" },
  { labelKey: "tabs.defi.label", value: "defi" },
  { labelKey: "tabs.rpc.label", value: "rpc" },
  { labelKey: "tabs.senders.label", value: "senders" },
] as const satisfies readonly { labelKey: string; value: DashboardTab }[];

export const tabIcons: Record<DashboardTab, typeof Activity> = {
  overview: Activity,
  network: Network,
  stablecoins: CircleDollarSign,
  defi: ArrowLeftRight,
  rpc: RadioTower,
  senders: Send,
};

export const tabIndicatorSpring = {
  damping: 32,
  stiffness: 360,
  type: "spring",
} as const;

export const emptyProvidersParam = "none";
export const defaultRangeDays = 90;
export const kpiCount = 4;
export const chartHeight = 320;
export const fallbackProviderColors = [
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
export const dataAggregatorRepositoryUrl =
  "https://github.com/solana-foundation/solana-data-aggregator";
export const rpcLatencyRepositoryUrl =
  "https://github.com/solana-foundation/rpc-latency-monitor";
export const rpcLatencyProviderOnboardingUrl = `${rpcLatencyRepositoryUrl}#adding-your-rpc-for-providers`;
const rpcSenderGrafanaUrl =
  "https://solanafoundation.grafana.net/public-dashboards/d0708457d6a243ae8a4c8113090fa159";
export const backfillRequestsUrl = `${dataAggregatorRepositoryUrl}/issues`;
export const resourceCarouselAutoAdvanceMs = 6000;
export const resourceCardStepFallback = 460;
export const resourceCards = [
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
    analyticsId: "defi-monitor",
    backgroundClassName: "",
    backgroundSrc: "/src/img/solutions/defi/bg-1.webp",
    ctaKey: "buildSection.cards.defiMonitor.cta",
    descriptionKey: "buildSection.cards.defiMonitor.description",
    href: "https://api.topledger.xyz/defi-monitor/",
    nodeId: "8:171",
    titleKey: "buildSection.cards.defiMonitor.title",
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
] as const;
export const dataSWRConfig = {
  dedupingInterval: dataDedupingIntervalMs,
  keepPreviousData: true,
  refreshInterval: dataRefreshIntervalMs,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
} as const;
export const rpcDataSWRConfig = {
  ...dataSWRConfig,
  dedupingInterval: rpcDataDedupingIntervalMs,
  refreshInterval: rpcDataRefreshIntervalMs,
} as const;
export const rpcFiltersSWRConfig = {
  dedupingInterval: rpcFiltersRefreshIntervalMs,
  keepPreviousData: true,
  refreshInterval: rpcFiltersRefreshIntervalMs,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
} as const;
