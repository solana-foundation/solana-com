import Navbar from "react-bootstrap/Navbar";
import Image from "next/image";
import Link from "../shared/Link";
import { useTranslation } from "next-i18next";
import SolanaLogo from "../../../public/src/img/logos-solana/logotype.svg";

const Header = () => {
  const { t } = useTranslation();

  return (
    // 1020 is a z-index value similar to main Header's one
    // that prevents stacking issues as e.g. modal underneath the main menu
    <>
      <Navbar
        sticky="top"
        id="navbar"
        expand="lg"
        variant=""
        className="navbar-dark"
        style={{ zIndex: 1020 }}
      >
        <div className="container-xl">
          <Link to="/" className="d-flex">
            <Image
              alt="Solana"
              src={SolanaLogo}
              width={149}
              height={22}
              priority
            />
          </Link>

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
              <li className="nav-item">
                <Link
                  className="nav-link nav-link--primary"
                  activeClassName="active"
                  to="/breakpoint/tickets"
                >
                  {t("breakpoint.header.tickets")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link nav-link--primary"
                  activeClassName="active"
                  to="https://e.jublia.com/SolanaBreakpoint/agenda/"
                >
                  {t("breakpoint.header.schedule")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link nav-link--primary"
                  activeClassName="active"
                  to="/breakpoint/speakers"
                >
                  {t("breakpoint.header.speakers")}
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link nav-link--primary"
                  activeClassName="active"
                  to="/breakpoint/side-events"
                >
                  {t("breakpoint.header.events")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link nav-link--primary"
                  activeClassName="active"
                  to="/breakpoint/sponsors"
                >
                  {t("breakpoint.header.sponsors")}
                </Link>
              </li>
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
          </Navbar.Collapse>
        </div>
      </Navbar>
    </>
  );
};

export default Header;
