import { HomePage } from "./home";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";
import {
  fetchCalendarEvents,
  CalendarEvent,
} from "@/lib/events/fetchCalendarEvents";
import { getAllPlaylistItems } from "@/lib/youtube/getYoutubePlaylist";
import { fetchLatestPosts } from "@/lib/media/post";
import { YouTubePlaylistItem } from "@/lib/youtube/types";
import { PostItem } from "@/types/media";
import { uniqBy } from "lodash";
import { PROJECTS, LINKS, GET_STARTED_LINKS } from "@/data/index/data";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations();

  let events: CalendarEvent[] = [];
  let firstFeaturedEventIndex = 0;

  try {
    const pastEvents = await fetchCalendarEvents("cal-J8WZ4jDbwzD9TWi", {
      period: "past",
      pagination_limit: 20,
    });
    events = [...pastEvents];
    const featuredEvents = await fetchCalendarEvents("cal-J8WZ4jDbwzD9TWi", {
      period: "future",
    });
    events = [...events, ...featuredEvents];
    events = uniqBy(events, "key");
    events.sort(
      (a, b) =>
        new Date(a.schedule.from ?? 0).getTime() -
        new Date(b.schedule.from ?? 0).getTime(),
    );
    firstFeaturedEventIndex = featuredEvents.length > 0 ? pastEvents.length : 0;
  } catch (error) {
    console.error(error);
  }

  let videos: YouTubePlaylistItem[] = [];

  try {
    videos = await getAllPlaylistItems("PLilwLeBwGuK6p3pB-vUQf1TjkX48j0Af-", 5);
  } catch (error) {
    console.error(error);
  }

  let news: PostItem[] = [];

  try {
    const { posts } = await fetchLatestPosts({ limit: 10 });
    news = posts ?? [];
  } catch (error) {
    console.error(error);
  }

  // --- Translations ---
  const lightFormatter = {
    light: (chunks: React.ReactNode) => (
      <>
        <br />
        <span className="font-light">{chunks}</span>
      </>
    ),
  };

  const translations = {
    // Hero
    heroTitle: t.rich("index.hero.title", lightFormatter),
    heroSubtitle: t("index.hero.subtitle"),
    heroBannerEyebrow: t("index.hero.bannerEyebrow"),
    heroBannerDescription: t("index.hero.bannerDescription"),
    heroBannerLabel: t("index.hero.bannerLabel"),
    heroCta: t("index.hero.cta"),

    // Get Started
    getStartedTitle: t("index.get-started.title"),
    getStartedTabInstitution: t("index.get-started.tabs.institution"),
    getStartedTabUser: t("index.get-started.tabs.user"),
    getStartedTabDeveloper: t("index.get-started.tabs.developer"),
    getStartedLinksInstitution: GET_STARTED_LINKS.institution.map((_, index) =>
      t(`index.get-started.links.institution.${index}`),
    ),
    getStartedLinksDeveloper: GET_STARTED_LINKS.developer.map((_, index) =>
      t(`index.get-started.links.developer.${index}`),
    ),
    getStartedLinksUser: GET_STARTED_LINKS.user.map((_, index) =>
      t(`index.get-started.links.user.${index}`),
    ),

    // Events
    eventsTitle: t.rich("index.events.title", lightFormatter),
    eventsSubtitle: t("index.events.subtitle"),
    eventsCta: t("index.events.cta"),

    // Performance
    performanceTitle: t.rich("index.performance.title", lightFormatter),
    performanceSubtitle: t("index.performance.subtitle"),
    performanceCounterLabels: [
      t("index.performance.counters.0.label"),
      t("index.performance.counters.1.label"),
    ],
    performanceStats: [
      {
        value: t("index.performance.stats.0.value"),
        label: t("index.performance.stats.0.label"),
      },
      {
        value: t("index.performance.stats.1.value"),
        label: t("index.performance.stats.1.label"),
      },
      {
        value: t("index.performance.stats.2.value"),
        label: t("index.performance.stats.2.label"),
      },
      {
        value: t("index.performance.stats.3.value"),
        label: t("index.performance.stats.3.label"),
      },
    ],

    // What's Up
    whatsUpTitle: t.rich("index.whats-up.title", lightFormatter),
    whatsUpCta: t("index.whats-up.cta"),

    // Projects
    projectsTitle: t.rich("index.projects.title", {
      light: (chunks: React.ReactNode) => (
        <>
          <br className="max-md:hidden" />
          <span className="font-light">{chunks}</span>
        </>
      ),
    }),
    projectsCta: t("index.projects.cta"),
    projectsTranslations: PROJECTS.map((item) => ({
      name: t(`index.projects.${item.key}.name`),
      stat: t(`index.projects.${item.key}.stat`),
      statLabel: t(`index.projects.${item.key}.statLabel`),
    })),

    // News
    newsTitle: t.rich("index.news.title", lightFormatter),
    newsButton: t("index.news.button"),

    // Videos
    videosTitle: t("index.videos.title"),
    videosSubtitle: t.rich("index.videos.subtitle", {
      brDesktop: () => <br className="max-xl:hidden" />,
    }),

    // Community
    communityTitle: t.rich("index.community.title", lightFormatter),
    communitySubtitle: t("index.community.subtitle"),
    communityLinksTranslations: LINKS.map((_, index) => ({
      title: t(`index.community.links.${index}.title`),
      description: t(`index.community.links.${index}.description`),
    })),
  };

  return (
    <HomePage
      translations={translations}
      events={events}
      firstFeaturedEventIndex={firstFeaturedEventIndex}
      videos={videos}
      news={news}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "index.meta.title",
    descriptionKey: "index.meta.description",
    path: "/",
    locale,
  });
  return {
    ...base,
    openGraph: {
      images: ["/src/img/index/og-image.jpeg"],
    },
  };
}
