import { EventsLandingPage } from "./events";
import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import { uniqBy, orderBy } from "lodash";
import {
  buildEventsJsonLd,
  EVENTS_PATH,
  EVENTS_SOCIAL_IMAGE,
  serializeJsonLd,
} from "@/lib/events/structuredData";
import {
  type CalendarEvent,
  fetchCalendarEvents,
} from "@/lib/events/fetchCalendarEvents";

type Props = { params: Promise<{ locale: string }> };

const EVENTS_REVALIDATE_SECONDS = 24 * 60 * 60;

export const revalidate = EVENTS_REVALIDATE_SECONDS;

const sortByStartDate = (events: CalendarEvent[]) =>
  orderBy(
    events,
    [
      (event) =>
        event.schedule.from
          ? new Date(event.schedule.from).getTime()
          : Number.POSITIVE_INFINITY,
    ],
    ["asc"],
  );

export default async function Page({ params }: Props) {
  const [
    { locale },
    mainEvents,
    breakpointEvents,
    solanaAccelerateEvents,
    usEvents,
    communityEvents,
    t,
  ] = await Promise.all([
    params,
    // Solana Foundation calendar
    fetchCalendarEvents(
      "cal-J8WZ4jDbwzD9TWi",
      {
        period: "future",
      },
      { revalidate: EVENTS_REVALIDATE_SECONDS },
    ),
    // Breakpoint 2026 calendar (https://luma.com/bp26)
    fetchCalendarEvents(
      "evgrp-f8F1bDAHhBNDM1f",
      {
        period: "future",
      },
      { revalidate: EVENTS_REVALIDATE_SECONDS },
    ),
    // Solana Accelerate calendar (https://luma.com/solana-accelerate)
    fetchCalendarEvents(
      "cal-78uQDEIMsmrT3GN",
      {
        period: "future",
      },
      { revalidate: EVENTS_REVALIDATE_SECONDS },
    ),
    // Solanamerica calendar
    fetchCalendarEvents(
      "cal-TLgSVhf1CeO04x3",
      {
        period: "future",
      },
      { revalidate: EVENTS_REVALIDATE_SECONDS },
    ),
    // Community calendar
    fetchCalendarEvents(
      "cal-C0cmhNE8Qz3xF5r",
      {
        period: "future",
      },
      { revalidate: EVENTS_REVALIDATE_SECONDS },
    ),
    getTranslations(),
  ]);

  // sorted and unique main events
  const sorted = sortByStartDate([
    ...mainEvents,
    ...breakpointEvents,
    ...solanaAccelerateEvents,
  ]);
  const unique = uniqBy(sorted, "key");

  // sorted community events
  const sortedCommunity = uniqBy(sortByStartDate(communityEvents), "key");

  // Set featured event: prefer explicitly marked featured, else first by date
  const featuredEvent =
    unique.find((e) => e.featured === true) || unique[0] || null;
  const events = [...unique];

  const seoTitle = t("events.meta.seoTitle");
  const seoDescription = t("events.meta.seoDescription");
  const structuredData = buildEventsJsonLd({
    events: uniqBy([...events, ...usEvents, ...sortedCommunity], "key"),
    locale,
    title: seoTitle,
    description: seoDescription,
  });

  const translations = {
    usHeading: t("events.us.heading"),
    usDescription: t("events.us.description"),
    communityHeading: t("events.community.heading"),
    communityDescription: t("events.community.description"),
    submitEvent: t("commands.submit-event"),
    archive: t("events.archive.archive"),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <EventsLandingPage
        events={events}
        communityEvents={sortedCommunity}
        featuredEvent={featuredEvent}
        usEvents={usEvents}
        translations={translations}
      />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();
  const title = t("events.meta.seoTitle");
  const description = t("events.meta.seoDescription");
  const alternates = getAlternates(EVENTS_PATH, locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      type: "website",
      url: alternates.canonical,
      images: [EVENTS_SOCIAL_IMAGE],
    },
    twitter: {
      title,
      description,
      images: [EVENTS_SOCIAL_IMAGE],
    },
  };
}
