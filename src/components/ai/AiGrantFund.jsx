import classNames from "classnames";
import Image from "next/legacy/image";
import { ArrowRight, Check } from "react-feather";

import { useTranslation } from "next-i18next";
import Button from "../shared/Button";
import RoundedDepthCard from "../shared/RoundedDepthCard";

import nftsEcosystemBlob from "../../../assets/ai/fund.png";
import SolanaLogo from "../../../assets/ai/solana-logo.inline.svg";

import styles from "./AiGrantFund.module.scss";

export default function AiGrantFund() {
  const { t } = useTranslation();

  return (
    <section className="container my-12 py-md-10">
      <div className="position-relative d-flex d-md-block justify-content-center">
        <div className={styles["grant-fund__graphic"]}>
          <Image src={nftsEcosystemBlob} placeholder="blur" alt="" />
        </div>
      </div>
      <RoundedDepthCard
        className={classNames(styles["card"], "px-8 pt-8 pb-5")}
      >
        <SolanaLogo className="mb-7" />
        <h3 className={classNames(styles["card__title"], "h2")}>
          {t("ai.grant-fund.title")}
        </h3>
        <p className={classNames(styles["card__content"], "mb-5")}>
          {t("ai.grant-fund.content")}
        </p>
        <div className={styles["card__points"]}>
          <div>
            <Check />
            {t("ai.grant-fund.check-1")}
          </div>
          <div>
            <Check />
            {t("ai.grant-fund.check-2")}
          </div>
          <div>
            <Check />
            {t("ai.grant-fund.check-3")}
          </div>
        </div>
        <div className="d-flex flex-column">
          <Button
            to="https://solana.org/grants"
            className="mt-6"
            noBorder={true}
            newTab
          >
            {t("ai.grant-fund.cta")}
            <ArrowRight className="ms-2" />
          </Button>
          <span className={styles["card__cta--note"]}>
            {t("ai.grant-fund.cta-note")}
          </span>
        </div>
      </RoundedDepthCard>
    </section>
  );
}
