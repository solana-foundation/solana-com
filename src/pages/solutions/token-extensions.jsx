import Link from "next/link";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Lottie from "react-lottie";

import Layout from "@/components/solutions/layout";
import HTMLHead from "@/components/HTMLHead";
import FooterCallout from "@/components/solutions/FooterCallout";
import SuccessStories, {
  StoryCard,
} from "@/components/solutions/SuccessStories";
import DeveloperResources, {
  DeveloperResourcesLink,
} from "@/components/solutions/DeveloperResources";
import LongformItem from "@/components/solutions/LongformItem";
import BasicCallout from "@/components/solutions/BasicCallout";
import VideoBgHero from "@/components/solutions/VideoBgHero";
import CollapsibleContent from "@/components/shared/CollapsibleContent";
import { MotionSlideIn } from "@/components/shared/Motions";
import Text, { AnimatedText, GradientText } from "@/components/shared/Text";
import EcosystemToggle, {
  EcosystemItemContentWrap,
  EcosystemItemContentTitle,
  EcosystemItemContentText,
} from "@/components/solutions/token-extensions/EcosystemToggle";
import Button from "@/components/solutions/Button";

import styles from "./TE.module.scss";

import * as longformOne from "../../../assets/solutions/token-extensions/Token Extensions_Confidential Transfer_V1.json";
import * as longformTwo from "../../../assets/solutions/token-extensions/Token Extensions_KYC_V1.json";
import * as longformThree from "../../../assets/solutions/token-extensions/Token Extensions_Transfer Fees_V1.json";

import paypalLogo from "../../../assets/solutions/token-extensions/paypal-logo.svg";
import paypalMain from "../../../assets/solutions/token-extensions/paypal-main.png";

