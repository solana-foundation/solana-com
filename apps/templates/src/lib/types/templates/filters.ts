import { TemplateFilter } from "./types";

/**
 * Create filters with translations
 * @param t Translation function from next-intl
 */
export const createFilters = (t: (key: string) => string): TemplateFilter[] => [
  {
    id: "usecases",
    keywords: [
      {
        id: "starter",
        name: t("keywords.starter"),
      },
      {
        id: "backend",
        name: t("keywords.backend"),
      },
      {
        id: "mobile",
        name: t("keywords.mobile"),
      },
      {
        id: "payments",
        name: t("keywords.payments"),
      },
      {
        id: "airdrop",
        name: t("keywords.airdrop"),
      },
      {
        id: "auth",
        name: t("keywords.auth"),
      },
    ],
    name: t("categories.usecases"),
  },
  {
    id: "frameworks",
    keywords: [
      {
        id: "nextjs",
        name: t("keywords.nextjs"),
      },
      {
        id: "expo",
        name: t("keywords.expo"),
      },
      {
        id: "vite",
        name: t("keywords.vite"),
      },
      {
        id: "react",
        name: t("keywords.react"),
      },
      {
        id: "react-native",
        name: t("keywords.react_native"),
      },
      {
        id: "node",
        name: t("keywords.node"),
      },
      {
        id: "pinocchio",
        name: t("keywords.pinocchio"),
      },
    ],
    name: t("categories.frameworks"),
  },
  {
    id: "solana-sdks",
    keywords: [
      {
        id: "solana-kit",
        name: t("keywords.solana_kit"),
      },
      {
        id: "solana-web3js",
        name: t("keywords.solana_web3js"),
      },
    ],
    name: t("categories.solana_sdks"),
  },
  {
    id: "wallet-adapters",
    keywords: [
      {
        id: "wallet-ui",
        name: t("keywords.wallet_ui"),
      },
      {
        id: "mobile-wallet-adapter",
        name: t("keywords.mobile_wallet_adapter"),
      },
      {
        id: "wallet-adapter",
        name: t("keywords.wallet_adapter"),
      },
    ],
    name: t("categories.wallet_adapters"),
  },
];

// Export static filters for backward compatibility/standalone usage
export const filters: TemplateFilter[] = [
  {
    id: "usecases",
    keywords: [
      { id: "starter", name: "Starter" },
      { id: "backend", name: "Backend" },
      { id: "mobile", name: "Mobile" },
      { id: "payments", name: "Payments" },
      { id: "airdrop", name: "Airdrop" },
      { id: "auth", name: "Auth" },
    ],
    name: "Use Cases",
  },
  {
    id: "frameworks",
    keywords: [
      { id: "nextjs", name: "Next.js" },
      { id: "expo", name: "Expo" },
      { id: "vite", name: "Vite" },
      { id: "react", name: "React" },
      { id: "react-native", name: "React Native" },
      { id: "node", name: "Node" },
      { id: "pinocchio", name: "Pinocchio" },
    ],
    name: "Frameworks",
  },
  {
    id: "solana-sdks",
    keywords: [
      { id: "solana-kit", name: "@solana/kit" },
      { id: "solana-web3js", name: "@solana/web3.js" },
    ],
    name: "Solana SDKs",
  },
  {
    id: "wallet-adapters",
    keywords: [
      { id: "wallet-ui", name: "Wallet UI" },
      { id: "mobile-wallet-adapter", name: "Mobile Wallet Adapter" },
      { id: "wallet-adapter", name: "Wallet Adapter" },
    ],
    name: "Wallet Adapters",
  },
];
