"use client";

import type { ReactNode } from "react";
import Button from "@/components/shared/Button";
import RoundedDepthCard from "@/components/shared/RoundedDepthCard";
import DevelopersResources from "@/components/developers/DevelopersResources/DevelopersResources";
import DevelopersFeaturedResourcesList from "@/components/developers/DevelopersFeaturedResourcesList/DevelopersFeaturedResourcesList";
import { useTranslations } from "next-intl";
import classNames from "classnames";
import styles from "@/components/developers/DevelopersContentPage/DevelopersContentPage.module.scss";

export type GuideRecord = {
  href?: string;
  title?: ReactNode;
  description?: ReactNode;
  difficulty?: string;
  tags?: string[];
  featured?: boolean;
};

type GuidesIndexProps = {
  records: GuideRecord[];
  featured: GuideRecord[];
};

export function GuidesIndex({ records, featured }: GuidesIndexProps) {
  const t = useTranslations();

  return (
    <div className={classNames(styles["developers-content-page"])}>
      <DevelopersFeaturedResourcesList
        items={featured}
        translationTag={"guides.featured-guides-list"}
      />

      <DevelopersResources
        items={records}
        title={t("developers.resource-content.guides-title")}
      />

      <RoundedDepthCard
        className="p-6 mt-20"
        bgColor="#26262b"
        color="#ffffff"
        shadow="bottom"
      >
        <h4>{t("developers.resources.items.stackexchange.ask.title")}</h4>
        <p>{t("developers.resources.items.stackexchange.ask.description")}</p>
        <Button
          to="https://solana.stackexchange.com/"
          variant="secondary"
          newTab
        >
          {t("developers.resources.items.stackexchange.ask.cta-label")}
        </Button>
      </RoundedDepthCard>
    </div>
  );
}