const TokenExtensions = () => {
  const { t } = useTranslation();

  // Some do not have collapsible content
  // Content children may include: Title, Text, Button
  const ecosystemItems = [
    {
      label: t("solutions-token-extensions.ecosystem.use-cases.seize-assets"),
      content: (
        <EcosystemItemContentWrap>
          <div className={styles.EcosystemItemContentBlock}>
            <EcosystemItemContentTitle
              text={t(
                "solutions-token-extensions.ecosystem.extensions.permanent-delegate.title",
              )}
            />
            <EcosystemItemContentText
              text={t(
                "solutions-token-extensions.ecosystem.extensions.permanent-delegate.text",
              )}
            />
          </div>
        </EcosystemItemContentWrap>
      ),
    },
    {
      label: t("solutions-token-extensions.ecosystem.use-cases.allow-list"),
      content: (
        <EcosystemItemContentWrap>
          <div className={styles.EcosystemItemContentBlock}>
            <EcosystemItemContentTitle
              text={t(
                "solutions-token-extensions.ecosystem.extensions.default-account.title",
              )}
            />
            <EcosystemItemContentText
              text={t(
                "solutions-token-extensions.ecosystem.extensions.default-account.text",
              )}
            />
          </div>

          <div className={styles.EcosystemItemContentBlock}>
            <EcosystemItemContentTitle
              text={t(
                "solutions-token-extensions.ecosystem.extensions.transfer-hook.title",
              )}
            />
            <EcosystemItemContentText
              text={t(
                "solutions-token-extensions.ecosystem.extensions.transfer-hook.text",
              )}
            />
          </div>

          <div className={styles.EcosystemItemContentBlock}>
            <Button
              text={t(
                "solutions-token-extensions.ecosystem.reference-implementation-btn",
              )}
              url="https://github.com/solana-developers/program-examples/tree/401366c31096f54cf2e4e5ccad9fb55bd36053dd/tokens/token-2022/transfer-hook/whitelist"
              target="_blank"
            />
          </div>
        </EcosystemItemContentWrap>
      ),
    },
    {
      label: t("solutions-token-extensions.ecosystem.use-cases.block-list"),
      content: (
        <EcosystemItemContentWrap>
          <div className={styles.EcosystemItemContentBlock}>
            <EcosystemItemContentTitle
              text={t(
                "solutions-token-extensions.ecosystem.extensions.transfer-hook.title",
              )}
            />
            <EcosystemItemContentText
              text={t(
                "solutions-token-extensions.ecosystem.extensions.transfer-hook.text",
              )}
            />
          </div>
        </EcosystemItemContentWrap>
      ),
    },
    {
      label: t(
        "solutions-token-extensions.ecosystem.use-cases.authority-over-tokens",
      ),
      content: (
        <EcosystemItemContentWrap>
          <div className={styles.EcosystemItemContentBlock}>
            <EcosystemItemContentTitle
              text={t(
                "solutions-token-extensions.ecosystem.extensions.permanent-delegate.title",
              )}
            />
            <EcosystemItemContentText
              text={t(
                "solutions-token-extensions.ecosystem.extensions.permanent-delegate.text",
              )}
            />
          </div>
        </EcosystemItemContentWrap>
      ),
    },
    {
      label: t("solutions-token-extensions.ecosystem.use-cases.hide-amounts"),
      content: (
        <EcosystemItemContentWrap>
          <div className={styles.EcosystemItemContentBlock}>
            <EcosystemItemContentTitle
              text={t(
                "solutions-token-extensions.ecosystem.extensions.confidential-balances.title",
              )}
            />
            <EcosystemItemContentText
              text={t(
                "solutions-token-extensions.ecosystem.extensions.confidential-balances.text",
              )}
            />
          </div>
        </EcosystemItemContentWrap>
      ),
    },
    {
      label: t(
        "solutions-token-extensions.ecosystem.use-cases.accruing-interest",
      ),
      content: (
        <EcosystemItemContentWrap>
          <div className={styles.EcosystemItemContentBlock}>
            <EcosystemItemContentTitle
              text={t(
                "solutions-token-extensions.ecosystem.extensions.interest-bearing.title",
              )}
            />
            <EcosystemItemContentText
              text={t(
                "solutions-token-extensions.ecosystem.extensions.interest-bearing.text",
              )}
            />
          </div>
          <div className={styles.EcosystemItemContentBlock}>
            <Button
              text={t(
                "solutions-token-extensions.ecosystem.reference-implementation-btn",
              )}
              url="https://solana.com/developers/guides/token-extensions/interest-bearing-tokens"
              target="_blank"
            />
          </div>
        </EcosystemItemContentWrap>
      ),
    },
    {
      label: t("solutions-token-extensions.ecosystem.use-cases.soul-bound"),
      content: (
        <EcosystemItemContentWrap>
          <div className={styles.EcosystemItemContentBlock}>
            <EcosystemItemContentTitle
              text={t(
                "solutions-token-extensions.ecosystem.extensions.non-transfer.title",
              )}
            />
            <EcosystemItemContentText
              text={t(
                "solutions-token-extensions.ecosystem.extensions.non-transfer.text",
              )}
            />
          </div>
          <div className={styles.EcosystemItemContentBlock}>
            <Button
              text={t(
                "solutions-token-extensions.ecosystem.reference-implementation-btn",
              )}
              url="https://solana.com/developers/guides/token-extensions/non-transferable"
              target="_blank"
            />
          </div>
        </EcosystemItemContentWrap>
      ),
    },
    {
      label: t(
        "solutions-token-extensions.ecosystem.use-cases.collect-fees-transfers",
      ),
      content: (
        <EcosystemItemContentWrap>
          <div className={styles.EcosystemItemContentBlock}>
            <EcosystemItemContentTitle
              text={t(
                "solutions-token-extensions.ecosystem.extensions.transfer-fees.title",
              )}
            />
            <EcosystemItemContentText
              text={t(
                "solutions-token-extensions.ecosystem.extensions.transfer-fees.text",
              )}
            />
          </div>

          <div className={styles.EcosystemItemContentBlock}>
            <EcosystemItemContentTitle
              text={t(
                "solutions-token-extensions.ecosystem.extensions.transfer-hook.title",
              )}
            />
            <EcosystemItemContentText
              text={t(
                "solutions-token-extensions.ecosystem.extensions.transfer-hook.text",
              )}
            />
          </div>
        </EcosystemItemContentWrap>
      ),
    },
    {
      label: t(
        "solutions-token-extensions.ecosystem.use-cases.permissioned-network",
      ),
      content: (
        <EcosystemItemContentWrap>
          <div className={styles.EcosystemItemContentBlock}>
            <EcosystemItemContentTitle
              text={t(
                "solutions-token-extensions.ecosystem.extensions.default-account.title",
              )}
            />
            <EcosystemItemContentText
              text={t(
                "solutions-token-extensions.ecosystem.extensions.default-account.text",
              )}
            />
          </div>

          <div className={styles.EcosystemItemContentBlock}>
            <EcosystemItemContentTitle
              text={t(
                "solutions-token-extensions.ecosystem.extensions.transfer-hook.title",
              )}
            />
            <EcosystemItemContentText
              text={t(
                "solutions-token-extensions.ecosystem.extensions.transfer-hook.text",
              )}
            />
          </div>
        </EcosystemItemContentWrap>
      ),
    },
    {
      label: t(
        "solutions-token-extensions.ecosystem.use-cases.attached-invoice-id",
      ),
      content: (
        <EcosystemItemContentWrap>
          <div className={styles.EcosystemItemContentBlock}>
            <EcosystemItemContentTitle
              text={t(
                "solutions-token-extensions.ecosystem.extensions.memo-required.title",
              )}
            />
            <EcosystemItemContentText
              text={t(
                "solutions-token-extensions.ecosystem.extensions.memo-required.text",
              )}
            />
          </div>
        </EcosystemItemContentWrap>
      ),
    },
    {
      label: t("solutions-token-extensions.ecosystem.use-cases.ap-ar"),
      content: (
        <EcosystemItemContentWrap>
          <div className={styles.EcosystemItemContentBlock}>
            <EcosystemItemContentTitle
              text={t(
                "solutions-token-extensions.ecosystem.extensions.memo-required.title",
              )}
            />
            <EcosystemItemContentText
              text={t(
                "solutions-token-extensions.ecosystem.extensions.memo-required.text",
              )}
            />
          </div>
        </EcosystemItemContentWrap>
      ),
    },
    {
      label: t("solutions-token-extensions.ecosystem.use-cases.collection-nft"),
      content: (
        <EcosystemItemContentWrap>
          <div className={styles.EcosystemItemContentBlock}>
            <EcosystemItemContentTitle
              text={t(
                "solutions-token-extensions.ecosystem.extensions.group-pointer.title",
              )}
            />
            <EcosystemItemContentText
              text={t(
                "solutions-token-extensions.ecosystem.extensions.group-pointer.text",
              )}
            />
          </div>
        </EcosystemItemContentWrap>
      ),
    },
    {
      label: t("solutions-token-extensions.ecosystem.use-cases.nft-royalties"),
      content: (
        <EcosystemItemContentWrap>
          <div className={styles.EcosystemItemContentBlock}>
            <EcosystemItemContentTitle
              text={t(
                "solutions-token-extensions.ecosystem.extensions.transfer-hook.title",
              )}
            />
            <EcosystemItemContentText
              text={t(
                "solutions-token-extensions.ecosystem.extensions.transfer-hook.text",
              )}
            />
          </div>

          <div className={styles.EcosystemItemContentBlock}>
            <Button
              text={t(
                "solutions-token-extensions.ecosystem.reference-implementation-btn",
              )}
              url="https://solana.com/developers/guides/token-extensions/transfer-hook"
              target="_blank"
            />
          </div>
        </EcosystemItemContentWrap>
      ),
    },
    {
      label: t("solutions-token-extensions.ecosystem.use-cases.transfer-logs"),
      content: (
        <EcosystemItemContentWrap>
          <div className={styles.EcosystemItemContentBlock}>
            <EcosystemItemContentTitle
              text={t(
                "solutions-token-extensions.ecosystem.extensions.transfer-hook.title",
              )}
            />
            <EcosystemItemContentText
              text={t(
                "solutions-token-extensions.ecosystem.extensions.transfer-hook.text",
              )}
            />
          </div>

          <div className={styles.EcosystemItemContentBlock}>
            <Button
              text={t(
                "solutions-token-extensions.ecosystem.reference-implementation-btn",
              )}
              url="https://solana.com/developers/guides/token-extensions/transfer-hook"
              target="_blank"
            />
          </div>
        </EcosystemItemContentWrap>
      ),
    },
  ];

  const caseStudyCards = [
    <StoryCard
      logo={paypalLogo}
      logoAlt="paypal logo"
      mobileImage={paypalMain}
      desktopImage={paypalMain}
      imageAlt="paypal Main"
      text={
        <Trans
          i18nKey={
            "solutions-token-extensions.case-studies.cards.item-one.excerpt"
          }
        />
      }
      buttonText={t(
        "solutions-token-extensions.case-studies.cards.item-one.button",
      )}
      buttonUrl="https://solana.com/pyusd"
      className={styles.StoryCard}
      logoClassName={styles.StoryCardLogo}
      key="paypal"
    />,
    <StoryCard
      logo={"/solutions/defi/etherfuse-logo.svg"}
      logoAlt="etherfuse logo"
      mobileImage={"/solutions/defi/etherfuse-main.webp"}
      desktopImage={"/solutions/defi/etherfuse-main.webp"}
      imageAlt="etherfuse main image"
      text={
        <Trans
          i18nKey={
            "solutions-token-extensions.case-studies.cards.item-two.excerpt"
          }
        />
      }
      buttonText={t(
        "solutions-token-extensions.case-studies.cards.item-two.button",
      )}
      buttonUrl="https://etherfuse.com/stablebonds/"
      className={styles.StoryCard}
      logoClassName={styles.StoryCardLogo}
      key="etherfuse"
    />,
  ];

  const developerResourcesLinks = [
    <DeveloperResourcesLink
      title={t(
        "solutions-token-extensions.developer-resources.links.link-one.title",
      )}
      link="https://solana.com/docs/intro/quick-start"
      key="quick-start"
    />,
    <DeveloperResourcesLink
      title={t(
        "solutions-token-extensions.developer-resources.links.link-two.title",
      )}
      link="https://cdn.builder.io/o/assets%2Fce0c7323a97a4d91bd0baa7490ec9139%2F83c26b9268f64400b8eb67442579a31a?alt=media&token=525415b0-d3ea-48d7-83d6-0fb0d9e522c6"
      key="token-extensions"
    />,
    <DeveloperResourcesLink
      title={t(
        "solutions-token-extensions.developer-resources.links.link-three.title",
      )}
      link="https://solana.com/developers/guides/token-extensions/getting-started"
      key="getting-started"
    />,
    <DeveloperResourcesLink
      title={t(
        "solutions-token-extensions.developer-resources.links.link-four.title",
      )}
      link="https://solana.com/docs/core/tokens"
      key="core-tokens"
    />,
  ];

  return (
    <Layout>
      <HTMLHead
        title={t("solutions-token-extensions.meta.title")}
        description={t("solutions-token-extensions.meta.description")}
      />

      <div className={styles.TokenExtensionsWrapper} id="te-page">
        <VideoBgHero
          videoSrc="https://player.vimeo.com/progressive_redirect/playback/1010826502/rendition/720p/file.mp4?loc=external&signature=26635ff9a62dec9b36970d7865700803479257a9c3d9009318726f7762973d37"
          videoPoster="/solutions/token-extensions/Token-Extension-Hero.jpeg"
          title={t("solutions-token-extensions.hero.title")}
          subtitle={t("solutions-token-extensions.hero.text")}
          eyebrow={t("solutions-token-extensions.hero.eyebrow")}
          buttons={[
            {
              text: t("solutions-token-extensions.hero.buttonOne"),
              url: "#resources",
            },
            {
              text: t("solutions-token-extensions.hero.buttonTwo"),
              url: "#real-world-use-cases",
              theme: "secondary",
            },
          ]}
        />

        <div id="ecosystem" className={styles.EcosystemSection}>
          <EcosystemToggle
            titleKey="solutions-token-extensions.ecosystem.title"
            textKey="solutions-token-extensions.ecosystem.text"
            toggleLabel="Find Extensions Based on Your Needs"
            items={ecosystemItems}
          />
        </div>

        <BasicCallout
          titleContent={
            <Trans
              i18nKey="solutions-token-extensions.callout-1.title"
              components={{
                gradient: (
                  <GradientText gradient="linear-gradient(270deg, #9945FF 0%, #EB54BC 50.57%, #FF754A 100%);" />
                ),
              }}
            />
          }
          subtitleKey="solutions-token-extensions.callout-1.text"
          className={styles.BasicCallout}
          id="real-world-use-cases"
        />

        <div className={styles.LongformSection}>
          <MotionSlideIn from="right">
            <LongformItem
              mediaComponent={
                <Lottie
                  options={{
                    animationData: longformOne,
                    loop: true,
                    autoplay: true,
                  }}
                  isClickToPauseDisabled={true}
                />
              }
              mediaDesktopPlacement="left"
              titleComponent={t(
                "solutions-token-extensions.longform-one.title",
              )}
              subtitleComponent={t(
                "solutions-token-extensions.longform-one.subtitle",
              )}
              className={styles.LongformItem1}
            />
          </MotionSlideIn>

          <MotionSlideIn from="left">
            <LongformItem
              mediaComponent={
                <div className={styles.TokenExtensionsMedia}>
                  <Lottie
                    options={{
                      animationData: longformTwo,
                      loop: true,
                      autoplay: true,
                    }}
                    isClickToPauseDisabled={true}
                  />
                </div>
              }
              mediaDesktopPlacement="right"
              titleComponent={t(
                "solutions-token-extensions.longform-two.title",
              )}
              subtitleComponent={
                <Trans i18nKey="solutions-token-extensions.longform-two.subtitle" />
              }
              className={styles.LongformItem2}
            />
          </MotionSlideIn>

          <MotionSlideIn from="right">
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
              mediaDesktopPlacement="left"
              titleComponent={t(
                "solutions-token-extensions.longform-three.title",
              )}
              subtitleComponent={t(
                "solutions-token-extensions.longform-three.subtitle",
              )}
              className={styles.LongformItem3}
            />
          </MotionSlideIn>
        </div>

        <SuccessStories
          title={t("solutions-token-extensions.case-studies.title")}
          cards={caseStudyCards}
          className={styles.SuccessStories}
        />

        <DeveloperResources
          title={t("solutions-token-extensions.developer-resources.title")}
          subtitle={t(
            "solutions-token-extensions.developer-resources.subtitle",
          )}
          links={developerResourcesLinks}
          id="resources"
        />

        <section className={styles.FAQ}>
          <div className={styles.SectionWrapper}>
            <div className={styles.ContentWrapper}>
              <AnimatedText element="p" className={styles.Eyebrow}>
                {t("solutions-token-extensions.faq.eyebrow")}
              </AnimatedText>

              <AnimatedText element="h2" as="heading">
                {t("solutions-token-extensions.faq.title")}
              </AnimatedText>
            </div>

            <div className={styles.Accordion}>
              <CollapsibleContent
                label={t("solutions-token-extensions.faq.q1.question")}
                defaultOpen={true}
              >
                <AnimatedText element="p" as="paragraph">
                  {t("solutions-token-extensions.faq.q1.answer")}
                </AnimatedText>
              </CollapsibleContent>

              <CollapsibleContent
                label={t("solutions-token-extensions.faq.q2.question")}
              >
                <AnimatedText element="p" as="paragraph">
                  {t("solutions-token-extensions.faq.q2.answer")}
                </AnimatedText>
              </CollapsibleContent>

              <CollapsibleContent
                label={t("solutions-token-extensions.faq.q3.question")}
              >
                <MotionSlideIn>
                  <Text element="p" as="paragraph">
                    {t("solutions-token-extensions.faq.q3.answer.p1")}
                  </Text>
                  <Text element="p" as="paragraph">
                    {t("solutions-token-extensions.faq.q3.answer.p2")}
                  </Text>
                  <ul>
                    <li>{t("solutions-token-extensions.faq.q3.answer.l1")}</li>
                    <li>{t("solutions-token-extensions.faq.q3.answer.l2")}</li>
                    <li>{t("solutions-token-extensions.faq.q3.answer.l3")}</li>
                    <li>{t("solutions-token-extensions.faq.q3.answer.l4")}</li>
                  </ul>
                  <Text element="p" as="paragraph">
                    {t("solutions-token-extensions.faq.q3.answer.p3")}
                  </Text>
                </MotionSlideIn>
              </CollapsibleContent>

              <CollapsibleContent
                label={t("solutions-token-extensions.faq.q4.question")}
              >
                <AnimatedText element="p" as="paragraph">
                  {t("solutions-token-extensions.faq.q4.answer")}
                </AnimatedText>
              </CollapsibleContent>

              <CollapsibleContent
                label={t("solutions-token-extensions.faq.q5.question")}
              >
                <AnimatedText element="p" as="paragraph">
                  {t("solutions-token-extensions.faq.q5.answer")}
                </AnimatedText>
              </CollapsibleContent>

              <CollapsibleContent
                label={t("solutions-token-extensions.faq.q6.question")}
              >
                <AnimatedText element="p" as="paragraph">
                  {t("solutions-token-extensions.faq.q6.answer")}
                </AnimatedText>
              </CollapsibleContent>

              <CollapsibleContent
                label={t("solutions-token-extensions.faq.q7.question")}
              >
                <AnimatedText element="p" as="paragraph">
                  <Trans
                    i18nKey="solutions-token-extensions.faq.q7.answer"
                    components={[
                      <Link
                        href="https://github.com/solana-labs/solana-program-library/pull/6098"
                        target="_blank"
                        rel="noopener noreferrer"
                        key="0"
                      />,
                    ]}
                  />
                </AnimatedText>
              </CollapsibleContent>

              <CollapsibleContent
                label={t("solutions-token-extensions.faq.q8.question")}
              >
                <AnimatedText element="p" as="paragraph">
                  {t("solutions-token-extensions.faq.q8.answer")}
                </AnimatedText>
              </CollapsibleContent>

              <CollapsibleContent
                label={t("solutions-token-extensions.faq.q9.question")}
              >
                <AnimatedText element="p" as="paragraph">
                  {t("solutions-token-extensions.faq.q9.answer")}
                </AnimatedText>
              </CollapsibleContent>

              <CollapsibleContent
                label={t("solutions-token-extensions.faq.q10.question")}
              >
                <AnimatedText element="p" as="paragraph">
                  {t("solutions-token-extensions.faq.q10.answer")}
                </AnimatedText>
              </CollapsibleContent>

              <CollapsibleContent
                label={t("solutions-token-extensions.faq.q11.question")}
              >
                <AnimatedText element="p" as="paragraph">
                  {t("solutions-token-extensions.faq.q11.answer")}
                </AnimatedText>
              </CollapsibleContent>

              <CollapsibleContent
                label={t("solutions-token-extensions.faq.q12.question")}
              >
                <AnimatedText element="p" as="paragraph">
                  <Trans
                    i18nKey="solutions-token-extensions.faq.q12.answer"
                    components={[
                      <Link
                        href="https://spl.solana.com/token-2022"
                        target="_blank"
                        rel="noopener noreferrer"
                        key="0"
                      />,
                    ]}
                  />
                </AnimatedText>
              </CollapsibleContent>
            </div>
          </div>
        </section>

        <FooterCallout
          title={t("solutions-token-extensions.footer-callout.title")}
          text={t("solutions-token-extensions.footer-callout.text")}
          btnText={t("solutions-token-extensions.footer-callout.btn")}
          btnUrl="https://solana.org/grants-funding"
          className={styles.FooterCallout}
          topSectionClassName={styles.FooterCalloutTopSection}
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

export default TokenExtensions;
