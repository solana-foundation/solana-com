import { useState } from "react";
import Link from "next/link";
import Layout from "@/components/solutions/layout";
import { useTranslation, Trans } from "next-i18next";
import HTMLHead from "@/components/HTMLHead";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Lottie from "react-lottie";

import WalletsHero from "@/components/solutions/wallets/WalletsHero";
import WalletsExploreSolutions from "@/components/solutions/wallets/WalletsExploreSolutions";
import BasicCallout from "@/components/solutions/BasicCallout";
import LongformItem, {
  LongformSeeMoreItem,
} from "@/components/solutions/LongformItem";
import DeveloperResources, {
  DeveloperResourcesLink,
} from "@/components/solutions/DeveloperResources";
import FooterCallout from "@/components/solutions/FooterCallout";
import { GradientText, AnimatedText } from "@/components/shared/Text";
import LottieCarousel, {
  LottieCarouselItem,
} from "@/components/shared/LottieCarousel";
import { MotionSlideIn } from "@/components/shared/Motions";

import styles from "./Wallets.module.scss";

import * as blinksLottie from "../../../assets/solutions/wallets/Blinks.json";
import * as gaslessLottie from "../../../assets/solutions/wallets/GaslessRelayer.json";
import * as kycLottie from "../../../assets/solutions/wallets/KYC.json";
import * as securityLottie from "../../../assets/solutions/wallets/Security.json";

import * as multiSigLottie from "../../../assets/learn/wallets/Wallets_Multi Sig Add_V1.json";
import * as custodexLottie from "../../../assets/learn/wallets/Wallets_Custodex_V1.json";
import * as stealthGuardLottie from "../../../assets/learn/wallets/Wallets_StealthGuard_V1.json";

