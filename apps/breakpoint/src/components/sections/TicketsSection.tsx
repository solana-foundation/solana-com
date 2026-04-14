"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function TicketsSection() {
  const t = useTranslations("breakpoint");

  return (
    <section className="mx-auto w-full max-w-[1920px] px-5 py-20 md:px-8 md:py-[120px]">
      <div className="max-w-[1376px]">
        <div className="flex max-w-[680px] flex-col gap-4">
          <span className="font-mono text-[0.9375rem] uppercase tracking-[0.09em] text-white/68">
            {t("tickets.eyebrow")}
          </span>
          <h2 className="font-sans text-[2.25rem] leading-[1] tracking-[-0.04em] text-white md:text-[4rem]">
            {t("tickets.headline")}
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card
            variant="ticket"
            heading={t("tickets.categories.general.label")}
            price={t("tickets.categories.general.price")}
          />
          <Card
            variant="ticket"
            heading={t("tickets.categories.developers.label")}
            price={t("tickets.categories.developers.price")}
          />
          <Card
            variant="ticket"
            heading={t("tickets.categories.students.label")}
            price={t("tickets.categories.students.price")}
          />
        </div>

        <div className="relative mt-6 overflow-hidden border border-white/15 bg-[#140d1f]">
          <div className="absolute inset-y-0 right-0 hidden w-[44%] md:block">
            <img
              src="/img/tower-bridge.png"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center opacity-40 mix-blend-screen"
            />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(171,102,253,0.38),transparent_32%),linear-gradient(90deg,rgba(5,3,10,0.96)_0%,rgba(20,13,31,0.72)_62%,rgba(20,13,31,0.2)_100%)]" />
          <div className="relative z-10 flex min-h-[251px] flex-col justify-between gap-8 p-6 md:max-w-[58%] md:p-8">
            <div className="space-y-4">
              <span className="font-mono text-[0.9375rem] uppercase tracking-[0.09em] text-purple">
                London 2026
              </span>
              <p className="max-w-[24ch] font-sans text-[1.75rem] leading-[1.05] tracking-[-0.04em] text-white md:text-[2.5rem]">
                Three days of launches, internet capital markets, and the
                builders shaping what comes next.
              </p>
            </div>
            <div>
              <Button label={t("tickets.cta")} variant="secondary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
