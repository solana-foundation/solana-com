import classNames from "classnames";
import DetailsSection, { Detail } from "@/components/solutions/DetailsSection";
import { useTranslation, Trans } from "next-i18next";
import { useInView } from "react-intersection-observer";
import { MotionSlideIn } from "@/components/shared/Motions";

const WalletsDetails = ({ styles }) => {
  const { t } = useTranslation();
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div ref={inViewRef}>
      <MotionSlideIn
        startAnimation={inView}
        animateTrigger="variable"
        delayIndex={1}
        className={classNames(styles.Callout1, "page-width")}
      >
        <h2>
          <Trans i18nKey={t("solutions-wallets.callout-1.title")} />
        </h2>
      </MotionSlideIn>
      <DetailsSection
        className={styles.DetailsSection}
        wrapperClassName={styles.DetailsWrapper}
      >
        <MotionSlideIn
          startAnimation={inView}
          delayIndex={2}
          animateTrigger="variable"
        >
          <Detail
            title={t("solutions-wallets.details.smart-account.title")}
            text={t("solutions-wallets.details.smart-account.text")}
          />
        </MotionSlideIn>
        <MotionSlideIn
          startAnimation={inView}
          delayIndex={3}
          animateTrigger="variable"
        >
          <Detail
            title={t("solutions-wallets.details.flexible-management.title")}
            text={t("solutions-wallets.details.flexible-management.text")}
          />
        </MotionSlideIn>
        <MotionSlideIn
          startAnimation={inView}
          delayIndex={4}
          animateTrigger="variable"
        >
          <Detail
            title={t("solutions-wallets.details.parallel-processing.title")}
            text={t("solutions-wallets.details.parallel-processing.text")}
          />
        </MotionSlideIn>
      </DetailsSection>
    </div>
  );
};

export default WalletsDetails;
