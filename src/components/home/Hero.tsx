import { useEffect, useRef } from "react";
import { useTranslation, Trans } from "next-i18next";

import useReducedMotion from "@/hooks/useReducedMotion";

import Button from "@/components/solutions/Button";
import { OpacityInText } from "@/components/shared/Text";
import { MotionSlideIn } from "@/components/shared/Motions";

import styles from "@/components/home/Hero.module.scss";

const Hero = () => {
  const { t } = useTranslation();
  const [prefersReducedMotion] = useReducedMotion();

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && prefersReducedMotion) {
      videoRef.current.pause();
    }
  }, [prefersReducedMotion]);

  return (
    <div className={styles.Hero}>
      <div className={styles.ContentWrapper}>
        <OpacityInText element="h1" as="heading" className={styles.HeroTitle}>
          {/* {t("home.hero.title")} */}
          <Trans
            i18nKey="home.hero.title"
            components={{
              kernout: <span className={styles.KernOut} />,
            }}
          />
        </OpacityInText>

        <OpacityInText
          element="p"
          as="paragraph"
          className={styles.HeroSubtitle}
        >
          {t("home.hero.subtitle")}
        </OpacityInText>

        <MotionSlideIn>
          <div className={styles.HeroButtons}>
            <Button
              text={t("home.hero.start-btn")}
              url="/docs/intro/quick-start"
              target="_blank"
            />
          </div>
        </MotionSlideIn>
      </div>

      <div className={styles.VideoWrapper}>
        <div className={styles.Gradient} />
        <video
          muted
          loop
          autoPlay
          playsInline
          poster="/src/img/home/home-hero.webp"
          ref={videoRef}
          controls={false}
        >
          <source
            src="https://player.vimeo.com/progressive_redirect/playback/1010825188/rendition/720p/file.mp4?loc=external&signature=cb772886a4ab32f7688c8987620df8b61599be0b4b9ea0c3c9b9fe59f67ed1f6"
            type="video/mp4"
            media="(max-width:720px)"
          />
          <source
            src="https://player.vimeo.com/progressive_redirect/playback/1010825188/rendition/1080p/file.mp4?loc=external&signature=a08febf71becd38b60a7c0fc4f269bc5cf332765a8e7f36fb315c6f61fa979c8"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default Hero;
