import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  CardDeck,
  CommunityGallery,
  FeatureHighlight,
  Heading,
  Hero,
  Stats,
  Switchback,
} from "@solana-foundation/solana-lib";
import {
  CARD_DECK_PRIMARY_CARDS,
  CARD_DECK_PRIMARY_COLUMNS,
  CARD_DECK_SECONDARY_CARDS,
  CARD_DECK_SECONDARY_COLUMNS,
  COMMUNITY_GALLERY_CARDS,
  COMMUNITY_GALLERY_CONFIG,
  FEATURE_HIGHLIGHT,
  FEATURE_HIGHLIGHT_CARDS,
  HERO_BUTTONS,
  HERO_IMAGE,
  META,
  STATS_CONFIG,
  SWITCHBACK_BUTTONS,
  SWITCHBACK_IMAGE,
} from "@/data/developers/nfts";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";

const DevelopersNftsPage = () => {
  const t = useTranslations("developers-nfts");
  const blockSpacing = { large: { marginTop: "20px" } };

  const stats = t.raw("stats") as { stat: string; description: string }[];

  const heroButtons = HERO_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`hero.buttons.${index}`),
  }));

  const primaryCardDeckCards = CARD_DECK_PRIMARY_CARDS.map((card, index) => ({
    ...card,
    heading: t(`cardDecks.primary.cards.${index}.heading`),
    body: t(`cardDecks.primary.cards.${index}.body`),
    callToAction: {
      ...card.callToAction,
      label: t(`cardDecks.primary.cards.${index}.ctaLabel`),
    },
  }));

  const secondaryCardDeckCards = CARD_DECK_SECONDARY_CARDS.map(
    (card, index) => ({
      ...card,
      heading: t(`cardDecks.secondary.cards.${index}.heading`),
      body: t(`cardDecks.secondary.cards.${index}.body`),
      callToAction: {
        ...card.callToAction,
        label: t(`cardDecks.secondary.cards.${index}.ctaLabel`),
      },
    }),
  );

  const switchbackButtons = SWITCHBACK_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`switchback.buttons.${index}`),
  }));

  const featureHighlightCards = FEATURE_HIGHLIGHT_CARDS.map((card, index) => ({
    ...card,
    feature: t(`featureHighlight.cards.${index}.feature`),
    body: t(`featureHighlight.cards.${index}.body`),
    button: card.button
      ? {
          ...card.button,
          label: t(`featureHighlight.cards.${index}.buttonLabel`),
        }
      : undefined,
  }));

  const featureHighlightButtons = FEATURE_HIGHLIGHT.buttons.map(
    (button, index) => ({
      ...button,
      label: t(`featureHighlight.buttons.${index}`),
    }),
  );

  const communityGalleryText = t.raw("communityGallery.cards") as {
    heading?: string;
    body?: string;
    buttonLabel?: string;
  }[];

  const communityGalleryCards = COMMUNITY_GALLERY_CARDS.map((card, index) => {
    const text = communityGalleryText[index] ?? {};

    return {
      ...card,
      heading: text.heading,
      body: text.body,
      button: card.button
        ? {
            ...card.button,
            label: text.buttonLabel ?? "",
          }
        : undefined,
    };
  });

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
          image={{
            alt: t("hero.headline"),
            src: HERO_IMAGE,
          }}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Stats stats={stats} contained={STATS_CONFIG.contained} />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Heading
          eyebrow={t("headings.whySolana.eyebrow")}
          headline={t("headings.whySolana.headline")}
          body={t("headings.whySolana.body")}
        />
      </ResponsiveBox>

      <CardDeck
        cards={
          primaryCardDeckCards as React.ComponentProps<typeof CardDeck>["cards"]
        }
        numCols={CARD_DECK_PRIMARY_COLUMNS}
      />

      <Heading
        eyebrow={t("headings.metaplex.eyebrow")}
        headline={t("headings.metaplex.headline")}
        body={t("headings.metaplex.body")}
      />

      <CardDeck
        cards={
          secondaryCardDeckCards as React.ComponentProps<
            typeof CardDeck
          >["cards"]
        }
        numCols={CARD_DECK_SECONDARY_COLUMNS}
      />

      <Switchback
        assetSide="right"
        image={{
          alt: t("switchback.headline"),
          src: SWITCHBACK_IMAGE,
        }}
        eyebrow={t("switchback.eyebrow")}
        headline={t("switchback.headline")}
        body={t.raw("switchback.body")}
        buttons={
          switchbackButtons as React.ComponentProps<
            typeof Switchback
          >["buttons"]
        }
      />

      <FeatureHighlight
        eyebrow={t("featureHighlight.eyebrow")}
        headline={t("featureHighlight.headline")}
        body={t("featureHighlight.body")}
        desktopBackground={FEATURE_HIGHLIGHT.desktopBackground}
        cards={featureHighlightCards as any}
        buttons={featureHighlightButtons as any}
        valueOf={null}
      />

      <Heading
        eyebrow={t("headings.earlyMovers.eyebrow")}
        headline={t("headings.earlyMovers.headline")}
        body={t("headings.earlyMovers.body")}
      />

      <CommunityGallery
        square={COMMUNITY_GALLERY_CONFIG.square}
        cards={
          communityGalleryCards as React.ComponentProps<
            typeof CommunityGallery
          >["cards"]
        }
      />
    </Layout>
  );
};

export default DevelopersNftsPage;

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
