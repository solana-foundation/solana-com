import classNames from "classnames";
import Image from "next/legacy/image";
import { useTranslation } from "next-i18next";
import Button from "@/components/shared/Button";
import DevelopersIcon from "../../../../../assets/hackathon/hero/developers.inline.svg";
import FundingIcon from "../../../../../assets/hackathon/hero/funding.inline.svg";
import ProjectsIcon from "../../../../../assets/hackathon/hero/projects.inline.svg";
import graphicLeft from "../../../../../assets/hackathon/hero/graphic-left.png";
import graphicRight from "../../../../../assets/hackathon/hero/graphic-right.png";
import { ArrowUpRight } from "react-feather";

import styles from "./HackathonHeroSection.module.scss";

function StatComponent({ Icon, title, subtitle }) {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ gap: 16 }}
    >
      {Icon && <Icon />}
      <div className="d-flex flex-column">
        <span className={styles["stats-title"]}>{title}</span>
        <p
          className={classNames("subdued", styles["stat-subtitle"])}
          style={{ margin: 0 }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default function HackathonHeroSection() {
  const { t } = useTranslation();

  return (
    <section className={styles["hero-section"]}>
      <div className="container">
        <h1 className={styles["title"]}>{t("hackathon.index.title")}</h1>
        <p className={classNames("subdued", styles["subtitle"])}>
          {t("hackathon.index.description")}
        </p>
        <div className={styles["signup-form"]}>
          <Button to="https://arena.colosseum.org/signup" newTab rel="nofollow">
            {t("hackathon.index.cta")}
            <ArrowUpRight />
          </Button>
        </div>
        <div
          className={classNames(
            "d-flex justify-content-center align-items-center",
            styles["hero-section__stats-container"],
          )}
        >
          <StatComponent
            Icon={DevelopersIcon}
            title={t("hackathon.index.hero.developers.title")}
            subtitle={t("hackathon.index.hero.developers.subtitle")}
          />
          <StatComponent
            Icon={ProjectsIcon}
            title={t("hackathon.index.hero.projects.title")}
            subtitle={t("hackathon.index.hero.projects.subtitle")}
          />
          <StatComponent
            Icon={FundingIcon}
            title={t("hackathon.index.hero.funding.title")}
            subtitle={t("hackathon.index.hero.funding.subtitle")}
          />
        </div>
      </div>
      <div className={styles["hero-section__graphic-left"]}>
        <Image src={graphicLeft} />
      </div>
      <div className={styles["hero-section__graphic-right"]}>
        <Image src={graphicRight} />
      </div>
      <div className={styles["hero-section__background"]}></div>
    </section>
  );
}
