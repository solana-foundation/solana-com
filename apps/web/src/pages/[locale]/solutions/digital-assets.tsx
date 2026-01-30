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
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import {
  META,
  HERO_IMAGE,
  SWITCHBACK_IMAGES,
  DEVELOPER_CARD_IMAGE,
} from "@/data/solutions/digital-assets";

const DigitalAssetsPage = () => {
  const t = useTranslations("digital-assets-solution");

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
        headline={t("headings.digitalAssets.headline")}
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
                url: "/solutions/token-extensions",
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
                url: "/news/state-compression-compressed-nfts-solana",
                label: t("buttons.compressedNFTs"),
              },
              {
                hierarchy: "primary",
                size: "md",
                url: "/news/solana-ecosystem-innovation-xnft",
                label: t("buttons.executableNFTs"),
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
                url: "https://solanafoundation.notion.site/Fungible-Tokens-4b45a92f37994461af58e172fbc91d51?pvs=4",
                label: t("buttons.learnMore"),
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
          {
            assetSide: "right",
            eyebrow: "",
            headline: t("switchbacks.3.headline"),
            body: t.raw("switchbacks.3.body"),
            image: {
              src: SWITCHBACK_IMAGES[3],
              alt: t("switchbacks.3.headline"),
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
          {
            label: t("buttons.seeCaseStudies"),
            hierarchy: "outline",
            size: "lg",
            url: "https://solana.com/news/tag/case-studies",
          },
        ]}
      />
    </Layout>
  );
};

export default DigitalAssetsPage;

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
