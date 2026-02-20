import classNames from "classnames";
import Image from "next/image";
import Button from "@/components/shared/Button";
import styles from "./DevelopersHeroSection.module.scss";

const HeroSection = ({
  img: { src, alt = "" },
  title,
  description,
  buttons,
}) => {
  return (
    <section
      className={classNames(
        "pt-10 lg:pt-32 pb-10 md:pb-32",
        styles["hero-section"],
      )}
    >
      <div className="container relative">
        <div className={styles["hero-section__image"]}>
          <Image src={src} alt={alt} placeholder="blur" priority />
        </div>
        <div className={styles["hero-section__light"]} />
        <div className={styles["content"]}>
          <h1>{title}</h1>
          <p className="h6 subdued">{description}</p>
          {buttons && (
            <div className={styles["content__hero-buttons"]}>
              {buttons?.cta && (
                <Button
                  to={buttons.cta.href}
                  newTab={buttons.cta.href?.startsWith("http")}
                  variant="secondary"
                >
                  {buttons.cta.label}
                </Button>
              )}
              {buttons?.secondary && (
                <Button
                  to={buttons.secondary.href}
                  newTab={buttons.secondary.href?.startsWith("http")}
                  className={styles["content__btn-icon"]}
                >
                  <span>{buttons.secondary.label}</span>
                  {buttons.secondary.icon || null}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
