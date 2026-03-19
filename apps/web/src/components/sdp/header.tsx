"use client";

import { useEffect, useState } from "react";
import { LanguageSelector } from "@solana-com/ui-chrome";
import Button from "@/component-library/button";
import LogoIcon from "@@/public/src/img/logos-solana/logotype.inline.svg";
import Image from "next/image";
import { MobileMenu } from "./mobile-menu";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Partners", href: "#partners" },
  { label: "Sandbox", href: "#sandbox" },
  { label: "Media", href: "#media" },
];

const MenuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <line
      x1="4"
      y1="6"
      x2="20"
      y2="6"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="12"
      x2="20"
      y2="12"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="4"
      y1="18"
      x2="20"
      y2="18"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const SdpHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  useEffect(() => {
    if (isDesktop) setMenuOpen(false);
  }, [isDesktop]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0C0C0E]">
      {/* main bar */}
      <div className="flex justify-center">
        <div className="flex items-center gap-[40px] w-full max-w-[1440px] h-[72px] xl:border-x xl:border-white/[0.08] px-5 md:px-8 xl:px-[48px]">
          {/* logo + badge */}
          <div className="flex items-center gap-[16px] shrink-0">
            <LogoIcon className="h-4 xl:h-5 w-auto" />
            <Image
              width={60}
              height={34}
              src="/src/img/solutions/sdp/sdp-badge.svg"
              alt="SDP"
            />
          </div>

          {/* desktop nav */}
          <nav className="hidden xl:flex flex-1 items-center gap-1">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="nd-body-s text-white/[0.64] hover:text-white transition-colors px-3 py-[6px] rounded-[800px] whitespace-nowrap"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* desktop right: lang selector + CTA */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            <LanguageSelector className="!text-white/60 hover:!text-white" />
            <Button size="m" variant="secondary">
              Join waitlist
            </Button>
          </div>

          {/* mobile hamburger */}
          <div className="xl:hidden flex flex-1 justify-end">
            {menuOpen ? (
              <MobileMenu
                links={navLinks}
                expanded
                setExpanded={setMenuOpen}
                button={
                  <Button
                    size="m"
                    showRightIcon
                    className="w-full justify-between"
                  >
                    Join waitlist
                  </Button>
                }
              />
            ) : (
              <button
                onClick={() => setMenuOpen(true)}
                className="p-1"
                aria-label={"Open menu"}
                aria-expanded={menuOpen}
              >
                <MenuIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SdpHeader;
