"use client";

import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  CardDeck,
  FeatureHighlight,
  Heading,
  Hero,
} from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  CHAIN_SELECTOR,
  CHAIN_SELECTOR_CARDS,
  SECONDARY_CARD_DECK,
} from "@/data/developers/evm-to-svm";

const FeatureHighlightAny = FeatureHighlight as any;

function SectionDivider() {
  return (
    <div className="tw-max-w-screen-xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-my-10">
      <div className="tw-border-t tw-border-white/10" />
    </div>
  );
}

export function DevelopersChainMigrationPage() {
  const t = useTranslations("developers-evm-to-svm");
  const blockSpacing = { large: { marginTop: "48px" } };

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
          buttons={[]}
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

      <SectionDivider />

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <div id="resources" className="tw-scroll-mt-24">
          <Heading
            eyebrow={t("heading.eyebrow")}
            headline={t("heading.headline")}
            body={t("heading.body")}
          />
        </div>
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
