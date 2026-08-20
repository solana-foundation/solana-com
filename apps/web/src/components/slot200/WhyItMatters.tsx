"use client";

import React from "react";
import { ArrowRight as ArrowRightIcon } from "@boxicons/react/ArrowRight";
import { useTranslations } from "@workspace/i18n/client";
import { Container } from "@/component-library/container";

const ANALYSIS_HREF = "/news/lowering-slot-time-and-validators-economic";

const CARD_KEYS = ["leader", "state", "opportunity"] as const;

/**
 * The case for the change — and its honest costs. Copy is grounded in the
 * Solana Foundation's economic analysis; the trade-offs panel exists on
 * purpose: staged activation is the story, not a caveat.
 */
export const WhyItMatters: React.FC = () => {
  const t = useTranslations("slot200.why");

  return (
    <section aria-labelledby="why-title">
      <Container className="py-14 md:py-20">
        <h2 id="why-title" className="nd-heading-l max-w-[760px]">
          {t.rich("title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
          })}
        </h2>

        <div className="mt-10 md:mt-12 grid md:grid-cols-3 gap-4 md:gap-5">
          {CARD_KEYS.map((key) => (
            <div
              key={key}
              className="rounded-xl border border-nd-border-light bg-white/[0.02] p-6 md:p-7 flex flex-col gap-3"
            >
              <div className="font-brand-mono text-[11px] md:text-xs uppercase tracking-[0.16em] text-solana-green">
                {t(`cards.${key}.eyebrow`)}
              </div>
              <h3 className="nd-heading-s">{t(`cards.${key}.title`)}</h3>
              <p className="nd-body-m text-nd-mid-em-text">
                {t(`cards.${key}.body`)}
              </p>
            </div>
          ))}
        </div>

        {/* the honest ledger */}
        <div className="mt-4 md:mt-5 rounded-xl border border-nd-highlight-orange/30 bg-nd-highlight-orange/[0.04] p-6 md:p-8">
          <div className="md:flex md:items-start md:justify-between md:gap-10">
            <div className="max-w-[720px]">
              <div className="font-brand-mono text-[11px] md:text-xs uppercase tracking-[0.16em] text-nd-highlight-orange">
                {t("tradeoffs.eyebrow")}
              </div>
              <h3 className="nd-heading-s mt-3">{t("tradeoffs.title")}</h3>
              <p className="nd-body-m text-nd-mid-em-text mt-3">
                {t("tradeoffs.body")}
              </p>
            </div>
            <a
              href={ANALYSIS_HREF}
              className="group mt-5 md:mt-1 inline-flex items-center gap-2 nd-body-m text-nd-high-em-text whitespace-nowrap underline underline-offset-4 decoration-nd-border-prominent hover:decoration-nd-border-hovered"
            >
              {t("tradeoffs.cta")}
              <ArrowRightIcon
                aria-hidden
                className="!size-[16px] transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>

        <p className="nd-body-s text-nd-mid-em-text mt-6 max-w-[820px]">
          {t("blockspaceNote")}
        </p>
      </Container>
    </section>
  );
};
