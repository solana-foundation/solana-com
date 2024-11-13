import classNames from "classnames";
import { useTranslation, Trans } from "next-i18next";
import { useInView } from "react-intersection-observer";
import Button from "@/components/solutions/Button";
import { MotionSlideIn } from "@/components/shared/Motions";
import Text, { AnimatedText, GradientText } from "@/components/shared/Text";

const WalletsExploreSolutions = ({ styles }) => {
  const { t } = useTranslation();

  const { ref: inViewRef } = useInView({
    triggerOnce: true,
    threshold: 0.25,
  });

  return (
    <div
      ref={inViewRef}
      className={classNames(styles.WalletSolutions, "page-width")}
    >
      <AnimatedText
        element="h2"
        as="heading"
        className={styles.WalletSolutionsTitle}
      >
        <Trans
          i18nKey="solutions-wallets.explore.title"
          components={{
            gradient: (
              <GradientText gradient="linear-gradient(90deg, #FFFFFF 0%, #7F77F9 49.68%, #9945FF 74.84%, #EB54BC 100%);" />
            ),
          }}
        />
      </AnimatedText>

      <AnimatedText
        element="p"
        as="paragraph"
        className={styles.WalletSolutionsSubtitle}
      >
        {t("solutions-wallets.explore.subtitle")}
      </AnimatedText>

      <div className={styles.WalletSolutionsCards}>
        <MotionSlideIn className={styles.WalletSolutionsCard}>
          <h3>{t("solutions-wallets.explore.cards.new.title")}</h3>
          <p>{t("solutions-wallets.explore.cards.new.subtitle")}</p>
        </MotionSlideIn>

        <MotionSlideIn className={styles.WalletSolutionsCard}>
          <Text element="h3" as="heading">
            {t("solutions-wallets.explore.cards.embed.title")}
          </Text>
          <Text element="p" as="paragraph">
            {t("solutions-wallets.explore.cards.embed.subtitle")}
          </Text>
        </MotionSlideIn>
      </div>

      <MotionSlideIn className={styles.WalletSolutionsButtonWrapper}>
        <Button
          text={t("solutions-wallets.explore.btn")}
          url="/solutions/wallets-explorer"
          target="_blank"
        />
      </MotionSlideIn>
    </div>
  );
};

export default WalletsExploreSolutions;
