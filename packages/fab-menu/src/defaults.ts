import type { MenuData } from "./types";

export const DEFAULT_MENU_DATA: MenuData = {
  title: "Get Started",
  tabs: [
    { id: "institution", title: "Institution", icon: "bank" },
    { id: "user", title: "User", icon: "avatar" },
    { id: "developer", title: "Developer", icon: "code" },
  ],
  links: {
    institution: [
      { title: "Tokenize an asset", href: "/solutions/tokenization" },
      { title: "Issue a stablecoin", href: "/solutions/stablecoins" },
      {
        title: "Build a payment gateway",
        href: "/solutions/institutional-payments",
      },
      { title: "Manage payments", href: "/solutions/enterprise" },
    ],
    developer: [
      { title: "Learn Solana development", href: "/developers" },
      { title: "Quick start guide", href: "/docs/intro/quick-start" },
      { title: "Access Docs", href: "/solutions/real-world-assets" },
      { title: "Join a hackathon", href: "/events" },
    ],
    user: [
      { title: "Solana 101", href: "/learn/what-is-solana" },
      { title: "Find a wallet", href: "/wallets" },
      { title: "Stake your SOL", href: "/staking" },
      { title: "Find a job", href: "https://jobs.solana.com/jobs" },
    ],
  },
};

export const DEFAULT_API_URL = "https://solana.com/api/fab-menu";
