import { withLocales } from "@workspace/i18n/routing";
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
  HERO,
  BUTTONS,
  HEADINGS,
  FEATURE_CARDS,
  SWITCHBACKS,
  TRUSTBAR_LOGOS,
  TOKEN_EXTENSIONS_STATS,
  DEVELOPER_CARDS,
  CONVERSION_PANEL,
} from "@/data/solutions/payments-tooling";

const PaymentsToolingPage = () => {
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
            label: BUTTONS.getStarted,
            hierarchy: "primary",
            size: "lg",
            url: "https://docs.solanapay.com/core/overview",
          },
        ]}
        image={{
          src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F61dddc8ac38f4ac6adb4b4d7f2f73faa.png",
        }}
      />

      <Heading
        headline={HEADINGS.lightningFast.headline}
        body={HEADINGS.lightningFast.body}
        variant="centered"
      />

      <Heading
        headline={HEADINGS.permissionless.headline}
        body={HEADINGS.permissionless.body}
      />

      <CardDeck
        numCols={2}
        cards={[
          {
            type: "cta",
            heading: FEATURE_CARDS.fast.heading,
            body: FEATURE_CARDS.fast.body,
            callToAction: {
              label: BUTTONS.learnMore,
              url: "https://www.pymnts.com/blockchain/2022/boa-sees-solana-blockchain-as-visa-of-digital-asset-ecosystem/",
            },
          },
          {
            type: "cta",
            heading: FEATURE_CARDS.direct.heading,
            body: FEATURE_CARDS.direct.body,
            callToAction: {
              label: "learn more",
              url: "https://solanapay.com/",
            },
          },
          {
            type: "cta",
            heading: FEATURE_CARDS.easy.heading,
            body: FEATURE_CARDS.easy.body,
            callToAction: {
              label: "learn more",
              url: "https://commercedocs.solanapay.com/",
            },
          },
          {
            type: "cta",
            heading: FEATURE_CARDS.sustainable.heading,
            body: FEATURE_CARDS.sustainable.body,
            callToAction: {
              label: "learn more",
              url: "https://solana.com/environment",
            },
          },
        ]}
      />

      <SwitchbackChain
        hideBackground={true}
        switchbacks={[
          {
            assetSide: "right",
            eyebrow: SWITCHBACKS[0].eyebrow,
            headline: SWITCHBACKS[0].headline,
            body: SWITCHBACKS[0].body,
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "https://solana.com/news/case-study-helio",
                label: BUTTONS.learnMore,
              },
            ],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fe1e740244dc04e1e9c69b4b7f907373b.png",
              alt: "",
            },
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
          {
            assetSide: "right",
            eyebrow: SWITCHBACKS[1].eyebrow,
            headline: SWITCHBACKS[1].headline,
            body: SWITCHBACKS[1].body,
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "https://solana.com/news/only-possible-on-solana-decaf",
                label: BUTTONS.learnMore,
              },
            ],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F95eae019372b47aba840c1b23abd88a6.png",
              alt: "",
            },
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
          {
            assetSide: "right",
            eyebrow: SWITCHBACKS[2].eyebrow,
            headline: SWITCHBACKS[2].headline,
            body: SWITCHBACKS[2].body,
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "https://docs.tiplink.io/docs/getting-started/quickstart",
                label: BUTTONS.learnMore,
              },
            ],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F0a0e942cac3c4e32abd5f64fbd59fad1.png",
              alt: "",
            },
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
        ]}
      />

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
        <Heading headline={HEADINGS.privacySupport.headline} />
      </ResponsiveBox>

      <Stats
        headline={TOKEN_EXTENSIONS_STATS.headline}
        headingAs="h4"
        stats={TOKEN_EXTENSIONS_STATS.stats}
        buttons={[
          {
            label: BUTTONS.learnMore,
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
        <Heading headline={HEADINGS.learnFromDevelopers.headline} />
      </ResponsiveBox>

      <CardDeck
        featured={true}
        numCols={2}
        cards={[
          {
            type: "image",
            heading: DEVELOPER_CARDS.introToDevelopment.heading,
            headingAs: "h3",
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
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
            heading: DEVELOPER_CARDS.developmentCourse.heading,
            headingAs: "h3",
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
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
            heading: DEVELOPER_CARDS.bootcamp.heading,
            headingAs: "h3",
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
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
            heading: DEVELOPER_CARDS.moreTools.heading,
            headingAs: "h3",
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
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
            heading: DEVELOPER_CARDS.buildNow.heading,
            headingAs: "h3",
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
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
        heading={CONVERSION_PANEL.heading}
        body={CONVERSION_PANEL.body}
        buttons={[
          {
            label: BUTTONS.learnMore,
            hierarchy: "primary",
            size: "md",
            iconSize: "md",
          },
          {
            label: BUTTONS.startBuilding,
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
