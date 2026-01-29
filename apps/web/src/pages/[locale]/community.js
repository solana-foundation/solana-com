import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import FeaturedVideos from "@/components/community/CommunityFeaturedVideos";
import CommunityHero from "@/components/community/CommunityHero";
import CommunityLinks from "@/components/community/CommunityLinks";
import CommunitySocial from "@/components/community/CommunitySocial";
import CommunityNews from "@/components/community/CommunityNews";
import CommunityCollective from "@/components/community/CommunityCollective";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import { fetchLatestPosts } from "@/lib/media/post";
import {
  getGHStargazers,
  getYTVideos,
  scrapeMeetupMemberCount,
  getYoutubeSubscriberCount,
} from "@/utils/followerFunctions";

/**
 * Community Page for `/community` page.
 *
 * @return {JSX.Element}
 * @constructor
 */
const CommunityPage = ({ posts, socialData, youtubeVideos }) => {
  const t = useTranslations();

  return (
    <Layout>
      <HTMLHead
        title={t("titles.community")}
        description="Anyone in the world can contribute to Solana’s technical, content or community efforts. Join our communities and tap into our global family."
      />
      <div className="community-page mt-n10">
        <CommunityHero />
        <CommunityLinks />
        <CommunitySocial data={socialData} />
        <CommunityCollective />
        <FeaturedVideos videos={youtubeVideos} />
        <CommunityNews posts={posts} />
      </div>
    </Layout>
  );
};

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  const [posts, youtube, github, meetup, youtubeVideos] =
    await Promise.allSettled([
      fetchLatestPosts({ limit: 6 }),
      getYoutubeSubscriberCount(),
      getGHStargazers(),
      scrapeMeetupMemberCount(),
      getYTVideos(10),
    ]);

  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;

  return {
    props: {
      locale,
      socialData: {
        youtube: youtube?.value || null,
        github: github?.value || null,
        meetup: meetup?.value || null,
      },
      youtubeVideos: youtubeVideos?.value,
      posts: posts?.value?.posts || [],
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

export default CommunityPage;
