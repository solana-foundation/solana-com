import Link from "next/link";
import { useTranslation, Trans } from "next-i18next";
import HTMLHead from "@/components/HTMLHead";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import classNames from "classnames";
import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";
import Lottie from "react-lottie";

import Layout from "@/components/solutions/layout";
import GamingVideoHero from "@/components/solutions/gaming/GamingVideoHero";
import GamesKit from "@/components/solutions/gaming/GamesKit";
import GamingSlider from "@/components/solutions/gaming/GamingSlider";
// import GamingSliderTwo from "@/components/solutions/gaming/GamingSliderTwo";
import Stats from "@/components/solutions/Stats";
import LongformItem from "@/components/solutions/LongformItem";
import SuccessStories, {
  StoryCard,
} from "@/components/solutions/SuccessStories";
import FooterCallout from "@/components/solutions/FooterCallout";
import DeveloperResources, {
  DeveloperResourcesLink,
} from "@/components/solutions/DeveloperResources";
import { MotionSlideIn } from "@/components/shared/Motions";
import { AnimatedText, GradientText } from "@/components/shared/Text";

import styles from "./Gaming.module.scss";

import * as blinksLottie from "../../../assets/solutions/gaming/Gaming_Blinks_V1.json";
import * as mintPonyCoinLottie from "../../../assets/solutions/gaming/Gaming_MintPonyCoin.json";
import * as nftLottie from "../../../assets/solutions/gaming/Gaming_NFT.json";
import spotlightImg from "../../../assets/solutions/gaming/Spotlight.jpg";

