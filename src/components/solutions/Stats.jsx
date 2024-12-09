import { useRef } from "react";
import { Trans } from "next-i18next";
import classNames from "classnames";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";
import { MotionSlideIn } from "@/components/shared/Motions";
import { AnimatedText } from "@/components/shared/Text";

import styles from "./Stats.module.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Stats = ({
  titleContent,
  subtitleKey,
  kickerKey,
  kickerUrl,
  buttonsComponent,
  stats,
  className,
  buttonsClassName,
  statsClassName,
}) => {
  const container = useRef(null);

  useGSAP(
    () => {
      const titles = gsap.utils.toArray(".stats-title");

      titles.forEach((title) => {
        gsap.from(title, {
          backgroundPosition: "100% 0%",
          ease: "none",
          scrollTrigger: {
            trigger: title,
            start: "top 80%",
            end: "top 10%",
            scrub: 1,
          },
        });
      });
    },
    { scope: container },
  );

  return (
    <div
      className={classNames(styles.Stats, "page-width", className)}
      ref={container}
    >
      <div className={styles.Container}>
        <div className={styles.ContentContainer}>
          {titleContent && (
            <AnimatedText element="h2" as="heading" className={styles.Title}>
              {titleContent}
            </AnimatedText>
          )}

          {subtitleKey && (
            <AnimatedText
              element="p"
              as="paragraph"
              className={styles.Subtitle}
            >
              <Trans i18nKey={subtitleKey} />
            </AnimatedText>
          )}

          {buttonsComponent && (
            <MotionSlideIn
              className={classNames(styles.ButtonContainer, buttonsClassName)}
            >
              {buttonsComponent}
            </MotionSlideIn>
          )}
        </div>

        <div className={classNames(styles.StatsContainer, statsClassName)}>
          {kickerKey && !kickerUrl && (
            <AnimatedText
              element="p"
              as="paragraph"
              className={styles.StatsKicker}
            >
              {kickerKey}
            </AnimatedText>
          )}

          {kickerKey && kickerUrl && (
            <AnimatedText
              element="p"
              as="paragraph"
              className={styles.StatsKicker}
            >
              <Link
                href={kickerUrl}
                className={styles.StatsKicker}
                target="_blank"
              >
                {kickerKey}
              </Link>
            </AnimatedText>
          )}

          {stats.map((stat, index) => (
            <div className={styles.Stat} key={`stat-${index}`}>
              <h3 className={`${styles.StatValue} stats-title`}>
                {stat.value}
              </h3>
              <p className={styles.StatLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
