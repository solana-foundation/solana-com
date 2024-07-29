import { useState } from "react";
import { useTranslation } from "next-i18next";
import classNames from "classnames";
import Image from "next/legacy/image";
import TypeformModal from "../shared/TypeformModal";
import styles from "./ECDRHero.module.scss";
import IndexBtn from "../index/IndexBtn";
import SolanaRing from "../../../public/src/img/ecdr/solana-ring.png";

const ECDRHero = () => {
  const { t } = useTranslation("common");
  const [showTypeformModal, setShowTypeformModal] = useState(false);

  return (
    <div className={classNames("pb-10", styles["ecdr-hero"])}>
      <div className="container text-center">
        <div className={styles["ecdr-hero__inner"]}>
          <div className={styles["ecdr-hero__ring--effect1"]} />
          <div className={styles["ecdr-hero__ring--img"]}>
            <Image
              src={SolanaRing}
              alt=""
              placeholder="blur"
              objectFit="contain"
              objectPosition="top"
              layout="fill"
              width={850}
              height={850}
            />
          </div>
          <div className={styles["ecdr-hero__ring--effect2"]} />
          <h1 className={classNames("mb-2", styles["ecdr-hero__heading"])}>
            {t("ecdr.hero.headline")}
          </h1>
          <div className="row">
            <div className="col-md-8 mx-auto">
              <p
                className={classNames(
                  "mt-2 mb-5",
                  styles["ecdr-hero__subHeading"],
                )}
              >
                {t("ecdr.hero.subheadline")}
              </p>
              <p className={classNames("my-1", styles["ecdr-hero__note"])}>
                {t("ecdr.hero.note")}
              </p>
            </div>
          </div>
          <IndexBtn
            className="d-inline-block mt-2 mt-md-4 px-md-6 py-md-4 me-2"
            variant="secondary"
            size="large"
            onClick={() => {
              setShowTypeformModal(true);
              gtag("event", "Button click", {
                event_category: "Open modal",
                event_label: "EC Developers Report - Get in touch modal ",
              });
            }}
          >
            {t("ecdr.hero.cta")}
          </IndexBtn>
        </div>
      </div>

      <TypeformModal
        showTypeformModal={showTypeformModal}
        setShowTypeformModal={setShowTypeformModal}
        typeformID="KFNfboXj"
      />
    </div>
  );
};

export default ECDRHero;
