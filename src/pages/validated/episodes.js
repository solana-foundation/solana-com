import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import HTMLHead from "../../components/HTMLHead";
import Layout from "../../components/layout";
import PodcastApi from "../../lib/podcast";
import PodcastEpisodesSection from "../../components/podcast/PodcastEpisodesSection";
import PodcastNavigation from "../../components/podcast/PodcastNavigation";
import PodcastStickyPlayer, {
  PodcastPlayerContextProvider,
} from "../../components/podcast/PodcastStickyPlayer";

export default function PodcastIndex({ episodes, hasMore }) {
  const { t } = useTranslation();

  return (
    <Layout>
      <HTMLHead
        title={t("podcast.episodes.title")}
        description={t("podcast.episodes.description")}
        socialShare="https://solana.com/social/validated.jpg"
      />
      <PodcastPlayerContextProvider episodes={episodes} hasMore={hasMore}>
        <div className="container">
          <PodcastStickyPlayer />
          <PodcastNavigation />
          <PodcastEpisodesSection />
        </div>
      </PodcastPlayerContextProvider>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  const { episodes, hasMore } = await PodcastApi.getEpisodes({
    limit: 15,
  });
  return {
    props: {
      episodes,
      hasMore,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 30,
  };
}
