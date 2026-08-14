"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "./theme-provider";
import { usePathname } from "@workspace/i18n/routing";
import { Link } from "./link";
import { HeaderList } from "./header-list";
import { DevelopersNav } from "./developers-nav";
import { InkeepSearchBar } from "./inkeep-searchbar";
import { LanguageSelector } from "./language-selector";
import { MobileMenu } from "./mobile-menu";
import { shouldShowDevelopersNav } from "./developer-routes";

import SolanaLogo from "./assets/logotype.inline.svg";
import Moon from "./assets/icons/moon.inline.svg";
import Sun from "./assets/icons/sun.inline.svg";

function Header({
  className = "",
  containerClassName = "",
  showLanguage = true,
  showDevelopersNav = true,
}) {
  const pathname = usePathname();
  const { theme, toggleTheme, isThemePage } = useTheme();
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);
  const showSecondaryDevelopersNav = shouldShowDevelopersNav(pathname);

  return (
    <>
      <header className={`sticky top-0 z-50 ${className}`}>
        <nav
          id="navbar"
          className="h-14 border-b border-white/10 bg-black/80 backdrop-blur-xl backdrop-saturate-150"
        >
          <div
            className={`mx-auto flex h-full w-full max-w-[1440px] items-center justify-between gap-x-4 px-4 sm:px-5 xl:gap-x-8 xl:px-6 ${containerClassName}`}
          >
            <Link
              to="/"
              className="flex h-11 shrink-0 grow-0 items-center !text-white"
              aria-label="Solana"
            >
              <SolanaLogo
                style={{ color: "currentColor" }}
                width={120}
                height={18}
                viewBox="0 0 149 22"
                className="block h-auto w-28 xl:w-[120px]"
              />
            </Link>

            <div className="ml-auto flex items-center gap-1 md:gap-2 xl:grow">
              {/* Desktop Menu */}
              <div className="hidden xl:block flex-1">
                <HeaderList />
              </div>

              {/* Desktop Search and Language */}
              <div className="flex items-center gap-3">
                <InkeepSearchBar />
                {showLanguage && (
                  <div className="relative items-center hidden xl:flex">
                    <LanguageSelector />
                  </div>
                )}
              </div>

              {/* Mobile Menu */}
              <MobileMenu
                expanded={expanded}
                setExpanded={setExpanded}
                showLanguage={showLanguage}
              />

              {/* Theme Toggle */}
              {isThemePage && (
                <button
                  className="ml-1 flex size-11 items-center justify-center border-none text-white transition-transform duration-300 ease-in-out hover:rotate-[15deg] md:size-9"
                  onClick={toggleTheme}
                  aria-label={t("commands.toggle")}
                >
                  {theme === "light" && <Moon />}
                  {theme === "dark" && <Sun />}
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>
      {/* Secondary nav for docs-owned developer routes. */}
      {showDevelopersNav && showSecondaryDevelopersNav && (
        <DevelopersNav containerClassName={containerClassName} />
      )}
    </>
  );
}

export { Header };
