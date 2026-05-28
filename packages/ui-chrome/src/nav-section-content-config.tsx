import NewspaperIcon from "./assets/nav/build/newspaper.inline.svg";
import ApiConnectionBuildIcon from "./assets/nav/build/api-connection.inline.svg";
import TemplatesIcon from "./assets/nav/build/templates.inline.svg";
import SchoolIcon from "./assets/nav/build/school.inline.svg";
import HandIcon from "./assets/nav/build/hand.inline.svg";
import MaintenanceIcon from "./assets/nav/build/maintenance.inline.svg";
import BankIcon from "./assets/nav/solutions/bank.inline.svg";
import BitcoinIcon from "./assets/nav/solutions/bitcoin.inline.svg";
import BuildingsIcon from "./assets/nav/solutions/buildings.inline.svg";
import CoinIcon from "./assets/nav/solutions/coin.inline.svg";
import CoinsAddIcon from "./assets/nav/solutions/coins-add.inline.svg";
import CoinsIcon from "./assets/nav/solutions/coins.inline.svg";
import ContrastIcon from "./assets/nav/solutions/contrast.inline.svg";
import FlowIcon from "./assets/nav/solutions/flow.inline.svg";
import MallIcon from "./assets/nav/solutions/mall.inline.svg";
import MoneyIcon from "./assets/nav/solutions/money.inline.svg";
import RootingIcon from "./assets/nav/solutions/rooting.inline.svg";
import SparklesIcon from "./assets/nav/solutions/sparkles.inline.svg";
import StoreIcon from "./assets/nav/solutions/store.inline.svg";
import WalletSolutionsIcon from "./assets/nav/solutions/wallet.inline.svg";
import WalletLearnIcon from "./assets/nav/learn/wallet.inline.svg";
import DocumentsIcon from "./assets/nav/learn/documents.inline.svg";
import EducationIcon from "./assets/nav/learn/education.inline.svg";
import TradingViewIcon from "./assets/nav/learn/trading-view.inline.svg";
import ApiConnectionNetworkIcon from "./assets/nav/network/api-connection.inline.svg";
import BezierIcon from "./assets/nav/network/bezier.inline.svg";
import ExplorerIcon from "./assets/nav/network/explorer.inline.svg";
import PulseIcon from "./assets/nav/network/pulse.inline.svg";
import NewspaperCommunityIcon from "./assets/nav/community/newspaper.inline.svg";
import CalendarIcon from "./assets/nav/community/calendar.inline.svg";
import AccelerateEventIcon from "./assets/nav/community/accelerate-event.inline.svg";
import GlobusIcon from "./assets/nav/community/globus.inline.svg";
import ApiConnectionCommunityIcon from "./assets/nav/community/api-connection.inline.svg";
import BreakpointLogo from "./assets/nav/community/bp26-footer-logo-mobile.inline.svg";
import type {
  NavItemDefinition,
  NavPromoDefinition,
  NavTopLevelSectionId,
} from "./nav-types";

export const useSolanaWalletItems: NavItemDefinition[] = [
  {
    id: "use-solana-wallets",
    titleKey: "nav.useSolana.wallets.items.wallets.title",
    descriptionKey: "nav.useSolana.wallets.items.wallets.description",
    href: "/wallets",
    icon: WalletLearnIcon,
    variant: "large",
  },
  {
    id: "use-solana-wallet-directory",
    titleKey: "nav.useSolana.wallets.items.directory.title",
    descriptionKey: "nav.useSolana.wallets.items.directory.description",
    href: "/solana-wallets",
    icon: WalletSolutionsIcon,
    variant: "large",
  },
  {
    id: "use-solana-learn",
    titleKey: "nav.useSolana.wallets.items.learn.title",
    descriptionKey: "nav.useSolana.wallets.items.learn.description",
    href: "/learn",
    icon: DocumentsIcon,
    variant: "large",
  },
  {
    id: "use-solana-what-is-solana",
    titleKey: "nav.useSolana.wallets.items.whatIsSolana.title",
    descriptionKey: "nav.useSolana.wallets.items.whatIsSolana.description",
    href: "/learn/what-is-solana",
    icon: EducationIcon,
    variant: "large",
  },
];