const Gaming = () => {
  const { t } = useTranslation();

  const statsContent = t("solutions-gaming.stats", {
    returnObjects: true,
  });

  const spotlightCards = [
    <StoryCard
      key="spotlight"
      logo="/solutions/gaming/photo-finish-live-logo.svg"
      logoAlt={t("solutions-gaming.spotlight.logo-alt")}
      mobileImage={spotlightImg}
      desktopImage={spotlightImg}
      imageAlt={t("solutions-gaming.spotlight.image-alt")}
      text={<Trans i18nKey="solutions-gaming.spotlight.text" />}
      buttonText={t("solutions-gaming.spotlight.button")}
      buttonUrl="https://solana.com/news/case-study-photo-finish-live"
      className={styles.StoryCard}
      logoClassName={styles.SuccessStoriesLogo}
    />,
  ];

  const developerResourcesLinks = [
    <DeveloperResourcesLink
      title={t("solutions-gaming.developer-resources.links.guide.title")}
      link="https://solana.com/docs/intro/wallets"
      key="guide-link"
    />,
    <DeveloperResourcesLink
      key="state-compression-link"
      title={t(
        "solutions-gaming.developer-resources.links.state-compression.title",
      )}
      link="https://solana.com/docs/advanced/state-compression"
    />,
    <DeveloperResourcesLink
      key="token-link"
      title={t(
        "solutions-gaming.developer-resources.links.token-extensions.title",
      )}
      link="https://solana.com/developers/guides/token-extensions/getting-started"
    />,
    <DeveloperResourcesLink
      key="blinks-link"
      title={t(
        "solutions-gaming.developer-resources.links.blinks-actions.title",
      )}
      link="https://solana.com/docs/advanced/actions#blinks"
    />,
  ];

  const [tvMertRef, tvMertInView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const TVMert = dynamic(
    () => import("../../components/solutions/gaming/TVMert"),
    {
      ssr: false,
    },
  );

  return (
    <Layout headerClassName={styles.Header}>
      <HTMLHead
        title={t("solutions-gaming.meta.title")}
        description={t("solutions-gaming.meta.description")}
      />

      <div className={styles.PageWrapper} id="gaming-page">
        <GamingVideoHero />

        <Stats
          titleContent={
            <Trans
              i18nKey="solutions-gaming.stats.title"
              defaults="<gradient>Solana is changing</gradient> what games can be."
              components={{
                gradient: (
                  <GradientText gradient="linear-gradient(90deg, #64A8F2 0%, #9945FF 49.61%, #EB54BC 100%);" />
                ),
              }}
            />
          }
          subtitleKey={statsContent.subtitle}
          stats={statsContent.stats}
          className={styles.Stats}
          statsClassName={styles.StatsContent}
        />

        <div className={classNames(styles.Callout1, "page-width")}>
          <AnimatedText
            element="h2"
            as="heading"
            className={styles.Callout1Title}
          >
            <Trans
              i18nKey="solutions-gaming.callout-1.title"
              components={{
                gradient: (
                  <GradientText gradient="linear-gradient(270deg, #9945FF 0%, #EB54BC 50.57%, #FF754A 100%);" />
                ),
              }}
            />
          </AnimatedText>
        </div>

        <div className={styles.LongformSection}>
          <MotionSlideIn>
            <LongformItem
              mediaComponent={
                <Lottie
                  options={{
                    animationData: nftLottie,
                    loop: true,
                    autoplay: true,
                  }}
                  isClickToPauseDisabled={true}
                />
              }
              mediaDesktopPlacement="below"
              className={styles.CreateWithoutConstraint}
              mediaClassName={styles.MediaComponent}
              textContentDesktopDirection="row"
              titleComponent={t(
                "solutions-gaming.create-without-constraint.title",
              )}
              subtitleComponent={
                <Trans
                  i18nKey="solutions-gaming.create-without-constraint.subtitle"
                  components={{
                    nextLink: (
                      <Link
                        href="/docs/advanced/state-compression"
                        target="_blank"
                      />
                    ),
                  }}
                />
              }
            />
          </MotionSlideIn>

          <MotionSlideIn from="left">
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
              mediaDesktopPlacement="right"
              titleComponent={t("solutions-gaming.engage-anywhere.title")}
              subtitleComponent={
                <Trans
                  i18nKey="solutions-gaming.engage-anywhere.subtitle"
                  components={{
                    nextLink: (
                      <Link href="/solutions/actions" target="_blank" />
                    ),
                  }}
                />
              }
            />
          </MotionSlideIn>

          <MotionSlideIn from="right">
            <LongformItem
              mediaComponent={
                <Lottie
                  options={{
                    animationData: mintPonyCoinLottie,
                    loop: true,
                    autoplay: true,
                  }}
                  isClickToPauseDisabled={true}
                />
              }
              mediaDesktopPlacement="left"
              titleComponent={t("solutions-gaming.control-customize.title")}
              subtitleComponent={
                <span className={styles.MultiLineSubtitle}>
                  <span>
                    <Trans
                      i18nKey="solutions-gaming.control-customize.subtitle"
                      components={{
                        nextLink: (
                          <Link
                            href="/solutions/token-extensions"
                            target="_blank"
                          />
                        ),
                      }}
                    />
                  </span>
                  <span>
                    <Trans i18nKey="solutions-gaming.control-customize.subtitle-2" />
                  </span>
                </span>
              }
            />
          </MotionSlideIn>
        </div>

        <div ref={tvMertRef} id="tv-mert">
          {tvMertInView ? <TVMert /> : <div className="min-vh-100 w-100" />}
        </div>

        <GamingSlider />
        {/* <GamingSliderTwo /> */}

        <div className={styles.SpotlightSection}>
          <SuccessStories
            title={<Trans i18nKey="solutions-gaming.spotlight.title" />}
            cards={spotlightCards}
            className={styles.SuccessStories}
          />
        </div>

        <DeveloperResources
          title={t("solutions-gaming.developer-resources.title")}
          subtitle={t("solutions-gaming.developer-resources.subtitle")}
          links={developerResourcesLinks}
          image="/solutions/gaming/developer-resources.svg"
          className={styles.DeveloperResources}
          id="developer-resources"
        />

        <GamesKit />

        <FooterCallout
          title={t("solutions-gaming.footer-callout.title")}
          text={t("solutions-gaming.footer-callout.text")}
          btnText={t("solutions-gaming.footer-callout.btn")}
          btnUrl="https://solana.org/grants-funding"
          btnLargeText={t("solutions-gaming.footer-callout.btn-large")}
          btnLargeUrl="games@solana.org"
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

export default Gaming;
