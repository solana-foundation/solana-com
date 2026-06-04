"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Terminal } from "lucide-react";

const DOCS_HREF = "/docs";

/**
 * Compact developer call-to-action band linking engineers to the docs.
 */
export const DevBand = () => {
  const t = useTranslations("icm.devBand");

  return (
    <section className="relative z-10 bg-black text-white text-left">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] pb-[64px] md:pb-[80px]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="grid place-items-center size-11 rounded-xl bg-white/5 text-[#CA9FF5] shrink-0">
              <Terminal className="size-5" aria-hidden />
            </div>
            <div>
              <span className="block font-medium text-lg tracking-[-0.4px]">
                {t("title")}
              </span>
              <span className="block text-[#ABABBA] text-base leading-[1.4]">
                {t("subtitle")}
              </span>
            </div>
          </div>
          <a
            href={DOCS_HREF}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5 shrink-0"
          >
            <code className="font-mono text-[#ABABBA]">{t("codeLabel")}</code>
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
};
