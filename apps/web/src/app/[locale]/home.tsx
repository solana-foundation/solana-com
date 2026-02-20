"use client";

import { Hero } from "@/components/index/hero";
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
import { CalendarEvent } from "@/lib/events/fetchCalendarEvents";
import { Performance } from "@/components/index/performance";
import dynamic from "next/dynamic";
import defaultImg from "@@/assets/events/solana-event.jpg";
import { Projects } from "@/components/index/projects";
import { BigBannerCard } from "@/component-library/big-banner-card";
import { BigVideoCard } from "@/component-library/big-video-card";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { YouTubePlaylistItem } from "@/lib/youtube/types";
import { Community } from "@/components/index/community";
import { WhatsUp } from "@/components/index/whats-up";
import { Decor } from "@/components/index/decor";
import Avatar from "@@/public/src/img/icons/Avatar.inline.svg";
import Bank from "@@/public/src/img/icons/Bank.inline.svg";
import CodeFilled from "@@/public/src/img/icons/CodeFilled.inline.svg";
import { PostItem } from "@/types/media";
import { fetchLatestPosts } from "@/lib/media/post";
import { useEffect, useState, useMemo } from "react";

const TransactionsStat = dynamic(
  () =>
    import("@/components/index/transactions-stat").then(
      (mod) => mod.TransactionsStat,
    ),
  {
    ssr: false,
  },
);

interface HomePageProps {
  translations: {
    heroTitle: React.ReactNode;
    heroSubtitle: string;
    heroBannerEyebrow: string;
    heroBannerDescription: string;
    heroBannerLabel: string;
    heroCta: string;
    getStartedTitle: string;
    getStartedTabInstitution: string;
    getStartedTabUser: string;
    getStartedTabDeveloper: string;
    getStartedLinksInstitution: string[];
    getStartedLinksDeveloper: string[];
    getStartedLinksUser: string[];
    eventsTitle: React.ReactNode;
    eventsSubtitle: string;
    eventsCta: string;
    performanceTitle: React.ReactNode;
    performanceSubtitle: string;
    performanceCounterLabels: string[];
    performanceStats: { value: string; label: string }[];
    whatsUpTitle: React.ReactNode;
    whatsUpCta: string;
    projectsTitle: React.ReactNode;
    projectsCta: string;
    projectsTranslations: { name: string; stat: string; statLabel: string }[];
    newsTitle: React.ReactNode;
    newsButton: string;
    videosTitle: string;
    videosSubtitle: React.ReactNode;
    communityTitle: React.ReactNode;
    communitySubtitle: string;
    communityLinksTranslations: { title: string; description: string }[];
  };
  events: (Omit<CalendarEvent, "schedule"> & {
    schedule: CalendarEvent["schedule"] & { from: string; to: string };
  })[];
  firstFeaturedEventIndex: number;
  videos: YouTubePlaylistItem[];
  news: PostItem[];
}

