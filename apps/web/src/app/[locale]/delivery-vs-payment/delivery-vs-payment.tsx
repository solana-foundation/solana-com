"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@workspace/i18n/client";
import { ArrowDown } from "@boxicons/react/ArrowDown";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { Check } from "@boxicons/react/Check";
import { Button as SharedButton } from "@workspace/ui/button";
import { Button } from "@/app/components/ui/button";
import { Container } from "@/component-library/container";
import { SafeUnicornScene } from "@/components/shared/SafeUnicornScene";
import jpmorganLogo from "../../../../../../packages/ecosystem-data/assets/companies/jpmorgan/logo-light.svg";

export type RelatedStory = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
};

const demoSteps = [
  {
    title: "Terms defined by maker",
    detail: "The maker records both sides of the trade",
  },
  { title: "Asset funded", detail: "Seller transfers TBILL to escrow" },
  { title: "Payment funded", detail: "Buyer transfers dUSD to escrow" },
  {
    title: "Settled atomically",
    detail: "The authority releases both legs in one transaction",
  },
];
const DEMO_STEP_DURATION_MS = 4000;

const eyebrowClass =
  "font-brand-mono text-xs uppercase tracking-[0.2em] text-nd-mid-em-text";
function VirtualTradeLeg({
  leg,
  stage,
  progress,
}: {
  leg: "asset" | "cash";
  stage: number;
  progress: number;
}) {
  const isAsset = leg === "asset";
  const quantity = isAsset ? "100" : "10,000";
  const symbol = isAsset ? "TBILL" : "dUSD";
  const funded = progress >= 100;
  const settled = stage === 4;
  const status = settled
    ? isAsset
      ? "Delivered to buyer"
      : "Paid to seller"
    : funded
      ? "Held in escrow"
      : progress > 0
        ? isAsset
          ? "Transfer in progress"
          : "Single transaction in progress"
        : stage > 0
          ? isAsset
            ? "Awaiting deposit"
            : "Awaiting payment"
          : "Awaiting trade";
  const color = isAsset ? "bg-nd-highlight-blue" : "bg-nd-highlight-green";

  return (
    <section
      aria-label={isAsset ? "Delivery leg" : "Payment leg"}
      className="rounded-2xl bg-white/[0.92] px-4 py-4 text-black sm:px-6 sm:py-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="m-0 text-[15px] font-normal tracking-[-0.02em]">
          {isAsset ? "Delivery" : "Payment"}
          <span className="ml-2 text-black/50">
            / Leg {isAsset ? "A" : "B"}
          </span>
        </h3>
        <span className="flex items-center gap-1 text-[11px] text-black/65">
          {funded && <Check className="!size-3.5" aria-hidden="true" />}
          {status}
        </span>
      </div>
      <div className="mt-3 grid items-center gap-x-6 gap-y-4 sm:grid-cols-2">
        <div className="flex items-baseline gap-2.5 whitespace-nowrap">
          <span className="text-[42px] leading-none tracking-[-0.065em] tabular-nums sm:text-[50px]">
            {quantity}
          </span>
          <span className="text-[15px] tracking-[-0.03em]">{symbol}</span>
        </div>
        <div>
          <div
            role="progressbar"
            aria-label={
              isAsset
                ? `${symbol} transfer timeline`
                : "Single payment transaction timeline"
            }
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-valuetext={`${Math.round(progress)}% of timeline elapsed · ${status}`}
            className="flex h-9 gap-1 sm:h-10"
          >
            {Array.from({ length: 24 }, (_, index) => (
              <span
                key={index}
                className="h-full min-w-0 flex-1 overflow-hidden rounded-full bg-black/[0.13]"
              >
                <span
                  className={`block h-full rounded-full transition-[width] duration-100 motion-reduce:transition-none ${color}`}
                  style={{
                    width: `${Math.max(0, Math.min(1, (progress / 100) * 24 - index)) * 100}%`,
                  }}
                />
              </span>
            ))}
          </div>
          <div className="mt-2 flex justify-between gap-2 font-brand-mono text-[10px] text-black/60">
            <span>{isAsset ? "Asset transfer" : "Single transaction"}</span>
            <span>
              {settled
                ? isAsset
                  ? "Delivered"
                  : "Paid"
                : funded
                  ? "In escrow"
                  : progress > 0
                    ? "Processing"
                    : "Awaiting"}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-black/[0.12] pt-3 text-[11px]">
        <span className={!funded ? "font-medium" : "text-black/55"}>
          {isAsset ? "Seller" : "Buyer"}
        </span>
        <ArrowRight className="!size-3 text-black/40" aria-hidden="true" />
        <span className={funded && !settled ? "font-medium" : "text-black/55"}>
          Escrow
        </span>
        <ArrowRight className="!size-3 text-black/40" aria-hidden="true" />
        <span className={settled ? "font-medium" : "text-black/55"}>
          {isAsset ? "Buyer" : "Seller"}
        </span>
      </div>
    </section>
  );
}

