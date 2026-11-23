import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { formatMetricValue } from "@/lib/metrics/format";
import { loadMetrics } from "@/lib/metrics/loader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Registry figure behind each tab's stat, so the menu shows the same number
 * as the site. The values in EXPLORE_MENU are the fallback if the registry
 * cannot be read.
 */
const STAT_METRICS = {
  builder: "network.monthly-active-developers",
  business: "stablecoins.circulating-supply",
  consumer: "consumer.daily-active-wallets",
} as const;

const EXPLORE_MENU = {
  title: "Explore Solana",
  tabs: [
    { id: "business", title: "Business", icon: "business" },
    { id: "builder", title: "Builder", icon: "builder" },
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

function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
  };
}

async function getStats() {
  const tabs = Object.keys(STAT_METRICS) as (keyof typeof STAT_METRICS)[];
  try {
    const metrics = await loadMetrics(Object.values(STAT_METRICS));
    return Object.fromEntries(
      tabs.map((tab) => {
        const { value, definition } = metrics[STAT_METRICS[tab]];
        const { unit, display } = definition;
        const formatted = formatMetricValue(
          value,
          unit,
          "en",
          display?.suffix === "+",
        );
        return [
          tab,
          {
            ...EXPLORE_MENU.stats[tab],
            value: `${display?.prefix ?? ""}${formatted}${display?.suffix ?? ""}`,
          },
        ];
      }),
    );
  } catch {
    return EXPLORE_MENU.stats;
  }
}

export async function GET(_request: NextRequest) {
  return NextResponse.json(
    { ...EXPLORE_MENU, stats: await getStats() },
    { headers: getCorsHeaders() },
  );
}

export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}