const Wallets = () => {
  const { t } = useTranslation();

  const complianceInABoxSeeMore = [
    <LongformSeeMoreItem key="transfer-hooks">
      <Trans i18nKey="solutions-wallets.compliance-in-a-box.see-more.transfer-hooks" />
    </LongformSeeMoreItem>,
    <LongformSeeMoreItem key="confidential-transfers">
      <Trans i18nKey="solutions-wallets.compliance-in-a-box.see-more.confidential-transfers" />
    </LongformSeeMoreItem>,
    <LongformSeeMoreItem key="freeze-seize">
      <Trans i18nKey="solutions-wallets.compliance-in-a-box.see-more.freeze-seize" />
    </LongformSeeMoreItem>,
  ];

  const oneClickCommerceSeeMore = [
    <LongformSeeMoreItem key="blockchain-links">
      <Trans
        i18nKey="solutions-wallets.one-click-commerce.see-more.blockchain-links"
        components={{
          nextLink: <Link href="/solutions/token-extensions" target="_blank" />,
        }}
      />
    </LongformSeeMoreItem>,
    <LongformSeeMoreItem key="solana-pay">
      <Trans
        i18nKey="solutions-wallets.one-click-commerce.see-more.solana-pay"
        components={{
          nextLink: <Link href="https://solanapay.com/" target="_blank" />,
        }}
      />
    </LongformSeeMoreItem>,
  ];

  const feelessTransactionsSeeMore = [
    <LongformSeeMoreItem key="octane">
      <Trans i18nKey="solutions-wallets.feeless-transactions.see-more.octane" />
    </LongformSeeMoreItem>,
  ];

  const unrivaledSecuritySeeMore = [
    <LongformSeeMoreItem key="exodus">
      <Trans
        i18nKey="solutions-wallets.unrivaled-security.see-more.exodus"
        components={{
          nextLink: (
            <Link href="https://passkeys.foundation/" target="_blank" />
          ),
        }}
      />
    </LongformSeeMoreItem>,
    <LongformSeeMoreItem key="dynamic">
      <Trans
        i18nKey="solutions-wallets.unrivaled-security.see-more.dynamic"
        components={{
          nextLink: <Link href="https://www.dynamic.xyz/" target="_blank" />,
        }}
      />
    </LongformSeeMoreItem>,
  ];

  const developerResourcesLinks = [
    <DeveloperResourcesLink
      title={t("solutions-wallets.developer-resources.links.guide.title")}
      link="https://solana.com/docs/intro/wallets"
      key="guide"
    />,
    <DeveloperResourcesLink
      title={t(
        "solutions-wallets.developer-resources.links.wallet-builder-kit.title",
      )}
      link="https://solanafoundation.notion.site/Wallet-Builder-s-Starter-Kit-615b61c2fe5d4109be71ec74a91e2034"
      key="wallet-builder-kit"
    />,
    <DeveloperResourcesLink
      title={t("solutions-wallets.developer-resources.links.helio.title")}
      link="https://github.com/kilogold/hellowallet"
      key="helio"
    />,
    <DeveloperResourcesLink
      title={t(
        "solutions-wallets.developer-resources.links.confidential-balances.title",
      )}
      link="https://github.com/kilogold/solana-rust-client/tree/kelvin"
      key="confidential-balances"
    />,
    <DeveloperResourcesLink
      title={t(
        "solutions-wallets.developer-resources.links.programmable-wallet.title",
      )}
      link="https://github.com/ZYJLiu/axum-solana-transfer"
      key="programmable-wallet"
    />,
  ];

  const [
    walletTypesLottiePausedStateMobile,
    setWalletTypesLottiePausedStateMobile,
  ] = useState([false, true, true]);

  const [
    walletTypesLottiePausedStateDesktop,
    setWalletTypesLottiePausedStateDesktop,
  ] = useState([true, false, true]);

  const walletTypesItemsMobile = [
    <LottieCarouselItem
      lottie={custodexLottie}
      text={
        <Trans i18nKey="solutions-wallets.wallet-types.items.custodial.text" />
      }
      isLottiePaused={walletTypesLottiePausedStateMobile[0]}
      key="custodial"
    />,
    <LottieCarouselItem
      lottie={stealthGuardLottie}
      text={
        <Trans i18nKey="solutions-wallets.wallet-types.items.non-custodial.text" />
      }
      isLottiePaused={walletTypesLottiePausedStateMobile[1]}
      key="non-custodial"
    />,
    <LottieCarouselItem
      lottie={multiSigLottie}
      text={
        <Trans i18nKey="solutions-wallets.wallet-types.items.multisig.text" />
      }
      isLottiePaused={walletTypesLottiePausedStateMobile[2]}
      key="multisig"
    />,
  ];

  const walletTypesItemsDesktop = [
    <LottieCarouselItem
      lottie={multiSigLottie}
      text={
        <Trans i18nKey="solutions-wallets.wallet-types.items.multisig.text" />
      }
      isLottiePaused={walletTypesLottiePausedStateDesktop[0]}
      key="multisig"
    />,
    <LottieCarouselItem
      lottie={custodexLottie}
      text={
        <Trans i18nKey="solutions-wallets.wallet-types.items.custodial.text" />
      }
      isLottiePaused={walletTypesLottiePausedStateDesktop[1]}
      key="custodial"
    />,
    <LottieCarouselItem
      lottie={stealthGuardLottie}
      text={
        <Trans i18nKey="solutions-wallets.wallet-types.items.non-custodial.text" />
      }
      isLottiePaused={walletTypesLottiePausedStateDesktop[2]}
      key="non-custodial"
    />,
  ];

  return (
    <Layout headerClassName={styles.Header}>
      <HTMLHead
        title={t("solutions-wallets.meta.title")}
        description={t("solutions-wallets.meta.description")}
      />

      <div className={styles.PageWrapper}>
        <WalletsHero />

        <div className={styles.WalletTypes}>
          <AnimatedText element="h2" as="heading">
            <Trans
              i18nKey="solutions-wallets.wallet-types.title"
              components={{
                gradient: (
                  <GradientText gradient="linear-gradient(270deg, #9945FF 0%, #EB54BC 50.57%, #FF754A 100%)" />
                ),
              }}
            />
          </AnimatedText>

          <LottieCarousel
            itemsMobile={walletTypesItemsMobile}
            itemsDesktop={walletTypesItemsDesktop}
            itemsStateMobile={walletTypesLottiePausedStateMobile}
            setItemsStateMobile={setWalletTypesLottiePausedStateMobile}
            itemsStateDesktop={walletTypesLottiePausedStateDesktop}
            setItemsStateDesktop={setWalletTypesLottiePausedStateDesktop}
          />
        </div>

        <BasicCallout
          titleContent={
            <Trans
              i18nKey="solutions-wallets.callout-2.title"
              components={{
                gradient: (
                  <GradientText gradient="linear-gradient(270deg, #9945FF 0%, #EB54BC 50.57%, #FF754A 100%);" />
                ),
              }}
            />
          }
          subtitleKey="solutions-wallets.callout-2.subtitle"
          className={styles.BasicCallout}
        />

        <div className={styles.LongformSection}>
          <MotionSlideIn from="left">
            <LongformItem
              mediaComponent={
                <Lottie
                  options={{
                    animationData: kycLottie,
                    loop: true,
                    autoplay: true,
                  }}
                  isClickToPauseDisabled={true}
                />
              }
              mediaDesktopPlacement="right"
              titleComponent={t("solutions-wallets.compliance-in-a-box.title")}
              subtitleComponent={
                <Trans
                  i18nKey="solutions-wallets.compliance-in-a-box.subtitle"
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
              seeMoreTitle={t(
                "solutions-wallets.compliance-in-a-box.see-more.title",
              )}
              seeMoreItems={complianceInABoxSeeMore}
              className={styles.LongformItem1}
              mediaClassName={styles.LongformItemMedia}
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
              titleComponent={
                <Link
                  href="https://solana.com/solutions/token-extensions"
                  target="_blank"
                >
                  {t("solutions-wallets.one-click-commerce.title")}
                </Link>
              }
              subtitleComponent={
                <Trans i18nKey="solutions-wallets.one-click-commerce.subtitle" />
              }
              seeMoreTitle={t(
                "solutions-wallets.one-click-commerce.see-more.title",
              )}
              seeMoreItems={oneClickCommerceSeeMore}
              className={styles.LongformItem2}
              mediaClassName={styles.LongformItemMedia}
            />
          </MotionSlideIn>

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
            textContentDesktopDirection="row"
            mediaDesktopPlacement="below"
            titleComponent={t("solutions-wallets.feeless-transactions.title")}
            subtitleComponent={
              <Trans i18nKey="solutions-wallets.feeless-transactions.subtitle" />
            }
            seeMoreTitle={t(
              "solutions-wallets.feeless-transactions.see-more.title",
            )}
            seeMoreItems={feelessTransactionsSeeMore}
            className={styles.LongformItem3}
          />

          <MotionSlideIn from="left">
            <LongformItem
              mediaComponent={
                <Lottie
                  options={{
                    animationData: securityLottie,
                    loop: true,
                    autoplay: true,
                  }}
                  isClickToPauseDisabled={true}
                />
              }
              mediaDesktopPlacement="right"
              titleComponent={t("solutions-wallets.unrivaled-security.title")}
              subtitleComponent={
                <Trans i18nKey="solutions-wallets.unrivaled-security.subtitle" />
              }
              seeMoreTitle={t(
                "solutions-wallets.unrivaled-security.see-more.title",
              )}
              seeMoreItems={unrivaledSecuritySeeMore}
              className={styles.LongformItem4}
            />
          </MotionSlideIn>
        </div>

        <WalletsExploreSolutions styles={styles} />

        <DeveloperResources
          title={t("solutions-wallets.developer-resources.title")}
          subtitle={t("solutions-wallets.developer-resources.subtitle")}
          links={developerResourcesLinks}
          id="wallets-developer-resources"
        />

        <FooterCallout
          title={t("solutions-wallets.footer-callout.title")}
          text={t("solutions-wallets.footer-callout.text")}
          btnText={t("solutions-wallets.footer-callout.btn")}
          btnUrl="https://solana.org/grants-funding"
          btnLargeText={t("solutions-wallets.footer-callout.btn-large")}
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