export function DeliveryVsPaymentPage({
  relatedStories,
}: {
  relatedStories: RelatedStory[];
}) {
  const [stage, setStage] = useState(0);
  const [legProgress, setLegProgress] = useState({ asset: 0, cash: 0 });
  const locale = useLocale();
  const [run, setRun] = useState(0);
  const virtualDemoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (run === 0) return;
    setStage(1);
    setLegProgress({ asset: 0, cash: 0 });
    const startedAt = performance.now();
    const timer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const nextStage = Math.min(
        4,
        Math.floor(elapsed / DEMO_STEP_DURATION_MS) + 1,
      );

      setStage(nextStage);
      setLegProgress({
        asset: Math.min(
          100,
          Math.max(
            0,
            ((elapsed - DEMO_STEP_DURATION_MS) / DEMO_STEP_DURATION_MS) * 100,
          ),
        ),
        cash: Math.min(
          100,
          Math.max(
            0,
            ((elapsed - DEMO_STEP_DURATION_MS * 2) / DEMO_STEP_DURATION_MS) *
              100,
          ),
        ),
      });

      if (nextStage === 4) window.clearInterval(timer);
    }, 50);

    return () => window.clearInterval(timer);
  }, [run]);

  const play = () => {
    setStage(0);
    setRun((value) => value + 1);
  };

  const selectStage = (nextStage: number) => {
    setRun(0);
    setStage(nextStage);
    setLegProgress({
      asset: nextStage >= 2 ? 100 : 0,
      cash: nextStage >= 3 ? 100 : 0,
    });
  };

  const playFromHero = () => {
    virtualDemoRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    play();
  };

  return (
    <main className="overflow-hidden bg-nd-bg text-nd-high-em-text">
      <section className="relative border-b border-nd-border-light bg-nd-inverse">
        <div
          className="absolute inset-0 opacity-[0.72] [background:radial-gradient(circle_at_78%_42%,rgba(20,241,149,0.12),transparent_7%),linear-gradient(118deg,transparent_58%,rgba(102,147,247,0.08)_58.1%,transparent_58.4%),linear-gradient(62deg,transparent_69%,rgba(85,233,171,0.08)_69.1%,transparent_69.4%)]"
          aria-hidden="true"
        />
        <SafeUnicornScene
          projectId="delivery-vs-payment-hero"
          className="!absolute inset-0 z-0 !h-full !w-full opacity-[0.82] motion-reduce:hidden"
          jsonFilePath="/src/img/solutions/defi/hero-bg.json"
          width="100%"
          height="100%"
          scale={1}
          fps={30}
          lazyLoad
          production
          fallback={null}
          onError={(error) => console.error("UnicornScene error:", error)}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.82)_72%,transparent),linear-gradient(0deg,rgba(0,0,0,0.55),transparent_55%)] sm:bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.88)_38%,transparent_76%),linear-gradient(0deg,rgba(0,0,0,0.55),transparent_55%)]"
          aria-hidden="true"
        />
        <Container className="relative z-10 flex min-h-[680px] flex-col justify-center py-20 md:min-h-[760px] md:py-28 xl:min-h-[820px]">
          <p className="mb-6 font-brand-mono text-xs uppercase tracking-[0.2em] text-nd-mid-em-text">
            Atomic settlement on Solana
          </p>
          <h1 className="nd-heading-2xl max-w-[1100px]">
            Delivery and payment.
            <br />
            <span className="font-light text-nd-mid-em-text">
              One transaction.
            </span>
          </h1>
          <p className="nd-body-xl mt-6 max-w-[620px] font-medium text-nd-mid-em-text md:mt-8">
            Exchange an asset and its payment together. Either both legs settle,
            or neither does.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 md:mt-[52px]">
            <Button
              onClick={playFromHero}
              className="h-12 rounded-full bg-nd-cta px-5 text-nd-inverse hover:bg-nd-primary/90"
              size="lg"
            >
              Play virtual settlement
              <span className="-mr-3 inline-flex size-8 items-center justify-center rounded-full bg-nd-inverse text-nd-cta">
                <ArrowDown className="!size-4" aria-hidden="true" />
              </span>
            </Button>
            <Button
              asChild
              className="h-12 rounded-full border border-nd-border-prominent bg-transparent px-5 text-white hover:bg-nd-border-light"
              size="lg"
            >
              <Link href="/delivery-vs-payment/demo">Run on devnet</Link>
            </Button>
          </div>
        </Container>
      </section>

      <section className="border-b border-nd-border-light">
        <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between md:py-8">
          <p className="font-brand-mono text-xs uppercase tracking-[0.16em] text-nd-mid-em-text">
            In partnership with
          </p>
          <div
            className="inline-flex items-center gap-3 text-white"
            aria-label="J.P. Morgan"
          >
            <Image
              src={jpmorganLogo}
              alt="J.P. Morgan"
              width={140}
              height={30}
              className="h-[30px] w-auto"
            />
          </div>
        </Container>
      </section>

      <section className="border-b border-nd-border-light py-16 md:py-24 xl:py-32">
        <Container>
          <div className="grid gap-10 xl:grid-cols-[0.72fr_1.28fr] xl:items-end">
            <div>
              <p className={eyebrowClass}>Virtual settlement</p>
              <h2 className="nd-heading-l mt-5 max-w-[570px]">
                See both sides move together.
              </h2>
              <p className="nd-body-l mt-5 max-w-[500px] text-nd-mid-em-text">
                This illustration is local to your browser. The in-depth demo
                runs the same flow with real accounts and transactions on
                devnet.
              </p>
            </div>

            <div
              ref={virtualDemoRef}
              role="region"
              aria-label="Virtual settlement"
              className="min-w-0 overflow-hidden rounded-2xl border border-nd-border-light bg-white/[0.025] font-brand"
            >
              <div className="flex items-center justify-between gap-4 border-b border-nd-border-light px-4 py-4 sm:px-5">
                <span className="font-brand-mono text-[10px] uppercase tracking-[0.12em] text-nd-mid-em-text">
                  Trade DVP-2048
                </span>
                <span
                  role="status"
                  className={`flex items-center gap-2 text-[11px] ${stage === 4 ? "text-nd-highlight-green" : "text-nd-mid-em-text"}`}
                >
                  <span
                    className={`size-1.5 rounded-full ${stage === 4 ? "bg-nd-highlight-green" : "bg-nd-mid-em-text"}`}
                    aria-hidden="true"
                  />
                  Virtual ·{" "}
                  {stage === 0
                    ? "Ready"
                    : stage === 4
                      ? "Settled"
                      : "In progress"}
                </span>
              </div>

              <div className="space-y-3 p-3 sm:p-4">
                <div className="grid grid-cols-2 gap-2 pb-1 sm:grid-cols-4">
                  {[
                    {
                      name: "Maker",
                      action: "Defines the terms",
                      step: 1,
                      dot: "bg-nd-highlight-lavendar",
                      active:
                        "border-nd-highlight-lavendar bg-nd-highlight-lavendar/[0.08]",
                    },
                    {
                      name: "Seller",
                      action: "Delivers TBILL",
                      step: 2,
                      dot: "bg-nd-highlight-blue",
                      active:
                        "border-nd-highlight-blue bg-nd-highlight-blue/[0.08]",
                    },
                    {
                      name: "Buyer",
                      action: "Pays dUSD",
                      step: 3,
                      dot: "bg-nd-highlight-green",
                      active:
                        "border-nd-highlight-green bg-nd-highlight-green/[0.08]",
                    },
                    {
                      name: "Authority",
                      action: "Settles both legs",
                      step: 4,
                      dot: "bg-nd-highlight-orange",
                      active:
                        "border-nd-highlight-orange bg-nd-highlight-orange/[0.08]",
                    },
                  ].map((party) => (
                    <button
                      type="button"
                      key={party.name}
                      onClick={() => selectStage(party.step)}
                      className={`min-w-0 rounded-xl border px-3 py-3 text-left font-[inherit] transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nd-highlight-green ${stage === party.step ? party.active : "border-nd-border-light bg-white/[0.025] hover:border-nd-border-prominent"}`}
                      aria-current={stage === party.step ? "step" : undefined}
                    >
                      <span className="flex items-center gap-1.5 text-xs">
                        <span
                          className={`size-1.5 shrink-0 rounded-full ${party.dot}`}
                          aria-hidden="true"
                        />
                        {party.name}
                      </span>
                      <span className="mt-1.5 block text-[10px] text-nd-mid-em-text">
                        {party.action}
                      </span>
                    </button>
                  ))}
                </div>

                <VirtualTradeLeg
                  leg="asset"
                  stage={stage}
                  progress={legProgress.asset}
                />
                <VirtualTradeLeg
                  leg="cash"
                  stage={stage}
                  progress={legProgress.cash}
                />
              </div>

              <div
                className={`border-t px-4 py-4 sm:px-5 ${stage === 4 ? "border-nd-highlight-green/30 bg-nd-highlight-green/[0.06]" : "border-nd-border-light"}`}
              >
                <div
                  role="group"
                  aria-label="Choose a settlement step"
                  className="mb-4 flex gap-1.5"
                >
                  {demoSteps.map((step, index) => (
                    <button
                      type="button"
                      key={step.title}
                      onClick={() => selectStage(index + 1)}
                      aria-label={`Step ${index + 1} of ${demoSteps.length}: ${step.title}`}
                      aria-current={stage === index + 1 ? "step" : undefined}
                      className="group h-5 flex-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-nd-highlight-green"
                    >
                      <span
                        className={`block h-1 rounded-full transition-colors duration-500 motion-reduce:transition-none ${stage > index ? "bg-nd-highlight-green" : "bg-white/15 group-hover:bg-white/35"}`}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div
                    className="flex min-w-0 flex-1 items-start gap-3"
                    aria-live="polite"
                  >
                    <span
                      className={`pt-0.5 font-brand-mono text-[11px] tabular-nums whitespace-nowrap ${stage === 4 ? "text-nd-highlight-green" : "text-nd-mid-em-text"}`}
                    >
                      {String(Math.max(stage, 1)).padStart(2, "0")} / 04
                    </span>
                    <div className="min-w-0">
                      <strong className="block text-sm font-normal tracking-[-0.02em]">
                        {stage === 0
                          ? "Ready to define the trade"
                          : demoSteps[stage - 1].title}
                      </strong>
                      <p className="mb-0 mt-1 text-xs leading-relaxed text-nd-mid-em-text">
                        {stage === 0
                          ? "No network connection or wallet required."
                          : demoSteps[stage - 1].detail}
                      </p>
                    </div>
                  </div>
                  <SharedButton
                    type="button"
                    size="lg"
                    onClick={play}
                    className="h-11 shrink-0 rounded-full !bg-white pl-5 pr-2 !text-black shadow-none hover:!bg-nd-highlight-green hover:!text-black focus-visible:border-nd-highlight-green focus-visible:ring-nd-highlight-green/40 max-sm:w-full"
                  >
                    {stage === 0 ? "Start" : "Replay"}
                    <span className="ml-3 grid size-7 place-items-center rounded-full bg-black text-white">
                      <ArrowRight className="!size-3.5" aria-hidden="true" />
                    </span>
                  </SharedButton>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-nd-border-light pt-6 sm:flex-row sm:items-center sm:justify-between xl:col-span-2 xl:mt-2">
              <p className="font-brand-mono text-xs uppercase tracking-[0.12em] text-nd-mid-em-text">
                Next: create and settle a real trade on Solana devnet.
              </p>
              <SharedButton
                asChild
                size="lg"
                className="h-12 rounded-full bg-nd-cta px-5 text-nd-inverse shadow-none hover:bg-nd-primary/90 focus-visible:border-nd-cta focus-visible:ring-nd-cta/40"
              >
                <Link href="/delivery-vs-payment/demo">
                  Open full devnet demo
                  <ArrowRight className="!size-4" aria-hidden="true" />
                </Link>
              </SharedButton>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-nd-border-light py-16 md:py-24 xl:py-32">
        <Container>
          <p className={eyebrowClass}>How it works</p>
          <div className="mt-8 divide-y divide-nd-border-light border-y border-nd-border-light">
            {[
              [
                "01",
                "Define the terms",
                "The parties, assets, amounts, authority, and expiry are recorded onchain.",
              ],
              [
                "02",
                "Fund each leg",
                "Each party funds its escrow with a standard token transfer from its existing " +
                  "wallet or custodian. No custom integration is required from a " +
                  "counterparty's wallet or custodian.",
              ],
              [
                "03",
                "Settle together",
                "The authority releases both legs in one atomic transaction—or the trade unwinds.",
              ],
            ].map(([number, title, copy]) => (
              <div
                className="grid gap-3 py-7 md:grid-cols-[80px_0.8fr_1.2fr] md:items-baseline md:gap-8 md:py-9"
                key={number}
              >
                <span className="font-brand-mono text-xs text-nd-mid-em-text">
                  {number}
                </span>
                <h3 className="nd-heading-s">{title}</h3>
                <p className="nd-body-m max-w-[590px] text-nd-mid-em-text">
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-nd-border-light py-16 md:py-24 xl:py-32">
        <Container>
          <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr] md:items-center">
            <div>
              <p className={eyebrowClass}>For developers</p>
              <h2 className="nd-heading-l mt-5 max-w-[610px]">
                Build the settlement flow from native primitives.
              </h2>
            </div>
            <div className="border border-nd-border-prominent bg-white/[0.03] p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-nd-border-light pb-4 font-brand-mono text-[10px] uppercase tracking-[0.12em] text-nd-mid-em-text">
                <span>DvP guide</span>
                <span>No custom Rust</span>
              </div>
              <p className="nd-body-l mt-5 max-w-[650px] text-nd-mid-em-text">
                Learn how to coordinate an atomic asset-and-payment exchange on
                Solana using token extensions, delegated authority, and standard
                transaction primitives.
              </p>
              <a
                href={`${locale === "en" ? "" : `/${locale}`}/docs/tokenization/dvp`}
                className="mt-7 inline-flex items-center gap-2 font-brand-mono text-xs uppercase tracking-[0.1em] text-white transition-colors hover:text-nd-highlight-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Read the DvP guide
                <ArrowUpRight className="!size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 xl:py-32">
        <Container>
          <div className="grid gap-10 md:grid-cols-[1.25fr_0.75fr] md:items-end">
            <div>
              <p className={eyebrowClass}>Open source · Audited by Cantina</p>
              <h2 className="nd-heading-l mt-5 max-w-[850px]">
                Inspect every account. Follow every transaction.
              </h2>
            </div>
            <div className="flex flex-col gap-3 md:items-start">
              <Button
                asChild
                className="h-12 rounded-full bg-nd-cta px-5 text-nd-inverse hover:bg-nd-primary/90"
                size="lg"
              >
                <Link href="/delivery-vs-payment/demo">
                  Run the devnet demo
                  <ArrowRight className="ml-2 !size-4" aria-hidden="true" />
                </Link>
              </Button>
              <a
                href="https://cantina.xyz/portfolio/fe870bb4-d96d-4902-8aec-9dfcfa2d6a79"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 text-sm text-nd-mid-em-text transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Review the audit
                <ArrowUpRight className="!size-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {relatedStories.length > 0 && (
            <div className="mt-16 border-t border-nd-border-light pt-8 md:mt-24 md:pt-10">
              <div className="grid gap-5 md:grid-cols-[0.75fr_2.25fr] md:gap-10">
                <div>
                  <p className={eyebrowClass}>Continue reading</p>
                  <h3 className="nd-heading-s mt-4">
                    The rails around the trade.
                  </h3>
                </div>
                <div className="grid border-t border-white/[0.12]">
                  {relatedStories.map((story) => (
                    <Link
                      className="group grid grid-cols-[minmax(120px,0.45fr)_1fr_1.05fr_max-content] items-baseline gap-5 border-b border-white/[0.12] py-[22px] text-white transition-colors motion-reduce:transition-none hover:border-nd-highlight-green/65 focus-visible:border-nd-highlight-green/65 focus-visible:outline-none max-sm:grid-cols-[1fr_max-content] max-sm:gap-x-4 max-sm:gap-y-2"
                      href={story.href}
                      key={story.href}
                    >
                      <span className="font-brand-mono text-[10px] uppercase tracking-[0.08em] text-[#ababba]">
                        {story.eyebrow}
                      </span>
                      <strong className="text-base font-medium leading-[1.35] max-sm:col-span-2">
                        {story.title}
                      </strong>
                      <p className="m-0 text-sm leading-[1.45] text-[#ababba] max-sm:col-span-2">
                        {story.description}
                      </p>
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] text-nd-highlight-green max-sm:col-start-2 max-sm:row-start-1">
                        Read story
                        <ArrowUpRight className="!size-4" aria-hidden="true" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
