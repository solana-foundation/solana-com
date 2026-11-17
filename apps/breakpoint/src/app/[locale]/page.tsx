import type { Metadata } from "next";
import { getTranslations } from "@workspace/i18n/server";
import HeroSection from "@/components/sections/HeroSection";
import PageShell from "@/components/PageShell";
import Marquee from "@/components/Marquee";
import NarrativeSection from "@/components/sections/NarrativeSection";
import TicketsSection from "@/components/sections/TicketsSection";
import SpeakersSection from "@/components/sections/SpeakersSection";
import WhyAttendSection from "@/components/sections/WhyAttendSection";
import GallerySection from "@/components/sections/GallerySection";
import StatsSection from "@/components/sections/StatsSection";
import SponsorsSection from "@/components/sections/SponsorsSection";
import EventsSection from "@/components/sections/EventsSection";
import HighlightsSection from "@/components/sections/HighlightsSection";
import AnnouncementsSection from "@/components/sections/AnnouncementsSection";
import NextEditionBar from "@/components/sections/NextEditionBar";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/sections/Footer";
import LiveEventSection from "@/components/sections/live/LiveEventSection";
import { LiveScheduleProvider } from "@/components/sections/live/LiveScheduleProvider";
import { getLiveAgenda } from "@/content/live/agenda";
import VenueMapSection from "@/components/sections/VenueMapSection";
import {
  isLiveConference,
  isProductionDeployment,
  resolveConferenceState,
  type SearchParams,
} from "@/content/conference-state";
import { GENERAL_ADMISSION_HREF } from "@/content/links";
import { isNextEditionVisible, NEXT_EDITION } from "@/content/next-edition";
import { getHomeMetadata } from "@/app/metadata";
import { buildBreakpointJsonLd, serializeJsonLd } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

type HomePageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<SearchParams>;
};

export async function generateMetadata({
  params,
  searchParams,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const state = resolveConferenceState(await searchParams);
  return getHomeMetadata(locale, state);
}

export default async function HomePage({
  params,
  searchParams,
}: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "breakpoint" });
  const initialNow = Date.now();
  const jsonLd = await buildBreakpointJsonLd(locale);
  const requestSearchParams = await searchParams;
  const live = isLiveConference(resolveConferenceState(requestSearchParams));
  const nextEdition = isNextEditionVisible(requestSearchParams) ? (
    <NextEditionBar announcement={NEXT_EDITION} />
  ) : null;
  // One agenda load feeds the stream hero, today's sessions and the map.
  const liveAgenda = live ? await getLiveAgenda() : [];

  return (
    <PageShell
      contentId="breakpoint-content"
      navigation={
        live
          ? {
              ctaAlwaysVisible: true,
              ctaHref: "/schedule",
              ctaLabel: t("navigation.agenda"),
            }
          : {
              ctaHref: GENERAL_ADMISSION_HREF,
              ctaLabel: t("menu.items.register"),
            }
      }
      beforeNavigation={
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      }
    >
      {live ? (
        <>
          <LiveScheduleProvider
            allowClockPreview={!isProductionDeployment()}
            initialItems={liveAgenda}
            initialNow={initialNow}
          >
            <LiveEventSection belowHero={nextEdition} />
            <VenueMapSection />
          </LiveScheduleProvider>
          <Marquee />
          <SponsorsSection />
          <SpeakersSection />
          <EventsSection />
          <FAQSection />
        </>
      ) : (
        <>
          <HeroSection roomBelow={Boolean(nextEdition)} />
          {/* From md up the hero is a fixed height with its copy pinned to
              the bottom edge, so the space above the bar is added here. */}
          {nextEdition && (
            <div className="bg-black md:pt-xl">{nextEdition}</div>
          )}
          <NarrativeSection />
          <Marquee />
          <TicketsSection initialNow={initialNow} />
          <VenueMapSection />
          <WhyAttendSection />
          <SponsorsSection />
          <SpeakersSection />
          <GallerySection />
          <StatsSection />
          <Marquee />
          <EventsSection />
          <HighlightsSection />
          <AnnouncementsSection />
          <FAQSection />
        </>
      )}
      <Footer />
    </PageShell>
  );
}
