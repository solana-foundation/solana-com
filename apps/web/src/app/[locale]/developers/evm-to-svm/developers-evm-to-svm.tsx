"use client";

import { CardDeck, Heading, Hero } from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  HERO_BUTTONS,
  PRIMARY_CARD_DECK,
  SECONDARY_CARD_DECK,
} from "@/data/developers/evm-to-svm";

export function DevelopersEvmToSvmPage() {
  const t = useTranslations("developers-evm-to-svm");

  const heroButtons = HERO_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`hero.buttons.${index}.label`),
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

  const secondaryCards = SECONDARY_CARD_DECK.cards.map((card, index) => ({
    ...card,
    eyebrow: t(`secondaryCardDeck.cards.${index}.eyebrow`),
    heading: t(`secondaryCardDeck.cards.${index}.heading`),
    body: t(`secondaryCardDeck.cards.${index}.body`),
  }));

  return (
    <>
      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
        buttons={heroButtons as React.ComponentProps<typeof Hero>["buttons"]}
      />

      <CardDeck
        cards={primaryCards as React.ComponentProps<typeof CardDeck>["cards"]}
        numCols={
          PRIMARY_CARD_DECK.numCols as React.ComponentProps<
            typeof CardDeck
          >["numCols"]
        }
        featured={PRIMARY_CARD_DECK.featured}
      />

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
