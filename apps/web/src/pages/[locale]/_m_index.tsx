import Layout from "@/components/solutions/layout";
import { withLocales } from "@workspace/i18n/routing";
import { Hero } from "@/components/index/hero";
import { useTranslations } from "next-intl";
import HTMLHead from "@/components/HTMLHead";
import { Logos } from "@/component-library/logos";
import { Divider } from "@/component-library/divider";
import {
  LOGOS,
  PROJECTS,
  PROJECTS_LOGOS,
  LINKS,
  GET_STARTED_LINKS,
} from "@/data/index/data";
import { CardCarouselSection } from "@/component-library/card-carousel-section";
import { PlaceMediaCard } from "@/component-library/place-media-card";
import {
  fetchCalendarEvents,
  CalendarEvent,
} from "@/lib/events/fetchCalendarEvents";
import { Performance } from "@/components/index/performance";
import dynamic from "next/dynamic";
import defaultImg from "@@/assets/events/solana-event.jpg";
import { Projects } from "@/components/index/projects";
import { BigBannerCard } from "@/component-library/big-banner-card";
import { BigVideoCard } from "@/component-library/big-video-card";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { YouTubePlaylistItem } from "@/lib/youtube/types";
import { getAllPlaylistItems } from "@/lib/youtube/getYoutubePlaylist";
import { Community } from "@/components/index/community";
import { WhatsUp } from "@/components/index/whats-up";
import { Decor } from "@/components/index/decor";
import Avatar from "@@/public/src/img/icons/Avatar.inline.svg";
import Bank from "@@/public/src/img/icons/Bank.inline.svg";
import CodeFilled from "@@/public/src/img/icons/CodeFilled.inline.svg";
import { PostItem } from "@/types/media";
import { fetchLatestPosts } from "@/lib/media/post";
import { useEffect, useState, useMemo } from "react";
import { uniqBy } from "lodash";

const TransactionsStat = dynamic(
  () =>
    import("@/components/index/transactions-stat").then(
      (mod) => mod.TransactionsStat,
    ),
  {
    ssr: false,
  },
);

interface HomeProps {
  events: (Omit<CalendarEvent, "schedule"> & {
    schedule: CalendarEvent["schedule"] & { from: string; to: string };
  })[];
  videos: YouTubePlaylistItem[];
  firstFeaturedEventIndex: number;
  news: PostItem[];
}

