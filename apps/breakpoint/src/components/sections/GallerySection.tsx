"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";

export default function GallerySection() {
  const t = useTranslations("breakpoint");

  return (
    <section className="bg-black px-5 pt-20 md:px-8 md:pt-[120px]">
      <div className="mx-auto w-full max-w-[1376px]">
        <div
          className="image-filter relative aspect-[2/1] w-full overflow-hidden"
          style={{ "--tint": "#aa67fb" } as React.CSSProperties}
        >
          <img
            src="/img/gallery/photo-1.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-y-0 left-[4.6%] flex w-full max-w-[500px] flex-col justify-center gap-6">
            <p className="font-mono !text-[16px] uppercase !leading-[1.3] !tracking-[0.08em] !text-white">
              {t("gallery.eyebrow")}
            </p>
            <p className="font-sans !text-[32px] !leading-[1.15] !tracking-[-0.02em] !text-white md:!text-[48px]">
              {t("gallery.headline")}
            </p>
            <div>
              <Button label={t("gallery.cta")} variant="primary" arrow />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
