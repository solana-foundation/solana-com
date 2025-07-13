import React from "react";
import { serverTranslation } from "@/i18n/translation";
import LearnPageContent from "@/components/learn/learn-page-content";
import { learnTutorials } from "@/utils/learn-tutorials";

type Props = { params: Promise<{ locale: string }> };

export default async function LearnPage(props: Props) {
  const { locale } = await props.params;

  const { t } = await serverTranslation(locale, ["common"]);

  const tutorials = learnTutorials.map((tutorial) => ({
    ...tutorial,
    title: t(`learn.tutorials.items.${tutorial.slug}.title`),
    description: t(`learn.tutorials.items.${tutorial.slug}.description`),
    category: t(`learn.tutorials.items.${tutorial.slug}.category`),
  }));

  const translations = {
    heroTitle: t("learn.hero.title"),
    heroSubtitle: t("learn.hero.subtitle"),
    heroStartLearning: t("learn.hero.start-learning"),
    heroBuild: t("learn.hero.build"),
    tutorialsAriaLabel: t("learn.tutorials.aria-label"),
    continueJourneyTitle: t("learn.resources.continueJourneyTitle"),
    continueJourneySubtitle: t("learn.resources.continueJourneySubtitle"),
    resourcesAriaLabel: t("learn.resources.ariaLabel"),
    documentationLabel: t("learn.resources.documentation.label"),
    documentationDescription: t("learn.resources.documentation.description"),
    documentationAriaLabel: t("learn.resources.documentation.ariaLabel"),
    cookbookLabel: t("learn.resources.cookbook.label"),
    cookbookDescription: t("learn.resources.cookbook.description"),
    cookbookAriaLabel: t("learn.resources.cookbook.ariaLabel"),
    coursesLabel: t("learn.resources.courses.label"),
    coursesDescription: t("learn.resources.courses.description"),
    coursesAriaLabel: t("learn.resources.courses.ariaLabel"),
    walletsLabel: t("learn.resources.wallets.label"),
    walletsDescription: t("learn.resources.wallets.description"),
    walletsAriaLabel: t("learn.resources.wallets.ariaLabel"),
    opensInNewTabAriaLabel: t("learn.resources.opensInNewTab"),
    tutorialPartLabel: t("learn.tutorials.partLabel"),
    readMoreLabel: t("learn.tutorials.readMore"),
    readMoreAriaLabel: t("learn.tutorials.readMoreAriaLabel"),
    // Developer component translations
    developersResourcesLearnMore: t("developers.resources.learn-more"),
    developersDocumentsViewAll: t("developers.documents.view-all"),
  };

  return <LearnPageContent tutorials={tutorials} translations={translations} />;
}
