import NewspaperIcon from "./assets/nav/build/newspaper.inline.svg";
import ApiConnectionBuildIcon from "./assets/nav/build/api-connection.inline.svg";
import TemplatesIcon from "./assets/nav/build/templates.inline.svg";
import EthereumIcon from "./assets/nav/build/ethereum.inline.svg";
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
import PhoneIcon from "./assets/nav/solutions/phone.inline.svg";
import RocketIcon from "./assets/nav/solutions/rocket.inline.svg";
import RootingIcon from "./assets/nav/solutions/rooting.inline.svg";
import SparklesIcon from "./assets/nav/solutions/sparkles.inline.svg";
import StoreIcon from "./assets/nav/solutions/store.inline.svg";
import TokensIcon from "./assets/nav/solutions/tokens.inline.svg";
import WalletSolutionsIcon from "./assets/nav/solutions/wallet.inline.svg";
import WalletLearnIcon from "./assets/nav/learn/wallet.inline.svg";
import DocumentsIcon from "./assets/nav/learn/documents.inline.svg";
import EducationIcon from "./assets/nav/learn/education.inline.svg";
import TradingViewIcon from "./assets/nav/learn/trading-view.inline.svg";
import ApiConnectionNetworkIcon from "./assets/nav/network/api-connection.inline.svg";
import BezierIcon from "./assets/nav/network/bezier.inline.svg";
import ExplorerIcon from "./assets/nav/network/explorer.inline.svg";
import PulseIcon from "./assets/nav/network/pulse.inline.svg";
import SolScanIcon from "./assets/nav/network/sol-scan.inline.svg";
import OkxIcon from "./assets/nav/network/okx.inline.svg";
import OrbIcon from "./assets/nav/network/orb.inline.svg";
import SwitchIcon from "./assets/nav/network/switch.inline.svg";
import NewspaperCommunityIcon from "./assets/nav/community/newspaper.inline.svg";
import CalendarIcon from "./assets/nav/community/calendar.inline.svg";
import FistbumpIcon from "./assets/nav/community/fistbump.inline.svg";
import GlobusIcon from "./assets/nav/community/globus.inline.svg";
import ScriptIcon from "./assets/nav/community/script.inline.svg";
import ApiConnectionCommunityIcon from "./assets/nav/community/api-connection.inline.svg";
import type { NavItemDefinition } from "./nav-types";

export const learnPrimaryItems: NavItemDefinition[] = [
  {
    id: "learn-wallet",
    titleKey: "nav.learn.start.items.wallet.title",
    descriptionKey: "nav.learn.start.items.wallet.description",
    href: "/learn/what-is-a-wallet",
    icon: WalletLearnIcon,
    variant: "large",
  },
  {
    id: "learn-defi",
    titleKey: "nav.learn.start.items.defi.title",
    descriptionKey: "nav.learn.start.items.defi.description",
    href: "/learn/introduction-to-defi-on-solana",
    icon: TradingViewIcon,
    variant: "large",
  },
  {
    id: "learn-universities",
    titleKey: "nav.learn.start.items.universities.title",
    descriptionKey: "nav.learn.start.items.universities.description",
    href: "/universities",
    icon: EducationIcon,
    variant: "large",
  },
  {
    id: "learn-all",
    titleKey: "nav.learn.start.items.all.title",
    descriptionKey: "nav.learn.start.items.all.description",
    href: "/learn",
    icon: DocumentsIcon,
    variant: "large",
  },
];

export const buildPrimaryItems: NavItemDefinition[] = [
  {
    id: "build-docs",
    titleKey: "nav.developers.items.docs.title",
    descriptionKey: "nav.developers.items.docs.description",
    href: "/docs",
    icon: NewspaperIcon,
    variant: "large",
  },
  {
    id: "build-api",
    titleKey: "nav.developers.items.api.title",
    descriptionKey: "nav.developers.items.api.description",
    href: "/docs/rpc",
    icon: ApiConnectionBuildIcon,
    variant: "large",
  },
  {
    id: "build-templates",
    titleKey: "nav.developers.items.templates.title",
    descriptionKey: "nav.developers.items.templates.description",
    href: "/developers/templates",
    icon: TemplatesIcon,
    variant: "large",
  },
  {
    id: "build-hub",
    titleKey: "nav.developers.items.hub.title",
    descriptionKey: "nav.developers.items.hub.description",
    href: "/developers",
    icon: SchoolIcon,
    variant: "large",
  },
  {
    id: "build-learn",
    titleKey: "developers.nav.courses",
    descriptionKey: "developers.courses.description",
    href: "/developers/learn",
    icon: SchoolIcon,
    variant: "large",
  },
];

