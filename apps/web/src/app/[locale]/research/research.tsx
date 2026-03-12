"use client";

import { Columns } from "@/component-library/columns";
import {
  CardDeck,
  ConversionPanel,
  Heading,
  RichTextStat,
  Section,
  Switchback,
} from "@solana-foundation/solana-lib";
import {
  ADDITIONAL_CARD_DECK,
  CONVERSION_PANEL,
  ENERGY_CARD_DECK,
  ENERGY_SWITCHBACK,
  HERO_SWITCHBACK,
  PERFORMANCE_CARD_DECK,
  PERFORMANCE_SWITCHBACK,
  VALIDATOR_CARD_DECK,
  VALIDATOR_SWITCHBACK,
} from "@/data/research";

interface ResearchPageProps {
  translations: {
    heroHeadline: string;
    heroBody: string;
    heroButtons: string[];
    validatorHeadline: string;
    validatorBody: string;
    validatorButtonLabel: string;
    validatorStats: { stat: string; description: string }[];
    validatorCards: {
      eyebrow: string;
      heading: string;
      body: string;
      ctaLabel: string;
    }[];
    energyHeadline: string;
    energyBody: string;
    energyButtonLabel: string;
    energyStats: { stat: string; description: string }[];
    energyCards: {
      eyebrow: string;
      heading: string;
      body: string;
      ctaLabel: string;
    }[];
    performanceHeadline: string;
    performanceBody: string;
    performanceButtonLabel: string;
    performanceStats: { stat: string; description: string }[];
    performanceCards: {
      eyebrow: string;
      heading: string;
      body: string;
      ctaLabel: string;
    }[];
    additionalCards: { eyebrow: string; heading: string; ctaLabel: string }[];
    additionalResearchEyebrow: string;
    additionalResearchHeadline: string;
    additionalResearchBody: string;
    conversionPanelHeading: string;
    conversionPanelBody: string;
    conversionPanelButtons: string[];
  };
}

