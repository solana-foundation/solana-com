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

import {
  META,
  HERO,
  BUTTONS,
  HEADINGS,
  SWITCHBACKS,
  DEVELOPER_CARDS,
  CONVERSION_PANEL,
} from "@/data/solutions/digital-assets";
import { ResponsiveBox } from "@/component-library/responsive-box";

const DigitalAssetsPage = () => {
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
          src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fe2bd4f3dc22141109dc1a02bfb9fb197.png",
          alt: "",
        }}
      />

      <Heading headline={HEADINGS.digitalAssets.headline} variant="centered" />

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
                url: "/solutions/token-extensions",
                label: BUTTONS.learnMore,
              },
            ],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fe80ca3b676a743b581582c6bb393e1d3.png",
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
                url: "/news/state-compression-compressed-nfts-solana",
                label: BUTTONS.compressedNFTs,
              },
              {
                hierarchy: "primary",
                size: "md",
                url: "/news/solana-ecosystem-innovation-xnft",
                label: BUTTONS.executableNFTs,
              },
            ],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fd54baf62442c48db81a96a9b4108c882.png",
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
                url: "https://solanafoundation.notion.site/Fungible-Tokens-4b45a92f37994461af58e172fbc91d51?pvs=4",
                label: BUTTONS.learnMore,
              },
            ],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F0fcbb1d5c395433e98060c26541e4b59.png",
              alt: "",
            },
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
          {
            assetSide: "right",
            eyebrow: SWITCHBACKS[3].eyebrow,
            headline: SWITCHBACKS[3].headline,
            body: SWITCHBACKS[3].body,
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fa6c307e3d0274a8f90acab88f4e918a2.png",
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
          {
            label: BUTTONS.seeCaseStudies,
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
