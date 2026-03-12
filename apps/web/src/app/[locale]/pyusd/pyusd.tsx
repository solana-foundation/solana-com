"use client";

import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  CardDeck,
  Heading,
  Hero,
  Section,
  Slider,
} from "@solana-foundation/solana-lib";
import {
  HERO_BUTTONS,
  PRIMARY_CARD_DECK_CARDS,
  PRIMARY_CARD_DECK_COLUMNS,
  SECONDARY_CARD_DECK_CARDS,
  SECONDARY_CARD_DECK_COLUMNS,
  SLIDER_CARDS,
} from "@/data/pyusd";

interface PyusdPageProps {
  translations: {
    heroEyebrow: string;
    heroHeadline: string;
    heroBody: string;
    heroButtons: string[];
    primaryCards: {
      eyebrow: string;
      heading: string;
      body: string;
      ctaLabel: string;
    }[];
    sliderCards: {
      title: string;
      body: string;
      ctaLabel: string;
    }[];
    learnSectionEyebrow: string;
    learnSectionHeadline: string;
    learnSectionBody: string;
    secondaryCards: {
      heading: string;
      ctaLabel: string;
    }[];
  };
}

export function PyusdPage({ translations }: PyusdPageProps) {
  const heroButtons = HERO_BUTTONS.map((button, index) => ({
    ...button,
    label: translations.heroButtons[index],
  }));

  const primaryCards = PRIMARY_CARD_DECK_CARDS.map((card, index) => ({
    ...card,
    eyebrow: translations.primaryCards[index]?.eyebrow ?? "",
    heading: translations.primaryCards[index]?.heading ?? "",
    body: translations.primaryCards[index]?.body ?? "",
    callToAction: {
      ...card.callToAction,
      label: translations.primaryCards[index]?.ctaLabel ?? "",
    },
  }));

  const sliderCards = SLIDER_CARDS.map((card, index) => ({
    ...card,
    title: translations.sliderCards[index]?.title ?? "",
    body: translations.sliderCards[index]?.body ?? "",
    button: {
      ...card.button,
      label: translations.sliderCards[index]?.ctaLabel ?? "",
    },
  }));

  const secondaryCards = SECONDARY_CARD_DECK_CARDS.map((card, index) => ({
    ...card,
    heading: translations.secondaryCards[index]?.heading ?? "",
    callToAction: {
      ...card.callToAction,
      label: translations.secondaryCards[index]?.ctaLabel ?? "",
    },
  }));

  return (
    <>
      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        eyebrow={translations.heroEyebrow}
        headline={translations.heroHeadline}
        body={translations.heroBody}
        buttons={heroButtons as React.ComponentProps<typeof Hero>["buttons"]}
      />

      <CardDeck
        featured={true}
        cards={primaryCards as React.ComponentProps<typeof CardDeck>["cards"]}
        numCols={PRIMARY_CARD_DECK_COLUMNS}
      />

      <Slider
        cards={sliderCards as React.ComponentProps<typeof Slider>["cards"]}
      />

      <Section>
        <ResponsiveBox
          responsiveStyles={{
            large: { marginBottom: "-90px" },
            medium: { marginBottom: "-45px" },
          }}
        >
          <Heading
            eyebrow={translations.learnSectionEyebrow}
            headline={translations.learnSectionHeadline}
            body={translations.learnSectionBody}
          />
        </ResponsiveBox>

        <CardDeck
          featured={true}
          cards={
            secondaryCards as React.ComponentProps<typeof CardDeck>["cards"]
          }
          numCols={SECONDARY_CARD_DECK_COLUMNS}
        />
      </Section>
    </>
  );
}
