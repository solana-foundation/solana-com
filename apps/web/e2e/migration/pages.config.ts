/**
 * Configuration for all Builder.io pages to compare during migration.
 * Total: 40 pages across solutions, developers, and other categories.
 */

export interface PageConfig {
  route: string;
  name: string;
  category: "solutions" | "developers" | "other";
}

export const PAGES_TO_COMPARE: PageConfig[] = [
  // Solutions Pages (14)
  { route: "/solutions", name: "Solutions Index", category: "solutions" },
  {
    route: "/solutions/token-extensions",
    name: "Token Extensions",
    category: "solutions",
  },
  { route: "/solutions/actions", name: "Actions", category: "solutions" },
  {
    route: "/solutions/solana-permissioned-environments",
    name: "Solana Permissioned Environments",
    category: "solutions",
  },
  {
    route: "/solutions/games-tooling",
    name: "Games Tooling",
    category: "solutions",
  },
  {
    route: "/solutions/payments-tooling",
    name: "Payments Tooling",
    category: "solutions",
  },
  {
    route: "/solutions/commerce-tooling",
    name: "Commerce Tooling",
    category: "solutions",
  },
  {
    route: "/solutions/financial-infrastructure",
    name: "Financial Infrastructure",
    category: "solutions",
  },
  {
    route: "/solutions/digital-assets",
    name: "Digital Assets",
    category: "solutions",
  },
  {
    route: "/solutions/real-world-assets",
    name: "Real World Assets",
    category: "solutions",
  },
  {
    route: "/solutions/gaming-and-entertainment",
    name: "Gaming and Entertainment",
    category: "solutions",
  },
  {
    route: "/solutions/artists-creators",
    name: "Artists & Creators",
    category: "solutions",
  },
  {
    route: "/solutions/request-for-startups",
    name: "Request for Startups",
    category: "solutions",
  },
  {
    route: "/solutions/financial-institutions",
    name: "Financial Institutions",
    category: "solutions",
  },

  // Developer Pages (17)
  {
    route: "/developers/dao",
    name: "Developers - DAO",
    category: "developers",
  },
  {
    route: "/developers/defi",
    name: "Developers - DeFi",
    category: "developers",
  },
  {
    route: "/developers/gaming",
    name: "Developers - Gaming",
    category: "developers",
  },
  {
    route: "/developers/nfts",
    name: "Developers - NFTs",
    category: "developers",
  },
  {
    route: "/developers/payments",
    name: "Developers - Payments",
    category: "developers",
  },
  {
    route: "/developers/evm-to-svm",
    name: "EVM to SVM Index",
    category: "developers",
  },
  {
    route: "/developers/evm-to-svm/accounts",
    name: "EVM to SVM - Accounts",
    category: "developers",
  },
  {
    route: "/developers/evm-to-svm/client-differences",
    name: "EVM to SVM - Client Differences",
    category: "developers",
  },
  {
    route: "/developers/evm-to-svm/complete-guide",
    name: "EVM to SVM - Complete Guide",
    category: "developers",
  },
  {
    route: "/developers/evm-to-svm/consensus",
    name: "EVM to SVM - Consensus",
    category: "developers",
  },
  {
    route: "/developers/evm-to-svm/eip2612",
    name: "EVM to SVM - EIP2612",
    category: "developers",
  },
  {
    route: "/developers/evm-to-svm/erc20",
    name: "EVM to SVM - ERC20",
    category: "developers",
  },
  {
    route: "/developers/evm-to-svm/erc3643",
    name: "EVM to SVM - ERC3643",
    category: "developers",
  },
  {
    route: "/developers/evm-to-svm/erc4337",
    name: "EVM to SVM - ERC4337",
    category: "developers",
  },
  {
    route: "/developers/evm-to-svm/erc4626",
    name: "EVM to SVM - ERC4626",
    category: "developers",
  },
  {
    route: "/developers/evm-to-svm/erc721",
    name: "EVM to SVM - ERC721",
    category: "developers",
  },
  {
    route: "/developers/evm-to-svm/smart-contracts",
    name: "EVM to SVM - Smart Contracts",
    category: "developers",
  },

  // Other Pages (9)
  { route: "/rpc", name: "RPC", category: "other" },
  { route: "/tos", name: "Terms of Service", category: "other" },
  { route: "/privacy-policy", name: "Privacy Policy", category: "other" },
  { route: "/2024outlook", name: "2024 Outlook", category: "other" },
  { route: "/art-basel", name: "Art Basel", category: "other" },
  {
    route: "/community/report-2024-newsletter-sign-up",
    name: "2024 Report Newsletter Sign Up",
    category: "other",
  },
  { route: "/pyusd", name: "PYUSD", category: "other" },
  { route: "/research", name: "Research", category: "other" },
  { route: "/staking", name: "Staking", category: "other" },
  { route: "/wallets", name: "Wallets", category: "other" },
  {
    route: "/tokenized-equities",
    name: "Tokenized Equities",
    category: "other",
  },
];

export const PRODUCTION_BASE_URL = "https://solana.com";
export const LOCAL_BASE_URL = "http://localhost:3000";

export function getPagesByCategory(category: PageConfig["category"]) {
  return PAGES_TO_COMPARE.filter((page) => page.category === category);
}

export function getAllRoutes() {
  return PAGES_TO_COMPARE.map((page) => page.route);
}
