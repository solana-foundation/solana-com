import React from "react";
import { PrivacyHackPage } from "./privacyhack";
import { getTranslations } from "next-intl/server";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations();

  const translations = {
    heroTitle: t("privacyhack.hero.title"),
    heroSubtitle: t("privacyhack.hero.subtitle"),
    heroRegisterButton: t("privacyhack.hero.registerButton"),
    heroResourcesButton: t("privacyhack.hero.resourcesButton"),

    timelineTitle: t("privacyhack.timeline.title"),
    timelinePhaseHeader: t("privacyhack.timeline.phaseHeader"),
    timelineDateHeader: t("privacyhack.timeline.dateHeader"),
    timelineEvents: [
      {
        phase: t("privacyhack.timeline.events.registration.phase"),
        date: t("privacyhack.timeline.events.registration.date"),
      },
      {
        phase: t("privacyhack.timeline.events.building.phase"),
        date: t("privacyhack.timeline.events.building.date"),
      },
      {
        phase: t("privacyhack.timeline.events.submission.phase"),
        date: t("privacyhack.timeline.events.submission.date"),
      },
      {
        phase: t("privacyhack.timeline.events.winners.phase"),
        date: t("privacyhack.timeline.events.winners.date"),
      },
    ],

    workshopsTitle: t("privacyhack.workshops.title"),
    workshops: t.raw("privacyhack.workshops.items") as Array<{
      title: string;
      date: string;
      speaker: string;
      speakerTitle: string;
      url: string;
    }>,

    requirementsTitle: t("privacyhack.requirements.title"),
    requirementsItems: t.raw("privacyhack.requirements.items") as string[],

    tracksTitle: t("privacyhack.tracks.title"),
    tracksSubtitle: t("privacyhack.tracks.subtitle"),
    tracksPrizeAmount: t("privacyhack.tracks.prizeAmount"),
    tracks: t.raw("privacyhack.tracks.items") as Array<{
      title: string;
      description: string;
      prizeAmount?: string;
      sponsor?: string;
      logo?: string;
    }>,

    sponsorBountiesTitle: t("privacyhack.sponsorBounties.title"),
    sponsorBountiesSubtitle: t("privacyhack.sponsorBounties.subtitle"),
    sponsorBounties: t.raw("privacyhack.sponsorBounties.items") as Array<{
      sponsor: string;
      logo: string;
      title: string;
      description: string;
      prizeAmount: string;
    }>,

    sponsorBannerTitle: t("privacyhack.sponsorBanner.title"),
    sponsorBannerLogos: t.raw("privacyhack.sponsorBanner.logos") as Array<{
      src: string;
      alt: string;
    }>,

    mentorsTitle: t("privacyhack.mentors.title"),
    mentorsSubtitle: t("privacyhack.mentors.subtitle"),
    mentorsComingSoon: t("privacyhack.mentors.comingSoon"),
    mentors: t.raw("privacyhack.mentors.items") as Array<{
      name: string;
      role: string;
      image: string;
      twitter: string;
    }>,

    resourcesTitle: t("privacyhack.resources.title"),
    resourcesDescription: t("privacyhack.resources.description"),
    resourcesGettingStarted: t("privacyhack.resources.gettingStarted"),
    resourcesAdvancedTopics: t("privacyhack.resources.advancedTopics"),
    resourcesLearnMore: t("privacyhack.resources.learnMore"),

    ctaEyebrow: t("privacyhack.cta.eyebrow"),
    ctaTitle: t("privacyhack.cta.title"),
    ctaDescription: t("privacyhack.cta.description"),
    ctaLabel: t("privacyhack.cta.label"),
    ctaUrl: t("privacyhack.cta.url"),

    resources: [
      {
        title: t("privacyhack.resources.items.docs.title"),
        description: t("privacyhack.resources.items.docs.description"),
        category: t("privacyhack.resources.items.docs.category"),
        url: "https://solana.com/docs",
      },
      {
        title: t("privacyhack.resources.items.templates.title"),
        description: t("privacyhack.resources.items.templates.description"),
        category: t("privacyhack.resources.items.templates.category"),
        url: "https://solana.com/templates",
      },
      {
        title: t("privacyhack.resources.items.privacyRepo.title"),
        description: t("privacyhack.resources.items.privacyRepo.description"),
        category: t("privacyhack.resources.items.privacyRepo.category"),
        url: "https://github.com/catmcgee/privacy-on-solana",
      },
    ],
  };

  return <PrivacyHackPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "privacyhack.title",
    descriptionKey: "privacyhack.description",
    path: "/privacyhack",
    locale,
  });
}
