"use client";

import Image from "next/image";
import { Link } from "@workspace/i18n/routing";
import { getImagePath } from "@/config";

export function HomepageFooter() {
  return (
    <footer className="relative overflow-hidden bg-black pb-16 pt-20 lg:pb-16 lg:pt-[82px]">
      {/* acc-hero 2 - inverted globe glow behind planet dots */}
      <div className="pointer-events-none absolute inset-0 -scale-y-100 opacity-50">
        <Image
          src={getImagePath("/images/homepage/acc-hero-bg.png")}
          alt=""
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 84.583%, #000000 100%)",
          }}
        />
      </div>

      {/* Planet dots decoration - clipped container showing only top arc of sphere */}
      {/* Figma: 1345×359 container, image 1110×1109 at (117, 8) */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 -translate-x-1/2 overflow-hidden"
        style={{ width: 1345, height: 359 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getImagePath("/images/homepage/planet-dots.png")}
          alt=""
          style={{
            position: "absolute",
            left: 117,
            top: -40,
            width: 1110,
            height: 1109,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1480px] px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {/* Left: Solana mark + event links */}
          <div className="flex items-center gap-10">
            {/* Solana Mark */}
            <Image
              src={getImagePath("/images/solana-logo.svg")}
              alt="Solana"
              width={98}
              height={84}
              className="h-[50px] w-auto lg:h-[84px]"
            />

            {/* Event links - Space Grotesk SemiBold 24px */}
            <div className="flex items-center gap-8">
              <Link
                href="/accelerate/hong-kong"
                className="text-[18px] font-semibold uppercase tracking-[1px] text-white transition-colors hover:text-white/80 lg:text-[20px]"
                style={{
                  fontFamily:
                    "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                  lineHeight: 1,
                }}
              >
                Hong Kong
              </Link>
              <a
                href="https://lu.ma/accelerate-miami"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[18px] font-semibold uppercase tracking-[1px] text-white transition-colors hover:text-white/80 lg:text-[20px]"
                style={{
                  fontFamily:
                    "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                  lineHeight: 1,
                }}
              >
                Miami
              </a>
            </div>
          </div>

          {/* Right: Social links - with divider */}
          <div className="flex items-center">
            {/* X / Solana */}
            <a
              href="https://x.com/solana"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border-r border-[#3d3d3d] pr-4 transition-colors hover:opacity-80"
            >
              <Image
                src={getImagePath("/images/x-social.svg")}
                alt="X"
                width={24}
                height={24}
              />
              <span
                className="text-[20px] tracking-[1px] text-[#8d8d8d]"
                style={{
                  fontFamily: "'ABC Diatype', sans-serif",
                  fontWeight: 300,
                  lineHeight: 1,
                }}
              >
                Solana
              </span>
            </a>
            {/* X / Solana Conf */}
            <a
              href="https://x.com/SolanaConf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 pl-4 transition-colors hover:opacity-80"
            >
              <Image
                src={getImagePath("/images/x-social.svg")}
                alt="X"
                width={24}
                height={24}
              />
              <span
                className="text-[20px] tracking-[1px] text-[#8d8d8d]"
                style={{
                  fontFamily: "'ABC Diatype', sans-serif",
                  fontWeight: 300,
                  lineHeight: 1,
                }}
              >
                Solana Conf
              </span>
            </a>
          </div>
        </div>

        {/* Copyright - ABC Diatype Regular 20px */}
        <p
          className="mt-16 text-center text-[16px] text-[#b3b2bc] lg:mt-[101px] lg:text-[20px]"
          style={{
            fontFamily: "'ABC Diatype', sans-serif",
            fontWeight: 400,
            lineHeight: 1.4,
          }}
        >
          &copy; Solana Foundation 2026
        </p>
      </div>
    </footer>
  );
}