export const useSolanaSafetyItems: NavItemDefinition[] = [
  {
    id: "use-solana-getting-started",
    titleKey: "nav.useSolana.safety.items.gettingStarted.title",
    href: "/learn/getting-started",
    icon: HandIcon,
  },
  {
    id: "use-solana-wallet-basics",
    titleKey: "nav.useSolana.safety.items.walletBasics.title",
    href: "/learn/what-is-a-wallet",
    icon: WalletLearnIcon,
  },
  {
    id: "use-solana-send-receive",
    titleKey: "nav.useSolana.safety.items.sendReceive.title",
    href: "/learn/sending-and-receiving-sol",
    icon: MoneyIcon,
  },
  {
    id: "use-solana-fees",
    titleKey: "nav.useSolana.safety.items.fees.title",
    href: "/learn/understanding-solana-transaction-fees",
    icon: CoinIcon,
  },
  {
    id: "use-solana-safety",
    titleKey: "nav.useSolana.safety.items.safety.title",
    href: "/learn/staying-safe-on-solana",
    icon: SparklesIcon,
  },
  {
    id: "use-solana-tokens",
    titleKey: "nav.useSolana.safety.items.tokens.title",
    href: "/learn/introduction-to-solana-tokens",
    icon: CoinsIcon,
  },
  {
    id: "use-solana-staking",
    titleKey: "nav.useSolana.safety.items.staking.title",
    href: "/staking",
    icon: BezierIcon,
  },
  {
    id: "use-solana-consumer",
    titleKey: "nav.useSolana.safety.items.consumer.title",
    href: "/solutions/consumer",
    icon: StoreIcon,
  },
];

export const buildStartItems: NavItemDefinition[] = [
  {
    id: "build-docs",
    titleKey: "nav.build.start.items.docs.title",
    descriptionKey: "nav.build.start.items.docs.description",
    href: "/docs",
    icon: NewspaperIcon,
    variant: "large",
  },
  {
    id: "build-quickstart",
    titleKey: "nav.build.start.items.quickstart.title",
    descriptionKey: "nav.build.start.items.quickstart.description",
    href: "/docs/intro/quick-start",
    icon: HandIcon,
    variant: "large",
  },
  {
    id: "build-installation",
    titleKey: "nav.build.start.items.installation.title",
    descriptionKey: "nav.build.start.items.installation.description",
    href: "/docs/intro/installation",
    icon: MaintenanceIcon,
    variant: "large",
  },
  {
    id: "build-hub",
    titleKey: "nav.build.start.items.hub.title",
    descriptionKey: "nav.build.start.items.hub.description",
    href: "/developers",
    icon: SchoolIcon,
    variant: "large",
  },
];

export const buildResourceItems: NavItemDefinition[] = [
  {
    id: "build-guides",
    titleKey: "nav.build.resources.items.guides.title",
    href: "/developers/guides",
    icon: DocumentsIcon,
  },
  {
    id: "build-cookbook",
    titleKey: "nav.build.resources.items.cookbook.title",
    href: "/developers/cookbook",
    icon: NewspaperIcon,
  },
  {
    id: "build-templates",
    titleKey: "nav.build.resources.items.templates.title",
    href: "/developers/templates",
    icon: TemplatesIcon,
  },
  {
    id: "build-rpc-docs",
    titleKey: "nav.build.resources.items.rpcDocs.title",
    href: "/docs/rpc",
    icon: ApiConnectionBuildIcon,
  },
  {
    id: "build-rpc-providers",
    titleKey: "nav.build.resources.items.rpcProviders.title",
    href: "/rpc",
    icon: ApiConnectionNetworkIcon,
  },
  {
    id: "build-tokens-docs",
    titleKey: "nav.build.resources.items.tokensDocs.title",
    href: "/docs/tokens",
    icon: CoinsIcon,
  },
];