export default function Home({
  events,
  firstFeaturedEventIndex,
  videos,
  news,
}: HomeProps) {
  const t = useTranslations();
  const [newsFallback, setNewsFallback] = useState<PostItem[] | null>(null);

  // Workaround for Vercel preview mode
  // Fetch news fallback if news is empty
  useEffect(() => {
    let isMounted = true;
    if (news.length === 0 && newsFallback === null) {
      fetchLatestPosts({ limit: 10 })
        .then(({ posts }) => {
          if (isMounted) {
            setNewsFallback(posts);
          }
        })
        .catch(() => {
          if (isMounted) {
            // Fallback to empty array if fetch fails to avoid infinite loop
            setNewsFallback([]);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [news, newsFallback]);

  const newsToDisplay = newsFallback || news;

  // Filter and sort events: remove events older than 1 week ago, sort ascending (oldest first)
  const filteredAndSortedEvents = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return events
      .filter((event) => {
        if (!event.schedule.from) return false;
        const eventDate = new Date(event.schedule.from);
        return eventDate >= oneWeekAgo;
      })
      .sort((a, b) => {
        const dateA = new Date(a.schedule.from).getTime();
        const dateB = new Date(b.schedule.from).getTime();
        return dateA - dateB;
      });
  }, [events]);

  return (
    <Layout className="bg-nd-bg">
      <HTMLHead
        title={t("index.meta.title")}
        description={t("index.meta.description")}
        socialShare="/src/img/index/og-image.jpeg"
      />

      <Hero
        title={t.rich("index.hero.title", {
          light: (chunks) => (
            <>
              <br />
              <span className="font-light">{chunks}</span>
            </>
          ),
        })}
        subtitle={t("index.hero.subtitle")}
        bannerEyebrow={t("index.hero.bannerEyebrow")}
        bannerDescription={t("index.hero.bannerDescription")}
        bannerImgSrc="/src/img/index/agent-hackathon.webp"
        // rm bannerHref and bannerLabel to hide banner
        bannerHref="https://colosseum.com/agent-hackathon/"
        bannerLabel={t("index.hero.bannerLabel")}
        bannerExpiryDate="2026-02-28"
        cta={t("index.hero.cta")}
        bgJsonFilePath="/src/img/index/hero-bg.json"
        bgImageSrc="/src/img/index/hero-bg.webp"
        getStartedTitle={t("index.get-started.title")}
        getStartedTabs={[
          {
            id: "institution",
            title: t("index.get-started.tabs.institution"),
            Icon: Bank,
          },
          { id: "user", title: t("index.get-started.tabs.user"), Icon: Avatar },
          {
            id: "developer",
            title: t("index.get-started.tabs.developer"),
            Icon: CodeFilled,
          },
        ]}
        getStartedLinks={{
          institution: GET_STARTED_LINKS.institution.map((item, index) => ({
            title: t(`index.get-started.links.institution.${index}`),
            href: item.href,
          })),
          developer: GET_STARTED_LINKS.developer.map((item, index) => ({
            title: t(`index.get-started.links.developer.${index}`),
            href: item.href,
          })),
          user: GET_STARTED_LINKS.user.map((item, index) => ({
            title: t(`index.get-started.links.user.${index}`),
            href: item.href,
          })),
        }}
      />

      <Logos
        className="h-[73px] xl:h-[123px] gap-twd-4 md:gap-twd-3 xl:gap-twd-4 justify-evenly max-w-screen-2xl w-full mx-twd-auto px-twd-5 md:px-twd-8 xl:px-twd-10 py-twd-6 xl:py-twd-11 mt-twd-4 md:mt-twd-6 xl:mt-twd-8"
        itemClassName="h-full m-0 !mr-0 flex-shrink-0"
        logos={LOGOS}
        animation={false}
      />

      <Divider className="pt-4" />

      {filteredAndSortedEvents.length > 0 && (
        <>
          <CardCarouselSection
            title={t.rich("index.events.title", {
              light: (chunks) => (
                <>
                  <br />
                  <span className="font-light">{chunks}</span>
                </>
              ),
            })}
            subtitle={t("index.events.subtitle")}
            totalItems={filteredAndSortedEvents.length}
            desktopLastPageOffset={2}
            tabletLastPageOffset={2}
            desktop2xlLastPageOffset={3}
            cardWidthClassName="w-full md:w-[356px] xl:w-[456px]"
            startIndex={firstFeaturedEventIndex}
            cta={t("index.events.cta")}
            ctaHref="/events"
          >
            {filteredAndSortedEvents.map((event) => (
              <PlaceMediaCard
                key={event.key}
                imageSrc={event.img.primary || defaultImg.src}
                title={event.title}
                date={event.schedule.from}
                location={event.venue.city || event.venue.address}
                href={event.rsvp}
                className="px-twd-1"
              />
            ))}
          </CardCarouselSection>
          <Divider />
        </>
      )}

      <Performance
        title={t.rich("index.performance.title", {
          light: (chunks) => (
            <>
              <br />
              <span className="font-light">{chunks}</span>
            </>
          ),
        })}
        subtitle={t("index.performance.subtitle")}
        counters={[
          {
            value: <TransactionsStat variant="total" />,
            label: t("index.performance.counters.0.label"),
            Icon: "/src/img/index/icons/steps.svg",
          },
          {
            value: <TransactionsStat variant="per-sec" />,
            label: t("index.performance.counters.1.label"),
            Icon: "/src/img/index/icons/speed.svg",
          },
        ]}
        stats={[
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
        ]}
        bgJsonFilePath="/src/img/index/performance-bg.json"
        bgImageSrc="/src/img/index/performance-bg.webp"
      />

      <Divider />

      <WhatsUp
        title={t.rich("index.whats-up.title", {
          light: (chunks) => (
            <>
              <br />
              <span className="font-light">{chunks}</span>
            </>
          ),
        })}
        cta={t("index.whats-up.cta")}
        ctaHref="/news"
      />

      <Divider />

      <Projects
        className="z-1"
        title={t.rich("index.projects.title", {
          light: (chunks) => (
            <>
              <br className="max-md:hidden" />
              <span className="font-light">{chunks}</span>
            </>
          ),
        })}
        projects={PROJECTS.map((item) => ({
          ...item,
          name: t(`index.projects.${item.key}.name`),
          stat: t(`index.projects.${item.key}.stat`),
          statLabel: t(`index.projects.${item.key}.statLabel`),
        }))}
        bgSrc="/src/img/index/projects-bg.webp"
        logos={PROJECTS_LOGOS}
        cta={t("index.projects.cta")}
        ctaHref="/solutions/tokenization"
      />

      <Decor />

      <CardCarouselSection
        title={t.rich("index.news.title", {
          light: (chunks) => (
            <>
              <br />
              <span className="font-light">{chunks}</span>
            </>
          ),
        })}
        totalItems={newsToDisplay.length}
        cardWidthClassName="w-full md:w-[700px] xl:w-[1360px]"
      >
        {newsToDisplay.map((item) => (
          <BigBannerCard
            key={item.id}
            className="px-twd-1"
            imageSrc={item.heroImage}
            title={item.title}
            description={item.description}
            href={item.url}
            buttonLabel={t(`index.news.button`)}
          />
        ))}
      </CardCarouselSection>

      <Divider />

      <CardCarouselSection
        title={t("index.videos.title")}
        subtitle={t.rich("index.videos.subtitle", {
          brDesktop: () => <br className="max-xl:hidden" />,
        })}
        totalItems={videos.length}
        cardWidthClassName="w-full md:w-[700px] xl:w-[800px]"
      >
        {videos.map((item) => (
          <BigVideoCard
            key={item.id}
            id={item.contentDetails.videoId}
            thumbnail={item.snippet.thumbnails.maxres.url}
            alt={item.snippet.title}
            className="px-twd-1"
            title={item.snippet.title}
            // description={item.snippet.resourceId.kind}
          />
        ))}
      </CardCarouselSection>

      <Community
        title={t.rich("index.community.title", {
          light: (chunks) => (
            <>
              <br />
              <span className="font-light">{chunks}</span>
            </>
          ),
        })}
        subtitle={t("index.community.subtitle")}
        bgJsonFilePath="/src/img/index/community-bg.json"
        bgImageSrc="/src/img/index/projects-bg.webp"
        links={LINKS.map((item, index) => ({
          ...item,
          title: t(`index.community.links.${index}.title`),
          description: t(`index.community.links.${index}.description`),
        }))}
      />

      <VideoPlayerModal />
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  try {
    const messages = (await import(`@@/public/locales/${locale}/common.json`))
      .default;

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
      // Dedupe by key (e.g. signup form events added to every fetch)
      events = uniqBy(events, "key");
      // Sort events by date
      events.sort(
        (a, b) =>
          new Date(a.schedule.from ?? 0).getTime() -
          new Date(b.schedule.from ?? 0).getTime(),
      );
      firstFeaturedEventIndex =
        featuredEvents.length > 0 ? pastEvents.length : 0;
    } catch (error) {
      console.error(error);
    }

    let videos: YouTubePlaylistItem[] = [];

    try {
      // TODO: Add actual playlist ID
      const ytVideos = await getAllPlaylistItems(
        "PLilwLeBwGuK6p3pB-vUQf1TjkX48j0Af-",
        5,
      );
      videos = ytVideos;
    } catch (error) {
      console.error(error);
    }

    const { posts } = await fetchLatestPosts({ limit: 10 });

    return {
      props: {
        locale,
        messages,
        events: events ? events : [],
        firstFeaturedEventIndex,
        videos: videos ? videos : [],
        news: posts ? posts : [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
