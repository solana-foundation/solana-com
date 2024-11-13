import Link from "next/link";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Lottie from "react-lottie";
import classNames from "classnames";

import Layout from "@/components/solutions/layout";
import HTMLHead from "@/components/HTMLHead";
import Button from "@/components/solutions/Button";
import LottieHeroWithTabs from "@/components/solutions/LottieHeroWithTabs";
import Stats from "@/components/solutions/Stats";
import FooterCallout from "@/components/solutions/FooterCallout";
import EcosystemSlider, { Card } from "@/components/solutions/EcosystemSlider";
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

import styles from "./Payments.module.scss";

import * as mobileHeroWithSolana from "../../../assets/solutions/payments/MobileHero_WithSolana.json";
import * as mobileHeroWithoutSolana from "../../../assets/solutions/payments/MobileHero_WithoutSolana.json";
import * as desktopHeroWithSolana from "../../../assets/solutions/payments/DesktopHero_WithSolana.json";
import * as desktopHeroWithoutSolana from "../../../assets/solutions/payments/DesktopHero_WithoutSolana.json";

import * as solanaPayLottie from "../../../assets/solutions/payments/Solana Pay_V1.json";
import * as kycLottie from "../../../assets/solutions/payments/KYC.json";
import * as blinksLottie from "../../../assets/solutions/payments/Blinks.json";
import * as gaslessLottie from "../../../assets/solutions/payments/GaslessRelayer.json";

import caseStudyHelioMobileImg from "../../../assets/solutions/payments/helio-case.png";
import caseStudyVisaImg from "../../../assets/solutions/payments/visa-case.png";
import caseStudyVisaLogo from "../../../assets/solutions/payments/visa-logo.svg";

