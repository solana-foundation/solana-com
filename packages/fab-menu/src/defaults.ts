import type { MenuData } from "./types";

export const DEFAULT_MENU_DATA: MenuData = {
  title: "Explore Solana",
  tabs: [
    { id: "builder", title: "Builder", icon: "builder" },
    { id: "business", title: "Business", icon: "business" },
    { id: "consumer", title: "Consumer", icon: "consumer" },
  ],
  featured: {
    builder: {
      label: "Quickstart",
      title: "Create and run your first Solana project",
      ctaText: "Read the quickstart",
      ctaHref: "/docs/intro/quick-start",
    },
    business: {
      label: "Enterprise",
      title: "Build financial infrastructure on Solana",
      ctaText: "View enterprise solutions",
      ctaHref: "/solutions/enterprise",
    },
    consumer: {
      label: "Start here",
      title: "What is Solana?",
      ctaText: "Read the guide",
      ctaHref: "/learn/what-is-solana",
    },
  },
  stats: {
    builder: { value: "3,000+", label: "Monthly active developers" },
    business: { value: "$15B", label: "Stablecoin supply" },
    consumer: { value: "2.5M+", label: "Daily active wallets" },
  },
  links: {
    builder: [
      { title: "Docs", href: "/docs" },
      { title: "Cookbook", href: "/developers/cookbook" },
      { title: "Templates", href: "/developers/templates" },
      { title: "Developer hub", href: "/developers" },
      { title: "Chain migration", href: "/developers/migrate-to-solana" },
      { title: "RPC docs", href: "/docs/rpc" },
    ],
    business: [
      { title: "Stablecoins", href: "/solutions/stablecoins" },
      { title: "Tokenization", href: "/solutions/tokenization" },
      {
        title: "Institutional payments",
        href: "/solutions/institutional-payments",
      },
      { title: "Real-world assets", href: "/solutions/real-world-assets" },
      {
        title: "Financial infrastructure",
        href: "/solutions/financial-infrastructure",
      },
      {
        title: "Financial institutions",
        href: "/solutions/financial-institutions",
      },
    ],
    consumer: [
      { title: "Learn the basics", href: "/learn" },
      { title: "Wallets", href: "/wallets" },
      { title: "Staking", href: "/staking" },
      {
        title: "Introduction to DeFi",
        href: "/learn/introduction-to-defi-on-solana",
      },
      { title: "Events", href: "/events" },
      { title: "Community", href: "/community" },
    ],
  },
  promo: {
    badge: "Event",
    text: "BLDR Epoch//01 — San Francisco, March 9–10, 2027",
    href: "/builder",
  },
  searchUrl: "https://solana.com",
};

export const DEFAULT_API_URL = "https://solana.com/api/fab-menu";
