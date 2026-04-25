"use client";
/**
 * Variant C: Bold Editorial
 * No component library in the hero — pure Tailwind. Very large display
 * headline, minimal decoration. Chain picker as two large full-width
 * tiles with strong colored left borders. Animation is more subtle —
 * the background image fades at the bottom into the dark page.
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

export function VariantC() {
  return (
    <div data-variant="C" className="tw-bg-nd-bg">
      {/* Hero — full bleed animation, minimal padding */}
      <section className="tw-relative tw-overflow-hidden tw-min-h-[55vh] tw-flex tw-items-end tw-border-b tw-border-nd-border-light">
        <UnicornScene
          projectId="vc-hero"
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
        {/* Fade from animation to black at the bottom */}
        <div className="tw-absolute tw-inset-x-0 tw-bottom-0 tw-h-40 tw-bg-gradient-to-b tw-from-transparent tw-to-nd-bg tw-z-10 tw-pointer-events-none" />

        <div className="tw-relative tw-z-20 tw-max-w-screen-xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-pt-32 tw-pb-20 tw-w-full">
          <p className="tw-text-xs tw-font-brand-mono tw-text-nd-highlight-lavendar tw-uppercase tw-tracking-widest tw-mb-6">
            {HERO.eyebrow}
          </p>
          <h1 className="tw-text-5xl md:tw-text-7xl lg:tw-text-8xl tw-font-brand tw-font-semibold tw-text-nd-high-em-text tw-leading-none tw-tracking-tight tw-mb-0">
            {HERO.headline}
          </h1>
        </div>
      </section>

      {/* Body + chain picker below the fold */}
      <div className="tw-max-w-screen-xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-pt-10 tw-pb-16">
        <p className="tw-text-nd-mid-em-text tw-text-xl tw-text-pretty tw-max-w-2xl tw-mb-16">
          {HERO.body}
        </p>

        {/* Chain picker — full-width editorial tiles */}
        <p className="tw-text-xs tw-font-brand-mono tw-text-nd-mid-em-text tw-uppercase tw-tracking-widest tw-mb-6">
          Where are you migrating from?
        </p>
        <div className="tw-flex tw-flex-col tw-gap-3">
          {CHAINS.map((chain, i) => {
            const borderColor =
              i === 0
                ? "tw-border-l-nd-highlight-lavendar"
                : "tw-border-l-nd-highlight-green";
            const labelColor =
              i === 0
                ? "tw-text-nd-highlight-lavendar"
                : "tw-text-nd-highlight-green";
            const btnColor =
              i === 0
                ? "tw-bg-nd-highlight-lavendar tw-text-black hover:tw-opacity-90"
                : "tw-bg-nd-highlight-green tw-text-black hover:tw-opacity-90";

            return (
              <div
                key={chain.title}
                className={`tw-flex tw-flex-col md:tw-flex-row md:tw-items-center tw-gap-6 tw-p-6 md:tw-p-8 tw-rounded-xl tw-border-l-4 tw-border tw-border-nd-border-light tw-bg-white/[0.02] ${borderColor}`}
              >
                <div className="tw-flex-1">
                  <p
                    className={`tw-text-xs tw-font-brand-mono tw-uppercase tw-tracking-widest tw-mb-2 ${labelColor}`}
                  >
                    {chain.eyebrow}
                  </p>
                  <p className="tw-font-brand tw-text-2xl tw-font-semibold tw-text-nd-high-em-text tw-mb-2">
                    {chain.title}
                  </p>
                  <p className="tw-text-nd-mid-em-text tw-text-sm tw-text-pretty tw-max-w-xl">
                    {chain.body}
                  </p>
                </div>
                <a
                  href={chain.url}
                  className={`tw-inline-flex tw-items-center tw-self-start md:tw-self-center tw-px-5 tw-py-2.5 tw-rounded-full tw-text-sm tw-font-brand tw-font-semibold tw-no-underline tw-shrink-0 tw-transition-opacity ${btnColor}`}
                >
                  {chain.cta}
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="tw-max-w-screen-xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8">
        <div className="tw-border-t tw-border-white/10" />
      </div>

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
