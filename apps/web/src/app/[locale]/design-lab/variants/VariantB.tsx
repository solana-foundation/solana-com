"use client";
/**
 * Variant B: Split Panel
 * Two-column layout under the animated background: left has hero copy +
 * CTA buttons, right has the chain picker cards stacked vertically.
 * Reads left-to-right: context → decision → resources.
 */

import dynamic from "next/dynamic";
import Image from "next/image";
import { CardDeck, Heading } from "@solana-foundation/solana-lib";
import {
  HERO,
  CHAINS,
  RESOURCES_HEADING,
  RESOURCE_CARDS,
} from "./fixture-data";

const UnicornScene = dynamic(
  () => import("unicornstudio-react").then((m) => m.default),
  { ssr: false },
);

const CHAIN_STYLES = [
  {
    border:
      "tw-border-nd-highlight-lavendar/30 hover:tw-border-nd-highlight-lavendar/60",
    dot: "tw-bg-nd-highlight-lavendar",
    label: "tw-text-nd-highlight-lavendar",
    badge:
      "tw-bg-nd-highlight-lavendar/10 tw-text-nd-highlight-lavendar hover:tw-bg-nd-highlight-lavendar/20",
  },
  {
    border:
      "tw-border-nd-highlight-green/30 hover:tw-border-nd-highlight-green/60",
    dot: "tw-bg-nd-highlight-green",
    label: "tw-text-nd-highlight-green",
    badge:
      "tw-bg-nd-highlight-green/10 tw-text-nd-highlight-green hover:tw-bg-nd-highlight-green/20",
  },
];

export function VariantB() {
  return (
    <div data-variant="B" className="tw-bg-nd-bg">
      <section className="tw-relative tw-overflow-hidden tw-border-b tw-border-nd-border-light">
        <UnicornScene
          projectId="vb-hero"
          className="!tw-absolute tw-inset-0 tw-z-0"
          jsonFilePath="/src/img/index/hero-bg.json"
          width="100%"
          height="101%"
          scale={1}
          dpi={typeof window !== "undefined" ? window.devicePixelRatio : 2}
          fps={30}
          lazyLoad
          production
          placeholder={
            <Image
              className="!tw-absolute tw-inset-0 tw-z-0"
              src="/src/img/index/hero-bg.webp"
              alt=""
              fill
              sizes="150vw"
              style={{ objectFit: "cover" }}
            />
          }
          showPlaceholderOnError
          showPlaceholderWhileLoading
        />

        <div className="tw-relative tw-z-10 tw-max-w-screen-xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-py-20 md:tw-py-32">
          <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-12 lg:tw-gap-20 tw-items-center">
            {/* Left: hero copy */}
            <div>
              <p className="tw-text-xs tw-font-brand-mono tw-text-nd-highlight-lavendar tw-uppercase tw-tracking-widest tw-mb-5">
                {HERO.eyebrow}
              </p>
              <h1 className="tw-text-4xl md:tw-text-5xl tw-font-brand tw-font-semibold tw-text-nd-high-em-text tw-text-balance tw-leading-tight tw-mb-5">
                {HERO.headline}
              </h1>
              <p className="tw-text-nd-mid-em-text tw-text-lg tw-text-pretty tw-mb-8">
                {HERO.body}
              </p>
              <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-3">
                <a
                  href={CHAINS[0].url}
                  className="tw-inline-flex tw-items-center tw-justify-center tw-px-6 tw-py-3 tw-rounded-full tw-text-sm tw-font-brand tw-font-semibold tw-no-underline tw-bg-nd-cta tw-text-nd-on-cta-high-em-text tw-transition-opacity hover:tw-opacity-90"
                >
                  {CHAINS[0].cta}
                </a>
                <a
                  href={CHAINS[1].url}
                  className="tw-inline-flex tw-items-center tw-justify-center tw-px-6 tw-py-3 tw-rounded-full tw-text-sm tw-font-brand tw-font-semibold tw-no-underline tw-border tw-border-nd-border-prominent tw-text-nd-high-em-text tw-transition-opacity hover:tw-opacity-80"
                >
                  {CHAINS[1].cta}
                </a>
              </div>
            </div>

            {/* Right: chain picker */}
            <div className="tw-flex tw-flex-col tw-gap-4">
              {CHAINS.map((chain, i) => {
                const s = CHAIN_STYLES[i];
                return (
                  <a
                    key={chain.title}
                    href={chain.url}
                    className={`tw-flex tw-items-start tw-gap-5 tw-p-5 tw-rounded-xl tw-border tw-bg-black/50 tw-backdrop-blur-sm tw-no-underline tw-transition-colors tw-duration-150 ${s.border}`}
                  >
                    <div
                      className={`tw-mt-1.5 tw-size-3 tw-rounded-full tw-shrink-0 ${s.dot}`}
                    />
                    <div className="tw-flex-1">
                      <p
                        className={`tw-text-xs tw-font-brand-mono tw-uppercase tw-tracking-widest tw-mb-1 ${s.label}`}
                      >
                        {chain.eyebrow}
                      </p>
                      <p className="tw-font-brand tw-text-lg tw-font-semibold tw-text-nd-high-em-text tw-mb-2">
                        {chain.title}
                      </p>
                      <p className="tw-text-nd-mid-em-text tw-text-sm tw-text-pretty tw-mb-3">
                        {chain.body}
                      </p>
                      <span
                        className={`tw-inline-flex tw-items-center tw-px-3 tw-py-1.5 tw-rounded-full tw-text-xs tw-font-brand-mono tw-font-semibold tw-transition-colors ${s.badge}`}
                      >
                        {chain.cta} →
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <div className="tw-max-w-screen-xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-mt-12">
        <Heading
          eyebrow={RESOURCES_HEADING.eyebrow}
          headline={RESOURCES_HEADING.headline}
          body={RESOURCES_HEADING.body}
        />
      </div>
      <CardDeck
        cards={RESOURCE_CARDS as React.ComponentProps<typeof CardDeck>["cards"]}
        numCols={3}
        featured={true}
      />
    </div>
  );
}
