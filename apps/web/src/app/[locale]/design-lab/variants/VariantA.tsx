"use client";
/**
 * Variant A: Unified
 * Hero and chain picker collapse into one animated section — the choice is
 * visible without scrolling. Replaces the FeatureHighlight with custom
 * chain cards embedded directly in the hero.
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
    accent:
      "tw-border-nd-highlight-lavendar/30 hover:tw-border-nd-highlight-lavendar/70",
    dot: "tw-bg-nd-highlight-lavendar",
    label: "tw-text-nd-highlight-lavendar",
  },
  {
    accent:
      "tw-border-nd-highlight-green/30 hover:tw-border-nd-highlight-green/70",
    dot: "tw-bg-nd-highlight-green",
    label: "tw-text-nd-highlight-green",
  },
];

export function VariantA() {
  return (
    <div data-variant="A" className="tw-bg-nd-bg">
      {/* Unified hero + chain picker */}
      <section className="tw-relative tw-overflow-hidden tw-border-b tw-border-nd-border-light">
        <UnicornScene
          projectId="va-hero"
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

        <div className="tw-relative tw-z-10 tw-max-w-screen-xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-pt-20 tw-pb-16 md:tw-pt-32 md:tw-pb-24">
          <p className="tw-text-xs tw-font-brand-mono tw-text-nd-highlight-lavendar tw-uppercase tw-tracking-widest tw-mb-5">
            {HERO.eyebrow}
          </p>
          <h1 className="tw-text-4xl md:tw-text-5xl lg:tw-text-6xl tw-font-brand tw-font-semibold tw-text-nd-high-em-text tw-text-balance tw-leading-tight tw-mb-4 tw-max-w-2xl">
            {HERO.headline}
          </h1>
          <p className="tw-text-nd-mid-em-text tw-text-lg tw-text-pretty tw-max-w-lg tw-mb-12">
            {HERO.body}
          </p>

          {/* Chain picker embedded in hero */}
          <p className="tw-text-xs tw-font-brand-mono tw-text-nd-mid-em-text tw-uppercase tw-tracking-widest tw-mb-4">
            Where are you migrating from?
          </p>
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-max-w-3xl">
            {CHAINS.map((chain, i) => {
              const s = CHAIN_STYLES[i];
              return (
                <a
                  key={chain.title}
                  href={chain.url}
                  className={`tw-group tw-flex tw-flex-col tw-gap-4 tw-p-6 tw-rounded-2xl tw-border tw-bg-black/40 tw-backdrop-blur-sm tw-no-underline tw-transition-colors tw-duration-150 ${s.accent}`}
                >
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <span
                      className={`tw-size-2 tw-rounded-full tw-shrink-0 ${s.dot}`}
                    />
                    <span
                      className={`tw-text-xs tw-font-brand-mono tw-uppercase tw-tracking-widest ${s.label}`}
                    >
                      {chain.eyebrow}
                    </span>
                  </div>
                  <p className="tw-font-brand tw-text-xl tw-font-semibold tw-text-nd-high-em-text">
                    {chain.title}
                  </p>
                  <p className="tw-text-nd-mid-em-text tw-text-sm tw-text-pretty tw-flex-1">
                    {chain.body}
                  </p>
                  <span
                    className={`tw-text-sm tw-font-brand-mono tw-font-semibold ${s.label} tw-mt-auto`}
                  >
                    {chain.cta} →
                  </span>
                </a>
              );
            })}
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
