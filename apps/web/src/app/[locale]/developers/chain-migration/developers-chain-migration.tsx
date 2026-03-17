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
  COSMOS_CARD_DECK,
  COSMOS_GUIDES_HEADING,
  EVM_GUIDES_HEADING,
  HERO_BUTTONS,
  PRIMARY_CARD_DECK,
  SECONDARY_CARD_DECK,
} from "@/data/developers/evm-to-svm";

const FeatureHighlightAny = FeatureHighlight as any;

function GuideSectionIntro({
  id,
  eyebrow,
  headline,
  body,
}: {
  id: string;
  eyebrow: string;
  headline: string;
  body: string;
}) {
  return (
    <div
      id={id}
      className="tw-max-w-screen-xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-grid tw-gap-3 tw-scroll-mt-24"
    >
      <p className="tw-eyebrow">{eyebrow}</p>
      <h3 className="tw-font-medium tw-text-display-xs md:tw-text-display-md tw-text-pretty">
        {headline}
      </h3>
      <p className="tw-text-lg tw-text-gray-300 tw-text-pretty">{body}</p>
    </div>
  );
}

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

  const evmGuideSections = [
    {
      id: "evm-foundations",
      eyebrow: t("evmGuideSections.foundations.eyebrow"),
      headline: t("evmGuideSections.foundations.headline"),
      body: t("evmGuideSections.foundations.body"),
      cards: [
        primaryCards[0],
        primaryCards[8],
        primaryCards[9],
        primaryCards[10],
      ],
    },
    {
      id: "evm-token-standards",
      eyebrow: t("evmGuideSections.tokenStandards.eyebrow"),
      headline: t("evmGuideSections.tokenStandards.headline"),
      body: t("evmGuideSections.tokenStandards.body"),
      cards: [
        primaryCards[1],
        primaryCards[2],
        primaryCards[4],
        primaryCards[5],
        primaryCards[6],
      ],
    },
    {
      id: "evm-advanced-patterns",
      eyebrow: t("evmGuideSections.advancedPatterns.eyebrow"),
      headline: t("evmGuideSections.advancedPatterns.headline"),
      body: t("evmGuideSections.advancedPatterns.body"),
      cards: [primaryCards[3], primaryCards[7]],
    },
  ];

  const evmFaqItems = Array.from({ length: 2 }, (_, i) => ({
    title: t(`faq.evm.accordions.${i}.title`),
    body: t.raw(`faq.evm.accordions.${i}.body`),
  }));

  const cosmosFaqItems = Array.from({ length: 2 }, (_, i) => ({
    title: t(`faq.cosmos.accordions.${i}.title`),
    body: t.raw(`faq.cosmos.accordions.${i}.body`),
  }));

  const secondaryCards = SECONDARY_CARD_DECK.cards.map((card, index) => ({
    ...card,
    eyebrow: t(`secondaryCardDeck.cards.${index}.eyebrow`),
    heading: t(`secondaryCardDeck.cards.${index}.heading`),
    body: t(`secondaryCardDeck.cards.${index}.body`),
  }));

  const cosmosCards = COSMOS_CARD_DECK.cards.map((card, index) => ({
    ...card,
    eyebrow: t(`cosmosCardDeck.cards.${index}.eyebrow`),
    heading: t(`cosmosCardDeck.cards.${index}.heading`),
    body: t(`cosmosCardDeck.cards.${index}.body`),
    callToAction: {
      ...card.callToAction,
      label: t(`cosmosCardDeck.cards.${index}.callToAction.label`),
    },
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
        <div id="evm-guides" className="tw-scroll-mt-24">
          <Heading
            variant={EVM_GUIDES_HEADING.variant as "floatingButton"}
            eyebrow={t("evmGuidesHeading.eyebrow")}
            headline={t("evmGuidesHeading.headline")}
            body={t("evmGuidesHeading.body")}
          />
        </div>
      </ResponsiveBox>

      {evmGuideSections.map((section) => (
        <div key={section.id}>
          <ResponsiveBox responsiveStyles={blockSpacing}>
            <GuideSectionIntro
              id={section.id}
              eyebrow={section.eyebrow}
              headline={section.headline}
              body={section.body}
            />
          </ResponsiveBox>

          <CardDeck
            cards={
              section.cards as React.ComponentProps<typeof CardDeck>["cards"]
            }
            numCols={
              PRIMARY_CARD_DECK.numCols as React.ComponentProps<
                typeof CardDeck
              >["numCols"]
            }
            featured={section.cards.some((card) => Boolean(card?.isFeatured))}
          />
        </div>
      ))}

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <div id="cosmos-guide" className="tw-scroll-mt-24">
          <Heading
            variant={COSMOS_GUIDES_HEADING.variant as "floatingButton"}
            eyebrow={t("cosmosGuidesHeading.eyebrow")}
            headline={t("cosmosGuidesHeading.headline")}
            body={t("cosmosGuidesHeading.body")}
          />
        </div>
      </ResponsiveBox>

      <CardDeck
        cards={cosmosCards as React.ComponentProps<typeof CardDeck>["cards"]}
        numCols={
          COSMOS_CARD_DECK.numCols as React.ComponentProps<
            typeof CardDeck
          >["numCols"]
        }
        featured={COSMOS_CARD_DECK.featured}
      />

      <ResponsiveBox responsiveStyles={{ large: { minHeight: "100px" } }}>
        <Accordion
          accordions={evmFaqItems}
          headline={t("faq.evm.headline")}
          eyebrow={t("faq.evm.eyebrow")}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Accordion
          accordions={cosmosFaqItems}
          headline={t("faq.cosmos.headline")}
          eyebrow={t("faq.cosmos.eyebrow")}
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