export const buildTutorialItems: NavItemDefinition[] = [
  {
    id: "build-hello-world",
    titleKey: "nav.developers.tutorials.hello-world",
    href: "/docs/intro/quick-start",
    icon: HandIcon,
  },
  {
    id: "build-local-setup",
    titleKey: "nav.developers.tutorials.local-setup",
    href: "/docs/intro/installation",
    icon: MaintenanceIcon,
  },
  {
    id: "build-evm-to-svm",
    titleKey: "nav.developers.tutorials.evm-to-svm",
    href: "/developers/evm-to-svm",
    icon: EthereumIcon,
  },
];

export const solutionsToolsColumns: NavItemDefinition[][] = [
  [
    {
      id: "solutions-token-extensions",
      titleKey: "nav.solutions.tools.items.0.title",
      href: "/solutions/token-extensions",
      icon: CoinsIcon,
    },
    {
      id: "solutions-wallets",
      titleKey: "nav.solutions.tools.items.5.title",
      href: "/solana-wallets",
      icon: WalletSolutionsIcon,
    },
  ],
  [
    {
      id: "solutions-commerce-tooling",
      titleKey: "nav.solutions.tools.items.1.title",
      href: "/solutions/commerce-tooling",
      icon: StoreIcon,
    },
    {
      id: "solutions-financial-infrastructure",
      titleKey: "nav.solutions.tools.items.2.title",
      href: "/solutions/financial-infrastructure",
      icon: FlowIcon,
    },
  ],
  [
    {
      id: "solutions-digital-assets",
      titleKey: "nav.solutions.tools.items.3.title",
      href: "/solutions/digital-assets",
      icon: ContrastIcon,
    },
    {
      id: "solutions-real-world-assets",
      titleKey: "nav.solutions.tools.items.4.title",
      href: "/solutions/real-world-assets",
      icon: MallIcon,
    },
  ],
];

export const solutionsCasesColumns: NavItemDefinition[][] = [
  [
    {
      id: "solutions-tokenization",
      titleKey: "nav.solutions.cases.items.5.title",
      href: "/solutions/tokenization",
      icon: CoinsAddIcon,
    },
    {
      id: "solutions-depin",
      titleKey: "nav.solutions.cases.items.4.title",
      href: "/solutions/depin",
      icon: RootingIcon,
    },
    {
      id: "solutions-btcfi",
      titleKey: "nav.solutions.cases.items.6.title",
      href: "/solutions/btcfi",
      icon: BitcoinIcon,
    },
    {
      id: "solutions-institutional-payments",
      titleKey: "nav.solutions.cases.items.7.title",
      href: "/solutions/institutional-payments",
      icon: BankIcon,
    },
    {
      id: "solutions-stablecoins",
      titleKey: "nav.solutions.cases.items.8.title",
      href: "/solutions/stablecoins",
      icon: CoinIcon,
    },
  ],
  [
    {
      id: "solutions-enterprise",
      titleKey: "nav.solutions.cases.items.1.title",
      href: "/solutions/enterprise",
      icon: BuildingsIcon,
    },
    {
      id: "solutions-financial-institutions",
      titleKey: "nav.solutions.cases.items.3.title",
      href: "/solutions/financial-institutions",
      icon: BankIcon,
    },
    {
      id: "solutions-ai",
      titleKey: "nav.solutions.cases.items.11.title",
      href: "/solutions/ai",
      icon: SparklesIcon,
    },
    {
      id: "solutions-sdp",
      titleKey: "nav.solutions.cases.items.13.title",
      href: "/solutions/sdp",
      icon: MaintenanceIcon,
    },
  ],
];

