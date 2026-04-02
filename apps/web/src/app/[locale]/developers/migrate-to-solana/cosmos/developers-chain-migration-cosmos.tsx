"use client";

import { ResponsiveBox } from "@/component-library/responsive-box";
import { CardDeck, Heading } from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  PATH_CARD_DECK,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/cosmos";
import {
  AnimatedHeroSection,
  SectionDivider,
  type HeroButton,
} from "./cosmos-page-shared";

export function DevelopersChainMigrationCosmosPage() {
  const t = useTranslations("developers-chain-migration-cosmos");
  const blockSpacing = { large: { marginTop: "48px" } };

  const heroButtons: HeroButton[] = [
    {
      hierarchy: "primary",
      label: t("hero.buttons.0.label"),
      url: "/developers/migrate-to-solana/cosmos/cosmwasm",
    },
    {
      hierarchy: "outline",
      label: t("hero.buttons.1.label"),
      url: "/developers/migrate-to-solana/cosmos/app-chain",
    },
  ];

  const pathCards = PATH_CARD_DECK.cards.map((card, index) => ({
    ...card,
    eyebrow: t(`pathCardDeck.cards.${index}.eyebrow`),
    heading: t(`pathCardDeck.cards.${index}.heading`),
    body: t(`pathCardDeck.cards.${index}.body`),
    callToAction: {
      ...card.callToAction,
      label: t(`pathCardDeck.cards.${index}.callToAction.label`),
    },
  }));

  const resourceCards = RESOURCE_CARD_DECK.cards.map((card, index) => ({
    ...card,
    heading: t(`resourceCardDeck.cards.${index}.heading`),
    body: t(`resourceCardDeck.cards.${index}.body`),
    callToAction: {
      ...card.callToAction,
      label: t(`resourceCardDeck.cards.${index}.callToAction.label`),
    },
  }));

  return (
    <>
      <AnimatedHeroSection
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
        buttons={heroButtons}
      />

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Heading
          eyebrow={t("pathHeading.eyebrow")}
          headline={t("pathHeading.headline")}
          body={t("pathHeading.body")}
        />
      </ResponsiveBox>

      <CardDeck
        cards={pathCards as React.ComponentProps<typeof CardDeck>["cards"]}
        numCols={
          PATH_CARD_DECK.numCols as React.ComponentProps<
            typeof CardDeck
          >["numCols"]
        }
        featured={PATH_CARD_DECK.featured}
      />

      <SectionDivider />

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Heading
          eyebrow={t("resourceHeading.eyebrow")}
          headline={t("resourceHeading.headline")}
          body={t("resourceHeading.body")}
        />
      </ResponsiveBox>

      <CardDeck
        cards={resourceCards as React.ComponentProps<typeof CardDeck>["cards"]}
        numCols={
          RESOURCE_CARD_DECK.numCols as React.ComponentProps<
            typeof CardDeck
          >["numCols"]
        }
        featured={RESOURCE_CARD_DECK.featured}
      />
    </>
  );
}
