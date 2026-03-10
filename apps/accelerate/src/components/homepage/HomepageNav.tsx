"use client";

import { useEffect, useState } from "react";
import { Link } from "@workspace/i18n/routing";
import Image from "next/image";
import { getImagePath } from "@/config";

/**
 * Top navigation bar — sits absolutely over the hero and scrolls with the page.
 * The logo slot is intentionally empty; the animated logo in HomepageHero
 * visually fills this space as the user scrolls.
 */
export function HomepageNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="absolute left-0 right-0 top-0 z-20">
        <div className="mx-auto flex h-[80px] max-w-[1920px] items-center justify-between px-6 py-4 lg:h-[147px] lg:px-[60px] lg:py-[33px]">
          {/* Logo space — the animated logo in HomepageHero lands here */}
          <div className="h-[40px] w-[70px] md:h-[50px] md:w-[88px] lg:h-[80px] lg:w-[141px]" />

          {/* Right nav */}
          <nav className="flex items-center gap-4 xl:gap-10">
            <Link
              href="/accelerate/hong-kong"
              className="hidden font-semibold uppercase tracking-[1px] text-white transition-colors hover:text-white/80 xl:inline"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                fontSize: "20px",
                lineHeight: 1,
              }}
            >
              Hong Kong (APAC)
            </Link>
            <Link
              href="/accelerate/miami"
              className="hidden font-semibold uppercase tracking-[1px] text-white transition-colors hover:text-white/80 xl:inline"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                fontSize: "20px",
                lineHeight: 1,
              }}
            >
              Miami (USA)
            </Link>

            {/* LIVE NOW button */}
            <Link
              href="/accelerate/miami"
              className="hidden items-center bg-[#19fb9b] p-2.5 xl:flex"
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
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex h-[44px] w-[44px] items-center justify-center border border-[#2e2e2e] text-[#19fb9b] transition-colors hover:border-[#19fb9b] xl:hidden"
              aria-label="Open navigation menu"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M2 4.5H16M2 9H16M2 13.5H16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black px-6 py-7">
          <div className="mx-auto flex w-full max-w-[1024px] items-start justify-between">
            <Image
              src={getImagePath("/images/solana-accelerate-logo.svg")}
              alt="Solana Accelerate"
              width={166}
              height={94}
              className="h-auto w-[120px] md:w-[166px]"
              priority
            />
            <button
              type="button"
              onClick={closeMobileMenu}
              className="inline-flex h-[44px] w-[44px] items-center justify-center text-[#19fb9b]"
              aria-label="Close navigation menu"
            >
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path
                  d="M5 5L21 21M21 5L5 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav className="mx-auto mt-[68px] flex w-full max-w-[1024px] flex-col gap-8">
            <Link
              href="/accelerate/hong-kong"
              onClick={closeMobileMenu}
              className="w-fit text-[56px] font-semibold uppercase leading-[0.95] tracking-[1px] text-white sm:text-[72px]"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              }}
            >
              Hong Kong
              <br />
              (APAC)
            </Link>
            <a
              href="https://lu.ma/accelerate-miami"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
              className="w-fit text-[56px] font-semibold uppercase leading-[0.95] tracking-[1px] text-white sm:text-[72px]"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              }}
            >
              Miami
              <br />
              (USA)
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
