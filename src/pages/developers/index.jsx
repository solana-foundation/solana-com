import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ContentApi from "@/utils/contentApi";
import { getYTVideos } from "@/utils/followerFunctions";
import { YT_PLAYLIST_CHANGELOG } from "@/constants/developerContentConfig";

import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";
import DevelopersHeroSection from "@/components/developers/sections/DevelopersHeroSection/DevelopersHeroSection";
import DevelopersCoursesSection from "@/components/developers/sections/DevelopersCoursesSection/DevelopersCoursesSection";
import DevelopersResourcesSection from "@/components/developers/sections/DevelopersResourcesSection/DevelopersResourcesSection";
import DevelopersDocumentsSection from "@/components/developers/sections/DevelopersDocumentsSection/DevelopersDocumentsSection";
import DevelopersContentSection from "@/components/developers/sections/DevelopersContentSection/DevelopersContentSection";

export default function DevelopersPage({
  resources,
  guides,
  // courses,
  latestChangelogVideo,
}) {
  const { t } = useTranslation();

  return (
    <Layout>
      <HTMLHead
        title={t("titles.developers")}
        description="Learn why Solana is used by the best and brightest teams in crypto. Explore our guides and examples to start building on the Solana blockchain."
      />
      <div className="overflow-hidden">
        <DevelopersHeroSection />

        <DevelopersCoursesSection /* courses={courses} */ />

        <DevelopersResourcesSection
          items={guides}
          baseHref={`/developers/guides`}
          translationKey={"guides"}
        />

        <DevelopersResourcesSection
          items={resources}
          baseHref={`/developers/resources`}
          translationKey={"resources"}
        />

        <DevelopersDocumentsSection latestVideo={latestChangelogVideo} />

        <DevelopersContentSection />
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  // get the listing of changelog videos
  let latestChangelogVideo = null;
  try {
    const videos = await getYTVideos(undefined, YT_PLAYLIST_CHANGELOG);
    if (videos.length) {
      latestChangelogVideo = videos.sort((a, b) => {
        return (
          new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt)
        );
      })[0];
    }
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
  }

  // get the developer content overview records
  const overview = await ContentApi.getOverviewRecords(locale);

  // todo: handle missing `overview` attributes?

  // todo: (nick) fetch courses to be displayed on the /developers index

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),

      resources: overview.resources || [],
      guides: overview.guides || [],
      // courses: overview?.courses,

      latestChangelogVideo,
    },
    revalidate: 30,
  };
}
