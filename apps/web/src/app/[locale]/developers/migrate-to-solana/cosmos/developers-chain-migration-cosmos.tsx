"use client";

import { useTranslations } from "next-intl";
import {
  COSMOS_PATHS,
  COSMOS_RESOURCES,
} from "@/data/developers/evm-to-svm/cosmos";
import { Products } from "@/components/solutions/products.v2";
import {
  AnimatedHeroSection,
  SectionDivider,
  type HeroButton,
} from "./cosmos-page-shared";

export function DevelopersChainMigrationCosmosPage() {
  const t = useTranslations("developers-chain-migration-cosmos");

  const heroButtons: HeroButton[] = [
    {
      hierarchy: "primary",
      label: t("hero.buttons.0.label"),
      url: "/developers/migrate-to-solana/cosmos/cosmwasm",
    },
    {
      hierarchy: "outline",
      label: t("hero.buttons.1.label"),
      url: "/developers/migrate-to-solana/cosmos/app-chain",
    },
  ];

  return (
    <>
      <AnimatedHeroSection
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
        buttons={heroButtons}
        showScene={true}
      />

      <Products
        products={COSMOS_PATHS}
        title={t("paths.title")}
        description={t("paths.description")}
        translationBase="developers-chain-migration-cosmos.paths"
      />

      <SectionDivider />

      <Products
        products={COSMOS_RESOURCES}
        title={t("resources.title")}
        description={t("resources.description")}
        translationBase="developers-chain-migration-cosmos.resources"
      />
    </>
  );
}
