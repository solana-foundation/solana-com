import { DevelopersPage } from "./developers";
import { YT_PLAYLIST_CHANGELOG } from "@/constants/developerContentConfig";
import { getYTVideos } from "@/utils/followerFunctions";
import { resources } from "@/app/sources/resources";
import { getGuides } from "@/app/sources/guides";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(props: Props) {
  const { locale } = await props.params;
  const latestChangelogVideo = await getLatestChangelogVideo();
  const guides = getGuides(locale)
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

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "developers.title",
    descriptionKey: "developers.description",
    path: "/developers",
    locale,
  });
}
