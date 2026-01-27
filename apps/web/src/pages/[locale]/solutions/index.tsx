import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import {
  Heading,
  CardDeck,
  ConversionPanel,
  Stats,
} from "@solana-foundation/solana-lib";
import { withLocales } from "@workspace/i18n/routing";
import {
  META,
  HEADINGS,
  BUTTONS,
  CARDS_TOOLS,
  CARDS_USE_CASES,
  CONVERSION_PANEL,
  STATS,
} from "@/data/solutions/index";
import { ResponsiveBox } from "@/component-library/responsive-box";

const SolutionsIndexPage = () => {
  return (
    <Layout>
      <HTMLHead
        title={META.seoTitle}
        description={META.seoDescription}
        // socialShare={META.seoImage}
      />

      <Heading
        headline={HEADINGS.hero.headline}
        buttons={[
          {
            label: BUTTONS.getStarted,
            hierarchy: "primary",
            size: "lg",
            url: "https://solana.com/developers",
          },
        ]}
        eyebrow={HEADINGS.hero.eyebrow}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-120px" },
          medium: { marginBottom: "-45px" },
        }}
      >
        <Heading
          headline={HEADINGS.tools.headline}
          buttons={[
            {
              label: BUTTONS.readDocs,
              hierarchy: "outline",
              size: "lg",
              url: "https://solana.com/developers",
            },
          ]}
          body={HEADINGS.tools.body}
        />
      </ResponsiveBox>

      <CardDeck
        cards={[
          {
            type: "gradient",
            heading: CARDS_TOOLS[0].heading,
            headingAs: "h2",
            body: "",
            backgroundGradient: "green",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              url: "/solutions/token22",
              label: BUTTONS.learnMore,
              hierarchy: "outline",
            },
          },
          {
            type: "gradient",
            heading: CARDS_TOOLS[1].heading,
            headingAs: "h2",
            body: "",
            backgroundGradient: "green",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              url: "/solutions/payments-tooling",
              label: BUTTONS.learnMore,
              hierarchy: "outline",
            },
          },
          {
            type: "gradient",
            heading: CARDS_TOOLS[2].heading,
            headingAs: "h2",
            body: "",
            backgroundGradient: "green",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: BUTTONS.learnMore,
              hierarchy: "outline",
              url: "/solutions/games-tooling",
            },
          },
          {
            type: "gradient",
            heading: CARDS_TOOLS[3].heading,
            headingAs: "h2",
            body: "",
            backgroundGradient: "green",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: BUTTONS.learnMore,
              hierarchy: "outline",
              url: "/solutions/financial-infrastructure",
            },
          },
          {
            type: "gradient",
            heading: CARDS_TOOLS[4].heading,
            headingAs: "h2",
            body: "",
            backgroundGradient: "green",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: BUTTONS.learnMore,
              hierarchy: "outline",
              url: "/solutions/digital-assets",
            },
          },
          {
            type: "gradient",
            heading: CARDS_TOOLS[5].heading,
            headingAs: "h2",
            body: "",
            backgroundGradient: "green",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: BUTTONS.learnMore,
              hierarchy: "outline",
              url: "https://solanamobile.com/developers",
              endIcon: "arrow-up-right",
            },
          },
          {
            type: "gradient",
            heading: CARDS_TOOLS[6].heading,
            headingAs: "h3",
            body: "",
            backgroundGradient: "green",
            isFeatured: false,
            hiddenOnDesktop: false,
            eyebrow: "",
            callToAction: {
              label: "LEARN MORE",
              hierarchy: "outline",
              url: "https://solana.com/developers/ai",
            },
          },
          {
            type: "gradient",
            heading: CARDS_TOOLS[7].heading,
            headingAs: "h3",
            body: "",
            backgroundGradient: "green",
            isFeatured: false,
            hiddenOnDesktop: false,
            eyebrow: "",
            callToAction: {
              label: BUTTONS.learnMore,
              hierarchy: "outline",
              url: "https://solana.com/solutions/solana-permissioned-environments",
            },
          },
          {
            type: "gradient",
            heading: CARDS_TOOLS[8].heading,
            headingAs: "h3",
            body: "",
            backgroundGradient: "blue",
            isFeatured: false,
            hiddenOnDesktop: false,
            eyebrow: "",
            callToAction: { label: "PAGE Coming Soon", hierarchy: "link" },
          },
          {
            type: "gradient",
            heading: CARDS_TOOLS[9].heading,
            headingAs: "h3",
            body: "",
            backgroundGradient: "blue",
            isFeatured: false,
            hiddenOnDesktop: false,
            eyebrow: "",
            callToAction: { label: "Page Coming Soon", hierarchy: "link" },
          },
          {
            type: "gradient",
            heading: CARDS_TOOLS[10].heading,
            headingAs: "h3",
            body: "",
            backgroundGradient: "blue",
            isFeatured: false,
            hiddenOnDesktop: false,
            eyebrow: "",
            callToAction: { label: "Page Coming Soon", hierarchy: "link" },
          },
        ]}
        featured={false}
        numCols={3}
      />

      <ConversionPanel
        variant="inline-centered"
        mobileBackground={{
          src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F2ffe062107544cffa49618a58b9c50bc.png",
        }}
        desktopBackground={{
          src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F389dc24276754a22b0dc57906f5ffe71.png",
        }}
        heading={CONVERSION_PANEL.featured.heading}
        body={CONVERSION_PANEL.featured.body}
        buttons={[
          {
            label: BUTTONS.learnMore,
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
          headline={HEADINGS.madeFor.headline}
          body={HEADINGS.madeFor.body}
          buttons={[
            {
              label: BUTTONS.seeCaseStudies,
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
            heading: CARDS_USE_CASES[0].heading,
            headingAs: "h2",
            body: CARDS_USE_CASES[0].body,
            backgroundGradient: "purple",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: BUTTONS.learnMore,
              hierarchy: "outline",
              url: "/solutions/enterprise",
            },
          },
          {
            type: "gradient",
            heading: CARDS_USE_CASES[1].heading,
            headingAs: "h2",
            body: CARDS_USE_CASES[1].body,
            backgroundGradient: "purple",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: BUTTONS.learnMore,
              hierarchy: "outline",
              url: "/solutions/gaming-and-entertainment",
            },
          },
          {
            type: "gradient",
            heading: CARDS_USE_CASES[2].heading,
            headingAs: "h2",
            body: CARDS_USE_CASES[2].body,
            backgroundGradient: "purple",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: BUTTONS.learnMore,
              hierarchy: "outline",
              url: "/solutions/artists-creators",
            },
          },
          {
            type: "gradient",
            heading: CARDS_USE_CASES[3].heading,
            headingAs: "h2",
            body: CARDS_USE_CASES[3].body,
            backgroundGradient: "purple",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: BUTTONS.learnMore,
              hierarchy: "outline",
              url: "/solutions/commerce-and-payments",
            },
          },
          {
            type: "gradient",
            heading: CARDS_USE_CASES[4].heading,
            headingAs: "h4",
            body: CARDS_USE_CASES[4].body,
            backgroundGradient: "purple",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: "LEARN MORE",
              hierarchy: "outline",
              url: "https://solana.com/developers/defi",
            },
          },
          {
            type: "gradient",
            heading: CARDS_USE_CASES[5].heading,
            headingAs: "h4",
            body: CARDS_USE_CASES[5].body,
            backgroundGradient: "purple",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: "LEARN MORE",
              hierarchy: "outline",
              url: "https://solana.com/developers/dao",
            },
          },
          {
            type: "gradient",
            heading: CARDS_USE_CASES[6].heading,
            headingAs: "h4",
            body: CARDS_USE_CASES[6].body,
            backgroundGradient: "blue",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: "Page Coming Soon",
              hierarchy: "link",
              url: "",
            },
          },
          {
            type: "gradient",
            heading: CARDS_USE_CASES[7].heading,
            headingAs: "h4",
            body: CARDS_USE_CASES[7].body,
            backgroundGradient: "blue",
            isFeatured: false,
            hiddenOnDesktop: false,
            callToAction: {
              label: "Page Coming Soon",
              hierarchy: "link",
              url: "",
            },
          },
        ]}
        featured={false}
        numCols={3}
      />

      <Heading
        headline={HEADINGS.aboutSolana.headline}
        body={HEADINGS.aboutSolana.body}
        variant="floatingButton"
      />

      <Stats stats={STATS} contained />

      <ConversionPanel
        buttons={[
          {
            label: BUTTONS.reachOut,
            hierarchy: "secondary",
            size: "lg",
            url: "mailto:product@solana.org",
          },
          {
            label: BUTTONS.seeDeveloperMaterials,
            hierarchy: "outline",
            size: "lg",
            url: "https://solana.com/developers",
          },
        ]}
        variant="centered"
        body={HEADINGS.cta.body}
        heading={HEADINGS.cta.heading}
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
