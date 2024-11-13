import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation, Trans } from "next-i18next";
import Link from "next/link";
import Lottie from "react-lottie";

import Layout from "@/components/solutions/layout";
import HTMLHead from "@/components/HTMLHead";
import WalletsHero from "@/components/learn/WalletsHero";
import BasicCallout from "@/components/solutions/BasicCallout";
import Text, { GradientText } from "@/components/shared/Text";
import LongformItem, {
  LongformSeeMoreItem,
} from "@/components/solutions/LongformItem";
import { MotionSlideIn } from "@/components/shared/Motions";
import EcosystemSlider, { Card } from "@/components/solutions/EcosystemSlider";
import DetailsSection, { Detail } from "@/components/solutions/DetailsSection";
import DeveloperResources, {
  DeveloperResourcesLink,
} from "@/components/solutions/DeveloperResources";
import FooterCallout from "@/components/solutions/FooterCallout";

import styles from "./Wallets.module.scss";

import * as multiSigLottie from "../../../assets/learn/wallets/Wallets_Multi Sig Add_V1.json";
import * as custodexLottie from "../../../assets/learn/wallets/Wallets_Custodex_V1.json";
import * as stealthGuardLottie from "../../../assets/learn/wallets/Wallets_StealthGuard_V1.json";
import * as walletHeroLottie from "../../../assets/wallets/wallet-finder.json";

