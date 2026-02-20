"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "./theme-provider";
import { useRouter } from "@workspace/i18n/use-router";
import { Link } from "./link";
import { HeaderList } from "./header-list";
import { DevelopersNav } from "./developers-nav";
import { InkeepSearchBar } from "./inkeep-searchbar";
import { LanguageSelector } from "./language-selector";
import { MobileMenu } from "./mobile-menu";
import { InkeepChatButton } from "./inkeep-chat-button";

import SolanaLogo from "./assets/logotype.inline.svg";
import Moon from "./assets/moon.inline.svg";
import Sun from "./assets/sun.inline.svg";

function Header({
  className = "",
  containerClassName = "",
  showLanguage = true,
  showDevelopersNav = true,
}) {
  const router = useRouter();
  const { theme, toggleTheme, isThemePage } = useTheme();
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <header className={`sticky top-0 z-50 ${className}`}>
        <nav
          id="navbar"
          className={`py-3 transition-colors duration-300 border-b border-[rgba(240,228,255,0.12)] bg-[rgb(18_18_18/95%)] light:bg-white/95`}
        >
          <div
            className={`w-full max-w-[1440px] px-[20px] xl:px-[14px] mx-auto flex items-center justify-between gap-x-5 xl:gap-x-12 ${containerClassName}`}
          >
            <Link
              to="/"
              className="block shrink-0 grow-0 !text-white light:!text-[#121212] "
              aria-label="Solana"
            >
              <SolanaLogo
                style={{ color: "currentColor" }}
                width={134}
                height={40}
                viewBox="0 0 149 22"
                className="block w-[107px] xl:w-[134px]"
              />
            </Link>

            <div className="xl:grow flex items-center max-md:gap-4 md:gap-2">

              {/* Desktop Menu */}
              <div className="hidden xl:block flex-1">
                <HeaderList />
              </div>

              {/* Desktop Search and Language */}
              <div className="flex gap-5 items-center">
                <InkeepSearchBar className="hidden md:block" />
                <InkeepChatButton variant="inline" className="md:hidden" />
                {showLanguage && (
                  <div className="relative items-center hidden xl:flex">
                    <LanguageSelector />
                  </div>
                )}
              </div>

              {/* Mobile Menu */}
              <MobileMenu expanded={expanded} setExpanded={setExpanded} />

              {/* Theme Toggle */}
              {isThemePage && (
                <button
                  className="flex border-none ml-[15px] transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-[15deg] hover:[&>svg]:fill-current"
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
      {/* Secondary nav for /developers/* and /docs/* */}
      {showDevelopersNav &&
        (router.asPath.includes("/developers") ||
          router.asPath.includes("/docs")) && (
          <DevelopersNav containerClassName={containerClassName} />
        )}
    </>
  );
}

export { Header };
