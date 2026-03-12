"use client";

import {
  Accordion,
  Hero,
  HtmlParser,
  Section,
} from "@solana-foundation/solana-lib";

interface StakingPageProps {
  translations: {
    heroHeadline: string;
    overview: string;
    overviewSectionHeadline: string;
    overviewAccordions: { title: string; body: string }[];
    rewardsSectionHeadline: string;
    rewardsAccordions: { title: string; body: string }[];
    economicsSectionHeadline: string;
    economicsAccordions: { title: string; body: string }[];
  };
}

export function StakingPage({ translations }: StakingPageProps) {
  return (
    <>
      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        headline={translations.heroHeadline}
      />

      <Section>
        <HtmlParser rawHtml={translations.overview} />

        <Accordion
          headline={translations.overviewSectionHeadline}
          accordions={
            translations.overviewAccordions as React.ComponentProps<
              typeof Accordion
            >["accordions"]
          }
        />

        <Accordion
          headline={translations.rewardsSectionHeadline}
          accordions={
            translations.rewardsAccordions as React.ComponentProps<
              typeof Accordion
            >["accordions"]
          }
        />

        <Accordion
          headline={translations.economicsSectionHeadline}
          accordions={
            translations.economicsAccordions as React.ComponentProps<
              typeof Accordion
            >["accordions"]
          }
        />
      </Section>
    </>
  );
}
