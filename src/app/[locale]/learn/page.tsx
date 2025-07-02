import React from "react";
import { serverTranslation } from "@/i18n/translation";
import LearnPageContent from "./LearnPageContent";
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

  // Derive featured posts from tutorials (first 3)
  const featuredPosts = tutorials.slice(0, 3);

  const translations = {
    heroTitle: t("learn.hero.title"),
    heroSubtitle: t("learn.hero.subtitle"),
    heroStartLearning: t("learn.hero.start-learning"),
    heroBuild: t("learn.hero.build"),
    featuredTitle: t("learn.featured.title"),
    featuredAriaLabel: t("learn.featured.aria-label"),
    tutorialsTitle: t("learn.tutorials.title"),
    tutorialsSubtitle: t("learn.tutorials.subtitle"),
    tutorialsAriaLabel: t("learn.tutorials.aria-label"),
  };

  return (
    <LearnPageContent
      featuredPosts={featuredPosts}
      tutorials={tutorials}
      translations={translations}
    />
  );
}
