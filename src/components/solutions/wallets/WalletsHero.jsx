import { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import classNames from "classnames";

import useReducedMotion from "@/hooks/useReducedMotion";

import Button from "@/components/solutions/Button";
import { OpacityInText } from "@/components/shared/Text";

import styles from "./WalletsHero.module.scss";

import { MotionSlideIn } from "@/components/shared/Motions";

const WalletsHero = () => {
  const { t } = useTranslation();

  const [active, setActive] = useState(false);
  const videoRef = useRef(null);
  const [prefersReducedMotion] = useReducedMotion();

  useEffect(() => {
    setTimeout(() => setActive(true), 500);
  }, []);

  useEffect(() => {
    prefersReducedMotion && videoRef.current.pause();
  }, [prefersReducedMotion]);

  return (
    <section className={classNames(styles.WalletsHero, "page-width")}>
      <div className={styles.ContentWrapper}>
        <OpacityInText
          element="p"
          as="paragraph"
          className={styles.Kicker}
          delayIndex={0}
        >
          {t("solutions-wallets.hero.kicker")}
        </OpacityInText>

        <OpacityInText
          element="h1"
          as="heading"
          className={styles.Title}
          delayIndex={0}
        >
          {t("solutions-wallets.hero.title")}
        </OpacityInText>

        <OpacityInText
          element="p"
          as="paragraph"
          className={styles.Subtitle}
          delayIndex={0}
        >
          {t("solutions-wallets.hero.subtitle")}
        </OpacityInText>

        <MotionSlideIn className={styles.Buttons} delayIndex={0}>
          <Button
            text={t("solutions-wallets.hero.start-btn")}
            url="/learn/wallets"
          />
          <Button
            text={t("solutions-wallets.hero.explore-btn-mobile")}
            url="/solutions/wallets-explorer"
            theme="secondary"
            classes="d-md-none"
            target="_blank"
          />
          <Button
            text={t("solutions-wallets.hero.explore-btn-desktop")}
            url="/solutions/wallets-explorer"
            theme="secondary"
            classes="d-none d-md-block"
            target="_blank"
          />
        </MotionSlideIn>
      </div>

      <div
        className={classNames(styles.VideoWrapper, active ? styles.Active : "")}
      >
        <video
          width="710"
          height="900"
          muted
          loop
          autoPlay
          poster="/solutions/wallets/Wallets_Hero.jpeg"
          ref={videoRef}
        >
          <source
            src="https://player.vimeo.com/progressive_redirect/playback/1010825600/rendition/720p/file.mp4?loc=external&signature=049750a1c61fc4a7b4538b87abf58b358033c5098d5962d8a30b9bd5c3df5855"
            type="video/mp4"
          />
        </video>
      </div>
    </section>
  );
};

export default WalletsHero;
