"use client";

import React from "react";
import { useTranslations } from "next-intl";
import SectionHeadline from "@/components/SectionHeadline";
import Button from "@/components/Button";

const GALLERY_PHOTOS = [
  "/img/gallery/photo-1.jpg",
  "/img/gallery/photo-2.jpg",
  "/img/gallery/photo-3.jpg",
  "/img/gallery/photo-4.jpg",
  "/img/gallery/photo-5.jpg",
  "/img/gallery/photo-6.jpg",
  "/img/gallery/photo-7.jpg",
];

export default function GallerySection() {
  const t = useTranslations("breakpoint");

  return (
    <section className="relative overflow-hidden py-2xl md:py-3xl">
      {/* Header */}
      <div className="flex items-end justify-between px-[20px] md:px-m">
        <SectionHeadline
          eyebrow={t("gallery.eyebrow")}
          headline={t("gallery.headline")}
          alignment="left"
        />
        <Button label={t("gallery.cta")} variant="secondary" />
      </div>

      {/* BREAKPOINT watermark */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 z-0 -translate-y-1/2 select-none whitespace-nowrap font-display text-[200px] uppercase tracking-wide text-neutral-800 opacity-50 md:text-[300px]"
        aria-hidden="true"
      >
        BREAKPOINT
      </div>

      {/* Photo carousel */}
      <div className="scrollbar-hidden relative z-10 mt-l flex gap-xs overflow-x-auto px-[20px] md:px-m">
        {GALLERY_PHOTOS.map((src, i) => (
          <div
            key={i}
            className="image-filter h-[300px] min-w-[300px] shrink-0 snap-start md:h-[400px] md:min-w-[400px]"
            style={{ "--tint": "#aa67fb" } as React.CSSProperties}
          >
            <img
              src={src}
              alt={`Breakpoint gallery photo ${i + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
