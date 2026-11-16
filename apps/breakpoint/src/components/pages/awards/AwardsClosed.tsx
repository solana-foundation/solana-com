"use client";

import { useTranslations } from "@workspace/i18n/client";
import Button from "@/components/Button";

export default function AwardsClosed() {
  const t = useTranslations("breakpoint.awards.closed");

  return (
    <section
      aria-labelledby="voting-title"
      className="bg-background-primary pb-3xl pt-2xl md:pb-4xl md:pt-3xl"
      id="voting"
    >
      <div className="container mx-auto grid gap-m border-t border-stroke-primary pt-m md:grid-cols-bp-desktop md:gap-x-s md:pt-l">
        <p className="type-eyebrow text-core-purple md:col-span-4">
          {t("eyebrow")}
        </p>
        <div className="flex flex-col items-start gap-m md:col-span-9 md:col-start-7">
          <h2 className="type-h3" id="voting-title">
            {t("headline")}
          </h2>
          <p className="max-w-[620px] text-p-large text-text-secondary">
            {t("thankYou")}
          </p>
          <Button disabled label={t("cta")} />
        </div>
      </div>
    </section>
  );
}
