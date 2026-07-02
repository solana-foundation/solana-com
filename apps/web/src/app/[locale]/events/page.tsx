import { EventsLandingPage } from "./events";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import { uniqBy, orderBy } from "lodash";
import scaleOrDieImg from "@@/assets/events/scaleordie.jpg";
import {
  fetchCalendarEvents,
  fetchCalendarRiverEvents,
  type CalendarEvent,
} from "@/lib/events/fetchCalendarEvents";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

const scaleOrDieEvent: CalendarEvent = {
  key: "scale-or-die-26",
  title: "Accelerate Scale or Die",
  description:
    "Solana's application-only summit for engineers, validators, protocol developers, infrastructure teams, and researchers pushing the network to its limits.",
  rsvp: "https://luma.com/scale-or-die-26",
  schedule: {
    from: "2026-11-14T09:30:00.000Z",
    to: "2026-11-14T18:30:00.000Z",
    timezone: "Europe/London",
  },
  img: {
    primary: scaleOrDieImg.src,
    alt: "Accelerate Scale or Die",
  },
  venue: {
    city: "London",
    region: "England",
    city_state: "London, United Kingdom",
    country: "United Kingdom",
    address: null,
  },
};

export default async function Page(_props: Props) {
  // Solana Foundation calendar
  let mainEvents = await fetchCalendarEvents("cal-J8WZ4jDbwzD9TWi", {
    period: "future",
  });

  // Breakpoint 2026 calendar (https://luma.com/bp26)
  const bp26Events = await fetchCalendarEvents("cal-vSUPHVSJHqgysCR", {
    period: "future",
  });

  // Merge Breakpoint 2026 events with main events
  mainEvents = [...mainEvents, ...bp26Events];
  if (
    !mainEvents.some(
      ({ key, rsvp }) =>
        key === scaleOrDieEvent.key ||
        rsvp === scaleOrDieEvent.rsvp ||
        rsvp === "https://lu.ma/scale-or-die-26",
    )
  ) {
    mainEvents.push(scaleOrDieEvent);
  }

  // Solanamerica calendar
  const usEvents = await fetchCalendarEvents("cal-TLgSVhf1CeO04x3", {
    period: "future",
  });

  // Community calendar
  const communityEvents = await fetchCalendarEvents("cal-C0cmhNE8Qz3xF5r", {
    period: "future",
  });

  const communityRiverEvents = await fetchCalendarRiverEvents({
    time: "future",
    limit: 20,
  });

  const sortInstructions = [
    [(x: { schedule: { from: string | null } }) => x.schedule.from],
    ["asc"],
  ];

  // sorted and unique main events
  const sorted = orderBy([...mainEvents], ...sortInstructions);
  const unique = uniqBy(sorted, "key");

  // sorted community events
  const sortedCommunity = orderBy(
    [...communityEvents, ...communityRiverEvents],
    ...sortInstructions,
  );

  // Set featured event: prefer explicitly marked featured, else first by date
  const featuredEvent =
    unique.find((e) => e.featured === true) || unique[0] || null;
  const events = [...unique];

  const t = await getTranslations();

  const translations = {
    usHeading: t("events.us.heading"),
    usDescription: t("events.us.description"),
    communityHeading: t("events.community.heading"),
    communityDescription: t("events.community.description"),
    submitEvent: t("commands.submit-event"),
    hostEvent: t("commands.host-event"),
    archive: t("events.archive.archive"),
  };

  return (
    <EventsLandingPage
      events={events}
      communityEvents={sortedCommunity}
      featuredEvent={featuredEvent}
      usEvents={usEvents}
      translations={translations}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations();
  return {
    title: t("titles.events"),
    description: t("events.description"),
    alternates: getAlternates("/events", locale),
  };
}
