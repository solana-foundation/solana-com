import { useTranslation } from "next-i18next";
import styles from "./AccelerateHeader.module.scss";
import SolanaWordMark from "../../../public/src/img/branding/solanaWordMark.svg";
import SolanaMark from "../../../public/img/logomark-white.svg";
import AccelerateLogo from "../../../public/img/accelerate-logo.svg";
import Dots from "../../../public/img/mobile-dots.svg";
import Image from "next/image";
import { ArrowUpRight, Menu, Ticket, X } from "lucide-react";
import { useState } from "react";
import { AccelerateApplyButton } from "./AccelerateApplyButton";

const Header = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const handleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    // 1020 is a z-index value similar to main Header's one
    // that prevents stacking issues as e.g. modal underneath the main menu
    //  <Navbar
    //    sticky="top"
    //    id="navbar"
    //    expand="lg"
    //    variant=""
    //    className={classNames("navbar-dark", styles["accelerate-navbar"])}
    //    style={{ zIndex: 1020 }}
    //  >
    //    <div className="container-xl">
    //      <Link to="/" className="d-flex" aria-label="Solana">
    //        <SolanaLogo
    //          style={{ color: "var(--body-text)" }}
    //          width={149}
    //          height={22}
    //        />
    //      </Link>

    //      <Navbar.Toggle aria-controls="navbarCollapse" as="button" type="button">
    //        <span className="bar"></span>
    //        <span className="bar"></span>
    //        <span className="bar"></span>
    //      </Navbar.Toggle>
    //      <Navbar.Collapse id="navbarCollapse">
    //        <ul className="navbar-nav align-items-lg-center ms-auto">
    //          <li className="nav-item">
    //            <Link
    //              className="nav-link nav-link--primary"
    //              activeClassName="active"
    //              to="/accelerate"
    //            >
    //              <AccelerateButton>
    //                {t("accelerate.header.home")}
    //              </AccelerateButton>
    //            </Link>
    //          </li>
    //          <li className="nav-item">
    //            <Link
    //              className="nav-link nav-link--primary"
    //              activeClassName="active"
    //              to="/accelerate/ship-or-die"
    //            >
    //              <AccelerateButton variant="ship">
    //                {t("accelerate.header.ship")}
    //              </AccelerateButton>
    //            </Link>
    //          </li>
    //          <li className="nav-item">
    //            <Link
    //              className="nav-link nav-link--primary"
    //              activeClassName="active"
    //              to="/accelerate/scale-or-die"
    //            >
    //              <AccelerateButton variant="scale">
    //                {t("accelerate.header.scale")}
    //              </AccelerateButton>
    //            </Link>
    //          </li>
    //          <li className="nav-item">
    //            <Link
    //              href="https://lu.ma/accelerate2025"
    //              className={styles["cta"]}
    //            >
    //              {t("accelerate.header.get-tickets")}
    //              <span>{t("accelerate.header.get-tickets")}</span>
    //            </Link>
    //          </li>
    //        </ul>
    //      </Navbar.Collapse>
    //    </div>
    //  </Navbar>
    <>
      <div className={styles.header}>
        <div className={styles.container}>
          <div className={styles.col}>
            <Image src={SolanaMark} alt="Solana mark" width={32} height={27} />
            <Image
              src={SolanaWordMark}
              alt="Solana mark word"
              width={143}
              height={20}
              className={styles.logoWord}
            />
          </div>

          <Image
            src={AccelerateLogo}
            alt="Accelerate logo"
            width={200}
            height={73}
            className={styles.logo}
          />

          <div className={styles.col}>
            <a href="#speakers">Speakers</a>
            <a href="#sponsors">Sponsors</a>
            <a href="#faq">FAQ</a>
            <a className={styles.cta} href="#tickets">
              <span>
                Get tickets <ArrowUpRight />
              </span>
            </a>
            <div className={styles.menuIcon}>
              {isOpen ? (
                <X size={32} onClick={handleMenu} />
              ) : (
                <Menu size={32} onClick={handleMenu} />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div
        className={styles.mobileMenu}
        style={{ height: isOpen ? "100vh" : "0" }}
      >
        <Image
          src={Dots}
          alt="Background"
          fill
          className={styles.mobileBackground}
        />
        <div className={styles.mobileLinks}>
          <a
            href="#speakers"
            onClick={(e) => {
              e.preventDefault();
              handleMenu();
              document
                .getElementById("speakers")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Speakers
          </a>
          <a
            href="#sponsors"
            onClick={(e) => {
              e.preventDefault();
              handleMenu();
              document
                .getElementById("sponsors")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Sponsors
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              handleMenu();
              document
                .getElementById("faq")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            FAQ
          </a>
        </div>

        <a
          href="#tickets"
          onClick={(e) => {
            e.preventDefault();
            handleMenu();
            document
              .getElementById("tickets")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className={styles.mobileCta}
        >
          Get tickets <Ticket size={24} />
        </a>
      </div>
    </>
  );
};

export default Header;
