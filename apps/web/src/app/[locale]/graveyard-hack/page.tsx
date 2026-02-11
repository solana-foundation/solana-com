import React from "react";
import { GraveyardHackPage } from "./graveyard-hack";
import { getTranslations } from "next-intl/server";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations();

  const translations = {
    heroTitle: t("graveyardHack.hero.title"),
    heroSubtitle1: t("graveyardHack.hero.subtitle1"),
    heroSubtitle2: t("graveyardHack.hero.subtitle2"),
    heroHeading: t("graveyardHack.hero.heroHeading"),
    heroDescription: t("graveyardHack.hero.heroDescription"),
    heroRegisterButton: t("graveyardHack.hero.registerButton"),
    heroResourcesButton: t("graveyardHack.hero.resourcesButton"),

    timelineTitle: t("graveyardHack.timeline.title"),
    timelinePhaseHeader: t("graveyardHack.timeline.phaseHeader"),
    timelineDateHeader: t("graveyardHack.timeline.dateHeader"),
    timelineEvents: [
      {
        phase: t("graveyardHack.timeline.events.kickoff.phase"),
        date: t("graveyardHack.timeline.events.kickoff.date"),
      },
      {
        phase: t("graveyardHack.timeline.events.building.phase"),
        date: t("graveyardHack.timeline.events.building.date"),
      },
      {
        phase: t("graveyardHack.timeline.events.submission.phase"),
        date: t("graveyardHack.timeline.events.submission.date"),
      },
      {
        phase: t("graveyardHack.timeline.events.winners.phase"),
        date: t("graveyardHack.timeline.events.winners.date"),
      },
    ],

    prizesTitle: t("graveyardHack.prizes.title"),
    prizesSubtitle: t("graveyardHack.prizes.subtitle"),
    overallPrizesTitle: t("graveyardHack.overallPrizes.title"),
    overallPrizesSubtitle: t("graveyardHack.overallPrizes.subtitle"),
    overallPrizes: t.raw("graveyardHack.overallPrizes.items") as Array<{
      place: string;
      prize: string;
      sponsor: string;
    }>,
    sponsorBountiesTitle: t("graveyardHack.sponsorBounties.title"),
    sponsorBountiesSubtitle: t("graveyardHack.sponsorBounties.subtitle"),
    sponsorBounties: t.raw("graveyardHack.sponsorBounties.items") as Array<{
      sponsor: string;
      title: string;
      description: string;
      prizeAmount: string;
      logo?: string;
    }>,

    sponsorBannerTitle: t("graveyardHack.sponsorBanner.title"),
    sponsorLogos: t.raw("graveyardHack.sponsorBanner.logos") as Array<{
      name: string;
      src: string;
    }>,

    resourcesTitle: t("graveyardHack.resources.title"),
    resourcesDescription: t("graveyardHack.resources.description"),
    resourcesLearnMore: t("graveyardHack.resources.learnMore"),
    resources: [
      {
        title: t("graveyardHack.resources.items.docs.title"),
        description: t("graveyardHack.resources.items.docs.description"),
        category: t("graveyardHack.resources.items.docs.category"),
        url: "https://solana.com/docs",
      },
      {
        title: t("graveyardHack.resources.items.templates.title"),
        description: t("graveyardHack.resources.items.templates.description"),
        category: t("graveyardHack.resources.items.templates.category"),
        url: "https://solana.com/developers/templates",
      },
      {
        title: t("graveyardHack.resources.items.aiTooling.title"),
        description: t("graveyardHack.resources.items.aiTooling.description"),
        category: t("graveyardHack.resources.items.aiTooling.category"),
        url: "https://solana.com/SKILL.md",
      },
    ],

    requirementsTitle: t("graveyardHack.requirements.title"),
    requirementsItems: t.raw("graveyardHack.requirements.items") as string[],

    ctaEyebrow: t("graveyardHack.cta.eyebrow"),
    ctaTitle: t("graveyardHack.cta.title"),
    ctaDescription: t("graveyardHack.cta.description"),
    ctaLabel: t("graveyardHack.cta.label"),
    ctaUrl: t("graveyardHack.cta.url"),

    telegram: t("graveyardHack.telegram"),
  };

  return <GraveyardHackPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "graveyardHack.title",
    descriptionKey: "graveyardHack.description",
    path: "/graveyard-hack",
    locale,
  });
}
