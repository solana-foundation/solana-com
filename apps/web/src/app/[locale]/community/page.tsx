import { CommunityPage } from "./community";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import { fetchLatestPosts } from "@/lib/media/post";
import {
  getGHStargazers,
  getYTVideos,
  scrapeMeetupMemberCount,
  getYoutubeSubscriberCount,
} from "@/utils/followerFunctions";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const [posts, youtube, github, meetup, youtubeVideos] =
    await Promise.allSettled([
      fetchLatestPosts({ limit: 6 }),
      getYoutubeSubscriberCount(),
      getGHStargazers(),
      scrapeMeetupMemberCount(),
      getYTVideos(10),
    ]);

  const socialData = {
    youtube: youtube.status === "fulfilled" ? youtube.value : null,
    github: github.status === "fulfilled" ? github.value : null,
    meetup: meetup.status === "fulfilled" ? meetup.value : null,
  };

  return (
    <CommunityPage
      posts={posts.status === "fulfilled" ? posts.value?.posts || [] : []}
      socialData={socialData}
      youtubeVideos={
        youtubeVideos.status === "fulfilled" ? youtubeVideos.value : undefined
      }
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations();
  return {
    title: t("titles.community"),
    description:
      "Anyone in the world can contribute to Solana's technical, content or community efforts. Join our communities and tap into our global family.",
    alternates: getAlternates("/community", locale),
  };
}
