import Image from "next/image";
import Layout from "@/components/solutions/layout";
import { useTranslation, Trans } from "next-i18next";
import HTMLHead from "@/components/HTMLHead";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Lottie from "react-lottie";
import BlinksHero from "@/components/solutions/blinks-and-actions/BlinksHero";
import BasicCallout from "@/components/solutions/BasicCallout";
import LongformItem from "@/components/solutions/LongformItem";
import DeveloperResources, {
  DeveloperResourcesLink,
} from "@/components/solutions/DeveloperResources";
import FooterCallout from "@/components/solutions/FooterCallout";
import MediaOptionSelection from "@/components/solutions/MediaOptionSelection";
import Text, { GradientText, AnimatedText } from "@/components/shared/Text";
import CardsSlider from "@/components/shared/CardsSlider";

import styles from "./BlinksAndActions.module.scss";

import { MotionSlideIn } from "@/components/shared/Motions";

import * as blinksLottie from "../../../assets/solutions/blinks-and-actions/Blinks_Blinks_V1.json";
import * as notificationsLottie from "../../../assets/solutions/blinks-and-actions/Blinks_Notification_V1.json";
import * as payLottie from "../../../assets/solutions/blinks-and-actions/Blinks_Pay_V1.json";
import * as socialLottie from "../../../assets/solutions/blinks-and-actions/Blinks_Social.json";
import * as messagingLottie from "../../../assets/solutions/blinks-and-actions/Blinks_Messaging.json";

