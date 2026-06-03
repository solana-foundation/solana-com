import { VideoBadge } from "@/components/solutions/video-grid.v2";
import {
  Activity,
  EyeOff,
  GitFork,
  Layers,
  Pause,
  Repeat,
  ShieldCheck,
  UserCheck,
  UserX,
  Vault,
  type LucideIcon,
} from "lucide-react";
import { Formats, TranslationValues } from "next-intl";

/** Logos for the "in production with" marquee (assets that exist locally). */
export const MARQUEE_LOGOS = [
  { src: "/src/img/logos-eco/blackrock.png", alt: "BlackRock" },
  { src: "/src/img/logos-eco/apollo.webp", alt: "Apollo" },
  {
    src: "/src/img/logos-eco/franklin-templeton.webp",
    alt: "Franklin Templeton",
  },
  { src: "/src/img/logos-eco/societe-generale.png", alt: "Société Générale" },
  { src: "/src/img/logos-eco/fiserv.svg", alt: "Fiserv" },
  { src: "/src/img/logos-eco/paypal.svg", alt: "PayPal" },
];

/**
 * Editorial case studies, grouped by tab. Copy lives in i18n under
 * `icm.caseStudies.cards.<cardKey>` and `icm.caseStudies.groups.<groupKey>`.
 */
export const CASE_STUDY_GROUPS = [
  { key: "equities", cards: ["xstocks", "globalMarkets", "superstateEquity"] },
  { key: "funds", cards: ["buidl", "acred", "benji", "ousg", "ustb"] },
  {
    key: "rwa",
    cards: [
      "metaWealth",
      "oro",
      "figureHeloc",
      "centrifuge",
      "maple",
      "carbon",
    ],
  },
  { key: "stable", cards: ["eurcv", "fiusd", "pyusd", "usdg"] },
  { key: "inst", cards: ["jpmorgan", "citi", "standardChartered"] },
] as const;

export type CaseStudyGroupKey = (typeof CASE_STUDY_GROUPS)[number]["key"];

/**
 * Maps the asset-table filter chips to real Tokens API categories.
 * `all` keeps every fetched category.
 */
export const ASSET_FILTERS = [
  "all",
  "rwa",
  "equity",
  "etf",
  "stablecoin",
  "commodity",
] as const;

export type AssetFilter = (typeof ASSET_FILTERS)[number];

/** Liquidity / allocator pillars. Copy in `icm.liquidity.pillars.<key>`. */
export const LIQUIDITY_PILLARS: { key: string; Icon: LucideIcon }[] = [
  { key: "marketMakers", Icon: Activity },
  { key: "onchainLiquidity", Icon: Layers },
  { key: "borrowLend", Icon: Vault },
];

export const LIQUIDITY_CALLOUT_ICON = GitFork;

/** Issuance platforms grid. Copy in `icm.issuance.platforms.items.<key>`. */
export const ISSUANCE_PLATFORMS = [
  "securitize",
  "backed",
  "superstate",
  "centrifuge",
  "libera",
  "ondo",
] as const;

/** Token standards list. Copy in `icm.issuance.standards.rows.<key>`. */
export const TOKEN_STANDARDS = [
  "token2022",
  "sdp",
  "ssts",
  "tokenAcl",
  "vault",
  "thaw",
  "cmtat",
] as const;

export type PermissionAttrStatus = "on" | "neutral";

/** Token-attribute rows in the permissioning card. Copy in `icm.permissioning.card.attrs.<key>`. */
export const PERMISSION_ATTRS: {
  key: string;
  Icon: LucideIcon;
  status: PermissionAttrStatus;
}[] = [
  { key: "allowlist", Icon: UserCheck, status: "on" },
  { key: "confidential", Icon: EyeOff, status: "on" },
  { key: "ofac", Icon: ShieldCheck, status: "on" },
  { key: "yield", Icon: Repeat, status: "neutral" },
  { key: "delegate", Icon: UserX, status: "neutral" },
  { key: "defaultState", Icon: Pause, status: "neutral" },
];

export const VIDEOS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "gYOTFfy5n3E",
    thumbnail: "/src/img/solutions/icm/video1.webp",
    title: t("icm.videoPlayer.videos.0.title"),
    description: t("icm.videoPlayer.videos.0.description"),
    alt: t("icm.videoPlayer.videos.0.alt"),
    badge: VideoBadge.Podcast,
  },
  {
    id: "8AGUcNIV5oo",
    thumbnail: "/src/img/solutions/icm/video2.webp",
    title: t("icm.videoPlayer.videos.1.title"),
    description: t("icm.videoPlayer.videos.1.description"),
    alt: t("icm.videoPlayer.videos.1.alt"),
    badge: VideoBadge.Interview,
  },
  {
    id: "PC3N-qQVA3w",
    thumbnail: "/src/img/solutions/icm/video3.webp",
    title: t("icm.videoPlayer.videos.2.title"),
    description: t("icm.videoPlayer.videos.2.description"),
    alt: t("icm.videoPlayer.videos.2.alt"),
    badge: VideoBadge.Originals,
  },
  {
    id: "qLbcvtIAPnI",
    thumbnail: "/src/img/solutions/icm/video4.webp",
    title: t("icm.videoPlayer.videos.3.title"),
    description: t("icm.videoPlayer.videos.3.description"),
    alt: t("icm.videoPlayer.videos.3.alt"),
    badge: VideoBadge.Event,
  },
];

export const LATEST_NEWS_QUERY = {
  categories: ["finance", "institutions"],
  tags: ["token", "finance", "partner"],
  limit: 6,
  excludeUrls: [
    "/news/solana-developer-platform",
    "/news/solana-network-upgrades",
  ],
  fallbackImage: "/src/img/solutions/icm/og-image.webp",
  fallbackImageAspectRatio: "1200 / 630",
};
