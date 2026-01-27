import { withLocales } from "@workspace/i18n/routing";
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
  HERO,
  BUTTONS,
  STATS,
  TRUSTBAR,
  HEADINGS,
  COMPLIANCE_CARDS,
  TOKENIZATION_CARDS,
  CASE_STUDY_CARDS,
  DEVELOPER_CARDS,
  CONVERSION_PANEL,
} from "@/data/solutions/real-world-assets";

const RealWorldAssetsPage = () => {
  return (
    <Layout>
      <HTMLHead
        title={META.seoTitle}
        description={META.seoDescription}
        socialShare={META.seoImage}
      />

      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        eyebrow={HERO.eyebrow}
        headline={HERO.headline}
        body={HERO.body}
        buttons={[
          {
            label: BUTTONS.learnMore,
            hierarchy: "primary",
            size: "md",
            iconSize: "md",
            url: "https://solanafoundation.typeform.com/to/wKLZxpbj",
          },
        ]}
        image={{
          src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F4f9868dcae8e4115b0db20b5aa111703.png",
          alt: "",
        }}
      />

      <Stats stats={STATS} contained />

      <Trustbar
        variant="standard"
        eyebrow={TRUSTBAR.eyebrow}
        logos={TRUSTBAR.logos as { src: string; alt: string; url: string }[]}
      />

      <Heading
        headline={HEADINGS.futureOfTrading.headline}
        body={HEADINGS.futureOfTrading.body}
        variant="centered"
        buttons={[
          {
            label: BUTTONS.exploreRwa,
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
        <Heading headline={HEADINGS.complianceTooling.headline} />
      </ResponsiveBox>

      <CardDeck
        numCols={3}
        cards={[
          {
            type: "standard",
            heading: COMPLIANCE_CARDS.spes.heading,
            headingAs: "h3",
            body: COMPLIANCE_CARDS.spes.body,
            backgroundGradient: "none",
            callToAction: {
              hierarchy: "primary",
              label: "LEARN MORE",
              url: "https://solana.com/solutions/solana-permissioned-environments",
            },
          },
          {
            type: "standard",
            heading: COMPLIANCE_CARDS.tokenExtensions.heading,
            headingAs: "h3",
            body: COMPLIANCE_CARDS.tokenExtensions.body,
            callToAction: {
              hierarchy: "primary",
              label: BUTTONS.learnMore,
              url: "https://solana.com/solutions/token-extensions",
            },
          },
          {
            type: "standard",
            heading: COMPLIANCE_CARDS.kycWithTransferHooks.heading,
            headingAs: "h3",
            body: COMPLIANCE_CARDS.kycWithTransferHooks.body,
            callToAction: {
              hierarchy: "primary",
              label: BUTTONS.learnMore,
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
        <Heading headline={HEADINGS.tokenization.headline} />
      </ResponsiveBox>

      <CardDeck
        numCols={3}
        cards={[
          {
            type: "standard",
            heading: TOKENIZATION_CARDS.metaplexNFTs.heading,
            headingAs: "h3",
            body: TOKENIZATION_CARDS.metaplexNFTs.body,
            backgroundGradient: "none",
            callToAction: {
              hierarchy: "primary",
              label: BUTTONS.getStarted,
              url: "https://developers.metaplex.com/",
              endIcon: "arrow-up-right",
            },
          },
          {
            type: "standard",
            heading: TOKENIZATION_CARDS.compressedNFTs.heading,
            headingAs: "h3",
            body: TOKENIZATION_CARDS.compressedNFTs.body,
            callToAction: {
              hierarchy: "primary",
              label: BUTTONS.learnMore,
              url: "https://solana.com/news/state-compression-compressed-nfts-solana",
            },
          },
          {
            type: "standard",
            heading: TOKENIZATION_CARDS.bridgesplit.heading,
            headingAs: "h3",
            body: TOKENIZATION_CARDS.bridgesplit.body,
            callToAction: {
              hierarchy: "primary",
              label: BUTTONS.learnMore,
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
          headline={HEADINGS.companiesUsingSolana.headline}
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
            heading: CASE_STUDY_CARDS.credix.heading,
            headingAs: "h2",
            body: CASE_STUDY_CARDS.credix.body,
            callToAction: {
              label: BUTTONS.read,
              hierarchy: "outline",
              url: "https://solana.com/news/case-study-credix",
            },
            backgroundGradient: "purple",
            eyebrow: CASE_STUDY_CARDS.credix.eyebrow,
          },
          {
            type: "cta",
            isFeatured: false,
            heading: CASE_STUDY_CARDS.homebase.heading,
            headingAs: "h2",
            body: CASE_STUDY_CARDS.homebase.body,
            callToAction: {
              label: BUTTONS.read,
              hierarchy: "outline",
              url: "https://solana.com/news/case-study-homebase",
            },
            backgroundGradient: "none",
            eyebrow: CASE_STUDY_CARDS.homebase.eyebrow,
          },
          {
            type: "cta",
            isFeatured: false,
            heading: CASE_STUDY_CARDS.baxus.heading,
            headingAs: "h2",
            body: CASE_STUDY_CARDS.baxus.body,
            callToAction: {
              label: BUTTONS.learnMore,
              hierarchy: "outline",
              url: "https://www.baxus.co/",
              endIcon: "arrow-up-right",
            },
            backgroundGradient: "none",
            eyebrow: CASE_STUDY_CARDS.baxus.eyebrow,
          },
        ]}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-90px" },
          medium: { marginBottom: "-45px" },
        }}
      >
        <Heading headline={HEADINGS.learnFromDevelopers.headline} />
      </ResponsiveBox>

      <CardDeck
        featured={true}
        numCols={3}
        cards={[
          {
            type: "image",
            heading: DEVELOPER_CARDS.introToDevelopment.heading,
            headingAs: "h3",
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
            },
            callToAction: {
              url: "/developers/guides/getstarted/hello-world-in-your-browser",
              endIcon: "arrow-right",
              hierarchy: "outline",
            },
          },
          {
            type: "image",
            heading: DEVELOPER_CARDS.developmentCourse.heading,
            headingAs: "h3",
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
            },
            callToAction: {
              url: "https://www.soldev.app/course",
              endIcon: "arrow-right",
              hierarchy: "outline",
            },
          },
          {
            type: "image",
            heading: DEVELOPER_CARDS.bootcamp.heading,
            headingAs: "h3",
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
            },
            callToAction: {
              url: "https://youtu.be/0P8JeL3TURU?feature=shared",
              endIcon: "arrow-right",
              hierarchy: "outline",
            },
          },
          {
            type: "image",
            heading: DEVELOPER_CARDS.moreTools.heading,
            headingAs: "h3",
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
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
        heading={CONVERSION_PANEL.heading}
        body={CONVERSION_PANEL.body}
        buttons={[
          {
            label: BUTTONS.seeDocs,
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
