"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@workspace/ui";
import { ArrowUpRight } from "lucide-react";
import UnicornScene from "unicornstudio-react";

// Upgrade card data
const UPGRADES = [
  {
    id: "p-token",
    title: "Optimized Token Program",
    description:
      "Performance improvements and optimizations to the Token Program for faster and more efficient token interactions.",
    slug: "p-token",
    date: "Q2 2026",
    status: "Finalizing for Mainnet",
    gradient: "from-[#14F195] via-cyan-500 to-[#9945FF]",
  },
  {
    id: "larger-transactions",
    title: "Enabling Larger Transactions",
    description:
      "Expanding maximum transaction size to support more complex operations and batch processing in a single transaction.",
    slug: "larger-transaction-size",
    date: "Q2 2026",
    status: "Under Development",
    gradient: "from-[#9945FF] to-purple-500",
  },
  {
    id: "alpenglow",
    title: "Alpenglow",
    description:
      "A new consensus mechanism that improves network efficiency and reduces latency through optimized block production.",
    slug: "alpenglow",
    date: "Q3 2026",
    status: "Under Development",
    gradient: "from-[#14F195] to-[#9945FF]",
  },
  {
    id: "100m-compute-units",
    title: "100M Compute Units",
    description:
      "Increasing the compute budget to 100 million compute units per block, enabling more complex transactions and programs.",
    slug: "100m-compute-units",
    date: "Q2 2026",
    status: "Finalizing for Mainnet",
    gradient: "from-[#9945FF] to-[#14F195]",
  },

  {
    id: "xdp",
    title: "XDP",
    description:
      "Fair distribution of block rewards to validators based on their contribution to consensus and network security.",
    slug: "xdp-adoption",
    date: "Q2 2026",
    status: "Finalizing for Mainnet",
    gradient: "from-[#14F195] to-blue-500",
  },
  {
    id: "rent-reduction",
    title: "Rent Reduction",
    description:
      "Lowering account rent costs to make it more affordable to store data on-chain and reduce barriers to entry.",
    slug: "rent-reduction",
    date: "Q2 2026",
    status: "Under Development",
    gradient: "from-purple-500 to-[#14F195]",
  },
];

interface UpgradeCardProps {
  upgrade: (typeof UPGRADES)[0];
}

function UpgradeCard({ upgrade }: UpgradeCardProps) {
  const href = `/upgrades/${upgrade.slug}`;

  return (
    <Link
      href={href}
      className="flex flex-col gap-4 group hover:opacity-80 transition-all cursor-pointer pb-6 border-b border-white/10"
    >
      {/* Placeholder gradient image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${upgrade.gradient} opacity-20`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-24 h-24 rounded-full bg-gradient-to-br ${upgrade.gradient} opacity-40 blur-3xl`}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500">{upgrade.date}</span>
        <span className="text-xs px-2 py-1 rounded-full border border-white/20 text-white/70">
          {upgrade.status}
        </span>
      </div>
      <h3 className="text-xl font-semibold group-hover:underline text-white">
        {upgrade.title}
      </h3>
      <div className="text-gray-400 grow">
        <p>{upgrade.description}</p>
      </div>
      <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:underline w-fit text-[#14F195]">
        Learn more
        <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </span>
    </Link>
  );
}

function HeroBackground() {
  return (
    <UnicornScene
      className="!absolute inset-0 z-0"
      jsonFilePath="/src/img/solutions/icm/hero-bg.json"
      width="100%"
      height="100%"
      scale={1}
      dpi={typeof window !== "undefined" ? window.devicePixelRatio : 2}
      fps={30}
      lazyLoad={true}
      production={true}
      onError={(error) => console.error("UnicornScene error:", error)}
    />
  );
}

export function UpgradesPage() {
  return (
    <div className="bg-black text-white overflow-hidden">
      {/* Hero Section - matching /skills style */}
      <section className="relative overflow-hidden">
        <HeroBackground />
        <div className="relative z-10 max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px]">
          <div className="py-[64px] md:py-[112px] xl:py-[160px] flex flex-col gap-6">
            <span className="text-xs font-medium uppercase tracking-widest text-sky-300/80">
              Protocol Upgrades
            </span>
            <h1 className="font-brand font-medium text-[40px] md:text-[56px] xl:text-[88px] leading-[1.1] tracking-[-1.6px] md:tracking-[-2.24px] xl:tracking-[-3.52px]">
              Solana Upgrades
            </h1>
            <p className="text-[#ABABBA] max-w-2xl text-lg md:text-2xl tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
              Core protocol work being done to improve security, increase
              bandwidth, and reduce latency.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Button
                asChild
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-[#14F195] hover:bg-[#14F195]/10"
              >
                <Link
                  href="https://github.com/solana-foundation/solana-improvement-documents/tree/main/proposals"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>View Proposals</span>
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>

              <Button
                asChild
                className="inline-flex items-center gap-2 rounded-full border border-[#14F195] bg-[#14F195]/10 px-6 py-3 text-sm font-semibold text-[#14F195] transition-all hover:bg-[#14F195] hover:text-black"
              >
                <Link href="https://solanafoundation.typeform.com/solana-upgrades">
                  <span>Receive Updates</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Upgrades Grid Section - matching /news card style */}
      <section className="bg-black border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] py-16 md:py-24">
          <h2 className="mb-12 text-3xl md:text-4xl font-bold text-white">
            What upgrades are coming to Solana?
          </h2>

          {/* Grid matching news layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {UPGRADES.map((upgrade) => (
              <UpgradeCard key={upgrade.id} upgrade={upgrade} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
