/**
 * VideoBgHero component renders a section with a video background and content overlay.
 *
 * @param {string} videoSrc - The source URL for the video to be displayed.
 * @param {string} [videoSrc720] - The source URL for the video to be displayed on screens with a max-width of 720px.
 * @param {string} videoPoster - The URL of the image to be shown while the video is loading or if the video cannot be played.
 * @param {string} title - The main title text to be displayed.
 * @param {string} [subtitle] - The subtitle text to be displayed.
 * @param {string} [eyebrow] - The eyebrow text to be displayed above the title.
 * @param {ButtonProps[]} [buttons] - An array of button properties to render buttons within the component.
 * @param {string} [classes] - Additional CSS classes to apply to the component.
 *
 * @returns {JSX.Element} The rendered VideoBgHero component.
 */
import { useEffect, useRef } from "react";
import classNames from "classnames";

import useReducedMotion from "@/hooks/useReducedMotion";
import Button, { ButtonProps } from "@/components/solutions/Button";
import { OpacityInText } from "@/components/shared/Text";
import { MotionSlideIn } from "@/components/shared/Motions";

import styles from "./VideoBgHero.module.scss";

interface VideoBgHeroProps {
  videoSrc: string;
  videoSrc720?: string;
  videoPoster: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  buttons?: ButtonProps[];
  classes?: string;
}

const VideoBgHero = ({
  videoSrc,
  videoSrc720,
  videoPoster,
  title,
  subtitle,
  eyebrow,
  buttons,
  classes,
}: VideoBgHeroProps) => {
  const [prefersReducedMotion] = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && prefersReducedMotion) {
      videoRef.current.pause();
    }
  }, [prefersReducedMotion]);

  return (
    <section className={classNames(styles.VideoBgHero, classes)}>
      <div className={classNames(styles.ContentWrapper, "page-width")}>
        <div className={styles.ContentInnerWrapper}>
          {eyebrow && (
            <OpacityInText element="p" className={styles.Eyebrow}>
              {eyebrow}
            </OpacityInText>
          )}

          <OpacityInText element="h1" as="heading" className={styles.Title}>
            {title}
          </OpacityInText>

          {subtitle && (
            <OpacityInText
              element="p"
              as="paragraph"
              className={styles.Subtitle}
            >
              {subtitle}
            </OpacityInText>
          )}

          {buttons && (
            <MotionSlideIn>
              <div className={styles.ButtonWrapper}>
                {buttons?.map((button, index) => (
                  <Button key={index} {...button} target={button.target} />
                ))}
              </div>
            </MotionSlideIn>
          )}
        </div>
      </div>

      <div className={styles.VideoWrapper}>
        <video
          width="710"
          height="900"
          muted
          loop
          autoPlay
          poster={videoPoster}
          ref={videoRef}
        >
          {videoSrc720 && (
            <source
              src={videoSrc720}
              type="video/mp4"
              media="(max-width:720px)"
            />
          )}
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
    </section>
  );
};

export default VideoBgHero;
