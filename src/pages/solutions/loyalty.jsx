import Lottie from "react-lottie";
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import classNames from "classnames";

import Layout from "@/components/solutions/layout";
import HTMLHead from "@/components/HTMLHead";
import Stats from "@/components/solutions/Stats";
import BasicCallout from "@/components/solutions/BasicCallout";
import LongformItem from "@/components/solutions/LongformItem";
import FooterCallout from "@/components/solutions/FooterCallout";
import LoyaltyHero from "@/components/solutions/loyalty/LoyaltyHero";
import CardsSlider from "@/components/shared/CardsSlider";
import { StoryCard } from "@/components/solutions/SuccessStories";
import DeveloperResources, {
  DeveloperResourcesLink,
} from "@/components/solutions/DeveloperResources";
import { MotionSlideIn } from "@/components/shared/Motions";
import { GradientText } from "@/components/shared/Text";
import SuccessStories from "@/components/solutions/SuccessStories";

import styles from "./Loyalty.module.scss";

import * as heroLottie from "../../../assets/solutions/loyalty/Loyalty_Hero_V1.json";
import * as LongformOneLottie from "../../../assets/solutions/loyalty/Loyalty_TokenExtensions.json";
import * as LongformTwoLottie from "../../../assets/solutions/loyalty/Loyalty_State Compression_V1.json";
import * as LongformThreeLottie from "../../../assets/solutions/loyalty/Loyalty_Solana Pay_V1.json";
import * as LongformFourLottie from "../../../assets/solutions/loyalty/Loyalty_Secret Menu Item_V1.json";

