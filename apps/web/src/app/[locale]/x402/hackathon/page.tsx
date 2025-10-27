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

    welcomeEyebrow: t("x402.hackathon.welcome.eyebrow"),
    welcomeTitle: t("x402.hackathon.welcome.title"),
    welcomeDescription: t("x402.hackathon.welcome.description"),
    welcomeCta: t("x402.hackathon.welcome.cta"),

    timelineTitle: t("x402.hackathon.timeline.title"),
    timelinePhaseHeader: t("x402.hackathon.timeline.phaseHeader"),
    timelineDateHeader: t("x402.hackathon.timeline.dateHeader"),
    timelineDescriptionHeader: t("x402.hackathon.timeline.descriptionHeader"),
    timelineEvents: [
      {
        phase: t("x402.hackathon.timeline.events.registration.phase"),
        date: t("x402.hackathon.timeline.events.registration.date"),
        description: t(
          "x402.hackathon.timeline.events.registration.description",
        ),
      },
      {
        phase: t("x402.hackathon.timeline.events.kickoff.phase"),
        date: t("x402.hackathon.timeline.events.kickoff.date"),
        description: t("x402.hackathon.timeline.events.kickoff.description"),
      },
      {
        phase: t("x402.hackathon.timeline.events.building.phase"),
        date: t("x402.hackathon.timeline.events.building.date"),
        description: t("x402.hackathon.timeline.events.building.description"),
      },
      {
        phase: t("x402.hackathon.timeline.events.submission.phase"),
        date: t("x402.hackathon.timeline.events.submission.date"),
        description: t("x402.hackathon.timeline.events.submission.description"),
      },
      {
        phase: t("x402.hackathon.timeline.events.winners.phase"),
        date: t("x402.hackathon.timeline.events.winners.date"),
        description: t("x402.hackathon.timeline.events.winners.description"),
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
    }>,

    resourcesTitle: t("x402.hackathon.resources.title"),
    resourcesDescription: t("x402.hackathon.resources.description"),
    resourcesGettingStarted: t("x402.hackathon.resources.gettingStarted"),
    resourcesAdvancedTopics: t("x402.hackathon.resources.advancedTopics"),
    resourcesLearnMore: t("x402.hackathon.resources.learnMore"),
    resources: [
      {
        title: t("x402.hackathon.resources.items.x402Docs.title"),
        description: t("x402.hackathon.resources.items.x402Docs.description"),
        category: t("x402.hackathon.resources.items.x402Docs.category"),
        url: "https://www.x402.org/",
      },
      {
        title: t("x402.hackathon.resources.items.x402SDK.title"),
        description: t("x402.hackathon.resources.items.x402SDK.description"),
        category: t("x402.hackathon.resources.items.x402SDK.category"),
        url: "https://www.x402dev.com/",
      },
      {
        title: t("x402.hackathon.resources.items.mcpDocs.title"),
        description: t("x402.hackathon.resources.items.mcpDocs.description"),
        category: t("x402.hackathon.resources.items.mcpDocs.category"),
        url: "https://modelcontextprotocol.io/",
      },
      {
        title: t("x402.hackathon.resources.items.solanaAgentKit.title"),
        description: t(
          "x402.hackathon.resources.items.solanaAgentKit.description",
        ),
        category: t("x402.hackathon.resources.items.solanaAgentKit.category"),
        url: "https://github.com/sendaifun/solana-agent-kit",
      },
      {
        title: t("x402.hackathon.resources.items.erc8004.title"),
        description: t("x402.hackathon.resources.items.erc8004.description"),
        category: t("x402.hackathon.resources.items.erc8004.category"),
        url: "https://eips.ethereum.org/EIPS/eip-8004",
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
