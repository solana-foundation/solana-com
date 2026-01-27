import { withLocales } from "@workspace/i18n/routing";
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
  HERO,
  BUTTONS,
  HEADINGS,
  SWITCHBACKS,
  PRICE_DISCOVERY_CARDS,
  LENDING_CARDS,
  DEVELOPER_CARDS,
  CONVERSION_PANEL,
} from "@/data/solutions/financial-infrastructure";

const FinancialInfrastructurePage = () => {
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
        image={{
          src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Faaa404f92f534213bc3bd27c02625c13.png",
        }}
      />

      <Heading
        headline={HEADINGS.suiteOfTools.headline}
        body={HEADINGS.suiteOfTools.body}
        variant="centered"
      />

      <SwitchbackChain
        hideBackground={true}
        switchbacks={[
          {
            assetSide: "right",
            eyebrow: SWITCHBACKS[0].eyebrow,
            headline: SWITCHBACKS[0].headline,
            body: SWITCHBACKS[0].body,
            buttons: [],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F4be0a39e13f243e4a79b37f4264131b0.png",
              alt: "",
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
          headline={HEADINGS.priceDiscovery.headline}
          body={HEADINGS.priceDiscovery.body}
          variant="standard"
        />
      </ResponsiveBox>

      <CardDeck
        numCols={2}
        cards={[
          {
            type: "standard",
            heading: PRICE_DISCOVERY_CARDS.raydium.heading,
            body: PRICE_DISCOVERY_CARDS.raydium.body,
            callToAction: {
              label: BUTTONS.learnMore,
              url: "https://raydium.io/",
            },
          },
          {
            type: "standard",
            heading: PRICE_DISCOVERY_CARDS.openbook.heading,
            body: PRICE_DISCOVERY_CARDS.openbook.body,
            callToAction: {
              label: BUTTONS.learnMore,
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
          headline={HEADINGS.peerToPeerLending.headline}
          body={HEADINGS.peerToPeerLending.body}
          variant="standard"
        />
      </ResponsiveBox>

      <CardDeck
        numCols={3}
        cards={[
          {
            type: "standard",
            heading: LENDING_CARDS.mrgnlend.heading,
            body: LENDING_CARDS.mrgnlend.body,
            callToAction: {
              label: BUTTONS.learnMore,
              url: "https://docs.marginfi.com/",
            },
          },
          {
            type: "standard",
            heading: LENDING_CARDS.solend.heading,
            body: LENDING_CARDS.solend.body,
            callToAction: {
              label: BUTTONS.learnMore,
              url: "https://solend.fi/",
            },
          },
          {
            type: "standard",
            heading: LENDING_CARDS.lulo.heading,
            body: LENDING_CARDS.lulo.body,
            callToAction: {
              label: BUTTONS.learnMore,
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
        <Heading
          headline={HEADINGS.learnFromDevelopers.headline}
          variant="standard"
        />
      </ResponsiveBox>

      <CardDeck
        featured={true}
        numCols={3}
        cards={[
          {
            type: "image",
            heading: DEVELOPER_CARDS.introToDevelopment.heading,
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
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
            heading: DEVELOPER_CARDS.developmentCourse.heading,
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
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
            heading: DEVELOPER_CARDS.bootcamp.heading,
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
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
            heading: DEVELOPER_CARDS.moreTools.heading,
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
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
        heading={CONVERSION_PANEL.heading}
        body={CONVERSION_PANEL.body}
        buttons={[
          {
            label: BUTTONS.seeDocs,
            hierarchy: "secondary",
            size: "lg",
            url: "https://docs.solana.com/",
          },
          {
            label: BUTTONS.seeCaseStudies,
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
