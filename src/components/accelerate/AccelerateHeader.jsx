import { useTranslation } from "next-i18next";
import styles from "./AccelerateHeader.module.scss";
import SolanaWordMark from "../../../public/src/img/branding/solanaWordMark.svg";
import SolanaMark from "../../../public/img/logomark-white.svg";
import AccelerateLogo from "../../../public/img/accelerate-logo.svg";
import Dots from "../../../public/img/mobile-dots.svg";
import Image from "next/image";
import { ArrowUpRight, Menu, Ticket, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const Header = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const handleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div className={styles.header}>
        <div className={styles.container}>
          <div className={styles.col}>
            <a href="https://solana.com" className={styles.solanaLink}>
              <Image
                src={SolanaMark}
                alt="Solana mark"
                width={32}
                height={27}
              />
              <Image
                src={SolanaWordMark}
                alt="Solana mark word"
                width={143}
                height={20}
                className={styles.logoWord}
              />
            </a>
          </div>

          <Link
            href="/accelerate"
            onClick={() => {
              handleMenu();
            }}
          >
            <Image
              src={AccelerateLogo}
              alt="Accelerate logo"
              width={200}
              height={73}
              className={styles.logo}
            />
          </Link>

          <div className={styles.col}>
            <Link className={styles.cta} href="/breakpoint">
              <span>
                {t("accelerate.header.get-tickets")} <ArrowUpRight />
              </span>
            </Link>
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
        <div className={styles.mobileLinks}></div>

        <Link
          href="/breakpoint"
          onClick={() => {
            handleMenu();
          }}
          className={styles.mobileCta}
        >
          {t("accelerate.header.get-tickets")} <Ticket size={24} />
        </Link>
      </div>
    </>
  );
};

export default Header;
