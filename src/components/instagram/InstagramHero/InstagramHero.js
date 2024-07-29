import { memo, useState } from "react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import Image from "next/legacy/image";
import styles from "./InstagramHero.module.scss";
import AnimatedCta from "../../shared/AnimatedCta/AnimatedCta";
import SolanaLogo from "../../../../assets/instagram/hero/solana-logo.inline.svg";
import InstagramLogo from "../../../../assets/instagram/hero/instagram-logo.png";
import FacebookLogo from "../../../../assets/instagram/hero/facebook-logo.png";
import InstagramHeroImage from "../../../../assets/instagram/hero/solana-instagram-nfts-hero-image.jpg";
import VideoModal from "../../shared/VideoModal";
import Link from "../../../utils/Link";

export default memo(function InstagramHero() {
  const { t } = useTranslation("common");
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <section className={styles["instagram-hero"]}>
      <div
        className={classNames(
          "container-fluid",
          styles["instagram-hero__container"],
        )}
      >
        <div className={styles["instagram-hero__content"]}>
          <div className={styles["instagram-hero__logos"]}>
            <SolanaLogo className={styles["instagram-hero__logo"]} />
            <div
              className={classNames(
                "d-inline-block align-middle",
                styles["instagram-hero__logo"],
              )}
            >
              <Image src={InstagramLogo} alt="Instagram" priority="true" />
            </div>
            <div
              className={classNames(
                "d-inline-block align-middle",
                styles["instagram-hero__logo"],
              )}
            >
              <Image src={FacebookLogo} alt="Facebook" priority="true" />
            </div>
          </div>
          <h1 className={styles["instagram-hero__title"]}>
            {t("instagram.title")}
          </h1>
          <p className={styles["instagram-hero__description"]}>
            {t("instagram.description")}
          </p>
          <div className="d-md-inline-block text-center">
            <AnimatedCta size="large" to="#giveaway-form">
              {t("instagram.enter-now")}
            </AnimatedCta>
            <Link
              to="#"
              className="d-block py-3 py-md-0 small"
              onClick={() => {
                setShowVideoModal(true);
              }}
            >
              {t("instagram.walkthrough")}
            </Link>
          </div>
        </div>
        <div className={styles["instagram-hero__image"]}>
          <Image
            alt={t("instagram.title")}
            src={InstagramHeroImage}
            quality={50}
          />
        </div>
      </div>
      <VideoModal
        type="youtube"
        showVideoModal={showVideoModal}
        setShowVideoModal={setShowVideoModal}
        urlId="aFICmtCyZiw"
      />
    </section>
  );
});
