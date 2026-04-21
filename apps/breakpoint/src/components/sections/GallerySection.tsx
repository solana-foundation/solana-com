"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";

export default function GallerySection() {
  const t = useTranslations("breakpoint");

  return (
    <section className="relative overflow-hidden py-2xl md:py-3xl">
      <div
        className="pointer-events-none absolute left-0 top-1/2 z-0 -translate-y-1/2 select-none whitespace-nowrap font-display text-[200px] uppercase tracking-wide text-neutral-800 opacity-50 md:text-[300px]"
        aria-hidden="true"
      >
        BREAKPOINT
      </div>

      <div className="relative z-10 px-[20px] md:px-m">
        <div
          className="image-filter relative h-[420px] w-full overflow-hidden md:h-[600px]"
          style={{ "--tint": "#aa67fb" } as React.CSSProperties}
        >
          <img
            src="/img/gallery/photo-1.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
            <span className="font-mono text-[0.9375rem] uppercase tracking-[0.09em] text-white/80">
              {t("gallery.eyebrow")}
            </span>
            <div className="flex flex-col gap-6 md:max-w-[560px]">
              <h2 className="font-sans text-[2rem] leading-[1.05] tracking-[-0.035em] text-white md:text-[3rem]">
                {t("gallery.headline")}
              </h2>
              <div>
                <Button label={t("gallery.cta")} variant="primary" arrow />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
