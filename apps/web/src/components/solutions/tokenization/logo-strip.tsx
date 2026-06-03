import React from "react";
import { Logos } from "@/component-library/logos";
import { MARQUEE_LOGOS } from "@/data/solutions/tokenization";

/**
 * Thin "in production with" band: a muted label above a marquee of partner
 * logos. Reuses the shared Logos marquee component.
 */
export const LogoStrip = () => (
  <section className="relative bg-black text-white">
    <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] py-[40px] md:py-[56px] flex flex-col gap-6 md:gap-8">
      <Logos
        logos={MARQUEE_LOGOS}
        itemClassName="h-[28px] md:h-[32px] [&_img]:opacity-60 [&_img]:transition-opacity hover:[&_img]:opacity-100"
        fadeColor="#000"
      />
    </div>
  </section>
);
