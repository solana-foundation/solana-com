import { EventsLandingPage } from "./events";
import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import orderBy from "lodash/orderBy";
import uniqBy from "lodash/uniqBy";
import {
  buildEventsJsonLd,
  EVENTS_PATH,
  EVENTS_SOCIAL_IMAGE,
  serializeJsonLd,
} from "@/lib/events/structuredData";
import {
  type CalendarEvent,
  fetchCalendarEvents,
  isUpcomingEvent,
} from "@/lib/events/fetchCalendarEvents";

type Props = { params: Promise<{ locale: string }> };

// Rebuild the listing on each request so an event disappears when it ends.
// Luma responses remain cached to avoid refetching every request.
export const revalidate = 0;

const EVENTS_REVALIDATE_SECONDS = 86400;

// Private Luma events are not included in the calendar API response.
const staticEvents: CalendarEvent[] = [
  {
    key: "sol-suits",
    title: "Solana & Suits",
    description: "Solana & Suits",
    rsvp: "https://luma.com/sol-suits",
    schedule: {
      from: "2026-10-05T09:00:00.000Z",
      to: "2026-10-05T18:30:00.000Z",
      timezone: "Europe/London",
    },
    img: {
      primary:
        "https://images.lumacdn.com/uploads/c7/d8ffff05-2be9-4940-8c0f-3b52c9aef378.png",
      alt: "Solana & Suits",
    },
    venue: {
      city: "London",
      region: "England",
      city_state: "London, United Kingdom",
      country: "United Kingdom",
      address: null,
    },
  },
];

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
    breakpointSideEvents,
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
    // Breakpoint 2026 community side events (https://luma.com/BP-SideEvents)
    fetchCalendarEvents(
      "cal-NFEDisEmJoSg0TU",
      { period: "future" },
      { revalidate: EVENTS_REVALIDATE_SECONDS, fetchAllPages: true },
    ),
    getTranslations(),
  ]);

  const now = Date.now();
  // sorted and unique main events
  const sorted = sortByStartDate(
    [
      ...staticEvents,
      ...mainEvents,
      ...breakpointEvents,
      ...solanaAccelerateEvents,
    ].filter((event) => isUpcomingEvent(event, now)),
  );
  const unique = uniqBy(sorted, "key");
  const mainEventKeys = new Set(unique.map((event) => event.key));

  // sorted community events
  const sortedCommunity = uniqBy(
    sortByStartDate(
      [...communityEvents, ...breakpointSideEvents].filter(
        (event) => isUpcomingEvent(event, now) && !mainEventKeys.has(event.key),
      ),
    ),
    "key",
  );
  const upcomingUsEvents = usEvents.filter((event) =>
    isUpcomingEvent(event, now),
  );

  // Set featured event: prefer explicitly marked featured, else first by date
  const featuredEvent =
    unique.find((e) => e.featured === true) || unique[0] || null;
  const events = [...unique];

  const seoTitle = t("events.meta.seoTitle");
  const seoDescription = t("events.meta.seoDescription");
  const structuredData = buildEventsJsonLd({
    events: uniqBy([...events, ...upcomingUsEvents, ...sortedCommunity], "key"),
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
        usEvents={upcomingUsEvents}
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
