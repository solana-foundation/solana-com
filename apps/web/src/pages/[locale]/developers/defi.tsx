import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  CardDeck,
  CommunityGallery,
  ConversionPanel,
  Heading,
  Hero,
  Stats,
  Switchback,
} from "@solana-foundation/solana-lib";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import {
  CARD_DECK_CARDS,
  CARD_DECK_COLUMNS,
  COMMUNITY_GALLERY_CARDS,
  COMMUNITY_GALLERY_CONFIG,
  CONVERSION_PANEL_COMMUNITY,
  CONVERSION_PANEL_PRIMARY,
  HERO_BUTTONS,
  HERO_IMAGE,
  // META,
  STATS_CONFIG,
  SWITCHBACK_BUTTONS,
  SWITCHBACK_IMAGE,
} from "@/data/developers/defi";

const DevelopersDefiPage = () => {
  const t = useTranslations("developers-defi");

  const stats = t.raw("stats") as { stat: string; description: string }[];

  const heroButtons = HERO_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`hero.buttons.${index}`),
  }));

  const switchbackButtons = SWITCHBACK_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`switchback.buttons.${index}`),
  }));

  const cardDeckCards = CARD_DECK_CARDS.map((card, index) => ({
    ...card,
    eyebrow: t(`cardDeck.eyebrows.${index}`),
    heading: t(`cardDeck.headings.${index}`),
    callToAction: {
      ...card.callToAction,
      label: t(`cardDeck.ctaLabels.${index}`),
    },
  }));

  const communityGalleryText = t.raw("communityGallery.cards") as {
    eyebrow?: string;
    heading?: string;
    body?: string;
    stat?: string;
    buttonLabel?: string;
  }[];

  const communityGalleryCards = COMMUNITY_GALLERY_CARDS.map((card, index) => {
    const text = communityGalleryText[index] ?? {};

    return {
      ...card,
      eyebrow: text.eyebrow,
      heading: text.heading,
      body: text.body,
      stat: text.stat,
      button: card.button
        ? {
            ...card.button,
            label: text.buttonLabel ?? "",
          }
        : undefined,
    };
  });

  const conversionPanelButtons = CONVERSION_PANEL_PRIMARY.buttons.map(
    (button, index) => ({
      ...button,
      label: t(`conversionPanel.buttons.${index}`),
    }),
  );

  const communityListItems = CONVERSION_PANEL_COMMUNITY.listItems.map(
    (item, index) => ({
      ...item,
      label: t(`communityPanel.listItems.${index}`),
    }),
  );

  return (
    <Layout>
      <HTMLHead
        title={t("meta.seoTitle")}
        description={t("meta.seoDescription")}
        // socialShare={META.seoImage}
      />

      <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
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

      <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
        <Stats stats={stats} contained={STATS_CONFIG.contained} />
      </ResponsiveBox>

      <Heading
        variant="floatingButton"
        eyebrow={t("headings.whySolana.eyebrow")}
        headline={t("headings.whySolana.headline")}
        body={t("headings.whySolana.body")}
      />

      <Switchback
        assetSide="left"
        image={{
          alt: t("switchback.headline"),
          src: SWITCHBACK_IMAGE,
        }}
        eyebrow={t("switchback.eyebrow")}
        headline={t("switchback.headline")}
        body={t.raw("switchback.body")}
        buttons={switchbackButtons as any}
      />

      <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
        <Heading
          eyebrow={t("headings.primitives.eyebrow")}
          headline={t("headings.primitives.headline")}
          body={t("headings.primitives.body")}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
        <CardDeck cards={cardDeckCards as any} numCols={CARD_DECK_COLUMNS} />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
        <ConversionPanel
          variant={CONVERSION_PANEL_PRIMARY.variant as "centered"}
          heading={t("conversionPanel.heading")}
          body={t("conversionPanel.body")}
          buttons={conversionPanelButtons as any}
          logos={[]}
          showLogos={false}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
        <CommunityGallery
          square={COMMUNITY_GALLERY_CONFIG.square}
          cards={communityGalleryCards as any}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
        <ConversionPanel
          variant={CONVERSION_PANEL_COMMUNITY.variant as "inline-centered"}
          heading={t("communityPanel.heading")}
          body={t("communityPanel.body")}
          buttons={[]}
          logos={[]}
          showLogos={CONVERSION_PANEL_COMMUNITY.showLogos}
          listItems={communityListItems as any}
        />
      </ResponsiveBox>
    </Layout>
  );
};

export default DevelopersDefiPage;

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
