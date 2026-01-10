import React from "react";
import { X402HackathonPage } from "./x402-hackathon";
import { getTranslations } from "next-intl/server";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations();

  const translations = {
    heroTitle: t("x402.hackathon.hero.title"),
    heroSubtitle: t("x402.hackathon.hero.subtitle"),
    heroRegisterButton: t("x402.hackathon.hero.registerButton"),
    heroResourcesButton: t("x402.hackathon.hero.resourcesButton"),

    timelineTitle: t("x402.hackathon.timeline.title"),
    timelinePhaseHeader: t("x402.hackathon.timeline.phaseHeader"),
    timelineDateHeader: t("x402.hackathon.timeline.dateHeader"),
    timelineDescriptionHeader: undefined,
    timelineEvents: [
      {
        phase: t("x402.hackathon.timeline.events.registration.phase"),
        date: t("x402.hackathon.timeline.events.registration.date"),
      },
      {
        phase: t("x402.hackathon.timeline.events.building.phase"),
        date: t("x402.hackathon.timeline.events.building.date"),
      },
      {
        phase: t("x402.hackathon.timeline.events.submission.phase"),
        date: t("x402.hackathon.timeline.events.submission.date"),
      },
      {
        phase: t("x402.hackathon.timeline.events.winners.phase"),
        date: t("x402.hackathon.timeline.events.winners.date"),
      },
    ],

    prerequisitesTitle: t("x402.hackathon.prerequisites.title"),
    x402IntroTitle: t("x402.hackathon.prerequisites.x402Intro.title"),
    x402IntroDescription: t(
      "x402.hackathon.prerequisites.x402Intro.description",
    ),
    x402IntroCta: t("x402.hackathon.prerequisites.x402Intro.cta"),
    solanaTitle: t("x402.hackathon.prerequisites.solana.title"),
    solanaDescription: t("x402.hackathon.prerequisites.solana.description"),
    solanaCta: t("x402.hackathon.prerequisites.solana.cta"),
    x402NextTitle: t("x402.hackathon.prerequisites.x402NextTemplate.title"),
    x402NextDescription: t(
      "x402.hackathon.prerequisites.x402NextTemplate.description",
    ),
    x402NextCta: t("x402.hackathon.prerequisites.x402NextTemplate.cta"),

    problemTitle: t("x402.hackathon.problem.title"),
    problemDescription: t("x402.hackathon.problem.description"),

    requirementsTitle: t("x402.hackathon.requirements.title"),
    requirementsItems: t.raw("x402.hackathon.requirements.items") as string[],

    tracksTitle: t("x402.hackathon.tracks.title"),
    tracksSubtitle: t("x402.hackathon.tracks.subtitle"),
    tracksPrizeAmount: t("x402.hackathon.tracks.prizeAmount"),
    tracks: t.raw("x402.hackathon.tracks.items") as Array<{
      title: string;
      description: string;
      prizeAmount?: string;
      sponsor?: string;
      logo?: string;
    }>,

    sponsorBountiesTitle: t("x402.hackathon.sponsorBounties.title"),
    sponsorBountiesSubtitle: t("x402.hackathon.sponsorBounties.subtitle"),
    sponsorBounties: t.raw("x402.hackathon.sponsorBounties.items") as Array<{
      sponsor: string;
      logo: string;
      title: string;
      description: string;
      prizeAmount: string;
    }>,

    sponsorBannerTitle: t("x402.hackathon.sponsorBanner.title"),
    sponsorBannerLogos: t.raw("x402.hackathon.sponsorBanner.logos") as Array<{
      src: string;
      alt: string;
    }>,

    resourcesTitle: t("x402.hackathon.resources.title"),
    resourcesDescription: t("x402.hackathon.resources.description"),
    resourcesGettingStarted: t("x402.hackathon.resources.gettingStarted"),
    resourcesAdvancedTopics: t("x402.hackathon.resources.advancedTopics"),
    resourcesLearnMore: t("x402.hackathon.resources.learnMore"),

    ctaEyebrow: t("x402.hackathon.cta.eyebrow"),
    ctaTitle: t("x402.hackathon.cta.title"),
    ctaDescription: t("x402.hackathon.cta.description"),
    ctaLabel: t("x402.hackathon.cta.label"),
    ctaUrl: t("x402.hackathon.cta.url"),

    resources: [
      {
        title: t("x402.hackathon.resources.items.x402Docs.title"),
        description: t("x402.hackathon.resources.items.x402Docs.description"),
        category: t("x402.hackathon.resources.items.x402Docs.category"),
        url: "https://solana.com/x402/what-is-x402",
      },
      {
        title: t("x402.hackathon.resources.items.x402SDK.title"),
        description: t("x402.hackathon.resources.items.x402SDK.description"),
        category: t("x402.hackathon.resources.items.x402SDK.category"),
        url: "https://docs.corbits.dev/build-with-corbits/ride-or-die",
      },
      {
        title: t("x402.hackathon.resources.items.facilitatorDocs.title"),
        description: t(
          "x402.hackathon.resources.items.facilitatorDocs.description",
        ),
        category: t("x402.hackathon.resources.items.facilitatorDocs.category"),
        url: "https://solana.com/developers/guides/getstarted/build-a-x402-facilitator",
      },
      {
        title: t("x402.hackathon.resources.items.x402Template.title"),
        description: t(
          "x402.hackathon.resources.items.x402Template.description",
        ),
        category: t("x402.hackathon.resources.items.x402Template.category"),
        url: "https://templates.solana.com/x402-template",
      },
      {
        title: t("x402.hackathon.resources.items.coinbaseDocs.title"),
        description: t(
          "x402.hackathon.resources.items.coinbaseDocs.description",
        ),
        category: t("x402.hackathon.resources.items.coinbaseDocs.category"),
        url: "https://docs.cdp.coinbase.com/x402/welcome",
      },
      {
        title: t("x402.hackathon.resources.items.paymentExample.title"),
        description: t(
          "x402.hackathon.resources.items.paymentExample.description",
        ),
        category: t("x402.hackathon.resources.items.paymentExample.category"),
        url: "https://github.com/coinbase/x402-examples",
      },
      {
        title: t("x402.hackathon.resources.items.mcpServer.title"),
        description: t("x402.hackathon.resources.items.mcpServer.description"),
        category: t("x402.hackathon.resources.items.mcpServer.category"),
        url: "https://modelcontextprotocol.io/docs/server/",
      },
    ],
  };

  return <X402HackathonPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "x402.hackathon.title",
    descriptionKey: "x402.hackathon.description",
    path: "/x402/hackathon",
    locale,
  });
}
