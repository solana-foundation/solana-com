"use client";

import classNames from "classnames";
import { useTranslations } from "next-intl";
import Button from "@/components/shared/Button";
import styles from "./SkillsHero.module.scss";

export default function SkillsHero() {
  const t = useTranslations();

  return (
    <div className="position-relative py-10">
      <div className={styles["hero__bg"]} />
      <div className={classNames("container", styles["hero__container"])}>
        <div className={styles["hero__content"]}>
          <h1 className={classNames("h1 mb-4", styles["hero__title"])}>
            <span className={styles["hero__title--gradient"]}>Solana</span> Developer Skills
          </h1>
          <p className="subdued mb-6 h5">
            A curated collection of AI agent skills for Solana development.
            <br />
            Equip your AI assistant with specialized knowledge for building on Solana.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <Button
              to="https://github.com/solana-foundation/solana-dev-skill"
              newTab
              size="large"
              variant="secondary"
            >
              View on GitHub
            </Button>
            <Button
              to="#install"
              size="large"
              variant="outline"
            >
              Quick Install
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
