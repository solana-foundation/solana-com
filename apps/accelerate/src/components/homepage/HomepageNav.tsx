"use client";

import { Link } from "@workspace/i18n/routing";
import Image from "next/image";
import { getImagePath } from "@/config";

export function HomepageNav() {
  return (
    <header className="absolute left-0 right-0 top-0 z-20">
      <div className="mx-auto flex max-w-[1920px] items-center justify-between px-6 py-4 lg:px-[60px] lg:py-[33px]">
        {/* Logo - hidden in nav, shown in hero */}
        <div />

        {/* Right nav */}
        <nav className="flex items-center gap-10">
          <Link
            href="/accelerate/hong-kong"
            className="hidden font-semibold uppercase tracking-[1.1px] text-white transition-colors hover:text-white/80 md:inline"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              fontSize: "22px",
              lineHeight: 1,
            }}
          >
            Hong Kong (APAC)
          </Link>
          <a
            href="https://lu.ma/accelerate-miami"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden font-semibold uppercase tracking-[1.1px] text-white transition-colors hover:text-white/80 md:inline"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              fontSize: "22px",
              lineHeight: 1,
            }}
          >
            Miami (USA)
          </a>

          {/* LIVE NOW pill button - split design */}
          <a
            href="https://lu.ma/accelerate-miami"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <div
              className="flex items-center gap-0.5 bg-[#19fb9b] py-[9.5px] pl-[20px] pr-[26px]"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              }}
            >
              <span className="text-[18px] font-semibold uppercase tracking-[0.9px] text-black">
                Live Now
              </span>
              <Image
                src={getImagePath("/images/homepage/live-now-arrow.svg")}
                alt=""
                width={13}
                height={13}
                className="ml-1"
              />
            </div>
            <div className="flex h-[39.84px] items-center bg-[#19fb9b] px-[10.5px]">
              <Image
                src={getImagePath("/images/homepage/cta-arrow.svg")}
                alt=""
                width={19}
                height={19}
              />
            </div>
          </a>
        </nav>
      </div>
    </header>
  );
}
