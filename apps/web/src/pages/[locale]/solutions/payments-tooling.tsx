import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import {
  Hero,
  Heading,
  CardDeck,
  SwitchbackChain,
  Trustbar,
  Stats,
  Section,
  YoutubeVideo,
  ConversionPanel,
} from "@solana-foundation/solana-lib";
import { ResponsiveBox } from "@/component-library/responsive-box";

import {
  META,
  HERO_IMAGE,
  SWITCHBACK_IMAGES,
  TRUSTBAR_LOGOS,
  DEVELOPER_CARD_IMAGE,
} from "@/data/solutions/payments-tooling";

const PaymentsToolingPage = () => {
  const t = useTranslations("payments-tooling-solution");

  const tokenExtensionsStats = [0, 1, 2, 3].map((i) => ({
    stat: "",
    description: t(`tokenExtensionsStats.stats.${i}.description`),
  }));

  const switchbackUrls = [
    "https://solana.com/news/case-study-helio",
    "https://solana.com/news/only-possible-on-solana-decaf",
    "https://docs.tiplink.io/docs/getting-started/quickstart",
  ];

  const switchbacks = [0, 1, 2].map((i) => ({
    assetSide: "right" as const,
    eyebrow: "",
    headline: t(`switchbacks.${i}.headline`),
    body: t.raw(`switchbacks.${i}.body`),
    buttons: [
      {
        hierarchy: "primary" as const,
        size: "md" as const,
        url: switchbackUrls[i],
        label: t("buttons.learnMore"),
      },
    ],
    image: {
      src: SWITCHBACK_IMAGES[i],
      alt: t(`switchbacks.${i}.headline`),
    },
    placeholder: "",
    emailError: "",
    submitError: "",
    successMessage: "",
  }));

  return (
    <Layout>
      <HTMLHead
        title={t("meta.title")}
        description={t("meta.description")}
        socialShare={META.seoImage}
      />

      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
        buttons={[
          {
            label: t("buttons.getStarted"),
            hierarchy: "primary",
            size: "lg",
            url: "https://docs.solanapay.com/core/overview",
          },
        ]}
        image={{
          src: HERO_IMAGE,
          alt: t("hero.headline"),
        }}
      />

      <Heading
        headline={t("headings.lightningFast.headline")}
        body={t("headings.lightningFast.body")}
        variant="centered"
      />

      <Heading
        headline={t("headings.permissionless.headline")}
        body={t("headings.permissionless.body")}
      />

      <CardDeck
        numCols={2}
        cards={[
          {
            type: "cta",
            heading: t("featureCards.fast.heading"),
            body: t("featureCards.fast.body"),
            callToAction: {
              label: t("buttons.learnMore"),
              url: "https://www.pymnts.com/blockchain/2022/boa-sees-solana-blockchain-as-visa-of-digital-asset-ecosystem/",
            },
          },
          {
            type: "cta",
            heading: t("featureCards.direct.heading"),
            body: t("featureCards.direct.body"),
            callToAction: {
              label: t("buttons.learnMore"),
              url: "https://solanapay.com/",
            },
          },
          {
            type: "cta",
            heading: t("featureCards.easy.heading"),
            body: t("featureCards.easy.body"),
            callToAction: {
              label: t("buttons.learnMore"),
              url: "https://commercedocs.solanapay.com/",
            },
          },
          {
            type: "cta",
            heading: t("featureCards.sustainable.heading"),
            body: t("featureCards.sustainable.body"),
            callToAction: {
              label: t("buttons.learnMore"),
              url: "https://solana.com/environment",
            },
          },
        ]}
      />

      <SwitchbackChain hideBackground={true} switchbacks={switchbacks} />

      <Trustbar
        variant="grid"
        logos={TRUSTBAR_LOGOS as { src: string; alt: string; url: string }[]}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-120px" },
          medium: { marginBottom: "-45px" },
        }}
      >
        <Heading headline={t("headings.privacySupport.headline")} />
      </ResponsiveBox>

      <Stats
        headline={t("tokenExtensionsStats.headline")}
        headingAs="h4"
        stats={tokenExtensionsStats}
        buttons={[
          {
            label: t("buttons.learnMore"),
            hierarchy: "link",
            size: "lg",
            endIcon: "arrow-up-right",
            url: "/solutions/token22",
          },
        ]}
        contained={false}
      />

      <Section>
        <YoutubeVideo url="https://www.youtube.com/watch?v=CEuKahqOYbs" />
      </Section>

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-90px" },
          medium: { marginBottom: "-45px" },
        }}
      >
        <Heading headline={t("headings.learnFromDevelopers.headline")} />
      </ResponsiveBox>

      <CardDeck
        featured={true}
        numCols={2}
        cards={[
          {
            type: "image",
            heading: t("developerCards.introToDevelopment.heading"),
            headingAs: "h3",
            backgroundImage: {
              src: DEVELOPER_CARD_IMAGE,
            },
            callToAction: {
              endIcon: "arrow-right",
              size: "lg",
              hierarchy: "outline",
              url: "/developers/guides/getstarted/hello-world-in-your-browser",
            },
          },
          {
            type: "image",
            heading: t("developerCards.developmentCourse.heading"),
            headingAs: "h3",
            backgroundImage: {
              src: DEVELOPER_CARD_IMAGE,
            },
            callToAction: {
              endIcon: "arrow-right",
              size: "lg",
              hierarchy: "outline",
              url: "https://www.soldev.app/course",
            },
          },
          {
            type: "image",
            heading: t("developerCards.bootcamp.heading"),
            headingAs: "h3",
            backgroundImage: {
              src: DEVELOPER_CARD_IMAGE,
            },
            callToAction: {
              endIcon: "arrow-right",
              size: "lg",
              hierarchy: "outline",
              url: "https://youtu.be/0P8JeL3TURU?feature=shared",
            },
          },
          {
            type: "image",
            heading: t("developerCards.moreTools.heading"),
            headingAs: "h3",
            backgroundImage: {
              src: DEVELOPER_CARD_IMAGE,
            },
            callToAction: {
              endIcon: "arrow-right",
              size: "lg",
              hierarchy: "outline",
              url: "/developers",
            },
          },
          {
            type: "image",
            heading: t("developerCards.buildNow.heading"),
            headingAs: "h3",
            backgroundImage: {
              src: DEVELOPER_CARD_IMAGE,
            },
            callToAction: {
              endIcon: "arrow-right",
              size: "lg",
              hierarchy: "outline",
              url: "/developers",
            },
          },
        ]}
      />

      <ConversionPanel
        heading={t("conversionPanel.heading")}
        body={t("conversionPanel.body")}
        buttons={[
          {
            label: t("buttons.learnMore"),
            hierarchy: "primary",
            size: "md",
            iconSize: "md",
          },
          {
            label: t("buttons.startBuilding"),
            hierarchy: "outline",
            size: "md",
            iconSize: "md",
            url: "https://docs.solanapay.com/core/overview",
          },
        ]}
      />
    </Layout>
  );
};

export default PaymentsToolingPage;

export async function getStaticProps({
  params,
}: {
  params: { locale: string };
}) {
  const { locale = "en" } = params;
  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;
  return {
    props: {
      locale,
      messages,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
