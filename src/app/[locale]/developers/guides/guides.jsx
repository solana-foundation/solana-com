"use client";

import Button from "@/components/shared/Button";
import RoundedDepthCard from "@/components/shared/RoundedDepthCard";
import DevelopersResources from "@/components/developers/DevelopersResources/DevelopersResources";
import DevelopersFeaturedResourcesList from "@/components/developers/DevelopersFeaturedResourcesList/DevelopersFeaturedResourcesList";
import { useTranslation } from "next-i18next";
import classNames from "classnames";
import styles from "@/components/developers/DevelopersContentPage/DevelopersContentPage.module.scss";

export function GuidesIndex({ records, featured }) {
  const { t } = useTranslation("common");

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
        className="p-5 mt-10"
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
