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
} from "@/data/solutions/solana-permissioned-environments";

const SolanaPermissionedEnvironmentsPage = () => {
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
            label: BUTTONS.readTheDocs,
            hierarchy: "primary",
            size: "lg",
            url: "https://solana.com/developers/guides/permissioned-environments",
          },
          {
            label: BUTTONS.areSpesRightForYou,
            hierarchy: "outline",
            size: "lg",
            url: "https://solanafoundation.notion.site/Solana-Permissioned-Environments-Decision-Tree-f5c9aec58da34763ae9bc09397d7d968?pvs=4",
          },
          {
            label: BUTTONS.getInTouch,
            hierarchy: "outline",
            size: "lg",
            url: "mailto:product@solana.org",
          },
        ]}
        image={{
          src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F2675362eaf6e4eb09d2e880ddd81cac5.png",
          alt: "",
        }}
      />

      <Heading
        headline={HEADINGS.permissionedChains.headline}
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
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F293c8a003c434aa7a2a29ce54cf4a232.png",
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
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F736faa258fdf4b188576f0ef0a4cad1e.png",
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
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F77cc8c60b17645d6b83f368de37e7134.png",
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
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "https://solana.com/solutions/token-extensions",
                label: BUTTONS.learnMoreAboutTokenExtensions,
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
            label: BUTTONS.contactUs,
            hierarchy: "primary",
            size: "lg",
            url: "https://solanafoundation.typeform.com/to/EVODonPw",
          },
        ]}
      />
    </Layout>
  );
};

export default SolanaPermissionedEnvironmentsPage;

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
