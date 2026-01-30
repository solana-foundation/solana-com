import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import {
  Hero,
  Stats,
  Trustbar,
  Heading,
  CardDeck,
  ConversionPanel,
} from "@solana-foundation/solana-lib";
import { ResponsiveBox } from "@/component-library/responsive-box";

import {
  META,
  TRUSTBAR,
  HERO_IMAGE,
  DEVELOPER_CARD_IMAGE,
} from "@/data/solutions/real-world-assets";

const RealWorldAssetsPage = () => {
  const t = useTranslations("real-world-assets-solution");

  const stats = Array.from({ length: 3 }, (_, index) => ({
    stat: t(`stats.${index}.value`),
    description: t(`stats.${index}.description`),
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
            label: t("buttons.learnMore"),
            hierarchy: "primary",
            size: "md",
            iconSize: "md",
            url: "https://solanafoundation.typeform.com/to/wKLZxpbj",
          },
        ]}
        image={{
          src: HERO_IMAGE,
          alt: t("hero.headline"),
        }}
      />

      <Stats stats={stats} contained />

      <Trustbar
        variant="standard"
        eyebrow={t("trustbar.eyebrow")}
        logos={TRUSTBAR.logos as { src: string; alt: string; url: string }[]}
      />

      <Heading
        headline={t("headings.futureOfTrading.headline")}
        body={t("headings.futureOfTrading.body")}
        variant="centered"
        buttons={[
          {
            label: t("buttons.exploreRwa"),
            hierarchy: "outline",
            size: "md",
            iconSize: "md",
            url: "https://yashhsm.medium.com/state-of-real-world-assets-on-solana-the-opportunities-23ebff9a50c9",
            endIcon: "arrow-up-right",
          },
        ]}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { display: "block", marginBottom: "-100px" },
          small: { display: "block", marginBottom: "-50px" },
        }}
      >
        <Heading headline={t("headings.complianceTooling.headline")} />
      </ResponsiveBox>

      <CardDeck
        numCols={3}
        cards={[
          {
            type: "standard",
            heading: t("complianceCards.spes.heading"),
            headingAs: "h3",
            body: t("complianceCards.spes.body"),
            backgroundGradient: "none",
            callToAction: {
              hierarchy: "primary",
              label: "LEARN MORE",
              url: "https://solana.com/solutions/solana-permissioned-environments",
            },
          },
          {
            type: "standard",
            heading: t("complianceCards.tokenExtensions.heading"),
            headingAs: "h3",
            body: t("complianceCards.tokenExtensions.body"),
            callToAction: {
              hierarchy: "primary",
              label: t("buttons.learnMore"),
              url: "https://solana.com/solutions/token-extensions",
            },
          },
          {
            type: "standard",
            heading: t("complianceCards.kycWithTransferHooks.heading"),
            headingAs: "h3",
            body: t("complianceCards.kycWithTransferHooks.body"),
            callToAction: {
              hierarchy: "primary",
              label: t("buttons.learnMore"),
              url: "https://solana.com/solutions/token-extensions",
            },
          },
        ]}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { display: "block", marginBottom: "-100px" },
          small: { display: "block", marginBottom: "-50px" },
        }}
      >
        <Heading headline={t("headings.tokenization.headline")} />
      </ResponsiveBox>

      <CardDeck
        numCols={3}
        cards={[
          {
            type: "standard",
            heading: t("tokenizationCards.metaplexNFTs.heading"),
            headingAs: "h3",
            body: t("tokenizationCards.metaplexNFTs.body"),
            backgroundGradient: "none",
            callToAction: {
              hierarchy: "primary",
              label: t("buttons.getStarted"),
              url: "https://developers.metaplex.com/",
              endIcon: "arrow-up-right",
            },
          },
          {
            type: "standard",
            heading: t("tokenizationCards.compressedNFTs.heading"),
            headingAs: "h3",
            body: t("tokenizationCards.compressedNFTs.body"),
            callToAction: {
              hierarchy: "primary",
              label: t("buttons.learnMore"),
              url: "https://solana.com/news/state-compression-compressed-nfts-solana",
            },
          },
          {
            type: "standard",
            heading: t("tokenizationCards.bridgesplit.heading"),
            headingAs: "h3",
            body: t("tokenizationCards.bridgesplit.body"),
            callToAction: {
              hierarchy: "primary",
              label: t("buttons.learnMore"),
              url: "https://www.bridgesplit.com/",
              endIcon: "arrow-up-right",
            },
          },
        ]}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-50px" },
        }}
      >
        <Heading
          headline={t("headings.companiesUsingSolana.headline")}
          variant="centered"
        />
      </ResponsiveBox>

      <CardDeck
        numCols={2}
        featured={true}
        cards={[
          {
            type: "standard",
            isFeatured: true,
            heading: t("caseStudyCards.credix.heading"),
            headingAs: "h2",
            body: t("caseStudyCards.credix.body"),
            callToAction: {
              label: t("buttons.read"),
              hierarchy: "outline",
              url: "https://solana.com/news/case-study-credix",
            },
            backgroundGradient: "purple",
            eyebrow: t("caseStudyCards.credix.eyebrow"),
          },
          {
            type: "cta",
            isFeatured: false,
            heading: t("caseStudyCards.homebase.heading"),
            headingAs: "h2",
            callToAction: {
              label: t("buttons.read"),
              hierarchy: "outline",
              url: "https://solana.com/news/case-study-homebase",
            },
            backgroundGradient: "none",
            eyebrow: t("caseStudyCards.homebase.eyebrow"),
          },
          {
            type: "cta",
            isFeatured: false,
            heading: t("caseStudyCards.baxus.heading"),
            headingAs: "h2",
            callToAction: {
              label: t("buttons.learnMore"),
              hierarchy: "outline",
              url: "https://www.baxus.co/",
              endIcon: "arrow-up-right",
            },
            backgroundGradient: "none",
            eyebrow: t("caseStudyCards.baxus.eyebrow"),
          },
        ]}
      />

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
        numCols={3}
        cards={[
          {
            type: "image",
            heading: t("developerCards.introToDevelopment.heading"),
            headingAs: "h3",
            backgroundImage: {
              src: DEVELOPER_CARD_IMAGE,
            },
            callToAction: {
              url: "/developers/guides/getstarted/hello-world-in-your-browser",
              endIcon: "arrow-right",
              hierarchy: "outline",
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
              url: "https://www.soldev.app/course",
              endIcon: "arrow-right",
              hierarchy: "outline",
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
              url: "https://youtu.be/0P8JeL3TURU?feature=shared",
              endIcon: "arrow-right",
              hierarchy: "outline",
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
              url: "/developers",
              endIcon: "arrow-right",
              hierarchy: "outline",
            },
          },
        ]}
      />

      <ConversionPanel
        variant="centered"
        heading={t("conversionPanel.heading")}
        body={t("conversionPanel.body")}
        buttons={[
          {
            label: t("buttons.seeDocs"),
            hierarchy: "secondary",
            size: "lg",
            url: "https://docs.solana.com/",
          },
        ]}
      />
    </Layout>
  );
};

export default RealWorldAssetsPage;

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
