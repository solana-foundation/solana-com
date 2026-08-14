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
  SheetDescription,
  VisuallyHidden,
} from "./sheet";
import AngleDown from "./assets/icons/angle-down.inline.svg";
import ArrowLeft from "./assets/icons/arrow-left.inline.svg";
import SolanaMono from "./assets/solana-mono.inline.svg";
import NavSwipe from "./assets/nav/nav-swipe.inline.svg";
import { HEADER_SECTIONS } from "./header-sections";
import { useSwipeDown } from "./hooks/useSwipeDown";
import { isNavSectionActive } from "./nav-active";
import { LanguageSelector } from "./language-selector";

interface MobileMenuProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  showLanguage?: boolean;
}

interface MenuItemProps {
  title: string;
  Icon?: React.ComponentType<{
    className?: string;
  }>;
  isActive?: boolean;
  onClick?: () => void;
}

const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ title, Icon, isActive, onClick }, ref) => {
    return (
      <button
        ref={ref}
        className="flex min-h-14 w-full items-center gap-3 py-4 text-left text-[16px] font-medium hover:bg-gradient-to-r hover:from-transparent hover:via-[10%] hover:via-white/5 hover:to-transparent"
        type="button"
        onClick={onClick}
      >
        {Icon && <Icon className="size-[20px] shrink-0 text-white" />}
        <div className="grow font-medium text-white">{title}</div>
        <AngleDown
          className={`shrink-0 -rotate-90 transition-transform duration-300 ${isActive ? "text-white" : ""}`}
          width={20}
          height={20}
          viewBox="0 0 24 24"
        />
      </button>
    );
  },
);
MenuItem.displayName = "MenuItem";

export const MobileMenu = ({
  expanded,
  setExpanded,
  showLanguage = true,
}: MobileMenuProps) => {
  const t = useTranslations();
  const { asPath } = useRouter();
  const [menu, setMenu] = React.useState<string | null>(null);
  const backButtonRef = React.useRef<HTMLButtonElement>(null);
  const sectionButtonRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const returnFocusSectionRef = React.useRef<string | null>(null);
  const activeSection = HEADER_SECTIONS.find(({ matchRules }) =>
    isNavSectionActive(asPath, matchRules),
  )?.id;
  const selectedSection = HEADER_SECTIONS.find(({ id }) => id === menu);
  const ActiveContent = selectedSection?.Content;

  // Close menu on route change
  React.useEffect(() => {
    setExpanded(false);
  }, [asPath, setExpanded]);

  // Reset menu state when menu is closed
  React.useEffect(() => {
    if (!expanded) {
      setMenu(null);
      returnFocusSectionRef.current = null;
    }
  }, [expanded]);

  // Keep keyboard and assistive-technology focus anchored as views change.
  React.useEffect(() => {
    if (!expanded) return;

    if (menu) {
      backButtonRef.current?.focus();
      return;
    }

    const sectionToFocus = returnFocusSectionRef.current;
    if (sectionToFocus) {
      sectionButtonRefs.current.get(sectionToFocus)?.focus();
      returnFocusSectionRef.current = null;
    }
  }, [expanded, menu]);

  const returnToMainMenu = () => {
    returnFocusSectionRef.current = menu;
    setMenu(null);
  };

  // Swipe down to close menu
  const swipeDownRef = useSwipeDown<HTMLDivElement>({
    onSwipe: () => setExpanded(false),
    threshold: 50,
  });

  return (
    <Sheet open={expanded} onOpenChange={setExpanded}>
      <SheetTrigger asChild>
        <button
          className="-m-1 flex size-11 cursor-pointer flex-col items-center justify-center gap-1 border-0 p-3 xl:hidden"
          aria-label={t("nav.mobile.open")}
          type="button"
        >
          <div className="flex w-4 shrink-0 flex-col items-stretch gap-1">
            <span
              className={`h-0.5 bg-white transition-all duration-300 ${
                expanded ? "rotate-45 translate-y-[6px]" : ""
              }`}
            ></span>
            <span
              className={`self-end w-[60%] h-0.5 bg-white transition-all duration-300 ${
                expanded ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`h-0.5 bg-white transition-all duration-300 ${
                expanded ? "-rotate-45 -translate-y-[6px]" : ""
              }`}
            ></span>
          </div>
        </button>
      </SheetTrigger>
      <SheetContent ref={swipeDownRef}>
        <VisuallyHidden>
          <SheetTitle>
            {selectedSection
              ? t(selectedSection.titleKey)
              : t("nav.mobile.menu")}
          </SheetTitle>
          <SheetDescription>{t("nav.mobile.description")}</SheetDescription>
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
              ref={backButtonRef}
              className="flex size-11 items-center justify-center opacity-[0.64] hover:opacity-100"
              type="button"
              aria-label={t("nav.mobile.back")}
              onClick={returnToMainMenu}
            >
              <ArrowLeft width={20} height={20} />
            </button>
          )}
          <NavSwipe className="pointer-events-none" width={30} height={6} />
          {/* Close Button */}
          <SheetClose asChild>
            <button
              className="flex size-11 items-center justify-center text-[#848895] transition-colors hover:text-white"
              aria-label={t("commands.close")}
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
          <nav
            aria-label={t("nav.mobile.menu")}
            className="divide-y divide-[rgba(238,228,255,0.04)] px-3"
          >
            {HEADER_SECTIONS.map(({ id, titleKey, mobileIcon }) => (
              <MenuItem
                key={id}
                ref={(node) => {
                  if (node) sectionButtonRefs.current.set(id, node);
                  else sectionButtonRefs.current.delete(id);
                }}
                title={t(titleKey)}
                Icon={mobileIcon}
                isActive={activeSection === id}
                onClick={() => setMenu(id)}
              />
            ))}
            {showLanguage && (
              <div className="py-1">
                <LanguageSelector
                  displayLanguageName
                  ariaLabel={t("nav.mobile.language")}
                  className="h-11 w-full justify-between px-0 text-white/70 hover:text-white"
                />
              </div>
            )}
          </nav>
        )}
        {ActiveContent && selectedSection && (
          <nav aria-label={t(selectedSection.titleKey)}>
            <ActiveContent isMobile={true} />
          </nav>
        )}
      </SheetContent>
    </Sheet>
  );
};
