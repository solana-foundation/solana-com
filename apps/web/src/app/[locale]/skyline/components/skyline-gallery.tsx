"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/app/components/utils";
import Marquee from "@/component-library/marquee";
import { Container } from "@/component-library/container";
import type { SkylineGalleryImage } from "@/data/skyline";

type SkylineGalleryProps = {
  title: ReactNode;
  description: ReactNode;
  images: SkylineGalleryImage[];
};

const imageWidthClassNames: Record<SkylineGalleryImage["variant"], string> = {
  wide: "w-[300px] md:w-[460px] xl:w-[540px]",
  tall: "w-[220px] md:w-[320px] xl:w-[380px]",
  panorama: "w-[380px] md:w-[640px] xl:w-[760px]",
};

export function SkylineGallery({
  title,
  description,
  images,
}: SkylineGalleryProps) {
  return (
    <section className="relative overflow-hidden bg-black text-white text-left">
      <Container className="pt-[48px] md:pt-[72px] xl:pt-[96px] pb-8 xl:pb-12">
        <div className="max-w-3xl">
          <h2 className="nd-heading-l mb-0">{title}</h2>
          <p className="nd-body-xl text-nd-mid-em-text mt-3 xl:mt-5 mb-0">
            {description}
          </p>
        </div>
      </Container>

      <div className="relative pb-[64px] md:pb-[112px] xl:pb-[160px]">
        <div
          aria-hidden={true}
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-32 bg-gradient-to-r from-black to-transparent"
        />
        <div
          aria-hidden={true}
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-32 bg-gradient-to-l from-black to-transparent"
        />

        <Marquee className="w-full" speed={42}>
          {images.map((image) => (
            <div
              key={image.src}
              className={cn(
                "relative mr-3 md:mr-4 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]",
                "h-[220px] md:h-[320px] xl:h-[380px]",
                imageWidthClassNames[image.variant],
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1280px) 760px, (min-width: 768px) 640px, 380px"
                className="object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