export default function Payments() {
  const { t } = useTranslation();

  const heroTabs = [
    {
      buttonTitle: t("solutions-payments.hero.tabs.0.trigger-title"),
      content: {
        title: t("solutions-payments.hero.tabs.0.title"),
        subtitle: t("solutions-payments.hero.tabs.0.subtitle"),
        lottieMobile: mobileHeroWithSolana,
        lottieDesktop: desktopHeroWithSolana,
      },
    },
    {
      buttonTitle: t("solutions-payments.hero.tabs.1.trigger-title"),
      content: {
        title: t("solutions-payments.hero.tabs.1.title"),
        subtitle: t("solutions-payments.hero.tabs.1.subtitle"),
        lottieMobile: mobileHeroWithoutSolana,
        lottieDesktop: desktopHeroWithoutSolana,
      },
    },
  ];

  const statsContent = t("solutions-payments.stats", {
    returnObjects: true,
  });

  const ecosystemCards = [
    <Card
      key="visa"
      img="/src/img/icons/visa.svg"
      url="https://usa.visa.com/solutions/crypto.html"
      title={t("solutions-payments.ecosystem.card-visa.title")}
      text={t("solutions-payments.ecosystem.card-visa.text")}
    />,
    <Card
      key="paypal"
      img="/src/img/icons/paypal.svg"
      url="https://www.paypal.com/us/digital-wallet/manage-money/crypto/pyusd"
      title={t("solutions-payments.ecosystem.card-paypal.title")}
      text={t("solutions-payments.ecosystem.card-paypal.text")}
    />,
    <Card
      key="sling"
      img="/src/img/icons/sling.svg"
      url="https://sling.money/"
      title={t("solutions-payments.ecosystem.card-sling.title")}
      text={t("solutions-payments.ecosystem.card-sling.text")}
    />,
    <Card
      key="stripe"
      img="/src/img/icons/stripe.png"
      url="https://stripe.com/use-cases/crypto"
      title={t("solutions-payments.ecosystem.card-stripe.title")}
      text={t("solutions-payments.ecosystem.card-stripe.text")}
    />,
    <Card
      key="worldpay"
      img="/src/img/icons/worldpay.svg"
      url="https://www.worldpay.com/en"
      title={t("solutions-payments.ecosystem.card-world-pay.title")}
      text={t("solutions-payments.ecosystem.card-world-pay.text")}
    />,
    <Card
      key="helio"
      img="/src/img/icons/helio.svg"
      url="https://www.hel.io/shopify-stores"
      title={t("solutions-payments.ecosystem.card-helio.title")}
      text={t("solutions-payments.ecosystem.card-helio.text")}
    />,
    <Card
      key="venta"
      img="/src/img/icons/venta.svg"
      url="https://www.venta.xyz/"
      title={t("solutions-payments.ecosystem.card-venta.title")}
      text={t("solutions-payments.ecosystem.card-venta.text")}
    />,
    <Card
      key="tiplink"
      img="/src/img/icons/tiplink.svg"
      url="https://tiplink.io/"
      title={t("solutions-payments.ecosystem.card-tiplink.title")}
      text={t("solutions-payments.ecosystem.card-tiplink.text")}
    />,
    <Card
      key="fireblocks"
      img="/src/img/icons/fireblocks.svg"
      url="https://www.fireblocks.com/customers/worldpay/"
      title={t("solutions-payments.ecosystem.card-fireblocks.title")}
      text={t("solutions-payments.ecosystem.card-fireblocks.text")}
    />,
    <Card
      key="loop-crypto"
      img="/src/img/icons/loop-crypto.svg"
      url="https://www.loopcrypto.xyz/"
      title={t("solutions-payments.ecosystem.card-loop-crypto.title")}
      text={t("solutions-payments.ecosystem.card-loop-crypto.text")}
    />,
  ];

  const caseStudyCards = [
    <StoryCard
      key="helio-case"
      logo="/solutions/payments/helio-logo.webp"
      logoAlt="Helio logo"
      mobileImage={caseStudyHelioMobileImg}
      desktopImage={caseStudyHelioMobileImg}
      imageAlt="Helio"
      text={
        <Trans i18nKey="solutions-payments.case-studies.cards.helio.excerpt" />
      }
      buttonText={t("solutions-payments.case-studies.cards.helio.button")}
      buttonUrl="/news/case-study-helio"
      className={styles.StoryCard}
      mainImageClassName={styles.StoryCardImage}
    />,
    <StoryCard
      key="visa-case"
      logo={caseStudyVisaLogo}
      logoAlt="Visa logo"
      mobileImage={caseStudyVisaImg}
      desktopImage={caseStudyVisaImg}
      imageAlt="Visa"
      text={
        <Trans i18nKey="solutions-payments.case-studies.cards.visa.excerpt" />
      }
      buttonText={t("solutions-payments.case-studies.cards.visa.button")}
      buttonUrl="https://usa.visa.com/solutions/crypto/deep-dive-on-solana.html"
      className={styles.StoryCard}
      logoClassName={classNames(styles.StoryCardLogo, styles.StoryCard2Logo)}
      mainImageClassName={styles.StoryCardMainImage}
    />,
  ];

  const developerResourcesLinks = [
    <DeveloperResourcesLink
      title={t(
        "solutions-payments.developer-resources.links.quick-start.title",
      )}
      link="https://solana.com/docs/intro/quick-start"
      key="quick-start"
    />,
    <DeveloperResourcesLink
      title={t("solutions-payments.developer-resources.links.solana-pay.title")}
      link="https://docs.solanapay.com/"
      key="solana-pay"
    />,
    <DeveloperResourcesLink
      title={t("solutions-payments.developer-resources.links.helio.title")}
      link="https://docs.hel.io/"
      key="helio"
    />,
  ];

  return (
    <Layout>
      <HTMLHead
        title={t("solutions-payments.meta.title")}
        description={t("solutions-payments.meta.description")}
      />

      <div className={styles.PageWrapper} id="payments-tooling-page">
        <LottieHeroWithTabs tabs={heroTabs} className={styles.Hero} />

        <div className={styles.StatsSectionWrapper}>
          <Stats
            titleContent={
              <Trans
                i18nKey="solutions-payments.stats.title"
                components={{
                  gradient: (
                    <GradientText gradient="linear-gradient(90deg, #64a8f2 0%, #9945ff 49.61%, #eb54bc 100%)" />
                  ),
                }}
              />
            }
            subtitleKey={statsContent.subtitle}
            stats={statsContent.stats}
            buttonsComponent={
              <>
                <Button
                  text={t("solutions-payments.stats.start-btn")}
                  url="#developer-resources"
                />
                <Button
                  text={t("solutions-payments.stats.explore-btn")}
                  url="#ecosystem"
                  theme="secondary"
                />
              </>
            }
            className={styles.StatsSection}
            buttonsClassName={styles.StatsButtons}
          />
        </div>

        <BasicCallout
          titleContent={
            <Trans
              i18nKey="solutions-payments.callout-1.title"
              components={{
                gradient: (
                  <GradientText gradient="linear-gradient(270deg, #9945FF 0%, #EB54BC 50.57%, #FF754A 100%);" />
                ),
              }}
            />
          }
          subtitleKey="solutions-payments.callout-1.subtitle"
          className={styles.BasicCallout}
        />

        <div className={styles.LongformSection}>
          <MotionSlideIn from="left">
            <LongformItem
              mediaComponent={
                <div className={styles.TokenExtensionsMedia}>
                  <Lottie
                    options={{
                      animationData: kycLottie,
                      loop: true,
                      autoplay: true,
                    }}
                    isClickToPauseDisabled={true}
                  />
                </div>
              }
              mediaDesktopPlacement="right"
              titleComponent={t("solutions-payments.token-extensions.title")}
              subtitleComponent={
                <Trans
                  i18nKey="solutions-payments.token-extensions.subtitle"
                  components={{
                    nextLink: (
                      <Link
                        href="/solutions/token-extensions"
                        target="_blank"
                      />
                    ),
                  }}
                />
              }
              className={classNames(styles.LongformItem, styles.LongformItem2)}
            />
          </MotionSlideIn>

          <MotionSlideIn>
            <LongformItem
              mediaComponent={
                <Lottie
                  options={{
                    animationData: gaslessLottie,
                    loop: true,
                    autoplay: true,
                  }}
                  isClickToPauseDisabled={true}
                />
              }
              textContentDesktopDirection="column"
              mediaDesktopPlacement="below"
              titleComponent={t(
                "solutions-payments.feeless-transactions.title",
              )}
              subtitleComponent={
                <Trans i18nKey="solutions-payments.feeless-transactions.subtitle" />
              }
              className={classNames(styles.LongformItem, styles.LongformItem4)}
            />
          </MotionSlideIn>

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
              titleComponent={t("solutions-payments.blinks-actions.title")}
              subtitleComponent={
                <Trans
                  i18nKey="solutions-payments.blinks-actions.subtitle"
                  components={{
                    nextLink: (
                      <Link href="/solutions/actions" target="_blank" />
                    ),
                  }}
                />
              }
              className={classNames(styles.LongformItem, styles.LongformItem3)}
            />
          </MotionSlideIn>

          <MotionSlideIn from="left">
            <LongformItem
              mediaComponent={
                <Lottie
                  options={{
                    animationData: solanaPayLottie,
                    loop: true,
                    autoplay: true,
                  }}
                  isClickToPauseDisabled={true}
                />
              }
              mediaDesktopPlacement="right"
              titleComponent={t("solutions-payments.solana-pay.title")}
              subtitleComponent={
                <Trans
                  i18nKey="solutions-payments.solana-pay.subtitle"
                  components={{
                    nextLink: (
                      <Link href="https://solanapay.com/" target="_blank" />
                    ),
                  }}
                />
              }
              className={classNames(styles.LongformItem, styles.LongformItem1)}
            />
          </MotionSlideIn>
        </div>

        <div id="ecosystem">
          <EcosystemSlider
            titleKey="solutions-payments.ecosystem.title"
            cards={ecosystemCards}
            className={styles.EcosystemSlider}
          />
        </div>

        <SuccessStories
          title={t("solutions-payments.case-studies.title")}
          cards={caseStudyCards}
          className={styles.SuccessStories}
        />

        <DeveloperResources
          title={t("solutions-payments.developer-resources.title")}
          subtitle={t("solutions-payments.developer-resources.subtitle")}
          links={developerResourcesLinks}
          id="developer-resources"
        />

        <FooterCallout
          title={t("solutions-payments.footer-callout.title")}
          text={t("solutions-payments.footer-callout.text")}
          btnText={t("solutions-payments.footer-callout.btn")}
          btnUrl="https://solana.org/grants-funding"
          btnLargeText={t("solutions-payments.footer-callout.btn-large")}
          btnLargeUrl="bd-payments-commerce@solana.org"
          className={styles.FooterCallout}
          topSectionClassName={styles.FooterCalloutTopSection}
        />
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
