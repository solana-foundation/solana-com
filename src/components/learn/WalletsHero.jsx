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
    <section className={classNames(styles.WalletsHero)}>
      <div className={styles.ContentWrapper}>
        <div className={styles.ContentInnerWrapper}>
          <OpacityInText
            element="p"
            as="paragraph"
            className={styles.Kicker}
            delayIndex={0}
          >
            {t("learn-wallets.hero.kicker")}
          </OpacityInText>

          <OpacityInText
            element="h1"
            as="heading"
            className={styles.Title}
            delayIndex={0}
          >
            {t("learn-wallets.hero.title")}
          </OpacityInText>

          <OpacityInText
            element="p"
            as="paragraph"
            className={styles.Subtitle}
            delayIndex={0}
          >
            {t("learn-wallets.hero.subtitle")}
          </OpacityInText>

          <MotionSlideIn className={styles.Buttons} delayIndex={0}>
            <Button
              text={t("learn-wallets.hero.find-btn")}
              url="/solutions/wallets-explorer"
            />
          </MotionSlideIn>
        </div>
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
          poster="/src/img/learn/wallets/learn-wallets-hero.webp"
          ref={videoRef}
        >
          <source
            src="https://player.vimeo.com/progressive_redirect/playback/1028498351/rendition/720p/file.mp4?loc=external&signature=ee73d35d27fa64d553a4dd6da5c661eac19fc9b48467e5b6a897e0028a300feb"
            type="video/mp4"
          />
        </video>
      </div>
    </section>
  );
};

export default WalletsHero;
