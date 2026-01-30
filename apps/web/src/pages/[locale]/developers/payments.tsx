import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  CardDeck,
  ConversionPanel,
  FeatureHighlight,
  Heading,
  Hero,
  Stats,
  Switchback,
} from "@solana-foundation/solana-lib";
import {
  CARD_DECK_CARDS,
  CARD_DECK_COLUMNS,
  COMMUNITY_PANEL,
  FEATURE_HIGHLIGHT,
  FEATURE_HIGHLIGHT_CARDS,
  FLOATING_HEADING,
  HERO_BUTTONS,
  HERO_IMAGE,
  META,
  STATS_CONFIG,
  SWITCHBACK_BUTTONS,
  SWITCHBACK_IMAGE,
} from "@/data/developers/payments";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";

const DevelopersPaymentsPage = () => {
  const t = useTranslations("developers-payments");
  const blockSpacing = { large: { marginTop: "20px" } };

  const stats = t.raw("stats") as { stat: string; description: string }[];

  const heroButtons = HERO_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`hero.buttons.${index}`),
  }));

  const cardDeckText = t.raw("cardDeck.cards") as {
    heading: string;
    body: string;
    ctaLabel: string;
  }[];

  const cardDeckCards = CARD_DECK_CARDS.map((card, index) => ({
    ...card,
    heading: cardDeckText[index]?.heading ?? "",
    body: cardDeckText[index]?.body ?? "",
    callToAction: {
      ...card.callToAction,
      label: cardDeckText[index]?.ctaLabel ?? "",
    },
  }));

  const featureHighlightCards = FEATURE_HIGHLIGHT_CARDS.map((card, index) => ({
    ...card,
    feature: t(`featureHighlight.cards.${index}.feature`),
    body: t(`featureHighlight.cards.${index}.body`),
  }));

  const switchbackButtons = SWITCHBACK_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`switchback.buttons.${index}`),
  }));

  const communityListItems = COMMUNITY_PANEL.listItems.map((item, index) => ({
    ...item,
    label: t(`communityPanel.listItems.${index}`),
  }));

  return (
    <Layout>
      <HTMLHead
        title={t("meta.seoTitle")}
        description={t("meta.seoDescription")}
        socialShare={META.seoImage}
      />

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Hero
          headingAs="h1"
          centered={false}
          newsLetter={false}
          eyebrow={t("hero.eyebrow")}
          headline={t("hero.headline")}
          body={t.raw("hero.body")}
          buttons={heroButtons as React.ComponentProps<typeof Hero>["buttons"]}
          image={{ alt: t("hero.headline"), src: HERO_IMAGE }}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Stats stats={stats} contained={STATS_CONFIG.contained} />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Heading
          eyebrow={t("headings.gettingStarted.eyebrow")}
          headline={t("headings.gettingStarted.headline")}
          body={t("headings.gettingStarted.body")}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <CardDeck
          cards={
            cardDeckCards as React.ComponentProps<typeof CardDeck>["cards"]
          }
          numCols={CARD_DECK_COLUMNS}
        />
      </ResponsiveBox>

      <Heading
        variant={FLOATING_HEADING.variant as "floatingButton"}
        eyebrow={t("headings.nextGeneration.eyebrow")}
        headline={t("headings.nextGeneration.headline")}
        body={t("headings.nextGeneration.body")}
      />

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <FeatureHighlight
          eyebrow={t("featureHighlight.eyebrow")}
          headline={t("featureHighlight.headline")}
          body={t("featureHighlight.body")}
          headingAs={"h2"}
          desktopBackground={FEATURE_HIGHLIGHT.desktopBackground}
          cards={featureHighlightCards as any}
          buttons={[]}
          valueOf={null}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Switchback
          assetSide="left"
          image={{ alt: t("switchback.headline"), src: SWITCHBACK_IMAGE }}
          eyebrow={t("switchback.eyebrow")}
          headline={t("switchback.headline")}
          body={t.raw("switchback.body")}
          buttons={
            switchbackButtons as React.ComponentProps<
              typeof Switchback
            >["buttons"]
          }
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <ConversionPanel
          variant={COMMUNITY_PANEL.variant as "inline-centered"}
          heading={t("communityPanel.heading")}
          body={t("communityPanel.body")}
          buttons={[]}
          logos={[]}
          showLogos={COMMUNITY_PANEL.showLogos}
          listItems={
            communityListItems as React.ComponentProps<
              typeof ConversionPanel
            >["listItems"]
          }
        />
      </ResponsiveBox>
    </Layout>
  );
};

export default DevelopersPaymentsPage;

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
