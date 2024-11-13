import Link from "next/link";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Lottie from "react-lottie";

import Layout from "@/components/solutions/layout";
import HTMLHead from "@/components/HTMLHead";
import Stats from "@/components/solutions/Stats";
import FooterCallout from "@/components/solutions/FooterCallout";
import VideoBgHero from "@/components/solutions/VideoBgHero";
import EcosystemSlider, {
  Card,
} from "../../components/solutions/EcosystemSlider";
import SuccessStories, {
  StoryCard,
} from "@/components/solutions/SuccessStories";
import DeveloperResources, {
  DeveloperResourcesLink,
} from "@/components/solutions/DeveloperResources";
import LongformItem from "@/components/solutions/LongformItem";
import BasicCallout from "@/components/solutions/BasicCallout";
import { MotionSlideIn } from "@/components/shared/Motions";
import { GradientText } from "@/components/shared/Text";

import styles from "./IF.module.scss";

import * as longformOne from "../../../assets/solutions/institutional-finance/InstitutionalFinance_PermanentDelegate_V1.json";
import * as longformTwo from "../../../assets/solutions/institutional-finance/Institutional Finance_SPE_V1.json";
import * as longformThree from "../../../assets/solutions/institutional-finance/Institutional Finance_RWA_V1.json";

import homebaseLogo from "../../../assets/solutions/institutional-finance/homebase-logo.png";
import homebaseMain from "../../../assets/solutions/institutional-finance/homebase-main.jpg";

