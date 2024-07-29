import Navbar from "react-bootstrap/Navbar";
import Image from "next/image";
import { Link } from "../../../utils/Link";
import SolanaLogo from "../../../../public/src/img/logos-solana/logotype.svg";
import { useTranslation } from "next-i18next";
import AnimatedCta from "../../shared/AnimatedCta/AnimatedCta";

const InstagramHeader = () => {
  const { t } = useTranslation("common");
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
        <div className="container-fluid">
          <Link to="/" className="d-flex">
            <Image
              alt={t("instagram.title")}
              src={SolanaLogo}
              width={149}
              height={22}
              priority="true"
            />
          </Link>

          <ul className="navbar-nav small align-items-lg-center ms-auto">
            <li className="nav-item p-4 p-lg-0 d-none d-lg-block">
              <AnimatedCta to="#giveaway-form">
                {t("instagram.enter-now")}
              </AnimatedCta>
            </li>
          </ul>

          {/* <Navbar.Toggle
            aria-controls="navbarCollapse"
            as="button"
            type="button"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="navbarCollapse">
            <ul className="navbar-nav small align-items-lg-center ms-auto">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  activeClassName="active"
                  to="/summercamp"
                >
                  Summer Camp
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  activeClassName="active"
                  to="/summercamp/resources"
                >
                  Resources
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  activeClassName="active"
                  to="/summercamp/teamup"
                >
                  Find a team
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  activeClassName="active"
                  to="/summercamp/ideas"
                >
                  Ideas
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  activeClassName="active"
                  to="/summercamp/faq"
                >
                  FAQs
                </Link>
              </li>
              <li className="nav-item p-4 p-lg-0 d-none d-lg-block">
                <AnimatedCta onClick={scrollToGiveawayForm}>
                  {t("instagram.enter-now")}
                </AnimatedCta>
              </li>
            </ul>
          </Navbar.Collapse> */}
        </div>
      </Navbar>
    </>
  );
};

export default InstagramHeader;
