"use client";

import Image from "next/image";
import { getImagePath } from "@/config";

/**
 * Wrapper for HomepageHero + wave lines.
 * The wave lines in Figma are positioned overlapping the hero bottom
 * and extending into the section below. We use a wrapper to allow the
 * wave lines to visually span both areas without being clipped by
 * the hero's overflow-hidden.
 */
export function HeroWaveWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {/* Hero goes here as children */}
      {children}

      {/* Wave lines SVG overlay — Figma component: 2219x978px.
          Positioned so the visible wave content starts in the lower
          portion of the 1000px hero and extends into the spacer below. */}
      <div className="pointer-events-none absolute left-[-181px] top-[500px] z-[20] hidden h-[978px] w-[2219px] lg:block">
        <Image
          src={getImagePath("/images/wave-lines.svg")}
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Spacer below hero for wave lines to extend into */}
      <div className="relative w-full bg-black" style={{ height: "350px" }}>
        {/* Bottom gradient fade to blend wave lines into the next section */}
        <div
          className="absolute bottom-0 left-0 z-[30] h-[200px] w-full"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, black 80%)",
          }}
        />
      </div>
    </div>
  );
}

/**
 * @deprecated Use HeroWaveWrapper instead. Kept for backward compatibility.
 */
export function AuroraWave() {
  return null;
}
