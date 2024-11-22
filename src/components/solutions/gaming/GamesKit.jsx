import Link from "next/link";
import classNames from "classnames";
import { useTranslation, Trans } from "next-i18next";

import Button from "@/components/solutions/Button";
import CaretIcon from "@/components/icons/Caret";
import { AnimatedText, GradientText } from "@/components/shared/Text";
import { MotionSlideIn } from "@/components/shared/Motions";

import styles from "./GamesKit.module.scss";

const GamesKit = () => {
  const { t } = useTranslation();

  const ListItem = ({ title, text, url }) => (
    <div className={styles.ListItem}>
      <h5>
        <Link href={url} target="_blank">
          <span>{title}</span>
          <CaretIcon />
        </Link>
      </h5>
      <p>{text}</p>
    </div>
  );

  return (
    <section className={classNames(styles.GamesKit)}>
      <div className={classNames(styles.Container, "page-width")}>
        <div className={styles.TextBlock}>
          <AnimatedText element="h2" as="heading">
            <span>
              <Trans
                i18nKey="solutions-gaming.games-kit.title"
                components={{
                  gradient: (
                    <GradientText gradient="linear-gradient(90deg, #64A8F2 0%, #9945FF 49.61%, #EB54BC 100%);" />
                  ),
                }}
              />
            </span>
          </AnimatedText>

          <AnimatedText element="p" as="paragraph">
            {t("solutions-gaming.games-kit.subtitle")}
          </AnimatedText>

          <MotionSlideIn>
            <Button text={t("solutions-gaming.games-kit.start-btn")} url="/" />
          </MotionSlideIn>
        </div>

        <div className={styles.ListItems}>
          <MotionSlideIn>
            <ListItem
              title={t("solutions-gaming.games-kit.items.wallets.title")}
              text={t("solutions-gaming.games-kit.items.wallets.text")}
              url="/wallets-tooling"
            />
          </MotionSlideIn>

          <MotionSlideIn>
            <ListItem
              title={t("solutions-gaming.games-kit.items.asset.title")}
              text={t("solutions-gaming.games-kit.items.asset.text")}
              url="/wallets-tooling"
            />
          </MotionSlideIn>

          <MotionSlideIn>
            <ListItem
              title={t("solutions-gaming.games-kit.items.engine.title")}
              text={t("solutions-gaming.games-kit.items.engine.text")}
              url="/wallets-tooling"
            />
          </MotionSlideIn>

          <MotionSlideIn>
            <ListItem
              title={t("solutions-gaming.games-kit.items.advanced.title")}
              text={t("solutions-gaming.games-kit.items.advanced.text")}
              url="/wallets-tooling"
            />
          </MotionSlideIn>
        </div>
      </div>
    </section>
  );
};

export default GamesKit;