export function ResearchPage({ translations }: ResearchPageProps) {
  const heroButtons = HERO_SWITCHBACK.buttons.map((button, index) => ({
    ...button,
    label: translations.heroButtons[index],
  }));

  const validatorButtons = VALIDATOR_SWITCHBACK.buttons.map((button) => ({
    ...button,
    label: translations.validatorButtonLabel,
  }));

  const energyButtons = ENERGY_SWITCHBACK.buttons.map((button) => ({
    ...button,
    label: translations.energyButtonLabel,
  }));

  const performanceButtons = PERFORMANCE_SWITCHBACK.buttons.map((button) => ({
    ...button,
    label: translations.performanceButtonLabel,
  }));

  const validatorCards = VALIDATOR_CARD_DECK.cards.map((card, index) => ({
    ...card,
    eyebrow: translations.validatorCards[index]?.eyebrow ?? "",
    heading: translations.validatorCards[index]?.heading ?? "",
    body: translations.validatorCards[index]?.body ?? "",
    callToAction: {
      ...card.callToAction,
      label: translations.validatorCards[index]?.ctaLabel ?? "",
    },
  }));

  const energyCards = ENERGY_CARD_DECK.cards.map((card, index) => ({
    ...card,
    eyebrow: translations.energyCards[index]?.eyebrow ?? "",
    heading: translations.energyCards[index]?.heading ?? "",
    body: translations.energyCards[index]?.body ?? "",
    callToAction: {
      ...card.callToAction,
      label: translations.energyCards[index]?.ctaLabel ?? "",
    },
  }));

  const performanceCards = PERFORMANCE_CARD_DECK.cards.map((card, index) => ({
    ...card,
    eyebrow: translations.performanceCards[index]?.eyebrow ?? "",
    heading: translations.performanceCards[index]?.heading ?? "",
    body: translations.performanceCards[index]?.body ?? "",
    callToAction: {
      ...card.callToAction,
      label: translations.performanceCards[index]?.ctaLabel ?? "",
    },
  }));

  const additionalCards = ADDITIONAL_CARD_DECK.cards.map((card, index) => ({
    ...card,
    eyebrow: translations.additionalCards[index]?.eyebrow ?? "",
    heading: translations.additionalCards[index]?.heading ?? "",
    callToAction: {
      ...card.callToAction,
      label: translations.additionalCards[index]?.ctaLabel ?? "",
    },
  }));

  const conversionButtons = CONVERSION_PANEL.buttons.map((button, index) => ({
    ...button,
    label: translations.conversionPanelButtons[index],
  }));

  return (
    <>
      <Switchback
        assetSide={HERO_SWITCHBACK.assetSide as "left" | "right"}
        image={HERO_SWITCHBACK.image}
        headline={translations.heroHeadline}
        body={translations.heroBody}
        buttons={
          heroButtons as React.ComponentProps<typeof Switchback>["buttons"]
        }
        placeholder={HERO_SWITCHBACK.placeholder}
        emailError={HERO_SWITCHBACK.emailError}
        submitError={HERO_SWITCHBACK.submitError}
        successMessage={HERO_SWITCHBACK.successMessage}
      />

      <Section className="tw-max-w-screen-xl tw-mx-auto">
        <Columns space={30} stackColumnsAt="tablet">
          <Switchback
            assetSide={VALIDATOR_SWITCHBACK.assetSide as "left" | "right"}
            headline={translations.validatorHeadline}
            body={translations.validatorBody}
            buttons={
              validatorButtons as React.ComponentProps<
                typeof Switchback
              >["buttons"]
            }
            placeholder={VALIDATOR_SWITCHBACK.placeholder}
            emailError={VALIDATOR_SWITCHBACK.emailError}
            submitError={VALIDATOR_SWITCHBACK.submitError}
            successMessage={VALIDATOR_SWITCHBACK.successMessage}
          />
          <RichTextStat stats={translations.validatorStats} />
        </Columns>
      </Section>

      <CardDeck
        featured={VALIDATOR_CARD_DECK.featured}
        cards={validatorCards as React.ComponentProps<typeof CardDeck>["cards"]}
        numCols={
          VALIDATOR_CARD_DECK.numCols as React.ComponentProps<
            typeof CardDeck
          >["numCols"]
        }
      />

      <Section className="tw-max-w-screen-xl tw-mx-auto">
        <Columns space={30} stackColumnsAt="tablet">
          <RichTextStat stats={translations.energyStats} />
          <Switchback
            assetSide={ENERGY_SWITCHBACK.assetSide as "left" | "right"}
            headline={translations.energyHeadline}
            body={translations.energyBody}
            buttons={
              energyButtons as React.ComponentProps<
                typeof Switchback
              >["buttons"]
            }
            placeholder={ENERGY_SWITCHBACK.placeholder}
            emailError={ENERGY_SWITCHBACK.emailError}
            submitError={ENERGY_SWITCHBACK.submitError}
            successMessage={ENERGY_SWITCHBACK.successMessage}
          />
        </Columns>
      </Section>

      <CardDeck
        featured={ENERGY_CARD_DECK.featured}
        cards={energyCards as React.ComponentProps<typeof CardDeck>["cards"]}
        numCols={
          ENERGY_CARD_DECK.numCols as React.ComponentProps<
            typeof CardDeck
          >["numCols"]
        }
      />

      <Section className="tw-max-w-screen-xl tw-mx-auto">
        <Columns space={30} stackColumnsAt="tablet">
          <Switchback
            assetSide={PERFORMANCE_SWITCHBACK.assetSide as "left" | "right"}
            headline={translations.performanceHeadline}
            body={translations.performanceBody}
            buttons={
              performanceButtons as React.ComponentProps<
                typeof Switchback
              >["buttons"]
            }
            placeholder={PERFORMANCE_SWITCHBACK.placeholder}
            emailError={PERFORMANCE_SWITCHBACK.emailError}
            submitError={PERFORMANCE_SWITCHBACK.submitError}
            successMessage={PERFORMANCE_SWITCHBACK.successMessage}
          />
          <RichTextStat stats={translations.performanceStats} />
        </Columns>
      </Section>

      <CardDeck
        featured={PERFORMANCE_CARD_DECK.featured}
        cards={
          performanceCards as React.ComponentProps<typeof CardDeck>["cards"]
        }
        numCols={
          PERFORMANCE_CARD_DECK.numCols as React.ComponentProps<
            typeof CardDeck
          >["numCols"]
        }
      />

      <Heading
        eyebrow={translations.additionalResearchEyebrow}
        headline={translations.additionalResearchHeadline}
        body={translations.additionalResearchBody}
      />

      <CardDeck
        cards={
          additionalCards as React.ComponentProps<typeof CardDeck>["cards"]
        }
        numCols={
          ADDITIONAL_CARD_DECK.numCols as React.ComponentProps<
            typeof CardDeck
          >["numCols"]
        }
      />

      <ConversionPanel
        variant={CONVERSION_PANEL.variant as "centered"}
        heading={translations.conversionPanelHeading}
        body={translations.conversionPanelBody}
        buttons={conversionButtons as any}
      />
    </>
  );
}
