"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  VisuallyHidden,
} from "@solana-com/ui-chrome";
import { useSwipeDown } from "@solana-com/ui-chrome/hooks";
import NavSwipe from "@@/public/src/img/solutions/sdp/nav-swipe.inline.svg";
import Image from "next/image";
import { Link } from "@solana-com/ui-chrome/link";

const MenuItem = ({
  label,
  href,
  onClick,
}: {
  label: string;
  href: string;
  onClick?: () => void;
}) => {
  return (
    <Link
      className={`w-full flex items-center text-left gap-3 py-3 text-[16px] hover:bg-gradient-to-r hover:from-transparent hover:via-[10%] hover:via-white/5 hover:to-transparent`}
      type="button"
      to={href}
      onClick={onClick}
    >
      <div className="text-white grow">{label}</div>
    </Link>
  );
};

interface MobileMenuProps {
  links: { label: string; href: string }[];
  expanded: boolean;
  setExpanded: (_expanded: boolean) => void;
  button?: React.ReactNode;
}

export const MobileMenu = ({
  expanded,
  setExpanded,
  links,
  button,
}: MobileMenuProps) => {
  // Swipe down to close menu
  const swipeDownRef = useSwipeDown<HTMLDivElement>({
    onSwipe: () => setExpanded(false),
    threshold: 50,
  });

  return (
    <Sheet open={expanded} onOpenChange={setExpanded}>
      <SheetTrigger asChild>
        <button
          className="xl:hidden -m-1.5 border-0 cursor-pointer p-3 h-10 w-10 flex flex-col justify-center items-center gap-1"
          aria-label="Toggle menu"
          type="button"
        >
          <div className="flex w-4 shrink-0 flex-col items-stretch gap-1">
            <span
              className={`h-0.5 bg-white light:!bg-[#121212] transition-all duration-300 ${
                expanded ? "rotate-45 translate-y-[6px]" : ""
              }`}
            ></span>
            <span
              className={`self-end w-[60%] h-0.5 bg-white light:!bg-[#121212] transition-all duration-300 ${
                expanded ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`h-0.5 bg-white light:!bg-[#121212] transition-all duration-300 ${
                expanded ? "-rotate-45 -translate-y-[6px]" : ""
              }`}
            ></span>
          </div>
        </button>
      </SheetTrigger>
      <SheetContent ref={swipeDownRef}>
        <VisuallyHidden>
          <SheetTitle>Menu</SheetTitle>
        </VisuallyHidden>
        <div className="flex justify-between items-center mb-3">
          {/* Solana logo */}
          <div className="flex items-center justify-center pl-3">
            <Image
              width={60}
              height={34}
              src="/src/img/solutions/sdp/sdp-badge.svg"
              alt="SDP"
            />
          </div>
          <NavSwipe className="pointer-events-none" width={30} height={6} />
          {/* Close Button */}
          <SheetClose asChild>
            <button
              className="p-2 text-[#848895] hover:text-white transition-colors"
              aria-label="Close menu"
              type="button"
              onClick={() => setExpanded(false)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </SheetClose>
        </div>

        {/* Navigation Sections */}
        <nav className="px-3 divide-y divide-[rgba(238,228,255,0.04)]">
          {links.map((link) => (
            <MenuItem
              key={link.href}
              label={link.label}
              href={link.href}
              onClick={() => setExpanded(false)}
            />
          ))}
        </nav>

        {button && <div className="mt-2">{button}</div>}
      </SheetContent>
    </Sheet>
  );
};
