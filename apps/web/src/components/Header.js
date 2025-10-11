"use client";

import Navbar from "react-bootstrap/Navbar";
import { useRouter } from "@@/src/hooks/useRouter";
import { Link } from "../utils/Link";
import { useEffect, useState } from "react";
import SolanaLogo from "../../public/src/img/logos-solana/logotype.inline.svg";
import Moon from "../../public/src/img/icons/Moon.inline.svg";
import Sun from "../../public/src/img/icons/Sun.inline.svg";
import HeaderList from "./header/HeaderList";
import { InkeepSearchBar } from "@@/src/app/components/inkeep/inkeep-searchbar";
import { useTheme } from "@/themecontext";
import { useTranslations } from "next-intl";
import DevelopersNav from "./developers/DevelopersNav/DevelopersNav";
import styles from "./Header.module.scss";
import LanguageSelector from "@/components/LanguageSelector";

const Header = ({ className = "", containerClassName = "" }) => {
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
          expand="xl"
          variant=""
          expanded={expanded}
          onToggle={setExpanded}
        >
          <div
            className={`w-full max-w-[1440px] px-[20px] xl:px-[14px] mx-auto flex items-center justify-between gap-x-5 xl:gap-x-12 ${containerClassName}`}
          >
            <Link to="/" className="block shrink-0 grow-0" aria-label="Solana">
              <SolanaLogo
                style={{ color: "var(--body-text)" }}
                width={134}
                height={40}
                viewBox="0 0 149 22"
                className="block w-[107px] xl:w-[134px]"
              />
            </Link>

            <div className="xl:grow flex items-center gap-x-5 xl:gap-x-12">
              <Navbar.Toggle
                aria-controls="navbarCollapse"
                as="button"
                type="button"
              >
                <span className="bar"></span>
                <span className="bar max-w-[60%] ml-auto"></span>
                <span className="bar"></span>
              </Navbar.Toggle>
              <Navbar.Collapse id="navbarCollapse">
                <HeaderList />
              </Navbar.Collapse>
              <div className="hidden xl:flex items-center gap-x-5">
                <InkeepSearchBar />
                <div className="language-selector relative">
                  <LanguageSelector />
                </div>
              </div>
              {isThemePage && (
                <button
                  className={styles.header__toggle}
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
};

export default Header;
