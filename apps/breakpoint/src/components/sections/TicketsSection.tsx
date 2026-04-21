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

        <div className="relative mt-6 overflow-hidden border border-white/15 bg-[#1e1e1e]">
          <div className="absolute inset-y-0 right-0 hidden w-[42%] md:block">
            <img
              src="/img/tower-bridge.png"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center opacity-35 mix-blend-screen"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,8,16,0.98)_0%,rgba(18,12,29,0.88)_58%,rgba(30,30,30,0.12)_100%)]" />
          <div className="relative z-10 flex min-h-[251px] flex-col justify-between gap-8 p-6 md:flex-row md:items-end md:gap-10 md:p-20">
            <div className="max-w-[38rem] space-y-6">
              <span className="font-mono text-[0.9375rem] uppercase tracking-[0.09em] text-white/72">
                {t("participate.eyebrow")}
              </span>
              <p className="max-w-[20ch] font-sans text-[2rem] leading-[1.05] tracking-[-0.035em] text-white md:text-[2.5rem]">
                {t("participate.headline")}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button label="Become a Sponsor" variant="primary" arrow />
              <Button label="Apply to Speak" variant="secondary" arrow />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