export const buildUseCaseItems: NavItemDefinition[] = [
  {
    id: "build-payments",
    titleKey: "nav.build.useCases.items.payments.title",
    href: "/developers/payments",
    icon: MoneyIcon,
  },
  {
    id: "build-defi",
    titleKey: "nav.build.useCases.items.defi.title",
    href: "/developers/defi",
    icon: TradingViewIcon,
  },
  {
    id: "build-gaming",
    titleKey: "nav.build.useCases.items.gaming.title",
    href: "/developers/gaming",
    icon: GlobusIcon,
  },
  {
    id: "build-token-extensions",
    titleKey: "nav.build.useCases.items.tokenExtensions.title",
    href: "/solutions/token-extensions",
    icon: CoinsAddIcon,
  },
  {
    id: "build-actions",
    titleKey: "nav.build.useCases.items.actions.title",
    href: "/solutions/actions",
    icon: SparklesIcon,
  },
  {
    id: "build-ai",
    titleKey: "nav.build.useCases.items.ai.title",
    href: "/solutions/ai",
    icon: RootingIcon,
  },
];

export const enterpriseBusinessColumns: NavItemDefinition[][] = [
  [
    {
      id: "enterprise-overview",
      titleKey: "nav.enterprise.business.items.overview.title",
      href: "/solutions/enterprise",
      icon: BuildingsIcon,
    },
    {
      id: "enterprise-institutional-payments",
      titleKey: "nav.enterprise.business.items.institutionalPayments.title",
      href: "/solutions/institutional-payments",
      icon: BankIcon,
    },
    {
      id: "enterprise-commerce-tooling",
      titleKey: "nav.enterprise.business.items.commerceTooling.title",
      href: "/solutions/commerce-tooling",
      icon: StoreIcon,
    },
    {
      id: "enterprise-stablecoins",
      titleKey: "nav.enterprise.business.items.stablecoins.title",
      href: "/solutions/stablecoins",
      icon: CoinIcon,
    },
    {
      id: "enterprise-tokenization",
      titleKey: "nav.enterprise.business.items.tokenization.title",
      href: "/solutions/tokenization",
      icon: CoinsAddIcon,
    },
  ],
  [
    {
      id: "enterprise-real-world-assets",
      titleKey: "nav.enterprise.business.items.realWorldAssets.title",
      href: "/solutions/real-world-assets",
      icon: MallIcon,
    },
    {
      id: "enterprise-digital-assets",
      titleKey: "nav.enterprise.business.items.digitalAssets.title",
      href: "/solutions/digital-assets",
      icon: ContrastIcon,
    },
    {
      id: "enterprise-defi",
      titleKey: "nav.enterprise.business.items.defi.title",
      href: "/solutions/defi",
      icon: TradingViewIcon,
    },
    {
      id: "enterprise-financial-infrastructure",
      titleKey: "nav.enterprise.business.items.financialInfrastructure.title",
      href: "/solutions/financial-infrastructure",
      icon: FlowIcon,
    },
    {
      id: "enterprise-financial-institutions",
      titleKey: "nav.enterprise.business.items.financialInstitutions.title",
      href: "/solutions/financial-institutions",
      icon: BankIcon,
    },
  ],
];

export const enterpriseProofItems: NavItemDefinition[] = [
  {
    id: "enterprise-network",
    titleKey: "nav.enterprise.proof.items.network.title",
    href: "/network",
    icon: BezierIcon,
  },
  {
    id: "enterprise-validators",
    titleKey: "nav.enterprise.proof.items.validators.title",
    href: "/validators",
    icon: BezierIcon,
  },
  {
    id: "enterprise-reports",
    titleKey: "nav.enterprise.proof.items.reports.title",
    href: "/reports",
    icon: NewspaperCommunityIcon,
    partiallyActive: true,
  },
  {
    id: "enterprise-research",
    titleKey: "nav.enterprise.proof.items.research.title",
    href: "/research",
    icon: DocumentsIcon,
  },
  {
    id: "enterprise-privacy",
    titleKey: "nav.enterprise.proof.items.privacy.title",
    href: "/privacy",
    icon: SparklesIcon,
  },
];