export function HomePage({
  translations,
  events,
  firstFeaturedEventIndex,
  videos,
  news,
}: HomePageProps) {
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
    <div className="bg-nd-bg">
      <Hero
        title={translations.heroTitle}
        subtitle={translations.heroSubtitle}
        bannerEyebrow="Graveyard Hack"
        bannerDescription="Build undead ideas on Solana. Join from February 12-27, 2026 and compete for prizes."
        bannerImgSrc="/assets/graveyard-hack/background.png"
        // rm bannerHref and bannerLabel to hide banner
        bannerHref="/graveyard-hack"
        bannerLabel="Explore Graveyard Hack"
        bannerExpiryDate="2026-02-27"
        cta={translations.heroCta}
        bgJsonFilePath="/src/img/index/hero-bg.json"
        bgImageSrc="/src/img/index/hero-bg.webp"
        getStartedTitle={translations.getStartedTitle}
        getStartedTabs={[
          {
            id: "institution",
            title: translations.getStartedTabInstitution,
            Icon: Bank,
          },
          {
            id: "user",
            title: translations.getStartedTabUser,
            Icon: Avatar,
          },
          {
            id: "developer",
            title: translations.getStartedTabDeveloper,
            Icon: CodeFilled,
          },
        ]}
        getStartedLinks={{
          institution: GET_STARTED_LINKS.institution.map((item, index) => ({
            title: translations.getStartedLinksInstitution[index],
            href: item.href,
          })),
          developer: GET_STARTED_LINKS.developer.map((item, index) => ({
            title: translations.getStartedLinksDeveloper[index],
            href: item.href,
          })),
          user: GET_STARTED_LINKS.user.map((item, index) => ({
            title: translations.getStartedLinksUser[index],
            href: item.href,
          })),
        }}
      />

      <Logos
        className="h-[73px] xl:h-[123px] gap-4 md:gap-3 xl:gap-4 justify-evenly max-w-screen-2xl w-full mx-auto px-5 md:px-8 xl:px-10 py-6 xl:py-11 mt-4 md:mt-6 xl:mt-8"
        itemClassName="h-full m-0 !mr-0 flex-shrink-0"
        logos={LOGOS}
        animation={false}
      />

      <Divider className="pt-4" />

      {filteredAndSortedEvents.length > 0 && (
        <>
          <CardCarouselSection
            title={translations.eventsTitle}
            totalItems={filteredAndSortedEvents.length}
            desktopLastPageOffset={2}
            tabletLastPageOffset={2}
            desktop2xlLastPageOffset={3}
            cardWidthClassName="w-full md:w-[356px] xl:w-[456px]"
            startIndex={firstFeaturedEventIndex}
            cta={translations.eventsCta}
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
                className="px-1"
              />
            ))}
          </CardCarouselSection>
          <Divider />
        </>
      )}

      <Performance
        title={translations.performanceTitle}
        subtitle={translations.performanceSubtitle}
        counters={[
          {
            value: <TransactionsStat variant="total" />,
            label: translations.performanceCounterLabels[0],
            Icon: "/src/img/index/icons/steps.svg",
          },
          {
            value: <TransactionsStat variant="per-sec" />,
            label: translations.performanceCounterLabels[1],
            Icon: "/src/img/index/icons/speed.svg",
          },
        ]}
        stats={translations.performanceStats}
        bgJsonFilePath="/src/img/index/performance-bg.json"
        bgImageSrc="/src/img/index/performance-bg.webp"
      />

      <Divider />

      <WhatsUp
        title={translations.whatsUpTitle}
        cta={translations.whatsUpCta}
        ctaHref="/news"
      />

      <Divider />

      <Projects
        className="z-1"
        title={translations.projectsTitle}
        projects={PROJECTS.map((item, index) => ({
          ...item,
          name: translations.projectsTranslations[index].name,
          stat: translations.projectsTranslations[index].stat,
          statLabel: translations.projectsTranslations[index].statLabel,
        }))}
        bgSrc="/src/img/index/projects-bg.webp"
        logos={PROJECTS_LOGOS}
        cta={translations.projectsCta}
        ctaHref="/solutions/tokenization"
      />

      <Decor />

      <CardCarouselSection
        title={translations.newsTitle}
        totalItems={newsToDisplay.length}
        cardWidthClassName="w-full md:w-[700px] xl:w-[1360px]"
      >
        {newsToDisplay.map((item) => (
          <BigBannerCard
            key={item.id}
            className="px-1"
            imageSrc={item.heroImage}
            title={item.title}
            description={item.description}
            href={item.url}
            buttonLabel={translations.newsButton}
          />
        ))}
      </CardCarouselSection>

      <Divider />

      <CardCarouselSection
        title={translations.videosTitle}
        subtitle={translations.videosSubtitle}
        totalItems={videos.length}
        cardWidthClassName="w-full md:w-[700px] xl:w-[800px]"
      >
        {videos.map((item) => (
          <BigVideoCard
            key={item.id}
            id={item.contentDetails.videoId}
            thumbnail={item.snippet.thumbnails.maxres.url}
            alt={item.snippet.title}
            className="px-1"
            title={item.snippet.title}
          />
        ))}
      </CardCarouselSection>

      <Community
        title={translations.communityTitle}
        subtitle={translations.communitySubtitle}
        bgJsonFilePath="/src/img/index/community-bg.json"
        bgImageSrc="/src/img/index/projects-bg.webp"
        links={LINKS.map((item, index) => ({
          ...item,
          title: translations.communityLinksTranslations[index].title,
          description:
            translations.communityLinksTranslations[index].description,
        }))}
      />

      <VideoPlayerModal />
    </div>
  );
}
