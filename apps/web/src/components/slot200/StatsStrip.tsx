"use client";

import React from "react";
import { useTranslations } from "@workspace/i18n/client";
import { Container } from "@/component-library/container";

const STAT_KEYS = ["blocks", "leader", "daily", "steps"] as const;

export const StatsStrip: React.FC = () => {
  const t = useTranslations("slot200.stats");

  return (
    <section aria-label={t("ariaLabel")}>
      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-px bg-nd-border-light rounded-xl overflow-hidden border border-nd-border-light">
          {STAT_KEYS.map((key) => (
            <div
              key={key}
              className="bg-nd-inverse px-5 py-6 md:px-7 md:py-8 flex flex-col gap-2"
            >
              <span className="nd-heading-m text-nd-high-em-text tabular-nums">
                {t(`${key}.value`)}
              </span>
              <span className="nd-body-s text-nd-mid-em-text">
                {t(`${key}.label`)}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