export const productSurfaceItems: NavItemDefinition[] = [
  {
    id: "products-overview",
    titleKey: "nav.products.surfaces.items.overview.title",
    descriptionKey: "nav.products.surfaces.items.overview.description",
    href: "/products",
    icon: BezierIcon,
    variant: "large",
  },
  {
    id: "products-sdp",
    titleKey: "nav.products.surfaces.items.sdp.title",
    descriptionKey: "nav.products.surfaces.items.sdp.description",
    href: "/solutions/sdp",
    icon: MaintenanceIcon,
    variant: "large",
  },
  {
    id: "products-x402",
    titleKey: "nav.products.surfaces.items.x402.title",
    descriptionKey: "nav.products.surfaces.items.x402.description",
    href: "/x402",
    icon: MoneyIcon,
    variant: "large",
  },
  {
    id: "products-agent-registry",
    titleKey: "nav.products.surfaces.items.agentRegistry.title",
    descriptionKey: "nav.products.surfaces.items.agentRegistry.description",
    href: "/agent-registry",
    icon: ApiConnectionCommunityIcon,
    variant: "large",
  },
  {
    id: "products-skills",
    titleKey: "nav.products.surfaces.items.skills.title",
    descriptionKey: "nav.products.surfaces.items.skills.description",
    href: "/skills",
    icon: DocumentsIcon,
    variant: "large",
  },
  {
    id: "products-actions",
    titleKey: "nav.products.surfaces.items.actions.title",
    descriptionKey: "nav.products.surfaces.items.actions.description",
    href: "/solutions/actions",
    icon: SparklesIcon,
    variant: "large",
  },
  {
    id: "products-ai",
    titleKey: "nav.products.surfaces.items.ai.title",
    descriptionKey: "nav.products.surfaces.items.ai.description",
    href: "/solutions/ai",
    icon: RootingIcon,
    variant: "large",
  },
];

export const productToolItems: NavItemDefinition[] = [
  {
    id: "products-commerce-kit",
    titleKey: "nav.products.tools.items.commerceKit.title",
    href: "/docs/tools/commerce-kit",
    icon: StoreIcon,
  },
  {
    id: "products-kora",
    titleKey: "nav.products.tools.items.kora.title",
    href: "/docs/tools/kora",
    icon: ApiConnectionBuildIcon,
  },
  {
    id: "products-solana-pay",
    titleKey: "nav.products.tools.items.solanaPay.title",
    href: "/docs/tools/solana-pay",
    icon: MoneyIcon,
  },
  {
    id: "products-rpc-providers",
    titleKey: "nav.products.tools.items.rpcProviders.title",
    href: "/rpc",
    icon: ApiConnectionNetworkIcon,
  },
  {
    id: "products-payments-tooling",
    titleKey: "nav.products.tools.items.paymentsTooling.title",
    href: "/solutions/payments-tooling",
    icon: MoneyIcon,
  },
  {
    id: "products-token-extensions",
    titleKey: "nav.products.tools.items.tokenExtensions.title",
    href: "/solutions/token-extensions",
    icon: CoinsIcon,
  },
  {
    id: "products-digital-assets",
    titleKey: "nav.products.tools.items.digitalAssets.title",
    href: "/solutions/digital-assets",
    icon: ContrastIcon,
  },
];

export const productAdjacentItems = productToolItems;

export const ecosystemNetworkItems: NavItemDefinition[] = [
  {
    id: "ecosystem-network",
    titleKey: "nav.ecosystem.network.items.network.title",
    href: "/network",
    icon: BezierIcon,
  },
  {
    id: "ecosystem-validators",
    titleKey: "nav.ecosystem.network.items.validators.title",
    href: "/validators",
    icon: BezierIcon,
  },
  {
    id: "ecosystem-rpc",
    titleKey: "nav.ecosystem.network.items.rpc.title",
    href: "/rpc",
    icon: ApiConnectionNetworkIcon,
  },
  {
    id: "ecosystem-reports",
    titleKey: "nav.ecosystem.network.items.reports.title",
    href: "/reports",
    icon: NewspaperCommunityIcon,
    partiallyActive: true,
  },
  {
    id: "ecosystem-research",
    titleKey: "nav.ecosystem.network.items.research.title",
    href: "/research",
    icon: DocumentsIcon,
  },
  {
    id: "ecosystem-status",
    titleKey: "nav.ecosystem.network.items.status.title",
    href: "https://status.solana.com/",
    icon: PulseIcon,
    external: true,
  },
];

