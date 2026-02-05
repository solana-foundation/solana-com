import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import {
  Heading,
  CardDeck,
  ConversionPanel,
  Stats,
} from "@solana-foundation/solana-lib";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import { CONVERSION_PANEL_IMAGES } from "@/data/solutions/index";
import { ResponsiveBox } from "@/component-library/responsive-box";

const SolutionsIndexPage = () => {
  const t = useTranslations("solutions-index");

  const toolsCards = Array.from({ length: 8 }, (_, index) => ({
    heading: t(`cardsTools.${index}.heading`),
  }));

  const useCaseCards = Array.from({ length: 6 }, (_, index) => ({
    heading: t(`cardsUseCases.${index}.heading`),
    body: t(`cardsUseCases.${index}.body`),
  }));

  const stats = Array.from({ length: 3 }, (_, index) => ({
    stat: t(`stats.${index}.stat`),
    description: t(`stats.${index}.description`),
  }));

  return (
    <Layout>
      <HTMLHead
        title={t("meta.title")}
        description={t("meta.description")}
        // socialShare={META.seoImage}
      />

      <Heading
        headline={t("headings.hero.headline")}
        buttons={[
          {
            label: t("buttons.getStarted"),
            hierarchy: "primary",
            size: "lg",
            url: "https://solana.com/developers",
          },
        ]}
        eyebrow={t("headings.hero.eyebrow")}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-120px" },
          medium: { marginBottom: "-45px" },
        }}
      >
        <Heading
          headline={t("headings.tools.headline")}
          buttons={[
            {
              label: t("buttons.readDocs"),
              hierarchy: "outline",
              size: "lg",
              url: "https://solana.com/developers",
            },
          ]}
          body={t("headings.tools.body")}
        />
      </ResponsiveBox>

      <CardDeck
        cards={[
          {
            type: "gradient",
            heading: toolsCards[0].heading,
            headingAs: "h2",
            body: "",
            backgroundGradient: "green",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              url: "/solutions/token22",
              label: t("buttons.learnMore"),
              hierarchy: "outline",
            },
          },
          {
            type: "gradient",
            heading: toolsCards[1].heading,
            headingAs: "h2",
            body: "",
            backgroundGradient: "green",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              url: "/solutions/institutional-payments",
              label: t("buttons.learnMore"),
              hierarchy: "outline",
            },
          },
          {
            type: "gradient",
            heading: toolsCards[2].heading,
            headingAs: "h2",
            body: "",
            backgroundGradient: "green",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: t("buttons.learnMore"),
              hierarchy: "outline",
              url: "/solutions/games-tooling",
            },
          },
          {
            type: "gradient",
            heading: toolsCards[3].heading,
            headingAs: "h2",
            body: "",
            backgroundGradient: "green",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: t("buttons.learnMore"),
              hierarchy: "outline",
              url: "/solutions/financial-infrastructure",
            },
          },
          {
            type: "gradient",
            heading: toolsCards[4].heading,
            headingAs: "h2",
            body: "",
            backgroundGradient: "green",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: t("buttons.learnMore"),
              hierarchy: "outline",
              url: "/solutions/digital-assets",
            },
          },
          {
            type: "gradient",
            heading: toolsCards[5].heading,
            headingAs: "h2",
            body: "",
            backgroundGradient: "green",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: t("buttons.learnMore"),
              hierarchy: "outline",
              url: "https://solanamobile.com/developers",
              endIcon: "arrow-up-right",
            },
          },
          {
            type: "gradient",
            heading: toolsCards[6].heading,
            headingAs: "h3",
            body: "",
            backgroundGradient: "green",
            isFeatured: false,
            hiddenOnDesktop: false,
            eyebrow: "",
            callToAction: {
              label: t("buttons.learnMore"),
              hierarchy: "outline",
              url: "https://solana.com/developers/ai",
            },
          },
          {
            type: "gradient",
            heading: toolsCards[7].heading,
            headingAs: "h3",
            body: "",
            backgroundGradient: "green",
            isFeatured: false,
            hiddenOnDesktop: false,
            eyebrow: "",
            callToAction: {
              label: t("buttons.learnMore"),
              hierarchy: "outline",
              url: "https://solana.com/solutions/solana-permissioned-environments",
            },
          },
        ]}
        featured={false}
        numCols={3}
      />

      <ConversionPanel
        variant="inline-centered"
        mobileBackground={{
          src: CONVERSION_PANEL_IMAGES.mobile.src,
        }}
        desktopBackground={{
          src: CONVERSION_PANEL_IMAGES.desktop.src,
        }}
        heading={t("conversionPanel.featured.heading")}
        body={t("conversionPanel.featured.body")}
        buttons={[
          {
            label: t("buttons.learnMore"),
            hierarchy: "secondary",
            size: "xl",
            url: "https://solana.com/solutions/solana-permissioned-environments",
          },
        ]}
        showLogos={false}
        newsLetter={false}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-120px" },
          medium: { marginBottom: "-45px" },
        }}
      >
        <Heading
          headline={t("headings.madeFor.headline")}
          body={t("headings.madeFor.body")}
          buttons={[
            {
              label: t("buttons.seeCaseStudies"),
              hierarchy: "outline",
              size: "lg",
              url: "/news/tag/case-studies",
            },
          ]}
        />
      </ResponsiveBox>

      <CardDeck
        cards={[
          {
            type: "gradient",
            heading: useCaseCards[0].heading,
            headingAs: "h2",
            body: useCaseCards[0].body,
            backgroundGradient: "purple",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: t("buttons.learnMore"),
              hierarchy: "outline",
              url: "/solutions/enterprise",
            },
          },
          {
            type: "gradient",
            heading: useCaseCards[1].heading,
            headingAs: "h2",
            body: useCaseCards[1].body,
            backgroundGradient: "purple",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: t("buttons.learnMore"),
              hierarchy: "outline",
              url: "/solutions/gaming-and-entertainment",
            },
          },
          {
            type: "gradient",
            heading: useCaseCards[2].heading,
            headingAs: "h2",
            body: useCaseCards[2].body,
            backgroundGradient: "purple",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: t("buttons.learnMore"),
              hierarchy: "outline",
              url: "/solutions/artists-creators",
            },
          },
          {
            type: "gradient",
            heading: useCaseCards[3].heading,
            headingAs: "h2",
            body: useCaseCards[3].body,
            backgroundGradient: "purple",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: t("buttons.learnMore"),
              hierarchy: "outline",
              url: "/solutions/institutional-payments",
            },
          },
          {
            type: "gradient",
            heading: useCaseCards[4].heading,
            headingAs: "h4",
            body: useCaseCards[4].body,
            backgroundGradient: "purple",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: t("buttons.learnMore"),
              hierarchy: "outline",
              url: "https://solana.com/developers/defi",
            },
          },
          {
            type: "gradient",
            heading: useCaseCards[5].heading,
            headingAs: "h4",
            body: useCaseCards[5].body,
            backgroundGradient: "purple",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: t("buttons.learnMore"),
              hierarchy: "outline",
              url: "https://solana.com/developers/dao",
            },
          },
        ]}
        featured={false}
        numCols={3}
      />

      <Heading
        headline={t("headings.aboutSolana.headline")}
        body={t("headings.aboutSolana.body")}
        variant="floatingButton"
      />

      <Stats stats={stats} contained />

      <ConversionPanel
        buttons={[
          {
            label: t("buttons.reachOut"),
            hierarchy: "secondary",
            size: "lg",
            url: "mailto:product@solana.org",
          },
          {
            label: t("buttons.seeDeveloperMaterials"),
            hierarchy: "outline",
            size: "lg",
            url: "https://solana.com/developers",
          },
        ]}
        variant="centered"
        body={t("headings.cta.body")}
        heading={t("headings.cta.heading")}
      />
    </Layout>
  );
};

export default SolutionsIndexPage;

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
