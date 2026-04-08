"use client";

import { ResponsiveBox } from "@/component-library/responsive-box";
import { CardDeck, Heading } from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  PATH_CARD_DECK,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/cosmos";
import { AnimatedHeroSection, SectionDivider } from "./cosmos-page-shared";

export function DevelopersChainMigrationCosmosPage() {
  const t = useTranslations("developers-chain-migration-cosmos");
  const blockSpacing = { large: { marginTop: "48px" } };

  const pathCards = PATH_CARD_DECK.cards.map((card, index) => ({
    ...card,
    eyebrow: "",
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
        buttons={[
          {
            label: "Smart Contract Developers",
            url: "/developers/migrate-to-solana/cosmos/cosmwasm",
            hierarchy: "primary",
          },
          {
            label: "App Chain Developers",
            url: "/developers/migrate-to-solana/cosmos/app-chain",
            hierarchy: "outline",
          },
        ]}
        showScene={true}
      />

      <div className="cosmos-path-card-deck">
        <CardDeck
          cards={pathCards as React.ComponentProps<typeof CardDeck>["cards"]}
          numCols={
            PATH_CARD_DECK.numCols as React.ComponentProps<
              typeof CardDeck
            >["numCols"]
          }
          featured={PATH_CARD_DECK.featured}
        />
      </div>

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

      <style jsx global>{`
        .cosmos-path-card-deck
          a[href^="/developers/migrate-to-solana/cosmos/"] {
          justify-content: flex-start !important;
        }
        @media (max-width: 767px) {
          .cosmos-path-card-deck
            a[href^="/developers/migrate-to-solana/cosmos/"] {
            height: auto !important;
            min-height: 0 !important;
            padding-top: 1.25rem !important;
            padding-bottom: 1.25rem !important;
            gap: 0.875rem !important;
          }
        }
      `}</style>
    </>
  );
}
