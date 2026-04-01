"use client";

import { Suspense } from "react";
import { VariantA } from "./variants/VariantA";
import { VariantB } from "./variants/VariantB";
import { VariantC } from "./variants/VariantC";
import { FeedbackOverlay } from "./FeedbackOverlay";

const VARIANTS = [
  {
    id: "A",
    label: "Unified",
    rationale:
      "Hero and chain picker collapse into one animated section — the choice is visible without scrolling. Cleaner, fewer sections.",
    Component: VariantA,
  },
  {
    id: "B",
    label: "Split Panel",
    rationale:
      "Two-column layout under the animation: left has headline + body + CTA buttons, right has the chain picker cards. Reads left-to-right.",
    Component: VariantB,
  },
  {
    id: "C",
    label: "Bold Editorial",
    rationale:
      "Display-size headline that bleeds into the animation. Chain picker as full-width editorial tiles with colored left borders. Typography-forward.",
    Component: VariantC,
  },
];

export default function DesignLabPage() {
  return (
    <div className="tw-min-h-dvh tw-bg-nd-bg tw-text-nd-high-em-text">
      <div className="tw-border-b tw-border-nd-border-light tw-bg-nd-bg tw-sticky tw-top-0 tw-z-40 tw-px-6 tw-py-4">
        <div className="tw-max-w-screen-xl tw-mx-auto tw-flex tw-items-center tw-justify-between tw-gap-4 tw-flex-wrap">
          <div>
            <p className="tw-text-xs tw-font-brand-mono tw-text-nd-highlight-lavendar tw-uppercase tw-tracking-widest tw-mb-0.5">
              Design Lab
            </p>
            <h1 className="tw-text-nd-high-em-text tw-font-brand tw-text-lg tw-font-semibold tw-mb-0">
              developers/migrate-to-solana — 3 variants
            </h1>
          </div>
          <p className="tw-text-nd-mid-em-text tw-text-sm tw-text-pretty tw-max-w-md">
            Use the{" "}
            <strong className="tw-text-nd-high-em-text">Rate variants</strong>{" "}
            button (bottom-right) to score each and paste feedback into chat.
          </p>
        </div>
      </div>

      {VARIANTS.map((v, i) => (
        <section
          key={v.id}
          className={i > 0 ? "tw-border-t-4 tw-border-nd-border-prominent" : ""}
        >
          <div className="tw-max-w-screen-xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-pt-10 tw-pb-4">
            <div className="tw-flex tw-items-start tw-gap-4">
              <span className="tw-inline-flex tw-size-8 tw-items-center tw-justify-center tw-rounded-full tw-bg-nd-highlight-lavendar tw-text-black tw-font-brand tw-font-bold tw-text-sm tw-shrink-0">
                {v.id}
              </span>
              <div>
                <h2 className="tw-text-nd-high-em-text tw-font-brand tw-text-xl tw-font-semibold tw-mb-1">
                  {v.label}
                </h2>
                <p className="tw-text-nd-mid-em-text tw-text-sm tw-text-pretty">
                  {v.rationale}
                </p>
              </div>
            </div>
          </div>
          <div className="tw-border tw-border-nd-border-light tw-rounded-xl tw-mx-4 sm:tw-mx-6 lg:tw-mx-8 tw-mb-4 tw-overflow-hidden">
            <Suspense
              fallback={
                <div className="tw-p-20 tw-text-center tw-text-nd-mid-em-text">
                  Loading...
                </div>
              }
            >
              <v.Component />
            </Suspense>
          </div>
        </section>
      ))}

      <div className="tw-h-24" />
      <FeedbackOverlay />
    </div>
  );
}