export const ecosystemCommunityItems: NavItemDefinition[] = [
  {
    id: "ecosystem-events",
    titleKey: "nav.ecosystem.community.items.events.title",
    href: "/events",
    icon: CalendarIcon,
    partiallyActive: true,
  },
  {
    id: "ecosystem-event-archive",
    titleKey: "nav.ecosystem.community.items.archive.title",
    href: "/events/archive",
    icon: CalendarIcon,
  },
  {
    id: "ecosystem-accelerate",
    titleKey: "nav.ecosystem.community.items.accelerate.title",
    href: "/accelerate",
    icon: AccelerateEventIcon,
  },
  {
    id: "ecosystem-breakpoint",
    titleKey: "nav.ecosystem.community.items.breakpoint.title",
    href: "/breakpoint",
    icon: CalendarIcon,
  },
  {
    id: "ecosystem-community",
    titleKey: "nav.ecosystem.community.items.community.title",
    href: "/community",
    icon: GlobusIcon,
  },
  {
    id: "ecosystem-news",
    titleKey: "nav.ecosystem.community.items.news.title",
    href: "/news",
    icon: NewspaperCommunityIcon,
    partiallyActive: true,
  },
  {
    id: "ecosystem-podcasts",
    titleKey: "nav.ecosystem.community.items.podcasts.title",
    href: "/podcasts",
    icon: ApiConnectionCommunityIcon,
    partiallyActive: true,
  },
];

export const ecosystemCategoryItems: NavItemDefinition[] = [
  {
    id: "ecosystem-depin",
    titleKey: "nav.ecosystem.categories.items.depin.title",
    href: "/solutions/depin",
    icon: RootingIcon,
  },
  {
    id: "ecosystem-desci",
    titleKey: "nav.ecosystem.categories.items.desci.title",
    href: "/solutions/desci",
    icon: SparklesIcon,
  },
  {
    id: "ecosystem-btcfi",
    titleKey: "nav.ecosystem.categories.items.btcfi.title",
    href: "/solutions/btcfi",
    icon: BitcoinIcon,
  },
  {
    id: "ecosystem-gaming",
    titleKey: "nav.ecosystem.categories.items.gaming.title",
    href: "/solutions/gaming-and-entertainment",
    icon: GlobusIcon,
  },
  {
    id: "ecosystem-creators",
    titleKey: "nav.ecosystem.categories.items.creators.title",
    href: "/solutions/artists-creators",
    icon: EducationIcon,
  },
];

export const navBannerConfigs = {
  use_solana: {
    id: "use-solana-banner",
    translationKey: "nav.useSolana.banner",
    href: "/use-solana",
    position: "left",
  },
  ecosystem: {
    id: "ecosystem-breakpoint-2026",
    translationKey: "nav.ecosystem.promo",
    href: "/breakpoint",
    position: "right",
    expiresAt: "2026-11-18",
    backgroundClassName:
      "xl:bg-[url(/src/img/nav/bp26-nav-banner-bg.webp)] bg-[url(/src/img/nav/bp26-nav-banner-bg-mobile.webp)]",
    Logo: BreakpointLogo,
    logoWidth: 220,
    logoHeight: 32,
  },
} satisfies Partial<Record<NavTopLevelSectionId, NavPromoDefinition>>;

export const navPromoConfigs = navBannerConfigs;

// Legacy header-list files are no longer wired into HEADER_SECTIONS, but they
// still compile as part of the package. Keep these aliases until the old files
// are removed in a cleanup-only change.
export const learnPrimaryItems = useSolanaWalletItems;
export const solutionsToolsColumns = [productAdjacentItems];
export const solutionsCasesColumns = enterpriseBusinessColumns;
export const solutionsResourceItems = productAdjacentItems;
export const networkResourceItems = ecosystemNetworkItems;
export const networkInspectItems = [
  {
    id: "network-solana-explorer",
    titleKey: "nav.ecosystem.network.items.explorer.title",
    href: "https://explorer.solana.com/",
    icon: ExplorerIcon,
    external: true,
  },
];
export const communityInvolvedItems = ecosystemCommunityItems;
