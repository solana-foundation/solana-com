import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import {
  CASE_STUDIES_PANEL,
  CTA_CARD_COLUMNS,
  CTA_CARDS,
  DEVELOPER_ECOSYSTEM_PANEL,
  FEATURE_HIGHLIGHT_CARDS,
  FEATURE_HIGHLIGHT_CONFIG,
  HERO_BUTTON,
  HERO_IMAGE,
  META,
  RESEARCH_CARD_COLUMNS,
  RESEARCH_CARDS,
  SWITCHBACK,
  VIDEO_CARD_COLUMNS,
  VIDEO_CARD_CTA,
  VIDEO_CARD_IMAGES,
} from "../../data/2024outlook";
import {
  CardDeck,
  ConversionPanel,
  FeatureHighlight,
  Heading,
  Hero,
  Switchback,
} from "@solana-foundation/solana-lib";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";

const FeatureHighlightAny = FeatureHighlight as any;

const Outlook2024Page = () => {
  const t = useTranslations("2024outlook");

  const featureCards = (t.raw("featureHighlight.cards") as string[]).map(
    (feature, index) => ({
      feature,
      body: "",
      ...FEATURE_HIGHLIGHT_CARDS[index],
    }),
  );
  const researchCards = (t.raw("cardDecks.research.headings") as string[]).map(
    (headingText, index) => ({
      ...RESEARCH_CARDS[index],
      heading: headingText,
      body: t.raw(`cardDecks.research.bodies.${index}`) as string,
      callToAction: {
        ...RESEARCH_CARDS[index].callToAction,
        label: t("buttons.readUpper"),
      },
    }),
  );
  const ctaCards = (t.raw("cardDecks.cta.headings") as string[]).map(
    (headingText, index) => ({
      ...CTA_CARDS[index],
      heading: headingText,
      callToAction: {
        ...CTA_CARDS[index].callToAction,
        label: t("buttons.read"),
      },
    }),
  );
  const videoCards = (t.raw("cardDecks.videos.headings") as string[]).map(
    (headingText, index) => ({
      type: "image",
      headingAs: "h3",
      heading: headingText,
      callToAction: {
        ...VIDEO_CARD_CTA[index],
        label: t("buttons.watch"),
      },
      backgroundImage: {
        src: VIDEO_CARD_IMAGES[index],
      },
      isFeatured: false,
    }),
  );
  const caseStudyLabels = t.raw(
    "conversionPanels.caseStudies.labels",
  ) as string[];
  const caseStudyItems = CASE_STUDIES_PANEL.listItems.map((item, index) => ({
    ...item,
    label: caseStudyLabels[index],
  }));
  const switchbackButtons = SWITCHBACK.buttons.map((button, index) => ({
    ...button,
    label: t(`switchback.buttons.${index}`),
  }));
  const heroButtons = [
    {
      ...HERO_BUTTON,
      label: t("hero.buttonLabel"),
    },
  ];

  return (
    <Layout>
      <HTMLHead
        title={t("meta.seoTitle")}
        description={t("meta.seoDescription")}
        socialShare={META.seoImage}
      />

      <Hero
        headingAs="h1"
        centered={false}
        body={t.raw("hero.body")}
        newsLetter={false}
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        buttons={heroButtons as any}
        image={{
          alt: t("hero.headline"),
          src: HERO_IMAGE,
        }}
      />

      <FeatureHighlightAny
        headline={t("featureHighlight.headline")}
        body={t("featureHighlight.body")}
        headingAs={FEATURE_HIGHLIGHT_CONFIG.headingAs}
        cards={featureCards}
      />

      <ConversionPanel
        variant={DEVELOPER_ECOSYSTEM_PANEL.variant as any}
        heading={t("conversionPanels.developerEcosystem.heading")}
        body={t("conversionPanels.developerEcosystem.body")}
        buttons={
          DEVELOPER_ECOSYSTEM_PANEL.buttons.map((button) => ({
            ...button,
            label: t("conversionPanels.developerEcosystem.buttonLabel"),
          })) as any
        }
        listItems={[]}
      />

      <CardDeck cards={researchCards as any} numCols={RESEARCH_CARD_COLUMNS} />

      <CardDeck cards={ctaCards as any} numCols={CTA_CARD_COLUMNS} />

      <ConversionPanel
        variant={CASE_STUDIES_PANEL.variant as any}
        heading={t("conversionPanels.caseStudies.heading")}
        body={t("conversionPanels.caseStudies.body")}
        buttons={[]}
        listItems={caseStudyItems as any}
      />

      <Heading
        eyebrow={t("heading.eyebrow")}
        headline={t("heading.headline")}
        body={t("heading.body")}
      />

      <CardDeck cards={videoCards as any} numCols={VIDEO_CARD_COLUMNS} />

      <Switchback
        assetSide={SWITCHBACK.assetSide as any}
        headline={t("switchback.headline")}
        body={t.raw("switchback.body")}
        buttons={switchbackButtons as any}
      />
    </Layout>
  );
};

export default Outlook2024Page;

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
