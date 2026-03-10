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
        <div className="flex flex-col items-center gap-16 md:flex-row md:items-center md:justify-between">
          {/* Solana mark + event links */}
          <div className="flex flex-col items-center gap-16 md:flex-row md:gap-10">
            {/* Solana Mark */}
            <Image
              src={getImagePath("/images/solana-logo.svg")}
              alt="Solana"
              width={98}
              height={84}
              className="h-[42px] w-auto md:h-[50px] lg:h-[84px]"
            />

            {/* Event links */}
            <div className="flex flex-col items-center gap-8 md:flex-row">
              <Link
                href="/accelerate/hong-kong"
                className="text-[20px] font-semibold uppercase leading-none tracking-[1px] text-white transition-colors hover:text-white/80"
              >
                Hong Kong
              </Link>
              <Link
                href="/accelerate/miami"
                className="text-[20px] font-semibold uppercase leading-none tracking-[1px] text-white transition-colors hover:text-white/80"
              >
                Miami
              </Link>
            </div>
          </div>

          {/* Social links - with divider */}
          <div className="flex items-center">
            {/* X / Solana */}
            <a
              href="https://x.com/solana"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[6px] border-r border-accelerate-gray-dark pr-5 transition-colors hover:opacity-80"
            >
              <Image
                src={getImagePath("/images/x-social.svg")}
                alt="X"
                width={18}
                height={18}
                className="h-[18px] w-[18px]"
              />
              <span className="font-diatype text-[15px] font-light leading-none tracking-[0.75px] text-accelerate-gray-200">
                Solana
              </span>
            </a>
            {/* X / Solana Conf */}
            <a
              href="https://x.com/SolanaConf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[6px] pl-3 transition-colors hover:opacity-80"
            >
              <Image
                src={getImagePath("/images/x-social.svg")}
                alt="X"
                width={18}
                height={18}
                className="h-[18px] w-[18px]"
              />
              <span className="font-diatype text-[15px] font-light leading-none tracking-[0.75px] text-accelerate-gray-200">
                Solana Conf
              </span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-16 text-center font-diatype text-[13px] font-normal leading-[1.4] text-accelerate-gray-100 lg:mt-[101px] lg:text-[20px]">
          &copy; Solana Foundation 2026
        </p>
      </div>
    </footer>
  );
}
