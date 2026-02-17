"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@workspace/i18n/use-router";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  VisuallyHidden,
} from "./sheet";
import HeaderListLearn from "./header-list.learn";
import HeaderListBuild from "./header-list.build";
import HeaderListSolutions from "./header-list.solutions";
import HeaderListNetwork from "./header-list.network";
import { HeaderListCommunity } from "./header-list.community";
import AngleDown from "./assets/angle-down.inline.svg";
import ArrowLeft from "./assets/arrow-left.inline.svg";
import SolanaMono from "./assets/solana-mono.inline.svg";
import CodeIcon from "./assets/nav/code.inline.svg";
import BezierIcon from "./assets/nav/bezier.inline.svg";
import GlobusIcon from "./assets/nav/globus.inline.svg";
import LightbulbIcon from "./assets/nav/lightbulb.inline.svg";
import NavSwipe from "./assets/nav/nav-swipe.inline.svg";
import { useSwipeDown } from "./hooks/useSwipeDown";

interface MobileMenuProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

interface MenuItemProps {
  title: string;
  Icon?: React.ComponentType<{
    className?: string;
  }>;
  isActive?: boolean;
  onClick?: () => void;
}

const MenuItem = ({ title, Icon, isActive, onClick }: MenuItemProps) => {
  return (
    <button
      className={`w-full flex items-center text-left gap-3 py-4 text-[16px] font-medium hover:bg-gradient-to-r hover:from-transparent hover:via-[10%] hover:via-white/5 hover:to-transparent`}
      type="button"
      onClick={onClick}
    >
      {Icon && <Icon className="size-[20px] text-white shrink-0" />}
      <div className="font-medium text-white grow">{title}</div>
      <AngleDown
        className={`transition-transform duration-300 -rotate-90 shrink-0 ${isActive ? "text-white" : ""}`}
        width={20}
        height={20}
        viewBox="0 0 24 24"
      />
    </button>
  );
};

export const MobileMenu = ({ expanded, setExpanded }: MobileMenuProps) => {
  const t = useTranslations();
  const { asPath } = useRouter();
  const [menu, setMenu] = React.useState<string | null>(null);

  const isLearnActive =
    (asPath.includes("/learn") && !asPath.includes("/developers/learn")) ||
    asPath === "/environment" ||
    asPath.includes("/universities");
  const isSolutionsActive =
    asPath.includes("/solutions") ||
    asPath.includes("/wallets") ||
    asPath.includes("/ai");
  const isBuildActive =
    asPath.includes("/developers") ||
    asPath.includes("/docs") ||
    asPath === "/hackathon";
  const isNetworkActive =
    asPath === "/validators" || asPath === "/rpc" || asPath === "/solanaramp";
  const isCommunityActive =
    asPath === "/community" ||
    asPath.includes("/events") ||
    asPath === "/breakpoint" ||
    asPath === "/news" ||
    asPath.includes("/podcasts");

  // Close menu on route change
  React.useEffect(() => {
    setExpanded(false);
  }, [asPath, setExpanded]);

  // Reset menu state when menu is closed
  React.useEffect(() => {
    if (!expanded) {
      setMenu(null);
    }
  }, [expanded]);

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
        <div className="flex justify-between items-center mb-1">
          {/* Solana logo */}
          {!menu && (
            <div className="flex items-center justify-center size-10">
              <SolanaMono width={18} height={18} />
            </div>
          )}
          {/* Go back button */}
          {menu && (
            <button
              className="flex items-center justify-center size-10 opacity-[0.64] hover:opacity-100"
              type="button"
              aria-label="Go back"
              onClick={() => setMenu(null)}
            >
              <ArrowLeft width={20} height={20} />
            </button>
          )}
          <NavSwipe className="pointer-events-none" width={30} height={6} />
          {/* Close Button */}
          <SheetClose asChild>
            <button
              className="p-2 text-[#848895] hover:text-white transition-colors"
              aria-label="Close menu"
              type="button"
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
        {!menu && (
          <nav className="px-3 divide-y divide-[rgba(238,228,255,0.04)]">
            <MenuItem
              title={t("nav.learn.title")}
              Icon={CodeIcon}
              isActive={isLearnActive}
              onClick={() => setMenu("learn")}
            />
            <MenuItem
              title={t("nav.developers.title")}
              Icon={CodeIcon}
              isActive={isBuildActive}
              onClick={() => setMenu("developers")}
            />
            <MenuItem
              title={t("nav.solutions.title")}
              Icon={LightbulbIcon}
              isActive={isSolutionsActive}
              onClick={() => setMenu("solutions")}
            />
            <MenuItem
              title={t("nav.network.title")}
              Icon={BezierIcon}
              isActive={isNetworkActive}
              onClick={() => setMenu("network")}
            />
            <MenuItem
              title={t("nav.community.title")}
              Icon={GlobusIcon}
              isActive={isCommunityActive}
              onClick={() => setMenu("community")}
            />
          </nav>
        )}
        {menu === "learn" && <HeaderListLearn />}
        {menu === "developers" && <HeaderListBuild />}
        {menu === "solutions" && <HeaderListSolutions isMobile={true} />}
        {menu === "network" && <HeaderListNetwork />}
        {menu === "community" && <HeaderListCommunity />}
      </SheetContent>
    </Sheet>
  );
};
