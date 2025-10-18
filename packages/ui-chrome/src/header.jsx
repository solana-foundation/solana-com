"use client";

import Navbar from "react-bootstrap/Navbar";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "./theme-provider";
import { useRouter } from "@workspace/i18n/use-router";
import { Link } from "./link";
import { HeaderList } from "./header-list";
import { DevelopersNav } from "./developers-nav";
import { InkeepSearchBar } from "./inkeep-searchbar";

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
  return (
    <>
      <header className={`position-sticky sticky-top ${className}`}>
        <Navbar
          id="navbar"
          expand="lg"
          variant=""
          expanded={expanded}
          onToggle={setExpanded}
        >
          <div className={`container-xl ${containerClassName}`}>
            <Link to="/" className="d-flex" aria-label="Solana">
              <SolanaLogo
                style={{ color: "var(--body-text)" }}
                width={149}
                height={22}
              />
            </Link>
            <div className="d-flex align-items-center">
              <Navbar.Toggle
                aria-controls="navbarCollapse"
                as="button"
                type="button"
              >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </Navbar.Toggle>
              <Navbar.Collapse id="navbarCollapse">
                <HeaderList />
              </Navbar.Collapse>
              <InkeepSearchBar />
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
        </Navbar>
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
