import { useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import classNames from "classnames";
import Image from "next/image";

import useReducedMotion from "@/hooks/useReducedMotion";

import Button from "@/components/solutions/Button";
import { OpacityInText } from "@/components/shared/Text";
import { MotionSlideIn } from "@/components/shared/Motions";

import styles from "./BlinksHero.module.scss";

const BlinksHero = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [prefersReducedMotion] = useReducedMotion();

  useEffect(() => {
    prefersReducedMotion && videoRef.current.pause();
  }, [prefersReducedMotion]);

  return (
    <section className={classNames(styles.BlinksHero, "page-width")}>
      <div className={styles.ContentWrapper}>
        <OpacityInText
          element="p"
          as="paragraph"
          className={styles.Kicker}
          delayIndex={0}
        >
          {t("solutions-blinks-and-actions.hero.kicker")}
        </OpacityInText>

        <OpacityInText
          element="h1"
          as="heading"
          className={styles.Title}
          delayIndex={0}
        >
          {t("solutions-blinks-and-actions.hero.title")}
        </OpacityInText>

        <OpacityInText
          element="p"
          as="paragraph"
          className={styles.Subtitle}
          delayIndex={0}
        >
          {t("solutions-blinks-and-actions.hero.subtitle")}
        </OpacityInText>

        <MotionSlideIn className={styles.Buttons} delayIndex={0}>
          <Button
            text={t("solutions-blinks-and-actions.hero.build-btn")}
            url="#blinks-developer-resources"
          />
          <Button
            text={t("solutions-blinks-and-actions.hero.see-btn")}
            url="https://dial.to/"
            theme="secondary"
            target="_blank"
          />
        </MotionSlideIn>
      </div>

      <MotionSlideIn
        from="right"
        delayIndex={1}
        className={styles.ImageWrapper}
      >
        <Image
          src="/solutions/blinks-and-actions/hero.png"
          width={561.55}
          height={702.38}
        />
      </MotionSlideIn>
    </section>
  );
};

export default BlinksHero;
