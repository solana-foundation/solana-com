import { useTranslations } from "next-intl";
import { withLocales } from "@/i18n/routing";

import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import PodcastApi from "@/lib/podcast";
import PodcastEpisodesSection from "@/components/podcast/PodcastEpisodesSection";
import PodcastNavigation from "@/components/podcast/PodcastNavigation";
import PodcastStickyPlayer, {
  PodcastPlayerContextProvider,
} from "@/components/podcast/PodcastStickyPlayer";

export default function PodcastIndex({ episodes, hasMore }) {
  const t = useTranslations();

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

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;
  const { episodes, hasMore } = await PodcastApi.getEpisodes({
    limit: 15,
  });
  return {
    props: {
      locale,
      episodes,
      hasMore,
      messages,
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
