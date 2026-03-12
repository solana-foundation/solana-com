"use client";

import Image from "next/image";
import { getImagePath } from "@/config";

/**
 * Miami hero background symbols — Freedom Tower, Palms, and Lifeguard Tower.
 * Positions are derived from Figma (1440×932 frame) and expressed as percentages
 * so they scale proportionally across viewport sizes.
 */
export function MiamiHeroSymbols() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Centered reference container matching the 1440px design frame */}
      <div className="absolute left-1/2 top-0 h-full w-[1440px] -translate-x-1/2">
        {/* Freedom Tower — centered, nearly full height */}
        <div
          className="absolute"
          style={{
            left: 622,
            top: 52,
            width: 202,
            height: 880,
          }}
        >
          <Image
            src={getImagePath("/images/miami-freedom-tower.svg")}
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Palms — right of center with sun/moon */}
        <div
          className="absolute"
          style={{
            left: 854,
            top: 261,
            width: 498,
            height: 671,
          }}
        >
          <Image
            src={getImagePath("/images/miami-palms.svg")}
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Lifeguard Tower — left of center, lower half */}
        <div
          className="absolute"
          style={{
            left: 196,
            top: 427,
            width: 417,
            height: 505,
          }}
        >
          <Image
            src={getImagePath("/images/miami-lifeguard-tower.svg")}
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
