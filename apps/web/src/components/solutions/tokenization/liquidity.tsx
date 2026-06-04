"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import {
  LIQUIDITY_CALLOUT_ICON,
  LIQUIDITY_PILLARS,
} from "@/data/solutions/tokenization";
import { Eyebrow } from "./eyebrow";

const STAT_KEYS = ["0", "1", "2", "3"] as const;
const FLOW_KEYS = ["0", "1", "2"] as const;
const CALLOUT_HREF = "https://kamino.com/borrow";

/**
 * Allocator / liquidity section: copy + stat grid, a "composability in
 * practice" callout with a flow diagram, and three liquidity pillars.
 */
export const Liquidity = () => {
  const t = useTranslations("icm.liquidity");
  const CalloutIcon = LIQUIDITY_CALLOUT_ICON;

  return (
    <section
      id="liquidity"
      className="relative bg-black text-white text-left scroll-mt-24"
    >
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px]">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-16 items-start">
          {/* Copy + stats */}
          <div>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h3 className="mt-4 font-brand font-medium leading-[1.1] text-[28px] md:text-[36px] xl:text-[48px] tracking-[-1.12px] md:tracking-[-1.44px] xl:tracking-[-1.92px]">
              {t("title")}
            </h3>
            <p className="mt-5 text-[#ABABBA] text-base md:text-lg leading-[1.55] max-w-xl">
              {t("description1")}
            </p>
            <p className="mt-4 text-[#ABABBA] text-base md:text-lg leading-[1.55] max-w-xl">
              {t("description2")}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
              {STAT_KEYS.map((key) => (
                <div key={key} className="flex flex-col bg-black p-5 md:p-6">
                  <dt className="order-2 mt-2 text-sm text-[#ABABBA] leading-snug">
                    {t(`stats.${key}.label`)}
                  </dt>
                  <dd className="order-1 text-3xl md:text-4xl font-light leading-none">
                    {t(`stats.${key}.value`)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Composability callout */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#CA9FF5]/[0.08] to-transparent p-6 md:p-8">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-[#CA9FF5]">
              <CalloutIcon className="size-4" aria-hidden />
              {t("callout.label")}
            </div>
            <h4 className="mt-4 text-xl md:text-2xl font-medium leading-[1.2] tracking-[-0.5px]">
              {t("callout.title")}
            </h4>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {FLOW_KEYS.map((key, index) => (
                <React.Fragment key={key}>
                  {index > 0 && (
                    <span className="text-white/30" aria-hidden>
                      →
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm">
                    {t(`flow.${key}.label`)}
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] text-white/60">
                      {t(`flow.${key}.badge`)}
                    </span>
                  </span>
                </React.Fragment>
              ))}
            </div>

            <p className="mt-6 text-[#ABABBA] text-base leading-[1.55]">
              {t("callout.body")}
            </p>
            <a
              href={CALLOUT_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-white underline underline-offset-4 hover:text-[#CA9FF5]"
            >
              {t("callout.cta")}
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          </div>
        </div>

        {/* Pillars */}
        <div className="mt-12 xl:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {LIQUIDITY_PILLARS.map(({ key, Icon }) => (
            <div
              key={key}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="grid place-items-center size-10 rounded-lg bg-white/5 text-[#CA9FF5]">
                <Icon className="size-5" aria-hidden />
              </div>
              <h4 className="mt-4 text-lg md:text-xl font-medium tracking-[-0.4px]">
                {t(`pillars.${key}.title`)}
              </h4>
              <p className="mt-2 text-[#ABABBA] text-base leading-[1.5] grow">
                {t(`pillars.${key}.body`)}
              </p>
              <div className="mt-5 pt-4 border-t border-white/10">
                <span className="block text-xs uppercase tracking-[0.06em] text-white/60">
                  {t(`pillars.${key}.partnersLabel`)}
                </span>
                <span className="mt-1 block text-sm text-white/70">
                  {t(`pillars.${key}.partners`)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
