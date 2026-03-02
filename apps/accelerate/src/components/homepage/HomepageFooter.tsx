"use client";

import Image from "next/image";
import { Link } from "@workspace/i18n/routing";
import { getImagePath } from "@/config";

export function HomepageFooter() {
  return (
    <footer className="relative bg-black pb-8 pt-12 lg:pb-12 lg:pt-16">
      <div className="mx-auto max-w-[1920px] px-6 lg:px-[60px]">
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
                className="text-[18px] font-semibold uppercase tracking-[1.2px] text-white transition-colors hover:text-white/80 lg:text-[24px]"
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
                className="text-[18px] font-semibold uppercase tracking-[1.2px] text-white transition-colors hover:text-white/80 lg:text-[24px]"
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
            <div className="flex items-center gap-2 border-r border-[#3d3d3d] pr-4">
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
            </div>
            {/* X / Solana Conf */}
            <div className="flex items-center gap-2 pl-4">
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
            </div>
          </div>
        </div>

        {/* Copyright - ABC Diatype Regular 20px */}
        <p
          className="mt-10 text-center text-[16px] text-[#b3b2bc] lg:mt-16 lg:text-[20px]"
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
