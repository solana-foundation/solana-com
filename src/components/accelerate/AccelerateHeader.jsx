import Navbar from "react-bootstrap/Navbar";
import Link from "../shared/Link";
import { useTranslation } from "next-i18next";
import SolanaLogo from "../../../public/src/img/logos-solana/logotype.inline.svg";
import { AccelerateButton } from "./AccelerateNavButton";
import styles from "./AccelerateHeader.module.scss";
import classNames from "classnames";

const Header = () => {
  const { t } = useTranslation();

  return (
    // 1020 is a z-index value similar to main Header's one
    // that prevents stacking issues as e.g. modal underneath the main menu
    <Navbar
      sticky="top"
      id="navbar"
      expand="lg"
      variant=""
      className={classNames("navbar-dark", styles["accelerate-navbar"])}
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

        <Navbar.Toggle aria-controls="navbarCollapse" as="button" type="button">
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
                to="/accelerate"
              >
                <AccelerateButton>
                  {t("accelerate.header.home")}
                </AccelerateButton>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link nav-link--primary"
                activeClassName="active"
                to="/accelerate/scale-or-die"
              >
                <AccelerateButton variant="scale">
                  {t("accelerate.header.scale")}
                </AccelerateButton>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link nav-link--primary"
                activeClassName="active"
                to="/accelerate/ship-or-die"
              >
                <AccelerateButton variant="ship">
                  {t("accelerate.header.ship")}
                </AccelerateButton>
              </Link>
            </li>
          </ul>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;
