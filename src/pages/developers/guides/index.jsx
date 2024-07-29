import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import HTMLHead from "@/components/HTMLHead";
import Button from "@/components/shared/Button";
import RoundedDepthCard from "@/components/shared/RoundedDepthCard";
import DevelopersLayout from "@/components/developers/DevelopersLayout";
import DevelopersResources from "@/components/developers/DevelopersResources/DevelopersResources";
import ContentApi from "@/utils/contentApi";
import DevelopersFeaturedResourcesList from "@/components/developers/DevelopersFeaturedResourcesList/DevelopersFeaturedResourcesList";
import { useTranslation } from "next-i18next";
import classNames from "classnames";
import styles from "@/components/developers/DevelopersContentPage/DevelopersContentPage.module.scss";

export async function getStaticProps({ locale }) {
  // locate the records for the group being viewed (via the correctly formatted api route)
  const records = await ContentApi.getRecordsForGroup("guides", locale);

  // extract a list of featured records
  const featured = ContentApi.extractFeaturedRecords({
    records,
    limit: 3,
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),

      records,
      featured,
    },
    revalidate: 60,
  };
}

export default function DeveloperGuidesIndex({ records, featured }) {
  const { t } = useTranslation("common");

  return (
    <DevelopersLayout>
      <HTMLHead
        title={"Developer Guides"}
        description={t("developers.guides.seo-description")}
      />

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
    </DevelopersLayout>
  );
}
