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
} from "@/data/solutions/games-tooling";

const GamesToolingPage = () => {
  const t = useTranslations("games-tooling-solution");

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
            hierarchy: "primary",
            size: "lg",
            url: "/developers/guides/games/getting-started-with-game-development",
            label: t("buttons.startBuilding"),
          },
        ]}
        image={{
          src: HERO_IMAGE,
          alt: t("hero.headline"),
        }}
      />

      <Heading
        headline={t("headings.suiteOfTools.headline")}
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
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "https://www.gameshift.dev/",
                label: t("buttons.learnMore"),
              },
            ],
            image: {
              src: SWITCHBACK_IMAGES[0],
              alt: t("switchbacks.0.headline"),
            },
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
          {
            assetSide: "right",
            eyebrow: "",
            headline: t("switchbacks.1.headline"),
            body: t.raw("switchbacks.1.body"),
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "https://docs.xnfts.dev/",
                label: t("buttons.readXnftDocs"),
              },
            ],
            image: {
              src: SWITCHBACK_IMAGES[1],
              alt: t("switchbacks.1.headline"),
            },
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
          {
            assetSide: "right",
            eyebrow: "",
            headline: t("switchbacks.2.headline"),
            body: t.raw("switchbacks.2.body"),
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "https://docs.metaplex.com/programs/token-metadata/overview#semi-fungible-tokens",
                label: t("buttons.readSftDocs"),
              },
            ],
            image: {
              src: SWITCHBACK_IMAGES[2],
              alt: t("switchbacks.2.headline"),
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
        <Heading headline={t("headings.learnFromDevelopers.headline")} />
      </ResponsiveBox>

      <CardDeck
        featured={true}
        numCols={3}
        cards={[
          {
            type: "image",
            heading: t("developerCards.introToDevelopment.heading"),
            headingAs: "h2",
            backgroundGradient: "none",
            backgroundImage: {
              src: DEVELOPER_CARD_IMAGE,
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
            heading: t("developerCards.developmentCourse.heading"),
            headingAs: "h2",
            backgroundGradient: "none",
            backgroundImage: {
              src: DEVELOPER_CARD_IMAGE,
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
            heading: t("developerCards.bootcamp.heading"),
            headingAs: "h2",
            backgroundGradient: "none",
            backgroundImage: {
              src: DEVELOPER_CARD_IMAGE,
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
            heading: t("developerCards.moreTools.heading"),
            headingAs: "h2",
            backgroundGradient: "none",
            backgroundImage: {
              src: DEVELOPER_CARD_IMAGE,
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
        heading={t("conversionPanel.heading")}
        body={t("conversionPanel.body")}
        buttons={[
          {
            label: t("buttons.seeSolanaDocs"),
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
