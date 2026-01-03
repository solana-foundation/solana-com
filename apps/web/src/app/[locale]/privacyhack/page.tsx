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
    timelineDescriptionHeader: undefined,
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

    prerequisitesTitle: t("privacyhack.prerequisites.title"),
    privacyIntroTitle: t("privacyhack.prerequisites.privacyIntro.title"),
    privacyIntroDescription: t(
      "privacyhack.prerequisites.privacyIntro.description",
    ),
    privacyIntroCta: t("privacyhack.prerequisites.privacyIntro.cta"),
    solanaTitle: t("privacyhack.prerequisites.solana.title"),
    solanaDescription: t("privacyhack.prerequisites.solana.description"),
    solanaCta: t("privacyhack.prerequisites.solana.cta"),
    zkTitle: t("privacyhack.prerequisites.zkCompression.title"),
    zkDescription: t("privacyhack.prerequisites.zkCompression.description"),
    zkCta: t("privacyhack.prerequisites.zkCompression.cta"),

    problemTitle: t("privacyhack.problem.title"),
    problemDescription: t("privacyhack.problem.description"),

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
        title: t("privacyhack.resources.items.privacyDocs.title"),
        description: t("privacyhack.resources.items.privacyDocs.description"),
        category: t("privacyhack.resources.items.privacyDocs.category"),
        url: "https://solana.com/developers/guides",
      },
      {
        title: t("privacyhack.resources.items.zkCompression.title"),
        description: t("privacyhack.resources.items.zkCompression.description"),
        category: t("privacyhack.resources.items.zkCompression.category"),
        url: "https://www.zkcompression.com/",
      },
      {
        title: t("privacyhack.resources.items.lightProtocol.title"),
        description: t("privacyhack.resources.items.lightProtocol.description"),
        category: t("privacyhack.resources.items.lightProtocol.category"),
        url: "https://www.lightprotocol.com/",
      },
      {
        title: t("privacyhack.resources.items.solanaPlayground.title"),
        description: t(
          "privacyhack.resources.items.solanaPlayground.description",
        ),
        category: t("privacyhack.resources.items.solanaPlayground.category"),
        url: "https://beta.solpg.io/",
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