const InstitutionalFinance = () => {
  const { t } = useTranslation();

  const statsContent = t("solutions-institutional-finance.stats", {
    returnObjects: true,
  });

  const ecosystemCards = [
    <Card
      key="institutional-finance-card-1"
      img="/path/to/image1.png"
      url="https://example.com/1"
      title={t("solutions-institutional-finance.ecosystem.card1.title")}
      text={t("solutions-institutional-finance.ecosystem.card1.text")}
    />,
    <Card
      key="institutional-finance-card-2"
      img="/path/to/image2.png"
      url="https://example.com/2"
      title={t("solutions-institutional-finance.ecosystem.card2.title")}
      text={t("solutions-institutional-finance.ecosystem.card2.text")}
    />,
  ];

  const caseStudyCards = [
    <StoryCard
      logo={"/solutions/institutional-finance/pyth-logo.svg"}
      logoAlt={t(
        "solutions-institutional-finance.case-studies.cards.item-one.logo-alt",
      )}
      mobileImage={"/solutions/defi/pyth-main.jpg"}
      desktopImage={"/solutions/defi/pyth-main.jpg"}
      imageAlt={t(
        "solutions-institutional-finance.case-studies.cards.item-one.image-alt",
      )}
      text={
        <Trans
          i18nKey="solutions-institutional-finance.case-studies.cards.item-one.excerpt"
          components={{ strong: <strong /> }}
        />
      }
      buttonText={t(
        "solutions-institutional-finance.case-studies.cards.item-one.button",
      )}
      buttonUrl="https://solana.com/news/case-study-pyth"
      className={styles.StoryCard}
      key="pyth"
    />,
    <StoryCard
      logo={homebaseLogo}
      logoAlt={t(
        "solutions-institutional-finance.case-studies.cards.item-two.logo-alt",
      )}
      mobileImage={homebaseMain}
      desktopImage={homebaseMain}
      imageAlt={t(
        "solutions-institutional-finance.case-studies.cards.item-two.image-alt",
      )}
      text={
        <Trans
          i18nKey="solutions-institutional-finance.case-studies.cards.item-two.excerpt"
          components={{ strong: <strong /> }}
        />
      }
      buttonText={t(
        "solutions-institutional-finance.case-studies.cards.item-two.button",
      )}
      buttonUrl="https://solana.com/news/case-study-homebase"
      className={styles.StoryCard}
      key="homebase"
    />,
  ];

  const developerResourcesLinks = [
    <DeveloperResourcesLink
      title={t(
        "solutions-institutional-finance.developer-resources.links.quick-start.title",
      )}
      link="https://solana.com/docs/intro/quick-start"
      key="quick-start"
    />,
    <DeveloperResourcesLink
      title={t(
        "solutions-institutional-finance.developer-resources.links.solana-pay.title",
      )}
      link="https://docs.solanapay.com/"
      key="solana-pay"
    />,
    <DeveloperResourcesLink
      title={t(
        "solutions-institutional-finance.developer-resources.links.helio.title",
      )}
      link="https://solana.com/docs/advanced/actions"
      key="helio"
    />,
  ];

  return (
    <Layout headerClassName={styles.Header}>
      <HTMLHead
        title={t("solutions-institutional-finance.meta.title")}
        description={t("solutions-institutional-finance.meta.description")}
      />

      <div className={styles.PageWrapper} id="if-page">
        <VideoBgHero
          classes={styles.VideoHero}
          videoSrc="https://player.vimeo.com/progressive_redirect/playback/1010826993/rendition/1080p/file.mp4?loc=external&signature=4fc1a0aa20104b5363ae29e7772493dde747947e2250e964ff1ff1003e497b81"
          videoSrc720="https://player.vimeo.com/progressive_redirect/playback/1010826993/rendition/720p/file.mp4?loc=external&signature=cfc66c3690345cb70d036749c31f77bc2a5fc401e438c396554c97584d07d097"
          videoPoster="/solutions/institutional-finance/Export Block Chain Solana V14.jpeg"
          title={t("solutions-institutional-finance.hero.title")}
          subtitle={t("solutions-institutional-finance.hero.subtitle")}
          eyebrow={t("solutions-institutional-finance.hero.eyebrow")}
          buttons={[
            {
              text: t("solutions-institutional-finance.hero.button"),
              url: "#resources",
            },
          ]}
        />

        <Stats
          titleContent={
            <Trans
              i18nKey="solutions-institutional-finance.stats.title"
              defaults="<gradient>Global and Cost-Effective,</gradient> Onchain Activity"
              components={{
                gradient: (
                  <GradientText gradient="linear-gradient(90deg, #64A8F2 0%, #9945FF 49.61%, #EB54BC 100%);" />
                ),
              }}
            />
          }
          titleKey={statsContent.title}
          subtitleKey={statsContent.subtitle}
          stats={statsContent.stats}
          className={styles.StatsSection}
          statsClassName={styles.StatsContent}
          buttonsClassName={styles.StatsButtons}
        />

        <BasicCallout
          titleContent={
            <Trans
              i18nKey="solutions-institutional-finance.callout-1.title"
              components={{
                gradient: (
                  <GradientText gradient="linear-gradient(270deg, #9945FF 0%, #EB54BC 50.57%, #FF754A 100%);" />
                ),
              }}
            />
          }
          className={styles.BasicCallout}
        />

        <div className={styles.LongformSection}>
          <MotionSlideIn from="right">
            <LongformItem
              mediaComponent={
                <div className={styles.TokenExtensionsMedia}>
                  <Lottie
                    options={{
                      animationData: longformOne,
                      loop: true,
                      autoplay: true,
                    }}
                    isClickToPauseDisabled={true}
                  />
                </div>
              }
              mediaDesktopPlacement="left"
              titleComponent={t(
                "solutions-institutional-finance.longform-two.title",
              )}
              subtitleComponent={
                <Trans
                  i18nKey="solutions-institutional-finance.longform-two.subtitle"
                  components={[
                    <Link href="/solutions/token-extensions" key="0" />,
                  ]}
                />
              }
              className={styles.LongformItem2}
            />
          </MotionSlideIn>

          <MotionSlideIn from="left">
            <LongformItem
              mediaComponent={
                <Lottie
                  options={{
                    animationData: longformThree,
                    loop: true,
                    autoplay: true,
                  }}
                  isClickToPauseDisabled={true}
                />
              }
              mediaDesktopPlacement="right"
              titleComponent={t(
                "solutions-institutional-finance.longform-three.title",
              )}
              subtitleComponent={
                <Trans
                  i18nKey="solutions-institutional-finance.longform-three.subtitle"
                  components={[
                    <Link
                      href="https://solana.com/solutions/real-world-assets"
                      key="0"
                      target="_blank"
                      rel="noopener noreferrer"
                    />,
                  ]}
                />
              }
              className={styles.LongformItem3}
            />
          </MotionSlideIn>

          <MotionSlideIn from="right">
            <LongformItem
              mediaComponent={
                <Lottie
                  options={{
                    animationData: longformTwo,
                    loop: true,
                    autoplay: true,
                  }}
                  isClickToPauseDisabled={true}
                />
              }
              mediaDesktopPlacement="left"
              titleComponent={t(
                "solutions-institutional-finance.longform-one.title",
              )}
              subtitleComponent={
                <Trans
                  i18nKey="solutions-institutional-finance.longform-one.subtitle"
                  components={[
                    <Link
                      href="/solutions/solana-permissioned-environments"
                      key="0"
                    />,
                  ]}
                />
              }
              className={styles.LongformItem1}
            />
          </MotionSlideIn>
        </div>

        <div id="ecosystem">
          <EcosystemSlider
            titleKey="solutions-institutional-finance.ecosystem.title"
            cards={ecosystemCards}
            className={styles.EcosystemSlider}
          />
        </div>

        <SuccessStories
          title={t("solutions-institutional-finance.case-studies.title")}
          cards={caseStudyCards}
          className={styles.SuccessStories}
        />

        <DeveloperResources
          title={t("solutions-institutional-finance.developer-resources.title")}
          subtitle={t(
            "solutions-institutional-finance.developer-resources.subtitle",
          )}
          links={developerResourcesLinks}
          id="resources"
        />

        <FooterCallout
          title={t("solutions-institutional-finance.footer-callout.title")}
          text={t("solutions-institutional-finance.footer-callout.text")}
          btnText={t("solutions-institutional-finance.footer-callout.btn")}
          btnUrl="https://solana.org/grants-funding"
          btnLargeText={t(
            "solutions-institutional-finance.footer-callout.btn-large",
          )}
          btnLargeUrl="https://solanafoundation.typeform.com/to/L2kwha4R"
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

export default InstitutionalFinance;