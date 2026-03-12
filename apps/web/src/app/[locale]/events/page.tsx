import { EventsLandingPage } from "./events";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import { uniqBy, orderBy } from "lodash";
import {
  fetchCalendarEvents,
  fetchCalendarRiverEvents,
} from "@/lib/events/fetchCalendarEvents";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

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

  // Solanamerica calendar
  let usEvents = await fetchCalendarEvents("cal-TLgSVhf1CeO04x3", {
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

  const sortInstructions = [[(x: any) => x.schedule.from], ["asc"]];

  // sorted and unique main events
  let sorted = orderBy([...mainEvents], ...sortInstructions);
  let unique = uniqBy(sorted, "key");

  // sorted community events
  let sortedCommunity = orderBy(
    [...communityEvents, ...communityRiverEvents],
    ...sortInstructions,
  );

  // Set featured event: prefer explicitly marked featured, else first by date
  let featuredEvent =
    unique.find((e: any) => e.featured === true) || unique[0] || null;
  let events = [...unique];

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
