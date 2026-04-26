"use client";

import React from "react";
import { useTranslations } from "@workspace/i18n/client";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function TicketsSection() {
  const t = useTranslations("breakpoint");

  return (
    <section className="bg-black pt-20 md:pt-[120px]">
      <div className="md:container flex flex-col gap-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="font-mono !text-[16px] uppercase !leading-[1.3] !tracking-[0.08em] !text-white">
            {t("tickets.eyebrow")}
          </p>
          <h2 className="font-sans !text-[32px] !leading-[1.15] !tracking-[-0.02em] !text-white md:!text-[48px]">
            {t("tickets.headline")}
          </h2>
        </div>

        <div className="container flex flex-col gap-6 md:!max-w-none md:px-0 md:grid md:grid-cols-3">
          <Card
            variant="ticket"
            heading={t("tickets.categories.general.label")}
            price={t("tickets.categories.general.price")}
            ctaLabel={t("tickets.categories.general.ctaLabel")}
            href={t("tickets.categories.general.href")}
          />
          <Card
            variant="ticket"
            heading={t("tickets.categories.developers.label")}
            price={t("tickets.categories.developers.price")}
            ctaLabel={t("tickets.categories.developers.ctaLabel")}
            href={t("tickets.categories.developers.href")}
          />
          <Card
            variant="ticket"
            heading={t("tickets.categories.students.label")}
            price={t("tickets.categories.students.price")}
            ctaLabel={t("tickets.categories.students.ctaLabel")}
            href={t("tickets.categories.students.href")}
          />
        </div>

        <div className="flex flex-col gap-8 bg-[#1e1e1e] px-m py-2xl md:flex-row md:items-end md:justify-between md:gap-10 md:p-20">
          <div className="flex flex-col gap-4">
            <p className="font-mono !text-[16px] uppercase !leading-[1.3] !tracking-[0.08em] !text-white">
              {t("participate.eyebrow")}
            </p>
            <h3 className="font-sans !text-[28px] !leading-[1.15] !tracking-[-0.02em] !text-white md:!text-[40px]">
              {t("participate.headline")}
            </h3>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button
              label={t("participate.actions.sponsor.label")}
              variant="primary"
              arrow
              href={t("participate.actions.sponsor.href")}
            />
            {/* <Button
              label={t("participate.actions.speaker.label")}
              variant="secondary"
              arrow
            /> */}
          </div>
        </div>
      </div>
    </section>
  );
}
