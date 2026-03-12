"use client";

import {
  CASE_STUDIES_PANEL,
  CTA_CARD_COLUMNS,
  CTA_CARDS,
  DEVELOPER_ECOSYSTEM_PANEL,
  FEATURE_HIGHLIGHT_CARDS,
  FEATURE_HIGHLIGHT_CONFIG,
  HERO_BUTTON,
  HERO_IMAGE,
  RESEARCH_CARD_COLUMNS,
  RESEARCH_CARDS,
  SWITCHBACK,
  VIDEO_CARD_COLUMNS,
  VIDEO_CARD_CTA,
  VIDEO_CARD_IMAGES,
} from "../../../data/2024outlook";
import {
  CardDeck,
  ConversionPanel,
  FeatureHighlight,
  Heading,
  Hero,
  Switchback,
} from "@solana-foundation/solana-lib";

const FeatureHighlightAny = FeatureHighlight as any;

interface Outlook2024PageProps {
  translations: {
    heroEyebrow: string;
    heroHeadline: string;
    heroBody: string;
    heroButtonLabel: string;
    featureHighlightHeadline: string;
    featureHighlightBody: string;
    featureHighlightCards: string[];
    devEcosystemHeading: string;
    devEcosystemBody: string;
    devEcosystemButtonLabel: string;
    researchHeadings: string[];
    researchBodies: string[];
    ctaHeadings: string[];
    videoHeadings: string[];
    caseStudiesHeading: string;
    caseStudiesBody: string;
    caseStudiesLabels: string[];
    headingEyebrow: string;
    headingHeadline: string;
    headingBody: string;
    switchbackHeadline: string;
    switchbackBody: string;
    switchbackButtons: string[];
    buttonsRead: string;
    buttonsReadUpper: string;
    buttonsWatch: string;
  };
}

export function Outlook2024Page({ translations }: Outlook2024PageProps) {
  const featureCards = translations.featureHighlightCards.map(
    (feature, index) => ({
      feature,
      body: "",
      ...FEATURE_HIGHLIGHT_CARDS[index],
    }),
  );
  const researchCards = translations.researchHeadings.map(
    (headingText, index) => ({
      ...RESEARCH_CARDS[index],
      heading: headingText,
      body: translations.researchBodies[index],
      callToAction: {
        ...RESEARCH_CARDS[index].callToAction,
        label: translations.buttonsReadUpper,
      },
    }),
  );
  const ctaCards = translations.ctaHeadings.map((headingText, index) => ({
    ...CTA_CARDS[index],
    heading: headingText,
    callToAction: {
      ...CTA_CARDS[index].callToAction,
      label: translations.buttonsRead,
    },
  }));
  const videoCards = translations.videoHeadings.map((headingText, index) => ({
    type: "image",
    headingAs: "h3",
    heading: headingText,
    callToAction: {
      ...VIDEO_CARD_CTA[index],
      label: translations.buttonsWatch,
    },
    backgroundImage: {
      src: VIDEO_CARD_IMAGES[index],
    },
    isFeatured: false,
  }));
  const caseStudyItems = CASE_STUDIES_PANEL.listItems.map((item, index) => ({
    ...item,
    label: translations.caseStudiesLabels[index],
  }));
  const switchbackButtons = SWITCHBACK.buttons.map((button, index) => ({
    ...button,
    label: translations.switchbackButtons[index],
  }));
  const heroButtons = [
    {
      ...HERO_BUTTON,
      label: translations.heroButtonLabel,
    },
  ];

  return (
    <>
      <Hero
        headingAs="h1"
        centered={false}
        body={translations.heroBody}
        newsLetter={false}
        eyebrow={translations.heroEyebrow}
        headline={translations.heroHeadline}
        buttons={heroButtons as any}
        image={{
          alt: translations.heroHeadline,
          src: HERO_IMAGE,
        }}
      />

      <FeatureHighlightAny
        headline={translations.featureHighlightHeadline}
        body={translations.featureHighlightBody}
        headingAs={FEATURE_HIGHLIGHT_CONFIG.headingAs}
        cards={featureCards}
      />

      <ConversionPanel
        variant={DEVELOPER_ECOSYSTEM_PANEL.variant as any}
        heading={translations.devEcosystemHeading}
        body={translations.devEcosystemBody}
        buttons={
          DEVELOPER_ECOSYSTEM_PANEL.buttons.map((button) => ({
            ...button,
            label: translations.devEcosystemButtonLabel,
          })) as any
        }
        listItems={[]}
      />

      <CardDeck cards={researchCards as any} numCols={RESEARCH_CARD_COLUMNS} />

      <CardDeck cards={ctaCards as any} numCols={CTA_CARD_COLUMNS} />

      <ConversionPanel
        variant={CASE_STUDIES_PANEL.variant as any}
        heading={translations.caseStudiesHeading}
        body={translations.caseStudiesBody}
        buttons={[]}
        listItems={caseStudyItems as any}
      />

      <Heading
        eyebrow={translations.headingEyebrow}
        headline={translations.headingHeadline}
        body={translations.headingBody}
      />

      <CardDeck cards={videoCards as any} numCols={VIDEO_CARD_COLUMNS} />

      <Switchback
        assetSide={SWITCHBACK.assetSide as any}
        headline={translations.switchbackHeadline}
        body={translations.switchbackBody}
        buttons={switchbackButtons as any}
      />
    </>
  );
}
