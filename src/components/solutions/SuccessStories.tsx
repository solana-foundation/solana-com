import { ReactNode } from "react";
import Image from "next/image";
import classNames from "classnames";

import { AnimatedText } from "@/components/shared/Text";
import { MotionSlideIn } from "@/components/shared/Motions";
import Button from "./Button";

import styles from "./SuccessStories.module.scss";

interface StoryCardProps {
  logo: string;
  logoAlt: string;
  mobileImage: string;
  desktopImage: string;
  imageAlt: string;
  text: string;
  buttonText: string;
  buttonUrl: string;
  className?: string;
  logoClassName?: string;
  mainImageClassName?: string;
}

export const StoryCard = ({
  logo,
  logoAlt,
  mobileImage,
  desktopImage,
  imageAlt,
  text,
  buttonText,
  buttonUrl,
  className,
  logoClassName,
  mainImageClassName,
}: StoryCardProps) => {
  return (
    <div className={classNames(styles.StoryCard, className)}>
      <div className={classNames(styles.LogoWrapper, logoClassName)}>
        <MotionSlideIn>
          <Image
            src={logo}
            alt={logoAlt}
            width={100}
            height={50}
            className={classNames(styles.LogoImage)}
          />
        </MotionSlideIn>
      </div>

      <div className={classNames(styles.MainImageWrapper, mainImageClassName)}>
        <MotionSlideIn>
          {mobileImage && (
            <Image
              src={mobileImage}
              alt={imageAlt}
              width={465}
              height={465}
              className="d-lg-none"
            />
          )}

          <Image
            src={desktopImage}
            alt={imageAlt}
            width={465}
            height={465}
            className={mobileImage ? "d-none d-lg-block" : styles.MainImage}
          />
        </MotionSlideIn>
      </div>

      <AnimatedText element="p" as="paragraph" className={styles.Text}>
        {text}
      </AnimatedText>

      <MotionSlideIn>
        <Button text={buttonText} url={buttonUrl} target="_blank" />
      </MotionSlideIn>
    </div>
  );
};

interface SuccessStoriesProps {
  title: string;
  cards: ReactNode[];
  backgroundTheme?: "grey" | "black";
  className?: string;
  cardsClassName?: string;
  id?: string;
}

const SuccessStories = ({
  title,
  cards,
  backgroundTheme = "grey",
  className,
  cardsClassName,
  id,
}: SuccessStoriesProps) => {
  return (
    <section
      className={classNames(styles.SuccessStories, className)}
      data-theme={backgroundTheme}
      id={id || "success-stories"}
    >
      <div className={classNames(styles.Container, "page-width")}>
        <AnimatedText element="h2" as="heading" className={styles.Title}>
          {title}
        </AnimatedText>

        <div
          className={classNames(
            styles.CardsWrapper,
            cardsClassName,
            cards.length === 1 && styles.SingleCard,
          )}
          data-cards-count={cards.length}
        >
          {cards}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
