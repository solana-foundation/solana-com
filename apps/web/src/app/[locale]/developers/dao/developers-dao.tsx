"use client";

import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  CardDeck,
  ConversionPanel,
  FeatureHighlight,
  Heading,
  Hero,
  Slider,
  Stats,
} from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  CARD_DECK_CARDS,
  CARD_DECK_COLUMNS,
  CONVERSION_PANEL,
  HERO_BUTTONS,
  HERO_IMAGE,
  SLIDER_CARDS,
  STATS_CONFIG,
} from "@/data/developers/dao";

const FeatureHighlightAny = FeatureHighlight as any;

export function DevelopersDaoPage() {
  const t = useTranslations("developers-dao");

  const stats = t.raw("stats") as { stat: string; description: string }[];

  const heroButtons = HERO_BUTTONS.map((button) => ({
    ...button,
    label: t("hero.buttonLabel"),
  }));

  const cardDeckCards = CARD_DECK_CARDS.map((card, index) => ({
    ...card,
    heading: t(`cardDeck.headings.${index}`),
    body: t(`cardDeck.bodies.${index}`),
    callToAction: {
      ...card.callToAction,
      label: t(`cardDeck.ctaLabels.${index}`),
    },
  }));

  const featureHighlightCards = t.raw("featureHighlight.cards") as {
    feature: string;
    body: string;
  }[];

  const sliderCards = SLIDER_CARDS.map((card, index) => ({
    ...card,
    button: {
      ...card.button,
      label: t("slider.buttonLabel"),
    },
    title: t(`slider.cards.${index}.title`),
    body: t.raw(`slider.cards.${index}.body`),
  }));

  const conversionListItems = CONVERSION_PANEL.listItems.map((item, index) => ({
    ...item,
    label: t(`conversionPanel.listItems.${index}`),
  }));

  return (
    <>
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

      <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
        <Heading
          eyebrow={t("headings.startBuilding.eyebrow")}
          headline={t("headings.startBuilding.headline")}
          body={t("headings.startBuilding.body")}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
        <CardDeck cards={cardDeckCards as any} numCols={CARD_DECK_COLUMNS} />
      </ResponsiveBox>

      <FeatureHighlightAny
        eyebrow={t("featureHighlight.eyebrow")}
        headline={t("featureHighlight.headline")}
        body={t("featureHighlight.body")}
        cards={featureHighlightCards as any}
      />

      <Heading
        variant="floatingButton"
        eyebrow={t("headings.floating.eyebrow")}
        headline={t("headings.floating.headline")}
        body={t("headings.floating.body")}
      />

      <Slider cards={sliderCards as any} />

      <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
        <ConversionPanel
          variant={CONVERSION_PANEL.variant as "inline-centered"}
          heading={t("conversionPanel.heading")}
          body={t("conversionPanel.body")}
          buttons={[]}
          logos={[]}
          showLogos={CONVERSION_PANEL.showLogos}
          listItems={conversionListItems as any}
        />
      </ResponsiveBox>
    </>
  );
}
