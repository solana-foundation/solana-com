"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
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
    detail: "The settlement authority records both sides of the trade",
  },
  { title: "Asset funded", detail: "Seller transfers TBILL to escrow" },
  { title: "Payment funded", detail: "Buyer transfers dUSD to escrow" },
  { title: "Settled atomically", detail: "Both legs move in one transaction" },
];

const eyebrowClass =
  "font-brand-mono text-xs uppercase tracking-[0.2em] text-nd-mid-em-text";
const demoMonoClass =
  "font-brand-mono text-xs uppercase tracking-[0.08em] text-[#ababba]";
const transitionClass =
  "transition-[transform,left,box-shadow,background-color] duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

export function DeliveryVsPaymentPage({
  relatedStories,
}: {
  relatedStories: RelatedStory[];
}) {
  const [stage, setStage] = useState(0);
  const [run, setRun] = useState(0);
  const virtualDemoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (run === 0) return;
    setStage(1);
    const timers = [
      window.setTimeout(() => setStage(2), 2000),
      window.setTimeout(() => setStage(3), 4000),
      window.setTimeout(() => setStage(4), 6000),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [run]);

  const play = () => {
    setStage(0);
    setRun((value) => value + 1);
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
                <ArrowRight className="!size-4" aria-hidden="true" />
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
              className="overflow-hidden rounded-2xl border border-white/[0.2] bg-white/[0.025]"
              aria-live="polite"
            >
              <div
                className={`flex items-center justify-between gap-5 border-b border-white/[0.12] px-5 py-4 ${demoMonoClass}`}
              >
                <span>Trade DVP-2048</span>
                <span className={stage === 4 ? "text-nd-highlight-green" : ""}>
                  {stage === 0
                    ? "Ready"
                    : stage === 4
                      ? "Settled"
                      : "In progress"}
                </span>
              </div>
              <div className="relative grid gap-7 px-5 pb-10 pt-7 max-sm:gap-7 max-sm:px-4 max-sm:pb-[34px] max-sm:pt-[22px]">
                <div className="relative z-[2] mx-auto mb-2 grid w-full max-w-[510px] grid-cols-[max-content_1fr_max-content] items-center gap-3.5 rounded-[10px] border border-nd-border-prominent bg-[#0a0a0c] px-3.5 py-3 text-[13px] max-sm:grid-cols-1 max-sm:gap-[3px]">
                  <span className="font-brand-mono text-[10px] uppercase tracking-[0.08em] text-[#ababba]">
                    Trade maker
                  </span>
                  <strong className="font-medium">Settlement authority</strong>
                  <span className="text-right font-brand-mono text-[10px] uppercase tracking-[0.08em] text-[#ababba] max-sm:text-left">
                    Defines terms · authorizes finality
                  </span>
                </div>
                <span
                  className={`absolute bottom-0 left-1/2 top-[72px] w-px origin-top bg-gradient-to-b from-solana-purple to-nd-highlight-green opacity-75 ${transitionClass} ${stage > 0 ? "scale-y-100" : "scale-y-[0.12]"} max-sm:top-[104px]`}
                  aria-hidden="true"
                />
                <div className="grid grid-cols-[64px_minmax(160px,1fr)_72px] items-center gap-3.5 text-sm max-sm:grid-cols-[48px_minmax(130px,1fr)_52px] max-sm:gap-[9px]">
                  <span className="grid font-medium text-[#ababba]">
                    <small className="mb-0.5 font-brand-mono text-[9px] font-normal uppercase tracking-[0.08em] text-[#72727f]">
                      From
                    </small>
                    Seller
                  </span>
                  <span className="relative flex h-9 min-w-0 items-center">
                    <span
                      className={`h-px w-full origin-left bg-white/[0.32] ${transitionClass} ${stage >= 2 ? "scale-x-100" : "scale-x-[0.12]"}`}
                    />
                    <span
                      className={`absolute left-0 z-[2] rounded-full border border-current bg-black px-[11px] py-[7px] font-brand-mono text-xs whitespace-nowrap ${transitionClass} ${stage === 4 ? "left-full -translate-x-full" : "text-solana-blue"}`}
                    >
                      100 TBILL
                    </span>
                    <span
                      className={`absolute left-[68%] top-1/2 size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-black ${transitionClass} ${stage === 4 ? "bg-nd-highlight-green shadow-[0_0_0_8px_rgba(85,233,171,0.14),0_0_30px_rgba(85,233,171,0.5)]" : ""} max-sm:left-[70%]`}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="grid text-right font-medium text-[#ababba]">
                    <small className="mb-0.5 font-brand-mono text-[9px] font-normal uppercase tracking-[0.08em] text-[#72727f]">
                      Final owner
                    </small>
                    Buyer
                  </span>
                </div>
                <div className="grid grid-cols-[64px_minmax(160px,1fr)_72px] items-center gap-3.5 text-sm max-sm:grid-cols-[48px_minmax(130px,1fr)_52px] max-sm:gap-[9px]">
                  <span className="grid font-medium text-[#ababba]">
                    <small className="mb-0.5 font-brand-mono text-[9px] font-normal uppercase tracking-[0.08em] text-[#72727f]">
                      From
                    </small>
                    Buyer
                  </span>
                  <span className="relative flex h-9 min-w-0 items-center">
                    <span
                      className={`h-px w-full origin-left bg-white/[0.32] ${transitionClass} ${stage >= 3 ? "scale-x-100" : "scale-x-[0.12]"}`}
                    />
                    <span
                      className={`absolute left-0 z-[2] rounded-full border border-current bg-black px-[11px] py-[7px] font-brand-mono text-xs whitespace-nowrap ${transitionClass} ${stage === 4 ? "left-full -translate-x-full" : "text-nd-highlight-green"}`}
                    >
                      10,000 dUSD
                    </span>
                    <span
                      className={`absolute left-[68%] top-1/2 size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-black ${transitionClass} ${stage === 4 ? "bg-nd-highlight-green shadow-[0_0_0_8px_rgba(85,233,171,0.14),0_0_30px_rgba(85,233,171,0.5)]" : ""} max-sm:left-[70%]`}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="grid text-right font-medium text-[#ababba]">
                    <small className="mb-0.5 font-brand-mono text-[9px] font-normal uppercase tracking-[0.08em] text-[#72727f]">
                      Final owner
                    </small>
                    Seller
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-5 border-t border-white/[0.12] px-5 py-4 max-sm:flex-wrap max-sm:items-start">
                <span className="font-brand-mono text-xs text-nd-mid-em-text">
                  {String(Math.max(stage, 1)).padStart(2, "0")} / 04
                </span>
                <div className="flex-1 font-brand">
                  <strong className="block text-[15px] font-medium text-white">
                    {stage === 0
                      ? "Ready to define the trade"
                      : demoSteps[stage - 1].title}
                  </strong>
                  <p className="mt-0.5 text-[13px] text-[#ababba]">
                    {stage === 0
                      ? "No network connection or wallet required."
                      : demoSteps[stage - 1].detail}
                  </p>
                </div>
                <SharedButton
                  type="button"
                  size="lg"
                  onClick={play}
                  className="h-11 min-w-[120px] rounded-full bg-white px-6 text-black shadow-none hover:bg-white/90 hover:text-black focus-visible:border-white focus-visible:ring-white/40"
                >
                  {stage === 0 ? "Start" : "Replay"}
                </SharedButton>
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
                "Each party sends an ordinary token transfer to its escrow account.",
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
              <Link
                href="/docs/tokenization/dvp"
                className="mt-7 inline-flex items-center gap-2 font-brand-mono text-xs uppercase tracking-[0.1em] text-white transition-colors hover:text-nd-highlight-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Read the DvP guide
                <ArrowUpRight className="!size-4" aria-hidden="true" />
              </Link>
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
