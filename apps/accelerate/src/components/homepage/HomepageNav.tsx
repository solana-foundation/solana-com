"use client";

import { Link } from "@workspace/i18n/routing";
import Image from "next/image";
import { getImagePath } from "@/config";

/**
 * Top navigation bar — sits absolutely over the hero and scrolls with the page.
 * The logo slot is intentionally empty; the animated logo in HomepageHero
 * visually fills this space as the user scrolls.
 */
export function HomepageNav() {
  return (
    <header className="absolute left-0 right-0 top-0 z-20">
      <div className="mx-auto flex h-[80px] max-w-[1920px] items-center justify-between px-6 py-4 lg:h-[147px] lg:px-[60px] lg:py-[33px]">
        {/* Logo space — the animated logo in HomepageHero lands here */}
        <div className="h-[40px] w-[70px] md:h-[50px] md:w-[88px] lg:h-[80px] lg:w-[141px]" />

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

          {/* LIVE NOW button */}
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
                <span className="relative ml-0.5 inline-block h-[8px] w-[8px] rounded-full bg-black">
                  <span className="absolute inset-0 animate-ping rounded-full bg-black/75" />
                </span>
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
