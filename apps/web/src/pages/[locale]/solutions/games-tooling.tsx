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
  DEVELOPER_CARDS,
  CONVERSION_PANEL,
} from "@/data/solutions/games-tooling";

const GamesToolingPage = () => {
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
            hierarchy: "primary",
            size: "lg",
            url: "/developers/guides/games/getting-started-with-game-development",
            label: BUTTONS.startBuilding,
          },
        ]}
        image={{
          src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F0da0236d7c7342328aa45f164c6fa253.png",
        }}
      />

      <Heading headline={HEADINGS.suiteOfTools.headline} variant="centered" />

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
                url: "https://www.gameshift.dev/",
                label: BUTTONS.learnMore,
              },
            ],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F16d53459995844c9a19d6343539466b6.png",
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
                url: "https://docs.xnfts.dev/",
                label: BUTTONS.readXnftDocs,
              },
            ],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F8ce3c7c7567b497a9851f6b57e5629f7.png",
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
                url: "https://docs.metaplex.com/programs/token-metadata/overview#semi-fungible-tokens",
                label: BUTTONS.readSftDocs,
              },
            ],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F4047398c82dd4a1799a798b67c6df076.png",
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
            marginBottom: "-90px",
          },
          medium: {
            marginBottom: "-45px",
          },
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
            headingAs: "h2",
            backgroundGradient: "none",
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
            },
            callToAction: {
              url: "/developers/guides/getstarted/hello-world-in-your-browser",
              label: "",
              endIcon: "arrow-right",
              hierarchy: "outline",
              size: "lg",
            },
          },
          {
            type: "image",
            heading: DEVELOPER_CARDS.developmentCourse.heading,
            headingAs: "h2",
            backgroundGradient: "none",
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
            },
            callToAction: {
              url: "https://www.soldev.app/course",
              label: "",
              endIcon: "arrow-right",
              hierarchy: "outline",
              size: "lg",
            },
          },
          {
            type: "image",
            heading: DEVELOPER_CARDS.bootcamp.heading,
            headingAs: "h2",
            backgroundGradient: "none",
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
            },
            callToAction: {
              url: "https://youtu.be/0P8JeL3TURU?feature=shared",
              label: "",
              endIcon: "arrow-right",
              hierarchy: "outline",
              size: "lg",
            },
          },
          {
            type: "image",
            heading: DEVELOPER_CARDS.moreTools.heading,
            headingAs: "h2",
            backgroundGradient: "none",
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
            },
            callToAction: {
              url: "/developers",
              label: "",
              endIcon: "arrow-right",
              hierarchy: "outline",
              size: "lg",
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
            label: BUTTONS.seeSolanaDocs,
            hierarchy: "primary",
            size: "lg",
            url: "https://docs.solana.com/",
          },
        ]}
      />
    </Layout>
  );
};

export default GamesToolingPage;

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
