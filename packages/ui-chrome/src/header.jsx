"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "./theme-provider";
import { useRouter } from "@workspace/i18n/use-router";
import { Link } from "./link";
import { HeaderList } from "./header-list";
import { DevelopersNav } from "./developers-nav";
import { InkeepSearchBar } from "./inkeep-searchbar";
import { LanguageSelector } from "./language-selector";

import SolanaLogo from "./assets/logotype.inline.svg";
import Moon from "./assets/moon.inline.svg";
import Sun from "./assets/sun.inline.svg";

function Header({ className = "", containerClassName = "" }) {
  const router = useRouter();
  const { theme, toggleTheme, isThemePage } = useTheme();
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      if (isThemePage) {
        navbar.classList.remove("navbar-light", "navbar-dark");
        navbar.classList.add("navbar-" + theme);
      } else {
        navbar.classList.add("navbar-dark");
      }
    }
  }, [t, theme, isThemePage]);

  useEffect(() => {
    // Close mobile navigation on route change
    setExpanded(false);
  }, [router.asPath]);

  const toggleMenu = () => setExpanded(!expanded);

  return (
    <>
      <header className={`sticky top-0 z-50 ${className}`}>
        <nav
          id="navbar"
          className="navbar py-3 transition-colors duration-300 border-b border-[rgba(240,228,255,0.12)]"
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
                style={{ color: "var(--body-text)" }}
                width={134}
                height={40}
                viewBox="0 0 149 22"
                className="block w-[107px] xl:w-[134px]"
              />
            </Link>

            <div className="xl:grow flex items-center gap-x-5 xl:gap-x-12">
              <button
                className="navbar-toggler xl:hidden -m-1.5 border-0 cursor-pointer p-3 h-10 w-10"
                aria-controls="navbarCollapse"
                aria-expanded={expanded}
                onClick={toggleMenu}
                type="button"
              >
                <span className={`bar ${expanded ? "" : ""}`}></span>
                <span
                  className={`bar max-w-[60%] ml-auto ${expanded ? "" : ""}`}
                ></span>
                <span className={`bar ${expanded ? "" : ""}`}></span>
              </button>
              <div
                id="navbarCollapse"
                className={`navbar-collapse ${expanded ? "block" : "hidden"} xl:block`}
              >
                <HeaderList />
              </div>
              <div className="hidden xl:flex items-center gap-x-5">
                <InkeepSearchBar />
                <div className="language-selector relative">
                  <LanguageSelector />
                </div>
              </div>
              {isThemePage && (
                <button
                  className="flex border-none ml-[15px] transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-[15deg] hover:[&>svg]:fill-[var(--body-text)]"
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
      {(router.asPath.includes("/developers") ||
        router.asPath.includes("/docs")) && (
        <DevelopersNav containerClassName={containerClassName} />
      )}
    </>
  );
}

export { Header };
