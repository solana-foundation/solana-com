import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import FeaturedVideos from "@/components/community/CommunityFeaturedVideos";
import CommunityHero from "@/components/community/CommunityHero";
import CommunityLinks from "@/components/community/CommunityLinks";
import CommunitySocial from "@/components/community/CommunitySocial";
import CommunityNews from "@/components/community/CommunityNews";
import CommunityCollective from "@/components/community/CommunityCollective";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withLocales } from "@/i18n/routing";
import { useTranslation } from "next-i18next";
import { getPostsPage, getPostPagination } from "@/lib/builder/api";
import {
  getGHStargazers,
  getYTVideos,
  scrapeMeetupMemberCount,
  getYoutubeSubscriberCount,
} from "@/utils/followerFunctions";

import { NEWS_BUILDER_CONFIG } from "@/lib/builder/news/constants";

/**
 * Community Page for `/community` page.
 *
 * @return {JSX.Element}
 * @constructor
 */
const CommunityPage = ({ posts, socialData, youtubeVideos }) => {
  const { t } = useTranslation();

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
  const [posts, pagination, youtube, github, meetup, youtubeVideos] =
    await Promise.allSettled([
      getPostsPage(NEWS_BUILDER_CONFIG.postsModel, 1, 6),
      getPostPagination(1, NEWS_BUILDER_CONFIG.postsModel),
      getYoutubeSubscriberCount(),
      getGHStargazers(),
      scrapeMeetupMemberCount(),
      getYTVideos(10),
    ]);

  return {
    props: {
      locale,
      socialData: {
        youtube: youtube?.value || null,
        github: github?.value || null,
        meetup: meetup?.value || null,
        news: pagination?.value?.total || null,
      },
      youtubeVideos: youtubeVideos?.value,
      posts: posts?.value || [],
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

export default CommunityPage;