const Wallets = () => {
  const { t } = useTranslation();

  const developerResourcesLinks = [
    <DeveloperResourcesLink
      key="beginners"
      title={t("learn-wallets.developer-resources.links.beginners.title")}
      link="https://solanafloor.com/learn/crypto-for-beginners"
    />,
    <DeveloperResourcesLink
      key="how-to"
      title={t("learn-wallets.developer-resources.links.how-to.title")}
      link="https://solanafloor.com/learn/how-to-set-up-a-crypto-wallet"
    />,
    <DeveloperResourcesLink
      key="security"
      title={t("learn-wallets.developer-resources.links.security.title")}
      link="https://solanafloor.com/learn/crypto-security-essentials"
    />,
  ];

  const ecosystemCards = [
    <Card
      key="solflare"
      img={"/src/img/learn/wallets/solflare.svg"}
      url="https://solflare.com/"
      title={t("learn-wallets.ecosystem.items.solflare.title")}
      text={t("learn-wallets.ecosystem.items.solflare.text")}
      className={styles.EcosystemCard}
    />,
    <Card
      key="phantom"
      img={"/src/img/learn/wallets/phantom.svg"}
      url="https://phantom.app/"
      title={t("learn-wallets.ecosystem.items.phantom.title")}
      text={t("learn-wallets.ecosystem.items.phantom.text")}
      className={styles.EcosystemCard}
    />,
    <Card
      key="backpack"
      img={"/src/img/learn/wallets/backpack.svg"}
      url="https://backpack.app/"
      title={t("learn-wallets.ecosystem.items.backpack.title")}
      text={t("learn-wallets.ecosystem.items.backpack.text")}
      className={styles.EcosystemCard}
    />,
    <Card
      key="ledger"
      img={"/src/img/learn/wallets/ledger.svg"}
      url="https://www.ledger.com/"
      title={t("learn-wallets.ecosystem.items.ledger.title")}
      text={t("learn-wallets.ecosystem.items.ledger.text")}
      className={styles.EcosystemCard}
    />,
    <Card
      key="coinbase"
      img={"/src/img/learn/wallets/coinbase.svg"}
      url="https://www.coinbase.com/wallet"
      title={t("learn-wallets.ecosystem.items.coinbase.title")}
      text={t("learn-wallets.ecosystem.items.coinbase.text")}
      className={styles.EcosystemCard}
    />,
    <Card
      key="binance"
      img={"/src/img/learn/wallets/binance.svg"}
      url="https://www.binance.com/en/web3wallet"
      title={t("learn-wallets.ecosystem.items.binance.title")}
      text={t("learn-wallets.ecosystem.items.binance.text")}
      className={styles.EcosystemCard}
    />,
  ];

  return (
    <Layout headerClassName={styles.Header}>
      <HTMLHead
        title={t("learn-wallets.meta.title")}
        description={t("learn-wallets.meta.description")}
      />

      <div className={styles.PageWrapper}>
        <WalletsHero />

        <BasicCallout
          titleContent={
            <Trans
              i18nKey="learn-wallets.callout-1.title"
              components={{
                gradient: (
                  <GradientText gradient="linear-gradient(270deg, #9945FF 0%, #EB54BC 50.57%, #FF754A 100%);" />
                ),
              }}
            />
          }
          subtitleKey="learn-wallets.callout-1.subtitle"
          className={styles.BasicCallout}
        />

        <div className={styles.LongformSection}>
          <MotionSlideIn from="right">
            <LongformItem
              mediaComponent={
                <Lottie
                  options={{
                    animationData: multiSigLottie,
                    loop: true,
                    autoplay: true,
                  }}
                  isClickToPauseDisabled={true}
                />
              }
              mediaDesktopPlacement="left"
              titleComponent={t("learn-wallets.longform.multisig.title")}
              subtitleComponent={
                <>
                  <span className={styles.LongformSubtitleWrapper}>
                    <Trans i18nKey="learn-wallets.longform.multisig.subtitle-1" />
                  </span>
                  <span className={styles.LongformSubtitleWrapper}>
                    <Trans i18nKey="learn-wallets.longform.multisig.subtitle-2" />
                  </span>
                </>
              }
              seeMoreTitle={t("learn-wallets.longform.multisig.see-more.title")}
              seeMoreItems={[
                <LongformSeeMoreItem key="multisig-see-more-1">
                  <Trans i18nKey="learn-wallets.longform.multisig.see-more.text" />
                </LongformSeeMoreItem>,
                // Add other LongformSeeMoreItem elements with unique keys if needed
              ]}
              className={styles.LongformItem1}
              mediaClassName={styles.LongformItemMedia}
            />
          </MotionSlideIn>

          <MotionSlideIn from="left">
            <LongformItem
              mediaComponent={
                <Lottie
                  options={{
                    animationData: custodexLottie,
                    loop: true,
                    autoplay: true,
                  }}
                  isClickToPauseDisabled={true}
                />
              }
              mediaDesktopPlacement="right"
              titleComponent={
                <Link
                  href="https://solana.com/solutions/token-extensions"
                  target="_blank"
                >
                  {t("learn-wallets.longform.custodial.title")}
                </Link>
              }
              subtitleComponent={
                <>
                  <span className={styles.LongformSubtitleWrapper}>
                    <Trans i18nKey="learn-wallets.longform.custodial.subtitle.0" />
                  </span>
                  <span className={styles.LongformSubtitleWrapper}>
                    <Trans i18nKey="learn-wallets.longform.custodial.subtitle.1" />
                  </span>
                </>
              }
              seeMoreTitle={t(
                "learn-wallets.longform.custodial.see-more.title",
              )}
              seeMoreItems={[
                <LongformSeeMoreItem key="custodial">
                  <Text element="p" as="paragraph">
                    <Trans i18nKey="learn-wallets.longform.custodial.see-more.text.0" />
                  </Text>
                  <Text element="p" as="paragraph">
                    <Trans i18nKey="learn-wallets.longform.custodial.see-more.text.1" />
                  </Text>
                  <Text element="p" as="paragraph">
                    <Trans i18nKey="learn-wallets.longform.custodial.see-more.text.2" />
                  </Text>
                </LongformSeeMoreItem>,
              ]}
              className={styles.LongformItem2}
              mediaClassName={styles.LongformItemMedia}
            />
          </MotionSlideIn>

          <MotionSlideIn from="right">
            <LongformItem
              mediaComponent={
                <Lottie
                  options={{
                    animationData: stealthGuardLottie,
                    loop: true,
                    autoplay: true,
                  }}
                  isClickToPauseDisabled={true}
                />
              }
              mediaDesktopPlacement="left"
              titleComponent={t("learn-wallets.longform.non-custodial.title")}
              subtitleComponent={
                <>
                  <span className={styles.LongformSubtitleWrapper}>
                    <Trans i18nKey="learn-wallets.longform.non-custodial.subtitle.0" />
                  </span>
                  <span className={styles.LongformSubtitleWrapper}>
                    <Trans i18nKey="learn-wallets.longform.non-custodial.subtitle.1" />
                  </span>
                </>
              }
              seeMoreTitle={t(
                "solutions-wallets.unrivaled-security.see-more.title",
              )}
              seeMoreItems={[
                <LongformSeeMoreItem key="unrivaled-security">
                  <Text element="p" as="paragraph">
                    <Trans i18nKey="learn-wallets.longform.non-custodial.see-more.text.0" />
                  </Text>
                  <Text element="p" as="paragraph">
                    <Trans i18nKey="learn-wallets.longform.non-custodial.see-more.text.1" />
                  </Text>
                  <Text element="p" as="paragraph">
                    <Trans i18nKey="learn-wallets.longform.non-custodial.see-more.text.2" />
                  </Text>
                  <Text element="p" as="paragraph">
                    <Trans i18nKey="learn-wallets.longform.non-custodial.see-more.text.3" />
                  </Text>
                  <Text element="p" as="paragraph">
                    <Trans i18nKey="learn-wallets.longform.non-custodial.see-more.text.4" />
                  </Text>
                </LongformSeeMoreItem>,
              ]}
              className={styles.LongformItem4}
            />
          </MotionSlideIn>
        </div>

        <div id="ecosystem">
          <EcosystemSlider
            titleKey="learn-wallets.ecosystem.title"
            cards={ecosystemCards}
            className={styles.EcosystemSlider}
            titleBlockClassName={styles.EcosystemSliderTitleBlock}
          />
        </div>

        <BasicCallout
          titleContent={t("learn-wallets.details.title")}
          subtitleKey={t("learn-wallets.details.subtitle")}
          className={styles.DetailsTitleBlock}
        />

        <DetailsSection className={styles.DetailsSection}>
          <Detail
            title={t("learn-wallets.details.items.0.title")}
            text={t("learn-wallets.details.items.0.text")}
          />
          <Detail
            title={t("learn-wallets.details.items.1.title")}
            text={t("learn-wallets.details.items.1.text")}
          />
          <Detail
            title={t("learn-wallets.details.items.2.title")}
            text={t("learn-wallets.details.items.2.text")}
          />
          <Detail
            title={t("learn-wallets.details.items.3.title")}
            text={t("learn-wallets.details.items.3.text")}
          />
        </DetailsSection>

        <DeveloperResources
          title={t("learn-wallets.developer-resources.title")}
          links={developerResourcesLinks}
          id="developer-resources"
          media={
            <Lottie
              options={{
                animationData: walletHeroLottie,
                loop: true,
                autoplay: true,
              }}
              isClickToPauseDisabled={true}
            />
          }
        />

        <FooterCallout
          btnLargeText={t("learn-wallets.footer-callout.btn-large")}
          btnLargeUrl="wallets@solana.org"
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

export default Wallets;
