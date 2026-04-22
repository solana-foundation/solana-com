import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FeatureCard } from "@/lib/keystatic/feature-data";

function HeroSection() {
  return (
    <section className="border-b border-white/[0.06]">
      <div className="mx-auto max-w-[1200px] px-5 py-12 md:px-8 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-2xl">
            <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#CA9FF5]">
              Solana Upgrades
            </p>
            <h1 className="m-0 mt-3 font-sans text-[40px] font-medium leading-tight tracking-[-0.8px] text-white md:text-[56px] md:tracking-[-1.12px]">
              Core protocol work being done to improve security, increase
              bandwidth, and reduce latency.
            </h1>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-auto rounded-full border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-white hover:border-[#CA9FF5]/30 hover:bg-white/[0.06]"
            >
              <Link href="/news/solana-network-upgrades">Past upgrades</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="h-auto rounded-full bg-white px-4 py-2 text-[13px] font-medium text-black hover:bg-white/90"
            >
              <Link href="#upcoming">Learn more</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function IntroSection() {
  return (
    <section className="border-b border-white/[0.06]">
      <div className="mx-auto max-w-[1200px] px-5 py-12 md:grid md:grid-cols-2 md:gap-12 md:px-8 md:py-16">
        <div className="mb-8 md:mb-0">
          <h2 className="m-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#CA9FF5]">
            How Solana changes
          </h2>
          <p className="m-0 mt-3 text-[18px] font-medium leading-snug text-white md:text-[22px]">
            Protocol changes are proposed, reviewed, and implemented in the open
            — anyone can follow along.
          </p>
          <p className="m-0 mt-3 text-[14px] leading-relaxed text-[#8A8A9A]">
            These pages focus on the upgrades themselves: what they do, when
            they&rsquo;re expected, and why they matter.
          </p>
        </div>
        <div>
          <h2 className="m-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#CA9FF5]">
            Looking for the technical detail?
          </h2>
          <p className="m-0 mt-3 text-[18px] font-medium leading-snug text-white md:text-[22px]">
            Every upgrade starts as a Solana Improvement Document (SIMD) — a
            specification discussed and ratified by the validator community.
          </p>
          <p className="m-0 mt-3 text-[14px] leading-relaxed text-[#8A8A9A]">
            Browse the full SIMD index, filter by status, and track the
            proposals behind each upgrade.
          </p>
          <Link
            href="/upgrades/proposals"
            className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#CA9FF5] transition-colors hover:text-white"
          >
            Explore SIMD proposals
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: FeatureCard }) {
  const card = (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015] transition-all hover:border-[#CA9FF5]/25 hover:bg-white/[0.03]">
      {feature.heroImage ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={feature.heroImage}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="aspect-[16/10] w-full bg-gradient-to-br from-[#CA9FF5]/10 via-transparent to-white/[0.02]" />
      )}
      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#CA9FF5]">
            {feature.quarter}
          </span>
        </div>
        <h3 className="m-0 text-[20px] font-medium leading-tight tracking-[-0.3px] text-white">
          {feature.title}
        </h3>
        <p className="m-0 flex-1 text-[14px] leading-relaxed text-[#8A8A9A]">
          {feature.summary}
        </p>
        {feature.href ? (
          <span className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#CA9FF5] transition-colors group-hover:text-white">
            Read the proposal
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </div>
  );

  if (feature.href) {
    return (
      <Link href={feature.href} className="block">
        {card}
      </Link>
    );
  }

  return card;
}

function FeatureGrid({ features }: { features: FeatureCard[] }) {
  return (
    <section id="upcoming">
      <div className="mx-auto max-w-[1200px] px-5 py-12 md:px-8 md:py-20">
        <h2 className="m-0 max-w-3xl font-sans text-[28px] font-medium leading-tight tracking-[-0.56px] text-white md:text-[40px] md:tracking-[-0.8px]">
          What upgrades are coming to Solana?
        </h2>
        <p className="m-0 mt-3 max-w-2xl text-[14px] leading-relaxed text-[#8A8A9A]">
          Each card highlights a SIMD marked as featured by the editorial team.
          Ship windows come from the latest release note attached to the
          proposal.
        </p>
        {features.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.015] px-6 py-12 text-center">
            <p className="m-0 text-[14px] leading-relaxed text-[#8A8A9A]">
              No featured upgrades yet. Mark a SIMD as{" "}
              <code className="font-mono text-[#CA9FF5]">featured</code> in
              Keystatic to see it here.
            </p>
            <Link
              href="/upgrades/proposals"
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#CA9FF5] transition-colors hover:text-white"
            >
              Browse every SIMD
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.slug} feature={feature} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function UpgradesLanding({ features }: { features: FeatureCard[] }) {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <IntroSection />
      <FeatureGrid features={features} />
    </div>
  );
}
