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
  DEVELOPER_CARD_IMAGES,
} from "@/data/solutions/solana-permissioned-environments";

const SolanaPermissionedEnvironmentsPage = () => {
  const t = useTranslations("spe-solution");

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
            label: t("buttons.readTheDocs"),
            hierarchy: "primary",
            size: "lg",
            url: "https://solana.com/developers/guides/permissioned-environments",
          },
          {
            label: t("buttons.areSpesRightForYou"),
            hierarchy: "outline",
            size: "lg",
            url: "https://solanafoundation.notion.site/Solana-Permissioned-Environments-Decision-Tree-f5c9aec58da34763ae9bc09397d7d968?pvs=4",
          },
          {
            label: t("buttons.getInTouch"),
            hierarchy: "outline",
            size: "lg",
            url: "mailto:product@solana.org",
          },
        ]}
        image={{
          src: HERO_IMAGE,
          alt: t("hero.headline"),
        }}
      />

      <Heading
        headline={t("headings.permissionedChains.headline")}
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
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "https://solana.com/solutions/token-extensions",
                label: t("buttons.learnMoreAboutTokenExtensions"),
              },
            ],
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
              src: DEVELOPER_CARD_IMAGES,
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
              src: DEVELOPER_CARD_IMAGES,
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
              src: DEVELOPER_CARD_IMAGES,
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
              src: DEVELOPER_CARD_IMAGES,
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
            label: t("buttons.contactUs"),
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
