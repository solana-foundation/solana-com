import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import {
  Hero,
  Heading,
  SwitchbackChain,
  CardDeck,
  ConversionPanel,
} from "@solana-foundation/solana-lib";
import { ResponsiveBox } from "@/component-library/responsive-box";

import {
  META,
  HERO_IMAGE,
  SWITCHBACK_IMAGES,
  DEVELOPER_CARD_IMAGE,
} from "@/data/solutions/financial-infrastructure";

const FinancialInfrastructurePage = () => {
  const t = useTranslations("financial-infrastructure-solution");

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
        image={{
          src: HERO_IMAGE,
          alt: t("hero.headline"),
        }}
      />

      <Heading
        headline={t("headings.suiteOfTools.headline")}
        body={t("headings.suiteOfTools.body")}
        variant="centered"
      />

      <SwitchbackChain
        hideBackground={true}
        switchbacks={[
          {
            assetSide: "right",
            eyebrow: "",
            headline: t("switchbacks.0.headline"),
            body: t.raw("switchbacks.0.body"),
            buttons: [],
            image: {
              src: SWITCHBACK_IMAGES[0],
              alt: t("switchbacks.0.headline"),
            },
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
        ]}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: {
            marginBottom: "-120px",
          },
          medium: {
            marginBottom: "-45px",
          },
        }}
      >
        <Heading
          headline={t("headings.priceDiscovery.headline")}
          body={t("headings.priceDiscovery.body")}
        />
      </ResponsiveBox>

      <CardDeck
        numCols={2}
        cards={[
          {
            type: "standard",
            heading: t("priceDiscoveryCards.raydium.heading"),
            body: t("priceDiscoveryCards.raydium.body"),
            callToAction: {
              label: t("buttons.learnMore"),
              url: "https://raydium.io/",
            },
          },
          {
            type: "standard",
            heading: t("priceDiscoveryCards.openbook.heading"),
            body: t("priceDiscoveryCards.openbook.body"),
            callToAction: {
              label: t("buttons.learnMore"),
              url: "https://github.com/openbook-dex",
            },
          },
        ]}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: {
            marginBottom: "-120px",
          },
          medium: {
            marginBottom: "-45px",
          },
        }}
      >
        <Heading
          headline={t("headings.peerToPeerLending.headline")}
          body={t("headings.peerToPeerLending.body")}
        />
      </ResponsiveBox>

      <CardDeck
        numCols={3}
        cards={[
          {
            type: "standard",
            heading: t("lendingCards.mrgnlend.heading"),
            body: t("lendingCards.mrgnlend.body"),
            callToAction: {
              label: t("buttons.learnMore"),
              url: "https://docs.marginfi.com/",
            },
          },
          {
            type: "standard",
            heading: t("lendingCards.solend.heading"),
            body: t("lendingCards.solend.body"),
            callToAction: {
              label: t("buttons.learnMore"),
              url: "https://solend.fi/",
            },
          },
          {
            type: "standard",
            heading: t("lendingCards.lulo.heading"),
            body: t("lendingCards.lulo.body"),
            callToAction: {
              label: t("buttons.learnMore"),
              url: "/ecosystem/openbook",
            },
          },
        ]}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: {
            marginBottom: "-90px",
          },
          medium: {
            marginBottom: "-45px",
          },
        }}
      >
        <Heading headline={t("headings.learnFromDevelopers.headline")} />
      </ResponsiveBox>

      <CardDeck
        featured={true}
        numCols={3}
        cards={[
          {
            type: "image",
            heading: t("developerCards.introToDevelopment.heading"),
            backgroundImage: {
              src: DEVELOPER_CARD_IMAGE,
            },
            callToAction: {
              url: "/developers/guides/getstarted/hello-world-in-your-browser",
              endIcon: "arrow-right",
              hierarchy: "outline",
            },
            headingAs: "h3",
          },
          {
            type: "image",
            heading: t("developerCards.developmentCourse.heading"),
            backgroundImage: {
              src: DEVELOPER_CARD_IMAGE,
            },
            callToAction: {
              url: "https://www.soldev.app/course",
              endIcon: "arrow-right",
              hierarchy: "outline",
            },
            headingAs: "h3",
          },
          {
            type: "image",
            heading: t("developerCards.bootcamp.heading"),
            backgroundImage: {
              src: DEVELOPER_CARD_IMAGE,
            },
            callToAction: {
              url: "https://youtu.be/0P8JeL3TURU?feature=shared",
              endIcon: "arrow-right",
              hierarchy: "outline",
            },
            headingAs: "h3",
          },
          {
            type: "image",
            heading: t("developerCards.moreTools.heading"),
            backgroundImage: {
              src: DEVELOPER_CARD_IMAGE,
            },
            callToAction: {
              url: "/developers",
              endIcon: "arrow-right",
              hierarchy: "outline",
            },
            headingAs: "h3",
          },
        ]}
      />

      <ConversionPanel
        heading={t("conversionPanel.heading")}
        body={t("conversionPanel.body")}
        buttons={[
          {
            label: t("buttons.seeDocs"),
            hierarchy: "secondary",
            size: "lg",
            url: "https://docs.solana.com/",
          },
          {
            label: t("buttons.seeCaseStudies"),
            hierarchy: "outline",
            size: "lg",
            url: "/news/tag/case-studies",
          },
        ]}
      />
    </Layout>
  );
};

export default FinancialInfrastructurePage;

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
