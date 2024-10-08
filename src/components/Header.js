import Navbar from "react-bootstrap/Navbar";
import { useRouter } from "next/router";
import { Link } from "../utils/Link";
import { useEffect, useState } from "react";
import SolanaLogo from "../../public/src/img/logos-solana/logotype.inline.svg";
import colorModeLight from "../../public/src/img/icons/color-mode-light.svg";
import colorModeDark from "../../public/src/img/icons/color-mode-dark.svg";
import HeaderList from "./header/HeaderList";
import { DocSearch } from "@docsearch/react";
import { useTheme } from "@/themecontext";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import DevelopersNav from "./developers/DevelopersNav/DevelopersNav";

const Header = ({ className = "", containerClassName = "" }) => {
  const router = useRouter();
  const { theme, toggleTheme, isThemePage } = useTheme();
  const { t } = useTranslation();
  const ThemeToggleButton = styled.button`
    background-image: url(${({ theme }) =>
      theme === "light" ? colorModeLight.src : colorModeDark.src});
    background-color: transparent;
    border: none;
    cursor: pointer;
    width: 60px;
    height: 24px;
    background-size: contain;
    margin-left: 20px;
  `;

  const [searchText, setSearchText] = useState("Search");

  useEffect(() => {
    setSearchText(t("commands.search"));

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

  return (
    <>
      <header className={`position-sticky sticky-top ${className}`}>
        <Navbar id="navbar" expand="lg" variant="">
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

              <DocSearch
                // note: these values are safe to be published and are NOT secrets
                apiKey={"011e01358301f5023b02da5db6af7f4d"}
                appId={"FQ12ISJR4B"}
                indexName={"solana-com"}
                placeholder={searchText}
                searchParameters={{
                  facetFilters: [`language:${router?.locale || "en"}`],
                }}
                translations={{
                  button: {
                    buttonText: searchText,
                    buttonAriaLabel: searchText,
                  },
                }}
              />

              {isThemePage && (
                <ThemeToggleButton
                  onClick={toggleTheme}
                  aria-label={t("commands.toggle")}
                />
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
