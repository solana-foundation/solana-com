"use client";

import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  Accordion,
  CardDeck,
  FeatureHighlight,
  Heading,
  Hero,
} from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  CHAIN_SELECTOR,
  CHAIN_SELECTOR_CARDS,
  EVM_GUIDES_HEADING,
  FAQ_COUNT,
  HERO_BUTTONS,
  PRIMARY_CARD_DECK,
  SECONDARY_CARD_DECK,
} from "@/data/developers/evm-to-svm";

const FeatureHighlightAny = FeatureHighlight as any;

export function DevelopersChainMigrationPage() {
  const t = useTranslations("developers-evm-to-svm");
  const blockSpacing = { large: { marginTop: "20px" } };

  const heroButtons = HERO_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`hero.buttons.${index}.label`),
  }));

  const chainSelectorCards = CHAIN_SELECTOR_CARDS.map((card, index) => ({
    ...card,
    feature: t(`chainSelector.cards.${index}.feature`),
    body: t(`chainSelector.cards.${index}.body`),
    eyebrow: t(`chainSelector.cards.${index}.eyebrow`),
    button: {
      ...card.button,
      label: t(`chainSelector.cards.${index}.button.label`),
    },
  }));

  const primaryCards = PRIMARY_CARD_DECK.cards.map((card, index) => ({
    ...card,
    eyebrow: t(`primaryCardDeck.cards.${index}.eyebrow`),
    heading: t(`primaryCardDeck.cards.${index}.heading`),
    body: t(`primaryCardDeck.cards.${index}.body`),
    callToAction: {
      ...card.callToAction,
      label: t(`primaryCardDeck.cards.${index}.callToAction.label`),
    },
  }));

  const faqItems = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    title: t(`faq.accordions.${i}.title`),
    body: t.raw(`faq.accordions.${i}.body`),
  }));

  const secondaryCards = SECONDARY_CARD_DECK.cards.map((card, index) => ({
    ...card,
    eyebrow: t(`secondaryCardDeck.cards.${index}.eyebrow`),
    heading: t(`secondaryCardDeck.cards.${index}.heading`),
    body: t(`secondaryCardDeck.cards.${index}.body`),
  }));

  return (
    <>
      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Hero
          headingAs="h1"
          centered={false}
          newsLetter={false}
          eyebrow={t("hero.eyebrow")}
          headline={t("hero.headline")}
          body={t.raw("hero.body")}
          buttons={heroButtons as React.ComponentProps<typeof Hero>["buttons"]}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <FeatureHighlightAny
          headingAs={CHAIN_SELECTOR.headingAs}
          color={CHAIN_SELECTOR.color}
          eyebrow={t("chainSelector.eyebrow")}
          headline={t("chainSelector.headline")}
          body={t("chainSelector.body")}
          cards={chainSelectorCards}
          buttons={[]}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Heading
          variant={EVM_GUIDES_HEADING.variant as "floatingButton"}
          eyebrow={t("evmGuidesHeading.eyebrow")}
          headline={t("evmGuidesHeading.headline")}
          body={t("evmGuidesHeading.body")}
        />
      </ResponsiveBox>

      <CardDeck
        cards={primaryCards as React.ComponentProps<typeof CardDeck>["cards"]}
        numCols={
          PRIMARY_CARD_DECK.numCols as React.ComponentProps<
            typeof CardDeck
          >["numCols"]
        }
        featured={PRIMARY_CARD_DECK.featured}
      />

      <ResponsiveBox responsiveStyles={{ large: { minHeight: "100px" } }}>
        <Accordion
          accordions={faqItems}
          headline={t("faq.headline")}
          eyebrow={t("faq.eyebrow")}
        />
      </ResponsiveBox>

      <Heading
        eyebrow={t("heading.eyebrow")}
        headline={t("heading.headline")}
        body={t("heading.body")}
      />

      <CardDeck
        cards={secondaryCards as React.ComponentProps<typeof CardDeck>["cards"]}
        numCols={
          SECONDARY_CARD_DECK.numCols as React.ComponentProps<
            typeof CardDeck
          >["numCols"]
        }
        featured={SECONDARY_CARD_DECK.featured}
      />
    </>
  );
}