const Loyalty = () => {
  const { t } = useTranslation();

  const statsContent = t("solutions-loyalty.stats", {
    returnObjects: true,
  });

  const longformContent = t("solutions-loyalty.longform", {
    returnObjects: true,
  });

  const caseStudyCards = [
    <StoryCard
      key="boba-guys"
      logo={"/solutions/loyalty/bobaguys-logo.webp"}
      logoAlt={t("solutions-loyalty.case-study-cards.cards.boba-guys.logo-alt")}
      mobileImage={"/solutions/loyalty/bobaguys-main.png"}
      desktopImage={"/solutions/loyalty/bobaguys-main.webp"}
      imageAlt={t(
        "solutions-loyalty.case-study-cards.cards.boba-guys.image-alt",
      )}
      text={
        <Trans
          i18nKey="solutions-loyalty.case-study-cards.cards.boba-guys.excerpt"
          components={{ strong: <strong /> }}
        />
      }
      buttonText={t(
        "solutions-loyalty.case-study-cards.cards.boba-guys.button-text",
      )}
      buttonUrl="https://solana.com/news/case-study-boba-guys"
      className={styles.StoryCard}
      logoClassName={styles.StoryCardLogo}
    />,
    <StoryCard
      key="asics"
      logo={"/solutions/loyalty/asics-logo.svg"}
      logoAlt={t("solutions-loyalty.case-study-cards.cards.asics.logo-alt")}
      mobileImage={"/solutions/loyalty/asics-main.webp"}
      desktopImage={"/solutions/loyalty/asics-main.webp"}
      imageAlt={t("solutions-loyalty.case-study-cards.cards.asics.image-alt")}
      text={
        <Trans
          i18nKey="solutions-loyalty.case-study-cards.cards.asics.excerpt"
          components={{ strong: <strong /> }}
        />
      }
      buttonText={t(
        "solutions-loyalty.case-study-cards.cards.asics.buttonText",
      )}
      buttonUrl="https://ui.asics.com/"
      className={styles.StoryCard}
      logoClassName={styles.StoryCardLogo}
    />,
    <StoryCard
      key="drip"
      logo={"/solutions/loyalty/drip-logo.svg"}
      logoAlt={t("solutions-loyalty.case-study-cards.cards.drip.logo-alt")}
      mobileImage={"/solutions/loyalty/drip-main.jpg"}
      desktopImage={"/solutions/loyalty/drip-main.jpg"}
      imageAlt={t("solutions-loyalty.case-study-cards.cards.drip.image-alt")}
      text={
        <Trans
          i18nKey="solutions-loyalty.case-study-cards.cards.drip.excerpt"
          components={{ strong: <strong /> }}
        />
      }
      buttonText={t("solutions-loyalty.case-study-cards.cards.drip.buttonText")}
      buttonUrl="https://blockworks.co/news/drip-haus-mass-adoption-strategy"
      className={styles.StoryCard}
      logoClassName={styles.StoryCardLogo}
    />,
    <StoryCard
      key="single"
      logo={"/solutions/loyalty/single-logo.png"}
      logoAlt={t(
        "solutions-loyalty.case-study-cards.cards.eric-church.logo-alt",
      )}
      mobileImage={"/solutions/loyalty/single-main.jpg"}
      desktopImage={"/solutions/loyalty/single-main.jpg"}
      imageAlt={t(
        "solutions-loyalty.case-study-cards.cards.eric-church.image-alt",
      )}
      text={
        <Trans
          i18nKey="solutions-loyalty.case-study-cards.cards.eric-church.excerpt"
          components={{ strong: <strong /> }}
        />
      }
      buttonText={t(
        "solutions-loyalty.case-study-cards.cards.eric-church.buttonText",
      )}
      buttonUrl="https://single.xyz/blogs/blog/eric-church-future-proofs-fandom-solana-based-digital-deeds-nashville-bar"
      className={styles.StoryCard}
      logoClassName={styles.StoryCardLogo}
    />,
  ];

  const developerResourcesLinks = [
    <DeveloperResourcesLink
      key="link-one"
      title={t("solutions-loyalty.developerResources.link-one")}
      link="https://solana.com/docs/intro/quick-start"
    />,
    <DeveloperResourcesLink
      key="link-two"
      title={t("solutions-loyalty.developerResources.link-two")}
      link="https://solana.com/docs/advanced/state-compression"
    />,
    <DeveloperResourcesLink
      key="link-three"
      title={t("solutions-loyalty.developerResources.link-three")}
      link="https://solana.com/docs/advanced/actions"
    />,
    <DeveloperResourcesLink
      key="link-four"
      title={t("solutions-loyalty.developerResources.link-four")}
      link="https://docs.solanapay.com/"
    />,
  ];

  return (
    <Layout>
      <HTMLHead
        title={t("solutions-loyalty.meta.title")}
        description={t("solutions-loyalty.meta.description")}
      />

      <div className={styles.LoyaltyPage} id="loyalty-page">
        <LoyaltyHero heroLottie={heroLottie} />

        <Stats
          titleContent={
            <Trans
              i18nKey="solutions-loyalty.stats.title"
              components={{
                gradient: (
                  <GradientText gradient="linear-gradient(90deg, #64A8F2 0%, #9945FF 49.61%, #EB54BC 100%)" />
                ),
              }}
            />
          }
          subtitleKey={statsContent.subtitle}
          kickerKey={statsContent.finePrint}
          kickerUrl="https://solana.com/news/case-study-boba-guys"
          stats={statsContent.stats}
          className={styles.Stats}
          statsClassName={styles.StatsContent}
        />

        <BasicCallout
          titleContent={
            <Trans
              i18nKey="solutions-loyalty.callout-1.title"
              components={{
                gradient: (
                  <GradientText gradient="linear-gradient(270deg, #9945FF 0%, #EB54BC 50.57%, #FF754A 100%);" />
                ),
              }}
            />
          }
          subtitleKey="solutions-loyalty.callout-1.subtitle"
          className={styles.BasicCallout}
        />

        <div className={styles.LongformSection}>
          <MotionSlideIn from="left">
            <LongformItem
              mediaComponent={
                <Lottie
                  options={{
                    animationData: LongformOneLottie,
                    loop: true,
                    autoplay: true,
                  }}
                  isClickToPauseDisabled={true}
                />
              }
              mediaDesktopPlacement="right"
              titleComponent={longformContent[0].title}
              subtitleComponent={longformContent[0].text}
              className={styles.LongformItem1}
            />
          </MotionSlideIn>

          <MotionSlideIn>
            <LongformItem
              mediaComponent={
                <Lottie
                  options={{
                    animationData: LongformTwoLottie,
                    loop: true,
                    autoplay: true,
                  }}
                  isClickToPauseDisabled={true}
                />
              }
              textContentDesktopDirection="row"
              mediaDesktopPlacement="below"
              titleComponent={longformContent[1].title}
              subtitleComponent={longformContent[1].text}
              className={styles.LongformItem2}
            />
          </MotionSlideIn>

          <MotionSlideIn from="right">
            <LongformItem
              mediaComponent={
                <Lottie
                  options={{
                    animationData: LongformThreeLottie,
                    loop: true,
                    autoplay: true,
                  }}
                  isClickToPauseDisabled={true}
                />
              }
              mediaDesktopPlacement="left"
              titleComponent={longformContent[2].title}
              subtitleComponent={longformContent[2].text}
              className={styles.LongformItem3}
            />
          </MotionSlideIn>

          <MotionSlideIn from="left">
            <LongformItem
              mediaComponent={
                <Lottie
                  options={{
                    animationData: LongformFourLottie,
                    loop: true,
                    autoplay: true,
                  }}
                  isClickToPauseDisabled={true}
                />
              }
              mediaDesktopPlacement="right"
              titleComponent={longformContent[3].title}
              subtitleComponent={longformContent[3].text}
              className={styles.LongformItem4}
            />
          </MotionSlideIn>
        </div>

        <div id="success-stories">
          <SuccessStories
            title={t("solutions-loyalty.case-study-cards.title")}
            cards={caseStudyCards}
            className={classNames(styles.SuccessStories, "d-md-none")}
            id="success-stories-mobile"
          />

          <CardsSlider
            items={caseStudyCards}
            titleKey="solutions-loyalty.case-study-cards.title"
            className={classNames(styles.SuccessStories, "d-none d-md-block")}
          />
        </div>

        <DeveloperResources
          title={t("solutions-loyalty.developerResources.title")}
          subtitle={t("solutions-loyalty.developerResources.text")}
          links={developerResourcesLinks}
          id="developer-resources"
        />

        <FooterCallout
          title={t("solutions-loyalty.footerCallout.title")}
          text={t("solutions-loyalty.footerCallout.text")}
          btnText={t("solutions-loyalty.footerCallout.btn")}
          btnUrl="https://solana.org/grants-funding"
          btnLargeText={t("solutions-loyalty.footerCallout.btnLarge")}
          btnLargeUrl="bd-payments-commerce@solana.org"
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

export default Loyalty;
