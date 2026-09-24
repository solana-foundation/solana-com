"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { Button } from "@/app/components/ui/button";
import { Container } from "@/component-library/container";
import { SafeUnicornScene } from "@/components/shared/SafeUnicornScene";
import styles from "./delivery-vs-payment.module.css";

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
        <div className={styles.heroGlow} aria-hidden="true" />
        <SafeUnicornScene
          projectId="delivery-vs-payment-hero"
          className={styles.heroScene}
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
        <div className={styles.heroVeil} aria-hidden="true" />
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

      <section className="border-b border-nd-border-light py-16 md:py-24 xl:py-32">
        <Container>
          <div className="grid gap-10 xl:grid-cols-[0.72fr_1.28fr] xl:items-end">
            <div>
              <p className="font-brand-mono text-xs uppercase tracking-[0.2em] text-nd-mid-em-text">
                Virtual settlement
              </p>
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
              className={styles.virtualDemo}
              aria-live="polite"
            >
              <div className={styles.demoHeader}>
                <span>Trade DVP-2048</span>
                <span className={stage === 4 ? styles.complete : ""}>
                  {stage === 0
                    ? "Ready"
                    : stage === 4
                      ? "Settled"
                      : "In progress"}
                </span>
              </div>
              <div className={styles.rail} data-stage={stage}>
                <div className={styles.maker}>
                  <span className={styles.makerLabel}>Trade maker</span>
                  <strong>Settlement authority</strong>
                  <span className={styles.makerAction}>
                    Defines terms · authorizes finality
                  </span>
                </div>
                <span className={styles.makerLine} aria-hidden="true" />
                <div className={styles.leg}>
                  <span className={styles.party}>
                    <small>From</small>
                    Seller
                  </span>
                  <span className={styles.track}>
                    <span className={styles.line} />
                    <span className={`${styles.token} ${styles.asset}`}>
                      100 TBILL
                    </span>
                    <span className={styles.atomicPoint} aria-hidden="true" />
                  </span>
                  <span className={styles.destination}>
                    <small>Final owner</small>
                    Buyer
                  </span>
                </div>
                <div className={styles.leg}>
                  <span className={styles.party}>
                    <small>From</small>
                    Buyer
                  </span>
                  <span className={styles.track}>
                    <span className={styles.line} />
                    <span className={`${styles.token} ${styles.cash}`}>
                      10,000 dUSD
                    </span>
                    <span className={styles.atomicPoint} aria-hidden="true" />
                  </span>
                  <span className={styles.destination}>
                    <small>Final owner</small>
                    Seller
                  </span>
                </div>
              </div>
              <div className={styles.stepReadout}>
                <span className="font-brand-mono text-xs text-nd-mid-em-text">
                  {String(Math.max(stage, 1)).padStart(2, "0")} / 04
                </span>
                <div>
                  <strong>
                    {stage === 0
                      ? "Ready to define the trade"
                      : demoSteps[stage - 1].title}
                  </strong>
                  <p>
                    {stage === 0
                      ? "No network connection or wallet required."
                      : demoSteps[stage - 1].detail}
                  </p>
                </div>
                <button type="button" onClick={play}>
                  {stage === 0 ? "Start" : "Replay"}
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-nd-border-light py-16 md:py-24 xl:py-32">
        <Container>
          <p className="font-brand-mono text-xs uppercase tracking-[0.2em] text-nd-mid-em-text">
            How it works
          </p>
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

      <section className="py-16 md:py-24 xl:py-32">
        <Container>
          <div className="grid gap-10 md:grid-cols-[1.25fr_0.75fr] md:items-end">
            <div>
              <p className="font-brand-mono text-xs uppercase tracking-[0.2em] text-nd-mid-em-text">
                Open source · Audited by Cantina
              </p>
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
                className="inline-flex items-center gap-2 px-5 py-2 text-sm text-nd-mid-em-text hover:text-white"
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
                  <p className="font-brand-mono text-xs uppercase tracking-[0.2em] text-nd-mid-em-text">
                    Continue reading
                  </p>
                  <h3 className="nd-heading-s mt-4">
                    The rails around the trade.
                  </h3>
                </div>
                <div className={styles.relatedStories}>
                  {relatedStories.map((story) => (
                    <Link
                      className={styles.storyCard}
                      href={story.href}
                      key={story.href}
                    >
                      <span className={styles.storyEyebrow}>
                        {story.eyebrow}
                      </span>
                      <strong>{story.title}</strong>
                      <p>{story.description}</p>
                      <span className={styles.storyLink}>
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
