import React from "react";
import { serverTranslation } from "@/i18n/translation";
import heroImg from "@@/assets/developers/hero-solana-learn.png";
import LearnPageContent from "./LearnPageContent";

const tutorialsData = [
  {
    id: 1,
    slug: "what-is-a-wallet",
  },
  {
    id: 2,
    slug: "understanding-solana-transaction-fees",
  },
  {
    id: 3,
    slug: "sending-and-receiving-sol",
  },
  {
    id: 4,
    slug: "what-is-staking",
  },
  {
    id: 5,
    slug: "introduction-to-solana-tokens",
  },
  {
    id: 6,
    slug: "what-are-nfts",
  },
  {
    id: 7,
    slug: "introduction-to-defi-on-solana",
  },
  {
    id: 8,
    slug: "exploring-solana-web3-applications",
  },
  {
    id: 9,
    slug: "staying-safe-in-web3",
  },
];

type Props = { params: Promise<{ locale: string }> };

export default async function LearnPage(props: Props) {
  const { locale } = await props.params;

  const { t } = await serverTranslation(locale, ["common"]);

  // Build tutorials with translations
  const tutorials = tutorialsData.map((tutorial) => ({
    ...tutorial,
    title: t(`learn.tutorials.items.${tutorial.slug}.title`),
    description: t(`learn.tutorials.items.${tutorial.slug}.description`),
  }));

  // Derive featured posts from tutorials (first 3)
  const featuredPosts = tutorials.slice(0, 3);

  // Pre-translate all needed strings
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
      heroImg={heroImg}
      featuredPosts={featuredPosts}
      tutorials={tutorials}
      translations={translations}
    />
  );
}
