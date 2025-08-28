import React from "react";
import { HackathonFall2025Page } from "./hackathon-fall-2025";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations();

  const translations = {
    heroTitle: t("universities.hackathon.hero.title"),
    heroSubtitle: t("universities.hackathon.hero.subtitle"),
    heroRegisterButton: t("universities.hackathon.hero.registerButton"),
    heroResourcesButton: t("universities.hackathon.hero.resourcesButton"),

    welcomeEyebrow: t("universities.hackathon.welcome.eyebrow"),
    welcomeTitle: t("universities.hackathon.welcome.title"),
    welcomeDescription: t("universities.hackathon.welcome.description"),
    welcomeCta: t("universities.hackathon.welcome.cta"),

    timelineTitle: t("universities.hackathon.timeline.title"),
    timelinePhaseHeader: t("universities.hackathon.timeline.phaseHeader"),
    timelineDateHeader: t("universities.hackathon.timeline.dateHeader"),
    timelineDescriptionHeader: t(
      "universities.hackathon.timeline.descriptionHeader",
    ),
    timelineEvents: [
      {
        phase: t("universities.hackathon.timeline.events.registration.phase"),
        date: t("universities.hackathon.timeline.events.registration.date"),
        description: t(
          "universities.hackathon.timeline.events.registration.description",
        ),
      },
      {
        phase: t("universities.hackathon.timeline.events.kickoff.phase"),
        date: t("universities.hackathon.timeline.events.kickoff.date"),
        description: t(
          "universities.hackathon.timeline.events.kickoff.description",
        ),
      },
      {
        phase: t("universities.hackathon.timeline.events.building.phase"),
        date: t("universities.hackathon.timeline.events.building.date"),
        description: t(
          "universities.hackathon.timeline.events.building.description",
        ),
      },
      {
        phase: t("universities.hackathon.timeline.events.submission.phase"),
        date: t("universities.hackathon.timeline.events.submission.date"),
        description: t(
          "universities.hackathon.timeline.events.submission.description",
        ),
      },
      {
        phase: t("universities.hackathon.timeline.events.winners.phase"),
        date: t("universities.hackathon.timeline.events.winners.date"),
        description: t(
          "universities.hackathon.timeline.events.winners.description",
        ),
      },
    ],

    prerequisitesTitle: t("universities.hackathon.prerequisites.title"),
    helloWorldTitle: t("universities.hackathon.prerequisites.helloWorld.title"),
    helloWorldDescription: t(
      "universities.hackathon.prerequisites.helloWorld.description",
    ),
    helloWorldCta: t("universities.hackathon.prerequisites.helloWorld.cta"),
    tutorialsTitle: t("universities.hackathon.prerequisites.tutorials.title"),
    tutorialsDescription: t(
      "universities.hackathon.prerequisites.tutorials.description",
    ),
    tutorialsCta: t("universities.hackathon.prerequisites.tutorials.cta"),

    problemTitle: t("universities.hackathon.problem.title"),
    problemDescription: t("universities.hackathon.problem.description"),

    requirementsTitle: t("universities.hackathon.requirements.title"),
    requirementsItems: t.raw(
      "universities.hackathon.requirements.items",
    ) as string[],

    resourcesTitle: t("universities.hackathon.resources.title"),
    resourcesDescription: t("universities.hackathon.resources.description"),
    resourcesGettingStarted: t(
      "universities.hackathon.resources.gettingStarted",
    ),
    resourcesProjectIdeas: t("universities.hackathon.resources.projectIdeas"),
    resourcesLearnMore: t("universities.hackathon.resources.learnMore"),
    resources: [
      {
        title: t("universities.hackathon.resources.items.smartContracts.title"),
        description: t(
          "universities.hackathon.resources.items.smartContracts.description",
        ),
        category: t(
          "universities.hackathon.resources.items.smartContracts.category",
        ),
        url: "https://github.com/solana-developers/program-examples",
      },
      {
        title: t("universities.hackathon.resources.items.playground.title"),
        description: t(
          "universities.hackathon.resources.items.playground.description",
        ),
        category: t(
          "universities.hackathon.resources.items.playground.category",
        ),
        url: "https://beta.solpg.io/",
      },
      {
        title: t("universities.hackathon.resources.items.anchor.title"),
        description: t(
          "universities.hackathon.resources.items.anchor.description",
        ),
        category: t("universities.hackathon.resources.items.anchor.category"),
        url: "https://www.anchor-lang.com/docs",
      },
      {
        title: t("universities.hackathon.resources.items.bootcamp.title"),
        description: t(
          "universities.hackathon.resources.items.bootcamp.description",
        ),
        category: t("universities.hackathon.resources.items.bootcamp.category"),
        url: "https://github.com/solana-developers/developer-bootcamp-2024",
      },
      {
        title: t("universities.hackathon.resources.items.crud.title"),
        description: t(
          "universities.hackathon.resources.items.crud.description",
        ),
        category: t("universities.hackathon.resources.items.crud.category"),
        url: "https://youtu.be/VRCcUlUTjfc?si=KHXXTsMS-hd0Zu-L",
      },
      {
        title: t("universities.hackathon.resources.items.vesting.title"),
        description: t(
          "universities.hackathon.resources.items.vesting.description",
        ),
        category: t("universities.hackathon.resources.items.vesting.category"),
        url: "https://youtu.be/_evMEjYHk-8?si=D1DVhwA-DGq2i4ng",
      },
      {
        title: t("universities.hackathon.resources.items.lottery.title"),
        description: t(
          "universities.hackathon.resources.items.lottery.description",
        ),
        category: t("universities.hackathon.resources.items.lottery.category"),
        url: "https://github.com/solana-developers/developer-bootcamp-2024/tree/main/project-9-token-lottery",
      },
      {
        title: t("universities.hackathon.resources.items.stablecoin.title"),
        description: t(
          "universities.hackathon.resources.items.stablecoin.description",
        ),
        category: t(
          "universities.hackathon.resources.items.stablecoin.category",
        ),
        url: "https://youtu.be/vhjcZRlQwYE?si=_xiJgUXBoAkAcd6G",
      },
    ],

    prizesTitle: t("universities.hackathon.prizes.title"),
    prizesPlaceHeader: t("universities.hackathon.prizes.placeHeader"),
    prizesAmountHeader: t("universities.hackathon.prizes.amountHeader"),
    prizesFirstPlace: t("universities.hackathon.prizes.firstPlace"),
    prizesSecondPlace: t("universities.hackathon.prizes.secondPlace"),
    prizesThirdPlace: t("universities.hackathon.prizes.thirdPlace"),
    prizesFirstPrize: t("universities.hackathon.prizes.firstPrize"),
    prizesSecondPrize: t("universities.hackathon.prizes.secondPrize"),
    prizesThirdPrize: t("universities.hackathon.prizes.thirdPrize"),
    prizesPart2Label: t("universities.hackathon.prizes.part2Label"),
    prizesPart2Description: t("universities.hackathon.prizes.part2Description"),
  };

  return <HackathonFall2025Page translations={translations} />;
}
