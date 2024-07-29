import classNames from "classnames";
import Image from "next/image";

import Button from "../../../shared/Button";
import { useTranslation } from "next-i18next";

import heroImg from "../../../../../assets/developers/hero-geometry.png";
import StackExchangeIcon from "../../../../../assets/developers/stackexchange.inline.svg";

import styles from "./DevelopersHeroSection.module.scss";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section
      className={classNames("pt-7 pt-lg-12 pb-md-14", styles["hero-section"])}
    >
      <div className="container position-relative">
        <div className={styles["hero-section__image"]}>
          <Image src={heroImg} alt="" placeholder="blur" priority />
        </div>
        <div className={styles["hero-section__light"]} />
        <div className={styles["content"]}>
          <h1>{t("developers.hero.title")}</h1>
          <p className="h6 subdued">{t("developers.hero.description")}</p>
          <div className={styles["content__hero-buttons"]}>
            <Button
              to="/docs/intro/quick-start"
              newTab={false}
              variant="secondary"
            >
              {t("developers.hero.build")}
            </Button>
            <Button
              to="https://solana.stackexchange.com/"
              newTab
              className={styles["content__btn-icon"]}
            >
              <span>Stack Exchange</span>
              <StackExchangeIcon width={16} height={20} fill="currentColor" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
