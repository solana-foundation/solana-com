"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "./link";
import { cn } from "./classnames";

/**
 * The "Developers" item of the solana.com header (2026-10-16). It replaced
 * the Build dropdown and sits right of Ecosystem. /developers wears the docs
 * chrome, so it opens in a new tab, marked with a small up-right arrow icon
 * sized like the dropdown chevrons, and a visually hidden
 * "(opens in a new tab)".
 */
export const DEVELOPERS_LINK = {
  href: "/developers",
  titleKey: "nav.developers.title",
  newTabKey: "nav.newTab",
} as const;

export const NEW_TAB_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

export function NewTabMark({ text }: { text: string }) {
  return (
    <>
      {/* Same box, spacing and opacity as the dropdown chevrons
       * (nav-menu.tsx AngleDown), so the row reads evenly. */}
      <svg
        aria-hidden="true"
        data-new-tab-mark=""
        className="relative top-px ml-0.5 -mr-1 inline-block size-4 shrink-0 opacity-60"
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 16 16 8M9.5 8H16v6.5" />
      </svg>
      <span className="sr-only"> {text}</span>
    </>
  );
}

export function DevelopersLink({
  className,
  onClick,
  icon,
}: {
  className?: string;
  onClick?: () => void;
  /** Leading icon (the mobile menu's rows have one). */
  icon?: ReactNode;
}) {
  const t = useTranslations();
  return (
    <Link
      to={DEVELOPERS_LINK.href}
      {...NEW_TAB_PROPS}
      className={cn("no-underline", className)}
      onClick={onClick}
      data-nav-item="developers"
    >
      {icon}
      <span>{t(DEVELOPERS_LINK.titleKey)}</span>
      <NewTabMark text={t(DEVELOPERS_LINK.newTabKey)} />
    </Link>
  );
}
