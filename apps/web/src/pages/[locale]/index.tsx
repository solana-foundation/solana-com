import Layout from "@/components/solutions/layout";
import { withLocales } from "@workspace/i18n/routing";
import { Hero } from "@/components/index/hero";
import { useTranslations } from "next-intl";
import HTMLHead from "@/components/HTMLHead";
import { Logos } from "@/component-library/logos";
import { Divider } from "@/component-library/divider";
import { LOGOS, PROJECTS, PROJECTS_LOGOS, LINKS } from "@/data/index/data";
import { CardCariuselSection } from "@/component-library/card-cariusel-section";
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
}

export default function Home({
  events,
  firstFeaturedEventIndex,
  videos,
}: HomeProps) {
  const t = useTranslations();

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
        bannerImgSrc="/src/img/index/hero-banner.webp"
        // TODO: Add banner href
        bannerHref="#"
        bannerLabel={t("index.hero.bannerLabel")}
        // TODO: Add onCtaClick function
        onCtaClick={() => {}}
        cta={t("index.hero.cta")}
        bgVideoSrc="/src/img/index/hero-bg.webm"
        bgVideoPoster="/src/img/index/hero-bg.webp"
      />

      <Logos
        className="h-[73px] xl:h-[123px] gap-twd-6 xl:gap-twd-12 justify-start max-w-screen-2xl w-full mx-twd-auto px-twd-5 md:px-twd-8 xl:px-twd-10 py-twd-6 xl:py-twd-11"
        itemClassName="h-full m-0"
        logos={LOGOS}
        animation={false}
      />

      <Divider />

      {events.length > 0 && (
        <>
          <CardCariuselSection
            title={t.rich("index.events.title", {
              light: (chunks) => (
                <>
                  <br />
                  <span className="font-light">{chunks}</span>
                </>
              ),
            })}
            subtitle={t("index.events.subtitle")}
            totalItems={events.length}
            desktopLastPageOffset={2}
            tabletLastPageOffset={2}
            cardWidthClassName="w-full md:w-[350px] xl:w-[450px]"
            startIndex={firstFeaturedEventIndex}
          >
            {events.map((event) => (
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
          </CardCariuselSection>
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
        bgVideoSrc="/src/img/index/performance-bg.webm"
        bgVideoPoster="/src/img/index/performance-bg.webp"
      />

      <Projects
        title={t.rich("index.projects.title", {
          light: (chunks) => (
            <>
              <br />
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
      />

      <CardCariuselSection
        title={t.rich("index.news.title", {
          light: (chunks) => (
            <>
              <br />
              <span className="font-light">{chunks}</span>
            </>
          ),
        })}
        // TODO: Add actual news count
        totalItems={2}
        cardWidthClassName="w-full md:w-[700px] xl:w-[1360px]"
      >
        {/* TODO: Add actual news */}
        <BigBannerCard
          className="px-twd-1"
          imageSrc="/src/img/index/news/news-1.webp"
          title={t(`index.news.items.0.title`)}
          description={t(`index.news.items.0.description`)}
          href="https://solanamobile.com/seeker"
          buttonLabel={t(`index.news.items.0.button`)}
        />
        <BigBannerCard
          className="px-twd-1"
          imageSrc="/src/img/index/news/news-1.webp"
          title={t(`index.news.items.0.title`)}
          description={t(`index.news.items.0.description`)}
          href="https://solanamobile.com/seeker"
          buttonLabel={t(`index.news.items.0.button`)}
        />
      </CardCariuselSection>

      <Divider />

      <CardCariuselSection
        title={t("index.videos.title")}
        subtitle={t("index.videos.subtitle")}
        totalItems={videos.length}
        cardWidthClassName="w-full md:w-[700px] xl:w-[800px]"
      >
        {videos.map((item) => (
          <BigVideoCard
            key={item.id}
            id={item.contentDetails.videoId}
            thumbnail={item.snippet.thumbnails.high.url}
            alt={item.snippet.title}
            className="px-twd-1"
            title={item.snippet.title}
            description={item.snippet.description}
          />
        ))}
      </CardCariuselSection>

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
        bgVideoSrc="/src/img/index/community-bg.webm"
        bgVideoPoster="/src/img/index/projects-bg.webp"
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
      firstFeaturedEventIndex =
        featuredEvents.length > 0 ? pastEvents.length : 0;
      events = [...events, ...featuredEvents];
    } catch (error) {
      console.error(error);
    }

    let videos: YouTubePlaylistItem[] = [];

    try {
      // TODO: Add actual playlist ID
      const ytVideos = await getAllPlaylistItems(
        "PLilwLeBwGuK51Ji870apdb88dnBr1Xqhm",
      );
      videos = ytVideos;
    } catch (error) {
      console.error(error);
    }

    // Sort events by date
    events.sort(
      (a, b) =>
        new Date(a.schedule.from).getTime() -
        new Date(b.schedule.from).getTime(),
    );

    return {
      props: {
        locale,
        messages,
        events: events ? events : [],
        firstFeaturedEventIndex,
        videos: videos ? videos : [],
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
