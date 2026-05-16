import React from "react";
import { PredictionMarketsHackPage } from "./prediction-markets-hack";
import { getTranslations } from "next-intl/server";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations();

  const translations = {
    heroTitle: t("predictionMarketsHack.hero.title"),
    heroSubtitle1: t("predictionMarketsHack.hero.subtitle1"),
    heroSubtitle2: t("predictionMarketsHack.hero.subtitle2"),
    heroHeading: t("predictionMarketsHack.hero.heroHeading"),
    heroDescription: t("predictionMarketsHack.hero.heroDescription"),
    heroRegisterButton: t("predictionMarketsHack.hero.registerButton"),
    heroResourcesButton: t("predictionMarketsHack.hero.resourcesButton"),

    timelineTitle: t("predictionMarketsHack.timeline.title"),
    timelinePhaseHeader: t("predictionMarketsHack.timeline.phaseHeader"),
    timelineDateHeader: t("predictionMarketsHack.timeline.dateHeader"),
    timelineEvents: [
      {
        phase: t("predictionMarketsHack.timeline.events.kickoff.phase"),
        date: t("predictionMarketsHack.timeline.events.kickoff.date"),
      },
      {
        phase: t("predictionMarketsHack.timeline.events.building.phase"),
        date: t("predictionMarketsHack.timeline.events.building.date"),
      },
      {
        phase: t("predictionMarketsHack.timeline.events.winners.phase"),
        date: t("predictionMarketsHack.timeline.events.winners.date"),
      },
    ],

    prizesTitle: t("predictionMarketsHack.prizes.title"),
    prizesSubtitle: t("predictionMarketsHack.prizes.subtitle"),
    overallPrizesTitle: t("predictionMarketsHack.overallPrizes.title"),
    overallPrizesSubtitle: t("predictionMarketsHack.overallPrizes.subtitle"),
    overallPrizes: t.raw("predictionMarketsHack.overallPrizes.items") as Array<{
      place: string;
      prize: string;
      sponsor: string;
    }>,
    sponsorBountiesTitle: t("predictionMarketsHack.sponsorBounties.title"),
    sponsorBountiesSubtitle: t(
      "predictionMarketsHack.sponsorBounties.subtitle",
    ),
    sponsorBountiesDisclaimer: t(
      "predictionMarketsHack.sponsorBounties.disclaimer",
    ),
    sponsorBounties: t.raw(
      "predictionMarketsHack.sponsorBounties.items",
    ) as Array<{
      sponsor: string;
      title: string;
      description: string;
      prizeAmount: string;
      logo?: string;
      url?: string;
    }>,
    addBountyText: t("predictionMarketsHack.sponsorBounties.addBountyText"),

    resourcesTitle: t("predictionMarketsHack.resources.title"),
    resourcesDescription: t("predictionMarketsHack.resources.description"),
    resourcesLearnMore: t("predictionMarketsHack.resources.learnMore"),
    resources: [
      {
        title: t("predictionMarketsHack.resources.items.docs.title"),
        description: t(
          "predictionMarketsHack.resources.items.docs.description",
        ),
        category: t("predictionMarketsHack.resources.items.docs.category"),
        url: "https://solana.com/docs",
      },
      {
        title: t("predictionMarketsHack.resources.items.templates.title"),
        description: t(
          "predictionMarketsHack.resources.items.templates.description",
        ),
        category: t("predictionMarketsHack.resources.items.templates.category"),
        url: "https://solana.com/developers/templates",
      },
      {
        title: t("predictionMarketsHack.resources.items.aiTooling.title"),
        description: t(
          "predictionMarketsHack.resources.items.aiTooling.description",
        ),
        category: t("predictionMarketsHack.resources.items.aiTooling.category"),
        url: "https://solana.com/SKILL.md",
      },
    ],

    requirementsTitle: t("predictionMarketsHack.requirements.title"),
    requirementsItems: t.raw(
      "predictionMarketsHack.requirements.items",
    ) as string[],

    ctaEyebrow: t("predictionMarketsHack.cta.eyebrow"),
    ctaTitle: t("predictionMarketsHack.cta.title"),
    ctaDescription: t("predictionMarketsHack.cta.description"),
    ctaLabel: t("predictionMarketsHack.cta.label"),
    ctaUrl: t("predictionMarketsHack.cta.url"),
  };

  return <PredictionMarketsHackPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "predictionMarketsHack.title",
    descriptionKey: "predictionMarketsHack.description",
    path: "/prediction-markets-hack",
    locale,
  });
}
