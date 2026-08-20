"use client";

import React from "react";
import { ArrowRight as ArrowRightIcon } from "@boxicons/react/ArrowRight";
import { useTranslations } from "@workspace/i18n/client";
import { Container } from "@/component-library/container";

const CARDS = [
  {
    key: "analysis",
    href: "/news/lowering-slot-time-and-validators-economic",
    accent: "#9945FF",
  },
  {
    key: "upgrade",
    href: "/upgrades/reduced-slot-times",
    accent: "#14F195",
  },
] as const;

export const LinksCta: React.FC = () => {
  const t = useTranslations("slot200.links");

  return (
    <section aria-labelledby="links-title">
      <Container className="py-14 md:py-20">
        <h2 id="links-title" className="nd-heading-l">
          {t.rich("title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
          })}
        </h2>

        <div className="mt-8 md:mt-10 grid md:grid-cols-2 gap-4 md:gap-5">
          {CARDS.map((card) => (
            <a
              key={card.key}
              href={card.href}
              className="group rounded-xl border border-nd-border-light bg-white/[0.02] p-6 md:p-8 flex flex-col gap-3 transition-colors hover:border-nd-border-hovered"
            >
              <div
                className="font-brand-mono text-[11px] md:text-xs uppercase tracking-[0.16em]"
                style={{ color: card.accent }}
              >
                {t(`cards.${card.key}.eyebrow`)}
              </div>
              <h3 className="nd-heading-s">{t(`cards.${card.key}.title`)}</h3>
              <p className="nd-body-m text-nd-mid-em-text">
                {t(`cards.${card.key}.description`)}
              </p>
              <span className="mt-auto pt-3 inline-flex items-center gap-2 nd-body-m text-nd-high-em-text">
                {t(`cards.${card.key}.cta`)}
                <ArrowRightIcon
                  aria-hidden
                  className="!size-[16px] transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </span>
            </a>
          ))}
        </div>

        <a
          href="/upgrades"
          className="group mt-6 inline-flex items-center gap-2 nd-body-m text-nd-mid-em-text hover:text-nd-high-em-text transition-colors"
        >
          {t("allUpgrades")}
          <ArrowRightIcon
            aria-hidden
            className="!size-[16px] transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </a>
      </Container>
    </section>
  );
};
