import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withLocales } from "@/i18n/routing";

import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import PodcastApi from "@/lib/podcast";
import PodcastNavigation from "@/components/podcast/PodcastNavigation";
import PodcastOverviewSection from "@/components/podcast/PodcastOverviewSection";
import PodcastRecentEpisodesSection from "@/components/podcast/PodcastRecentEpisodesSection";
import PodcastStickyPlayer, {
  PodcastPlayerContextProvider,
} from "@/components/podcast/PodcastStickyPlayer";

export default function PodcastIndex({ episodes }) {
  const { t } = useTranslation();

  return (
    <Layout>
      <HTMLHead
        title={t("podcast.title")}
        description={t("podcast.description")}
        socialShare="https://solana.com/social/validated.jpg"
      />
      <PodcastPlayerContextProvider episodes={episodes}>
        <div className="container">
          <PodcastStickyPlayer />
          <PodcastNavigation />
          <PodcastOverviewSection />
          <PodcastRecentEpisodesSection />
        </div>
      </PodcastPlayerContextProvider>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  const { episodes } = await PodcastApi.getEpisodes({
    limit: 5,
  });
  return {
    props: {
      locale,
      episodes,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 60,
  };
}
export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
