import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import HTMLHead from "../../../components/HTMLHead";
import Layout from "../../../components/layout";
import PodcastNavigation from "../../../components/podcast/PodcastNavigation";
import PodcastStickyPlayer, {
  PodcastPlayerContextProvider,
} from "../../../components/podcast/PodcastStickyPlayer";
import PodcastEpisodeSection from "../../../components/podcast/episode/PodcastEpisodeSection";
import PodcastApi from "../../../lib/podcast";

export default function PodcastIndex({ episode }) {
  return (
    <Layout>
      <HTMLHead
        title={episode.title}
        description={episode.description}
        socialShare="https://solana.com/social/validated.jpg"
      />
      <PodcastPlayerContextProvider episodes={[episode]}>
        <div className="container">
          <PodcastStickyPlayer />
          <PodcastNavigation />
          <PodcastEpisodeSection episode={episode} />
        </div>
      </PodcastPlayerContextProvider>
    </Layout>
  );
}

export const getStaticPaths = async () => {
  const { episodes } = await PodcastApi.getEpisodes({
    limit: 10,
  });

  return {
    paths: episodes.map((episode) => ({
      params: {
        slug: episode.slug,
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ locale, params }) => {
  try {
    let slug = params?.slug;

    const { episode } = await PodcastApi.getEpisodeBySlug(slug);

    if (!episode) {
      return { notFound: true };
    }

    return {
      props: {
        episode,
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};
