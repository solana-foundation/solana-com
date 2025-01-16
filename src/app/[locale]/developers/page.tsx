import { DevelopersPage } from "./developers";
import { YT_PLAYLIST_CHANGELOG } from "@/constants/developerContentConfig";
import { getYTVideos } from "@/utils/followerFunctions";
import { resources, getGuides } from "@/app/source";
import { serverTranslation } from "@/i18n/translation";
import { ResolvingMetadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export default async function Page() {
  const latestChangelogVideo = await getLatestChangelogVideo();
  const guides = getGuides()
    .filter((guide: any) => guide.featured)
    .slice(0, 6);
  const resources = await getResources();
  return (
    <DevelopersPage
      latestChangelogVideo={latestChangelogVideo}
      guides={guides}
      resources={resources}
    />
  );
}

async function getLatestChangelogVideo() {
  try {
    let latestChangelogVideo = null;
    const videos = await getYTVideos(undefined, YT_PLAYLIST_CHANGELOG);
    if (videos.length) {
      latestChangelogVideo = videos.sort((a: any, b: any) => {
        return (
          new Date(b.snippet.publishedAt).getTime() -
          new Date(a.snippet.publishedAt).getTime()
        );
      })[0];
    }
    return latestChangelogVideo;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return null;
  }
}

async function getResources() {
  return resources.filter((r) => r.featured).slice(0, 6);
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
) {
  const { locale } = await params;
  const { t } = await serverTranslation(locale);
  const { openGraph } = await parent;
  return {
    title: t("developers.title"),
    description: t("developers.description"),
    openGraph: {
      ...openGraph,
      title: t("developers.title"),
      description: t("developers.description"),
    },
  };
}
