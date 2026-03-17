"use client";

import { ResponsiveBox } from "@/component-library/responsive-box";
import { Accordion, CardDeck, Heading } from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  EVM_GUIDES_HEADING,
  PRIMARY_CARD_DECK,
} from "@/data/developers/evm-to-svm";

function GuideSectionIntro({
  id,
  eyebrow,
  headline,
  body,
  cardCount,
  borderColor = "#CA9FF5",
}: {
  id: string;
  eyebrow: string;
  headline: string;
  body: string;
  cardCount?: number;
  borderColor?: string;
}) {
  return (
    <div
      id={id}
      className="tw-max-w-screen-xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-scroll-mt-24"
    >
      <div
        className="tw-border-l-2 tw-pl-4 tw-grid tw-gap-3"
        style={{ borderColor }}
      >
        <div className="tw-flex tw-items-center tw-gap-3">
          <p className="tw-eyebrow">{eyebrow}</p>
          {cardCount !== undefined && (
            <span
              className="tw-text-xs tw-font-medium tw-px-2 tw-py-0.5 tw-rounded-full"
              style={{
                color: borderColor,
                backgroundColor: `${borderColor}1a`,
              }}
            >
              {cardCount} {cardCount === 1 ? "guide" : "guides"}
            </span>
          )}
        </div>
        <h3 className="tw-font-medium tw-text-display-xs md:tw-text-display-md tw-text-pretty">
          {headline}
        </h3>
        <p className="tw-text-lg tw-text-gray-300 tw-text-pretty">{body}</p>
      </div>
    </div>
  );
}

export function DevelopersEvmToSvmPage() {
  const t = useTranslations("developers-evm-to-svm");
  const blockSpacing = { large: { marginTop: "48px" } };

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

  return (
    <>
      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Heading
          variant={EVM_GUIDES_HEADING.variant as "floatingButton"}
          eyebrow={t("evmGuidesHeading.eyebrow")}
          headline={t("evmGuidesHeading.headline")}
          body={t("evmGuidesHeading.body")}
        />
      </ResponsiveBox>

      {evmGuideSections.map((section) => (
        <div key={section.id}>
          <ResponsiveBox responsiveStyles={blockSpacing}>
            <GuideSectionIntro
              id={section.id}
              eyebrow={section.eyebrow}
              headline={section.headline}
              body={section.body}
              cardCount={section.cards.length}
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

      <ResponsiveBox responsiveStyles={{ large: { minHeight: "100px" } }}>
        <Accordion
          accordions={evmFaqItems}
          headline={t("faq.evm.headline")}
          eyebrow={t("faq.evm.eyebrow")}
        />
      </ResponsiveBox>
    </>
  );
}
