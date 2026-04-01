import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const EXPLORE_MENU = {
  title: "Explore Solana",
  tabs: [
    { id: "builder", title: "Builder", icon: "builder" },
    { id: "business", title: "Business", icon: "business" },
    { id: "consumer", title: "Consumer", icon: "consumer" },
  ],
  featured: {
    builder: {
      label: "Quick Start",
      title: "Start building on Solana",
      ctaText: "Quick Start Guide",
      ctaHref: "/docs/intro/quick-start",
    },
    business: {
      label: "Network Dominance",
      title: "The leading network for stablecoins & institutional finance",
      ctaText: "Explore Solutions",
      ctaHref: "/solutions/stablecoins",
    },
    consumer: {
      label: "Start Here",
      title: "What is Solana?",
      ctaText: "Learn the Basics",
      ctaHref: "/learn/what-is-solana",
    },
  },
  stats: {
    builder: { value: "4,000+", label: "Active developers monthly" },
    business: { value: "$12B+", label: "Stablecoin supply" },
    consumer: { value: "100M+", label: "Active addresses" },
  },
  links: {
    builder: [
      { title: "Documentation", href: "/docs" },
      { title: "RPC API", href: "/docs/rpc" },
      { title: "Templates", href: "/developers/templates" },
      { title: "Developer Hub", href: "/developers" },
      { title: "EVM to SVM", href: "/developers/evm-to-svm" },
      { title: "Hackathons & Events", href: "/events" },
    ],
    business: [
      { title: "Stablecoins", href: "/solutions/stablecoins" },
      { title: "Tokenization", href: "/solutions/tokenization" },
      {
        title: "Institutional Payments",
        href: "/solutions/institutional-payments",
      },
      { title: "Enterprise", href: "/solutions/enterprise" },
      {
        title: "Financial Infrastructure",
        href: "/solutions/financial-infrastructure",
      },
      { title: "Real World Assets", href: "/solutions/real-world-assets" },
    ],
    consumer: [
      { title: "Learn Solana", href: "/learn" },
      { title: "Get a Wallet", href: "/wallets" },
      { title: "Stake SOL", href: "/staking" },
      {
        title: "Explore DeFi",
        href: "/learn/introduction-to-defi-on-solana",
      },
      { title: "Events", href: "/events" },
      { title: "Community", href: "/community" },
    ],
  },
  promo: {
    badge: "Event",
    text: "Solana Accelerate — Join the global builder summit",
    href: "/accelerate",
  },
  searchUrl: "https://solana.com",
};

function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
  };
}

export async function GET(_request: NextRequest) {
  return NextResponse.json(EXPLORE_MENU, { headers: getCorsHeaders() });
}

export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}
