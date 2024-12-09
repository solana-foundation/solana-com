import { useRef, useEffect } from "react";
import { useTranslation } from "next-i18next";
import useReducedMotion from "../../../hooks/useReducedMotion";

import Button from "@/components/solutions/Button";
import { OpacityInText } from "@/components/shared/Text";
import { MotionSlideIn } from "@/components/shared/Motions";

import styles from "./GamingVideoHero.module.scss";

const GamingVideoHero = () => {
  const { t } = useTranslation();
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const [prefersReducedMotion] = useReducedMotion();

  const videos = [
    {
      src_720:
        "https://player.vimeo.com/progressive_redirect/playback/1009457872/rendition/720p/file.mp4?loc=external&signature=9c3fab67abf9c4a84a9db0c3cc16ffaeab06ad83e2c8100aa5b524d0184f9954",
      src_1080:
        "https://player.vimeo.com/progressive_redirect/playback/1009457872/rendition/1080p/file.mp4?loc=external&signature=86bd2ccd9bc532bff002c5e4eeb2cd892842aba7ac17b8f06936c5bfeab95012",
      poster: "/solutions/gaming/hero-video-1.webp",
    },
    {
      src_720:
        "https://player.vimeo.com/progressive_redirect/playback/1009457866/rendition/720p/file.mp4?loc=external&signature=f945644cad9795580cb0b90ce6d3ca744fdd13a5faf7eeafd1fb35b46739a7bd",
      src_1080:
        "https://player.vimeo.com/progressive_redirect/playback/1009457866/rendition/1080p/file.mp4?loc=external&signature=f77cc386fce4caa083968ed91504145a93b448a51d4b8e22b2d444484722d128",
      poster: "/solutions/gaming/hero-video-2.webp",
    },
  ];

  const handleVideoEnd = () => {
    video1Ref.current.style.opacity = 0;
    video2Ref.current.style.opacity = 1;
  };

  useEffect(() => {
    if (video1Ref.current && prefersReducedMotion) {
      video1Ref.current.pause();
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (video1Ref.current && video2Ref.current) {
      video1Ref.current.play();
      video2Ref.current.play();
    }
  }, [video1Ref, video2Ref]);

  return (
    <div className={styles.GamingVideoHero}>
      <div className={styles.VideoWrapper}>
        <video
          muted
          playsInline
          poster={videos[0].poster}
          ref={video1Ref}
          className={styles.Video1}
          onEnded={handleVideoEnd}
        >
          <source
            src={videos[0].src_720}
            type="video/mp4"
            media="(max-width:720px)"
          />
          <source src={videos[0].src_1080} type="video/mp4" />
        </video>

        <video
          loop
          muted
          playsInline
          poster={videos[1].poster}
          ref={video2Ref}
          className={styles.Video2}
        >
          <source
            src={videos[1].src_720}
            type="video/mp4"
            media="(max-width:720px)"
          />
          <source src={videos[1].src_1080} type="video/mp4" />
        </video>

        <div className={styles.VideoOverlay} />
      </div>

      <div className={styles.TextBlock}>
        <OpacityInText element="small" className={styles.Kicker}>
          {t("solutions-gaming.hero.kicker")}
        </OpacityInText>
        <OpacityInText element="h1" as="heading">
          {t("solutions-gaming.hero.title")}
        </OpacityInText>
        <OpacityInText element="p" as="paragraph">
          {t("solutions-gaming.hero.subtitle")}
        </OpacityInText>

        <MotionSlideIn>
          <div className={styles.Buttons}>
            <Button
              text={t("solutions-gaming.hero.start-btn")}
              href="#developer-resources"
            />
            <Button
              text={t("solutions-gaming.hero.play-btn")}
              href="#tv-mert"
              theme="secondary"
            />
          </div>
        </MotionSlideIn>
      </div>
    </div>
  );
};

export default GamingVideoHero;
