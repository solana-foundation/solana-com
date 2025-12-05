"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@workspace/i18n/use-router";
import * as Collapsible from "@radix-ui/react-collapsible";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  VisuallyHidden,
} from "./sheet";
import { InkeepSearchBar } from "./inkeep-searchbar";
import HeaderListLearn from "./header-list.learn";
import HeaderListBuild from "./header-list.build";
import HeaderListSolutions from "./header-list.solutions";
import HeaderListNetwork from "./header-list.network";
import { HeaderListCommunity } from "./header-list.community";
import AngleDown from "./assets/angle-down.inline.svg";

interface MobileMenuProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

interface MenuSectionProps {
  title: string;
  isActive: boolean;
  children: React.ReactNode;
  activeColor?: string;
}

const MenuSection = ({
  title,
  isActive,
  children,
  activeColor,
}: MenuSectionProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-b border-white/10"
    >
      <Collapsible.Trigger asChild>
        <button
          className={`flex w-full items-center justify-between py-4 text-base font-normal transition-colors ${
            isActive ? "text-white" : "text-[#848895]"
          } hover:text-white`}
          style={
            isActive && activeColor
              ? ({ "--color-active": activeColor } as React.CSSProperties)
              : undefined
          }
        >
          <span>{title}</span>
          <AngleDown
            className={`size-4 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            width={16}
            height={16}
            viewBox="0 0 24 24"
          />
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content className="pb-4 overflow-hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:duration-300 data-[state=closed]:duration-300 px-2">
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export const MobileMenu = ({ expanded, setExpanded }: MobileMenuProps) => {
  const t = useTranslations();
  const { asPath } = useRouter();

  const isLearnActive =
    asPath.includes("/learn") ||
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
      <SheetContent className="w-full overflow-y-auto bg-gradient-to-b from-[#111214] to-[#181222]">
        <VisuallyHidden>
          <SheetTitle>Menu</SheetTitle>
        </VisuallyHidden>
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <div className="flex justify-end mb-4">
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

          {/* Search */}
          <div className="pb-4 border-b border-white/10">
            <InkeepSearchBar />
          </div>

          {/* Navigation Sections */}
          <nav className="flex-1 flex flex-col">
            <MenuSection
              title={t("nav.learn.title")}
              isActive={isLearnActive}
              activeColor="#19fb9b"
            >
              <HeaderListLearn />
            </MenuSection>

            <MenuSection
              title={t("nav.developers.title")}
              isActive={isBuildActive}
              activeColor="#fed612"
            >
              <HeaderListBuild />
            </MenuSection>

            <MenuSection
              title={t("nav.solutions.title")}
              isActive={isSolutionsActive}
              activeColor="#FF5722"
            >
              <HeaderListSolutions />
            </MenuSection>

            <MenuSection
              title={t("nav.network.title")}
              isActive={isNetworkActive}
              activeColor="#9945ff"
            >
              <HeaderListNetwork />
            </MenuSection>

            <MenuSection
              title={t("nav.community.title")}
              isActive={isCommunityActive}
              activeColor="#f087ff"
            >
              <HeaderListCommunity />
            </MenuSection>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};
