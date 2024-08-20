import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import HTMLHead from "@/components/HTMLHead";
import SharedButton from "@/components/shared/Button";
import RoundedDepthCard from "@/components/shared/RoundedDepthCard";
import DevelopersLayout from "@/components/developers/DevelopersLayout";
import ContentApi from "@/utils/contentApi";
import { useTranslation } from "next-i18next";
import classNames from "classnames";
import styles from "@/components/developers/DevelopersContentPage/DevelopersContentPage.module.scss";
import { InferGetStaticPropsType } from "next";

import { CardDeck } from "@solana-foundation/solana-lib";
import { DefaultCard } from "@solana-foundation/solana-lib/dist/components/CardDeck/DefaultCard/defaultCard";

export async function getStaticProps({ locale }) {
  // locate the records for the group being viewed (via the correctly formatted api route)
  const records = await ContentApi.getRecordsForGroup("courses", locale);

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

export default function DeveloperCoursesIndex({
  records: courseRecords,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation("common");

  let filteredCourseRecords = courseRecords
    // Remove any courses with the isHidden flag
    // Note: we don't remove the routing to them as there's currently a CFP to
    // update these courses, and we want people working on these updates to
    // browse their content if they know the URL.
    .filter((courseRecord) => {
      return !courseRecord.isHidden;
    })
    // Sort the course records by their priority
    // Eg, 'intro' courses should be listed first before more advanced topics.
    .sort((a, b) => a.priority - b.priority);

  const courseCards: Array<DefaultCard> = filteredCourseRecords.map(
    (record) => {
      return {
        type: "blog",
        eyebrow:
          record.lessons.length > 0 && `${record.lessons.length} Lessons`,
        body: record.description,
        callToAction: {
          hierarchy: "link",
          size: "md",
          label: "Start Course",
          endIcon: "arrow-up-right",
          iconSize: "sm",
          url: record.href,
        },
        backgroundImage: {
          src: record.image || `/opengraph/developers/courses/${record.slug}`,
        },
        isFeatured: false,
      };
    },
  );

  return (
    <DevelopersLayout>
      <HTMLHead
        title={"Developer Courses"}
        description={t("developers.guides.seo-description")}
      />

      <CardDeck numCols={3} cards={courseCards} isListing />

      <div className={classNames(styles["developers-content-page"])}>
        {/* @ts-expect-error */}
        <RoundedDepthCard
          className="p-5 mt-10"
          bgColor="#26262b"
          color="#ffffff"
          shadow="bottom"
        >
          <h4>{t("developers.resources.items.stackexchange.ask.title")}</h4>
          <p>{t("developers.resources.items.stackexchange.ask.description")}</p>
          {/* @ts-expect-error */}
          <SharedButton
            to="https://solana.stackexchange.com/"
            variant="secondary"
            newTab
          >
            {t("developers.resources.items.stackexchange.ask.cta-label")}
          </SharedButton>
        </RoundedDepthCard>
      </div>
    </DevelopersLayout>
  );
}
