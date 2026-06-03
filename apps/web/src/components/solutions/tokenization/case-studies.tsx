"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/app/components/utils";
import {
  CASE_STUDY_GROUPS,
  type CaseStudyGroupKey,
} from "@/data/solutions/tokenization";
import { Eyebrow } from "./eyebrow";

/**
 * Tabbed, fully-interactive case-study grid. Editorial copy is sourced from
 * `icm.caseStudies.*`; the active tab swaps which card set is rendered.
 */
export const CaseStudies = () => {
  const t = useTranslations("icm.caseStudies");
  const [activeTab, setActiveTab] = useState<CaseStudyGroupKey>(
    CASE_STUDY_GROUPS[0].key,
  );

  const activeGroup =
    CASE_STUDY_GROUPS.find((group) => group.key === activeTab) ??
    CASE_STUDY_GROUPS[0];

  return (
    <section
      id="cases"
      className="relative bg-black text-white text-left scroll-mt-24"
    >
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px]">
        <div className="max-w-2xl mb-[32px] xl:mb-[48px]">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="mt-4 font-brand font-medium leading-[1.1] text-[32px] md:text-[40px] xl:text-[64px] tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.56px]">
            {t("title")}
          </h2>
          <p className="mt-4 text-[#ABABBA] text-lg md:text-2xl tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
            {t("description")}
          </p>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label={t("title")}
          className="flex flex-wrap gap-2 md:gap-3 mb-8 xl:mb-12"
        >
          {CASE_STUDY_GROUPS.map((group) => {
            const isActive = group.key === activeTab;
            return (
              <button
                key={group.key}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setActiveTab(group.key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm md:text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CA9FF5]",
                  isActive
                    ? "border-white bg-white text-black"
                    : "border-white/15 text-[#ABABBA] hover:border-white/30 hover:text-white",
                )}
              >
                {t(`groups.${group.key}`)}
                <span
                  className={cn(
                    "text-xs",
                    isActive ? "text-black/50" : "text-white/40",
                  )}
                >
                  {group.cards.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeGroup.cards.map((cardKey) => (
            <article
              key={cardKey}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/20"
            >
              <span className="text-xs uppercase tracking-[0.08em] text-[#CA9FF5]">
                {t(`cards.${cardKey}.tag`)}
              </span>
              <h3 className="mt-3 text-xl md:text-2xl font-medium tracking-[-0.4px] leading-[1.2]">
                {t(`cards.${cardKey}.name`)}
              </h3>
              <p className="mt-3 text-[#ABABBA] text-base leading-[1.5]">
                {t(`cards.${cardKey}.description`)}
              </p>
              <div className="mt-6 pt-4 border-t border-white/10">
                <span className="text-sm text-white/70">
                  {t(`cards.${cardKey}.meta`)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
