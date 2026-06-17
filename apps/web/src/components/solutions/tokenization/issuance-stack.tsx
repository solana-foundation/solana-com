"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  ISSUANCE_PLATFORMS,
  TOKEN_STANDARDS,
} from "@/data/solutions/tokenization";
import { Eyebrow } from "./eyebrow";

/**
 * "Solutions & partners" section: two cards — issuance platforms (a grid of
 * partners by asset class) and the onchain token standards / infrastructure
 * that enforce compliance at the protocol layer.
 */
export const IssuanceStack = () => {
  const t = useTranslations("icm.issuance");

  return (
    <section
      id="solutions"
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Issuance platforms */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-medium tracking-[-0.5px]">
              {t("platforms.title")}
            </h3>
            <p className="mt-2 text-[#ABABBA] text-base leading-[1.5]">
              {t("platforms.sub")}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
              {ISSUANCE_PLATFORMS.map((key) => (
                <div key={key} className="bg-black p-4 md:p-5">
                  <div className="font-medium leading-tight">
                    {t(`platforms.items.${key}.name`)}
                  </div>
                  <div className="mt-1 text-sm text-white/50">
                    {t(`platforms.items.${key}.detail`)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Token standards */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-medium tracking-[-0.5px]">
              {t("standards.title")}
            </h3>
            <p className="mt-2 text-[#ABABBA] text-base leading-[1.5]">
              {t("standards.sub")}
            </p>
            <ul className="mt-6 m-0 list-none p-0 divide-y divide-white/10">
              {TOKEN_STANDARDS.map((key) => (
                <li
                  key={key}
                  className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 py-4"
                >
                  <span className="font-medium md:w-40 shrink-0">
                    {t(`standards.rows.${key}.name`)}
                  </span>
                  <span className="text-sm text-[#ABABBA] grow leading-[1.5]">
                    {t(`standards.rows.${key}.desc`)}
                  </span>
                  <span className="text-xs text-white/50 whitespace-nowrap shrink-0">
                    {t(`standards.rows.${key}.meta`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
