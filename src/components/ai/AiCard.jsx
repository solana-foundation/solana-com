import classNames from "classnames";
import Image from "next/image";
import { ArrowRight } from "react-feather";

import { useTranslation } from "next-i18next";
import Button from "../shared/Button";
import RoundedDepthCard from "../shared/RoundedDepthCard";
import nftsEcosystemBlob from "../../../assets/ai/fund.png";
import sendAIhackathon from "../../../assets/ai/sendai-hackathon.png";
import styles from "./AiCard.module.scss";
import Link from "next/link";

export default function AiCard() {
  const { t } = useTranslation();

  return (
    <section className="container my-12 py-md-10">
      <div className="position-relative d-flex d-md-block justify-content-center">
        <div className={styles["ai-card__graphic"]}>
          <Image src={nftsEcosystemBlob} placeholder="blur" alt="" />
        </div>
      </div>
      <RoundedDepthCard
        className={classNames(styles["card"], "px-8 pt-8 pb-5")}
      >
        <h3 className={classNames(styles["card__title"], "h2")}>
          {t("ai.card.title")}
        </h3>

        <div className={classNames(styles["card__content"], "my-5")}>
          <ul>
            <li>{t("ai.card.check-1")}</li>
            <li>{t("ai.card.check-2")}</li>
            <li>{t("ai.card.check-3")}</li>
          </ul>
        </div>

        <div className="d-flex flex-column">
          <Button
            to="https://x.com/knimkar/status/1863719025500623344"
            className="mt-6"
            noBorder={true}
            newTab
          >
            {t("ai.card.cta")}
            <ArrowRight className="ms-2" />
          </Button>
        </div>
      </RoundedDepthCard>

      <RoundedDepthCard
        className={classNames(styles["card"], "px-8 pt-8 pb-5")}
      >
        <h3 className={classNames(styles["card__title"], "h2")}>
          {t("ai.hackathon.title")}
        </h3>

        <div className={classNames(styles["card__content"], "my-5")}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-md-items-center">
            <ul>
              <li>{t("ai.hackathon.check-1")}</li>
              <li>{t("ai.hackathon.check-2")}</li>
              <li>{t("ai.hackathon.check-3")}</li>
              <li>{t("ai.hackathon.check-4")}</li>
            </ul>
            <Link
              href="https://www.solanaagentkit.xyz/?ref=solana.com/ai"
              target="_blank"
            >
              <Image
                src={sendAIhackathon}
                alt={t("ai.hackathon.title")}
                height={100}
              />
            </Link>
          </div>
        </div>

        <div className="d-flex flex-column flex-lg-row mt-6">
          <Button
            to="https://x.com/sendaifun/status/1879665070709621176"
            className="me-lg-2 mb-2 mb-lg-0"
            noBorder={true}
            newTab
          >
            {t("ai.hackathon.cta")}
            <ArrowRight className="ms-2" />
          </Button>
          <Button
            newTab
            to="https://solana.thegrid.id/?tags=id1737015029-ulUU9ISNQxOUF2UjdrJ6BQ,id1737015507-P6TfbQFKThCH7iMnt087KA"
            variant="outline"
          >
            {t("ai.hero.cta-2")}
            <ArrowRight className="ms-2" />
          </Button>
        </div>
      </RoundedDepthCard>
    </section>
  );
}
