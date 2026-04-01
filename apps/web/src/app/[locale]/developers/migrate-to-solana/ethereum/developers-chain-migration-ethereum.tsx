"use client";

import { ResponsiveBox } from "@/component-library/responsive-box";
import { CardDeck, Heading, Hero } from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  PRIMARY_CARD_DECK,
  SECONDARY_CARD_DECK,
} from "@/data/developers/evm-to-svm";

export function DevelopersChainMigrationEthereumPage() {
  const t = useTranslations("developers-evm-to-svm");
  const blockSpacing = { large: { marginTop: "48px" } };

  const heroButtons = [
    {
      hierarchy: "primary",
      size: "md",
      url: "/developers/migrate-to-solana/complete-guide",
      label: t("evmGuidesHeading.buttons.0.label"),
    },
    {
      hierarchy: "outline",
      size: "md",
      url: "https://rareskills.io/solana-tutorial",
      label: t("evmGuidesHeading.buttons.1.label"),
    },
  ];

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
      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Hero
          headingAs="h1"
          centered={false}
          newsLetter={false}
          eyebrow={t("evmGuidesHeading.eyebrow")}
          headline={t("evmGuidesHeading.headline")}
          body={t.raw("evmGuidesHeading.body")}
          buttons={heroButtons as React.ComponentProps<typeof Hero>["buttons"]}
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

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Heading
          eyebrow={t("heading.eyebrow")}
          headline={t("heading.headline")}
          body={t("heading.body")}
        />
      </ResponsiveBox>

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
