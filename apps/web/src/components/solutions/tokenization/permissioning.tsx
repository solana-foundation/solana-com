"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/utils";
import { PERMISSION_ATTRS } from "@/data/solutions/tokenization";
import { Eyebrow } from "./eyebrow";

const CTA1_HREF = "/reports/privacy-2026";
const CTA2_HREF = "/docs/tokens/extensions";

/**
 * Permissioning & privacy section: copy + CTAs alongside a sample tokenized
 * security card showing protocol-level compliance attributes.
 */
export const Permissioning = () => {
  const t = useTranslations("icm.permissioning");

  return (
    <section
      id="compliance"
      className="relative bg-black text-white text-left scroll-mt-24"
    >
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px]">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-16 items-center">
          {/* Copy */}
          <div>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2 className="mt-4 font-brand font-medium leading-[1.05] text-[32px] md:text-[44px] xl:text-[56px] tracking-[-1.28px] md:tracking-[-1.76px] xl:tracking-[-2.24px]">
              {t.rich("title", {
                br: () => <br />,
              })}
            </h2>
            <p className="mt-5 text-[#ABABBA] text-base md:text-lg leading-[1.55] max-w-xl">
              {t("description1")}
            </p>
            <p className="mt-4 text-[#ABABBA] text-base md:text-lg leading-[1.55] max-w-xl">
              {t("description2")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white text-black hover:!bg-white/90"
              >
                <a href={CTA1_HREF}>
                  {t("cta1")}
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/20 bg-transparent text-white hover:!bg-white/5"
              >
                <a href={CTA2_HREF}>{t("cta2")}</a>
              </Button>
            </div>
          </div>

          {/* Token attribute card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-medium leading-tight">
                  {t("card.name")}
                </div>
                <div className="mt-1 text-sm text-white/50">
                  {t("card.issuer")}
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-400 shrink-0">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                {t("card.statusLabel")}
              </span>
            </div>

            <ul className="mt-6 m-0 list-none p-0 divide-y divide-white/10">
              {PERMISSION_ATTRS.map(({ key, Icon, status }) => (
                <li
                  key={key}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <span className="inline-flex items-center gap-2.5 text-sm text-[#ABABBA]">
                    <Icon className="size-4 text-white/50" aria-hidden />
                    {t(`card.attrs.${key}.label`)}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-sm whitespace-nowrap",
                      status === "on" ? "text-emerald-400" : "text-white",
                    )}
                  >
                    {status === "on" && (
                      <span className="grid place-items-center size-4 rounded-full bg-emerald-400/15">
                        <Check className="size-2.5" aria-hidden />
                      </span>
                    )}
                    {t(`card.attrs.${key}.value`)}
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
