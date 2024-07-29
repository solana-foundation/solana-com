import classNames from "classnames";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "react-feather";

import { Trans, useTranslation } from "next-i18next";
import Button from "../shared/Button";

import bgSmall from "../../../assets/ai/hero-bg-small.png";
import bgLarge from "../../../assets/ai/hero-bg-large.png";

import styles from "./AiHero.module.scss";
import TypeformModal from "../shared/TypeformModal";

export default function AiHero() {
  const [showTypeformModal, setShowTypeformModal] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="position-relative mb-8">
      <div className={styles["hero__bg--small"]}>
        <Image src={bgSmall} alt="" priority fill />
      </div>
      <div className={styles["hero__bg--large"]}>
        <Image src={bgLarge} alt="" priority fill />
      </div>
      <div className={classNames("container", styles["hero__container"])}>
        <div className={styles["hero__content"]}>
          <h1 className={classNames("h2 mb-4", styles["hero__title"])}>
            <Trans
              i18nKey="ai.hero.title"
              components={{
                colored: <span className={styles["hero__title--colored"]} />,
              }}
            />
          </h1>
          <div className={classNames("w-lg-75", styles["hero__points"])}>
            <div>{t("ai.hero.point-1")}</div>
            <div>{t("ai.hero.point-2")}</div>
            <div>{t("ai.hero.point-3")}</div>
          </div>
        </div>
        <Button
          onClick={() => setShowTypeformModal(true)}
          className="d-inline-block mt-2 mt-md-4 px-md-6 py-md-4 me-sm-2"
          variant="tertiary"
          size="large"
          noBorder={true}
        >
          {t("ai.hero.cta")}
          <ArrowRight className="ms-6" />
        </Button>
      </div>
      <TypeformModal
        showTypeformModal={showTypeformModal}
        setShowTypeformModal={setShowTypeformModal}
        typeformID="k1tsmZTx"
      />
    </div>
  );
}