const BlinksAndActions = () => {
  const { t } = useTranslation();

  const longform1Content = t("solutions-blinks-and-actions.longform-1.items", {
    returnObjects: true,
  }).map((item, index) => (
    <div key={`longform-1-${index}`} className={styles.LongformContent}>
      <Text element="h3" as="heading">
        {item.title}
      </Text>
      <Text element="p" as="paragraph">
        {item.text}
      </Text>
    </div>
  ));

  const EcosystemCard = ({ img, imgAlt }) => (
    <div className={styles.EcosystemCard}>
      <Image src={img} alt={imgAlt} width={300} height={438.92} />
    </div>
  );

  const ecosystemCards = [
    <EcosystemCard
      key="blink-realms"
      img="/solutions/blinks-and-actions/ecosystem/blink-realms.png"
      imgAlt={t("solutions-blinks-and-actions.ecosystem.items.realms.imgAlt")}
    />,
    <EcosystemCard
      key="blink-sanctum"
      img="/solutions/blinks-and-actions/ecosystem/blink-sanctum.png"
      imgAlt={t("solutions-blinks-and-actions.ecosystem.items.sanctum.imgAlt")}
    />,
    <EcosystemCard
      key="blink-tensor"
      img="/solutions/blinks-and-actions/ecosystem/blink-tensor.png"
      imgAlt={t("solutions-blinks-and-actions.ecosystem.items.tensor.imgAlt")}
    />,
    <EcosystemCard
      key="blink-jup"
      img="/solutions/blinks-and-actions/ecosystem/blink-jup.png"
      imgAlt={t("solutions-blinks-and-actions.ecosystem.items.jup.imgAlt")}
    />,
    <EcosystemCard
      key="blink-meteora"
      img="/solutions/blinks-and-actions/ecosystem/blink-meteora.png"
      imgAlt={t("solutions-blinks-and-actions.ecosystem.items.meteora.imgAlt")}
    />,
    <EcosystemCard
      key="blink-access"
      img="/solutions/blinks-and-actions/ecosystem/blink-access.png"
      imgAlt={t("solutions-blinks-and-actions.ecosystem.items.access.imgAlt")}
    />,
  ];

  const developerResourcesLinks = [
    <DeveloperResourcesLink
      title={t(
        "solutions-blinks-and-actions.developer-resources.links.dialect-sdk.title",
      )}
      link="https://github.com/dialectlabs"
      key="dialect-sdk"
    />,
    <DeveloperResourcesLink
      title={t(
        "solutions-blinks-and-actions.developer-resources.links.dev-doc.title",
      )}
      link="https://solana.com/docs/advanced/actions"
      key="dev-doc"
    />,
  ];

  const lottieOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      className: styles.Lottie,
    },
  };

  const mediaOptionSelectionOptions = [
    {
      label: "Push Notifications",
      media: (
        <MotionSlideIn>
          <Lottie
            options={{
              animationData: notificationsLottie,
              ...lottieOptions,
            }}
            isClickToPauseDisabled={true}
          />
        </MotionSlideIn>
      ),
    },
    {
      label: "QR codes",
      media: (
        <MotionSlideIn>
          <Lottie
            options={{
              animationData: payLottie,
              ...lottieOptions,
            }}
            isClickToPauseDisabled={true}
          />
        </MotionSlideIn>
      ),
    },
    {
      label: "Social Posts",
      media: (
        <MotionSlideIn>
          <Lottie
            options={{
              animationData: socialLottie,
              ...lottieOptions,
            }}
            isClickToPauseDisabled={true}
          />
        </MotionSlideIn>
      ),
    },
    {
      label: "Messaging Apps",
      media: (
        <MotionSlideIn>
          <Lottie
            options={{
              animationData: messagingLottie,
              ...lottieOptions,
            }}
            isClickToPauseDisabled={true}
          />
        </MotionSlideIn>
      ),
    },
  ];

  return (
    <Layout headerClassName={styles.Header}>
      <HTMLHead
        title={t("solutions-blinks-and-actions.meta.title")}
        description={t("solutions-blinks-and-actions.meta.description")}
      />

      <div className={styles.PageWrapper}>
        <BlinksHero />

        <BasicCallout
          titleContent={
            <Trans
              i18nKey="solutions-blinks-and-actions.callout-1.title"
              components={{
                gradient: (
                  <GradientText gradient="linear-gradient(270deg, #9945FF 0%, #EB54BC 50.57%, #FF754A 100%);" />
                ),
              }}
            />
          }
          subtitleKey="solutions-blinks-and-actions.callout-1.subtitle"
          className={styles.BasicCallout}
        />

        <div className={styles.LongformSection}>
          <MotionSlideIn from="right">
            <LongformItem
              mediaComponent={
                <Lottie
                  options={{
                    animationData: blinksLottie,
                    loop: true,
                    autoplay: true,
                  }}
                  isClickToPauseDisabled={true}
                />
              }
              mediaDesktopPlacement="left"
              className={styles.LongformItem1}
              mediaClassName={styles.LongformItemMedia}
              customContent={
                <div className={styles.LongformCustomContent}>
                  {longform1Content}
                </div>
              }
            />
          </MotionSlideIn>
        </div>

        <div id="ecosystem" className={styles.EcosystemSection}>
          <AnimatedText
            element="h2"
            as="heading"
            className={styles.EcosystemTitle}
          >
            <Trans
              i18nKey="solutions-blinks-and-actions.ecosystem.title"
              components={{
                gradient: (
                  <GradientText gradient="linear-gradient(90deg, #14f195 -6.38%, #80ecff 51.28%, #64a8f2 106.12%)" />
                ),
              }}
            />
          </AnimatedText>

          <CardsSlider
            items={ecosystemCards}
            className={styles.EcosystemSlider}
            carouselClassName={styles.EcosystemSliderCarousel}
            cardsClassName={styles.EcosystemCards}
            cardWrapperClassName={styles.EcosystemCardWrapper}
          />
        </div>

        <BasicCallout
          titleContent={
            <Trans
              i18nKey="solutions-blinks-and-actions.callout-2.title"
              components={{
                gradient: (
                  <GradientText gradient="linear-gradient(270deg, #9945FF 0%, #EB54BC 50.57%, #FF754A 100%);" />
                ),
              }}
            />
          }
          subtitleKey="solutions-blinks-and-actions.callout-2.subtitle"
          className={styles.BasicCallout}
        />

        <MediaOptionSelection
          options={mediaOptionSelectionOptions}
          title={t("solutions-blinks-and-actions.with-actions.title")}
          buttonText={t("solutions-blinks-and-actions.with-actions.learn-btn")}
          buttonUrl="/docs/advanced/actions#actions"
        />

        <DeveloperResources
          title={t("solutions-blinks-and-actions.developer-resources.title")}
          subtitle={t(
            "solutions-blinks-and-actions.developer-resources.subtitle",
          )}
          links={developerResourcesLinks}
          id="blinks-developer-resources"
        />

        <FooterCallout
          title={t("solutions-wallets.footer-callout.title")}
          text={t("solutions-wallets.footer-callout.text")}
          btnText={t("solutions-wallets.footer-callout.btn")}
          btnUrl="https://solana.org/grants-funding"
          className={styles.FooterCallout}
          topSectionClassName={styles.FooterCalloutTopSection}
          buttonLargeClassName={styles.FooterCalloutButtonLarge}
        />
      </div>
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default BlinksAndActions;
