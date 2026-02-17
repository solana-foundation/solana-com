import { useState } from "react";
import { Link } from "@/utils/Link";
import { useTranslations } from "next-intl";
import SolanaLogo from "../../../public/src/img/logos-solana/logotype.inline.svg";

const Header = () => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  return (
    // 1020 is a z-index value similar to main Header's one
    // that prevents stacking issues as e.g. modal underneath the main menu
    <>
      <nav
        id="navbar"
        className="navbar navbar-dark sticky-top"
        style={{ zIndex: 1020 }}
      >
        <div className="container-xl">
          <Link to="/" className="d-flex" aria-label="Solana">
            <SolanaLogo
              style={{ color: "var(--body-text)" }}
              width={149}
              height={22}
            />
          </Link>

          <button
            aria-controls="navbarCollapse"
            aria-expanded={isOpen}
            type="button"
            className="navbar-toggler"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
          <div
            id="navbarCollapse"
            className={`navbar-collapse${isOpen ? " show" : ""}`}
          >
            <ul className="navbar-nav align-items-lg-center ms-auto">
              <li className="nav-item">
                <Link
                  className="nav-link nav-link--primary"
                  activeClassName="active"
                  to="/breakpoint"
                >
                  Breakpoint
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link
                  className="nav-link nav-link--primary"
                  activeClassName="active"
                  to="/breakpoint/speakers"
                >
                  {t("breakpoint.header.speakers")}
                </Link>
              </li> */}
              {/* <li className="nav-item">
                <Link
                  className="nav-link nav-link--primary"
                  activeClassName="active"
                  to="/breakpoint/sponsors"
                >
                  {t("breakpoint.header.sponsors")}
                </Link>
              </li> */}
              <li className="nav-item">
                <Link
                  className="nav-link nav-link--primary"
                  activeClassName="active"
                  to="/breakpoint/travel"
                >
                  {t("breakpoint.header.travel")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link nav-link--primary"
                  activeClassName="active"
                  to="/breakpoint/faq"
                >
                  {t("breakpoint.header.faq")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