export const solutionsResourceItems: NavItemDefinition[] = [
  {
    id: "solutions-payments-org",
    titleKey: "nav.solutions.resources.items.0.title",
    href: "https://payments.org",
    icon: MoneyIcon,
    external: true,
  },
  {
    id: "solutions-launch",
    titleKey: "nav.solutions.resources.items.1.title",
    href: "https://launch.solana.com/",
    icon: RocketIcon,
    external: true,
  },
  {
    id: "solutions-mobile",
    titleKey: "nav.solutions.resources.items.2.title",
    href: "https://solanamobile.com/developers",
    icon: PhoneIcon,
    external: true,
  },
  {
    id: "solutions-tokens",
    titleKey: "nav.solutions.resources.items.3.title",
    href: "https://tokens.solana.com",
    icon: TokensIcon,
    external: true,
  },
];

export const networkResourceItems: NavItemDefinition[] = [
  {
    id: "network-validators",
    titleKey: "nav.network.resources.items.0.title",
    descriptionKey: "nav.network.resources.items.0.description",
    href: "/validators",
    icon: BezierIcon,
    variant: "large",
  },
  {
    id: "network-rpc",
    titleKey: "nav.network.resources.items.1.title",
    descriptionKey: "nav.network.resources.items.1.description",
    href: "/rpc",
    icon: ApiConnectionNetworkIcon,
    variant: "large",
  },
  {
    id: "network-status",
    titleKey: "nav.network.resources.items.2.title",
    descriptionKey: "nav.network.resources.items.2.description",
    href: "https://status.solana.com/",
    icon: PulseIcon,
    variant: "large",
    external: true,
  },
  {
    id: "network-ramp",
    titleKey: "nav.network.resources.items.3.title",
    descriptionKey: "nav.network.resources.items.3.description",
    href: "/solanaramp",
    icon: SwitchIcon,
    variant: "large",
  },
];

export const networkInspectItems: NavItemDefinition[] = [
  {
    id: "network-solscan",
    titleKey: "nav.network.inspect.items.0.title",
    href: "https://solscan.io/",
    icon: SolScanIcon,
    external: true,
  },
  {
    id: "network-explorer",
    titleKey: "nav.network.inspect.items.1.title",
    href: "https://explorer.solana.com/",
    icon: ExplorerIcon,
    external: true,
  },
  {
    id: "network-orb",
    titleKey: "nav.network.inspect.items.2.title",
    href: "https://orbmarkets.io/",
    icon: OrbIcon,
    external: true,
  },
  {
    id: "network-okx",
    titleKey: "nav.network.inspect.items.3.title",
    href: "https://web3.okx.com/explorer/solana",
    icon: OkxIcon,
    external: true,
  },
];

export const communityInvolvedItems: NavItemDefinition[] = [
  {
    id: "community-news",
    titleKey: "nav.community.involved.items.0.title",
    href: "/news",
    icon: NewspaperCommunityIcon,
    partiallyActive: true,
  },
  {
    id: "community-podcasts",
    titleKey: "nav.community.involved.items.1.title",
    href: "/podcasts",
    icon: ApiConnectionCommunityIcon,
    partiallyActive: true,
  },
  {
    id: "community-events",
    titleKey: "nav.community.involved.items.2.title",
    href: "/events",
    icon: CalendarIcon,
    partiallyActive: true,
  },
  {
    id: "community-main",
    titleKey: "nav.community.involved.items.4.title",
    href: "/community",
    icon: GlobusIcon,
    partiallyActive: true,
  },
  {
    id: "community-collective",
    titleKey: "nav.community.involved.items.3.title",
    descriptionKey: "nav.community.involved.items.3.description",
    href: "https://www.solanacollective.com/",
    icon: FistbumpIcon,
    variant: "large",
    external: true,
  },
  {
    id: "community-policy",
    titleKey: "nav.community.involved.items.5.title",
    descriptionKey: "nav.community.involved.items.5.description",
    href: "https://www.solanapolicyinstitute.org/",
    icon: ScriptIcon,
    variant: "large",
    external: true,
  },
];
