"use client";

import { Link } from "@workspace/i18n/routing";
import Image from "next/image";
import { getImagePath } from "@/config";

export function HomepageNav() {
  return (
    <header className="absolute left-0 right-0 top-0 z-20">
      <div className="mx-auto flex h-[80px] max-w-[1920px] items-center justify-between px-6 py-4 lg:h-[147px] lg:px-[60px] lg:py-[33px]">
        {/* Logo - hidden in nav, shown in hero */}
        <div />

        {/* Right nav */}
        <nav className="flex items-center gap-10">
          <Link
            href="/accelerate/hong-kong"
            className="hidden font-semibold uppercase tracking-[1px] text-white transition-colors hover:text-white/80 md:inline"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              fontSize: "20px",
              lineHeight: 1,
            }}
          >
            Hong Kong (APAC)
          </Link>
          <a
            href="https://lu.ma/accelerate-miami"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden font-semibold uppercase tracking-[1px] text-white transition-colors hover:text-white/80 md:inline"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              fontSize: "20px",
              lineHeight: 1,
            }}
          >
            Miami (USA)
          </a>

          {/* LIVE NOW button - single green container matching Figma */}
          <a
            href="https://lu.ma/accelerate-miami"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-[#19fb9b] p-2.5"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
          >
            <div className="flex w-full items-center gap-8">
              <div className="flex items-center gap-1">
                <span className="text-[18px] font-bold uppercase tracking-[0.9px] text-black">
                  Live Now
                </span>
                {/* Animated dot indicator */}
                <span className="relative ml-0.5 inline-block h-[8px] w-[8px] rounded-full bg-black" />
              </div>
              <Image
                src={getImagePath("/images/homepage/cta-arrow.svg")}
                alt=""
                width={19}
                height={19}
                className="flex-shrink-0"
              />
            </div>
          </a>
        </nav>
      </div>
    </header>
  );
}
