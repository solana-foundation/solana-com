import { EventsArchivePage } from "./events-archive";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import { uniqBy, orderBy } from "lodash";
import {
  type CalendarEvent,
  fetchCalendarEvents,
} from "@/lib/events/fetchCalendarEvents";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

export const revalidate = 60;

const ARCHIVE_EVENTS_PER_PAGE = 24;
// Pull a deep slice of past events per calendar in a single request so the
// archive has real depth without paginating the upstream API.
const ARCHIVE_FETCH_LIMIT = 100;
const ARCHIVE_CALENDAR_IDS = [
  // Solana Foundation calendar
  "cal-J8WZ4jDbwzD9TWi",
  // HH calendar
  "cal-dLrjJu0Dqay3WBe",
  // Community calendar
  "cal-C0cmhNE8Qz3xF5r",
] as const;

const sortByStartDateDesc = (events: CalendarEvent[]) =>
  orderBy(
    events,
    [
      (event) =>
        event.schedule.from
          ? new Date(event.schedule.from).getTime()
          : Number.NEGATIVE_INFINITY,
    ],
    ["desc"],
  );

async function fetchArchiveEvents() {
  const eventGroups = await Promise.all(
    ARCHIVE_CALENDAR_IDS.map((calendarId) =>
      fetchCalendarEvents(calendarId, {
        period: "past",
        pagination_limit: ARCHIVE_FETCH_LIMIT,
      }),
    ),
  );

  return uniqBy(sortByStartDateDesc(eventGroups.flat()), "key");
}

function parsePageParam(value?: string | string[]) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const requestedPage = Number.parseInt(rawValue ?? "", 10);

  return Number.isFinite(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;
}

export default async function Page({ searchParams }: Props) {
  const [events, params, t] = await Promise.all([
    fetchArchiveEvents(),
    searchParams,
    getTranslations(),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(events.length / ARCHIVE_EVENTS_PER_PAGE),
  );
  const currentPage = Math.min(parsePageParam(params.page), totalPages);
  const pageStart = (currentPage - 1) * ARCHIVE_EVENTS_PER_PAGE;
  const pageEnd = Math.min(pageStart + ARCHIVE_EVENTS_PER_PAGE, events.length);
  const pageEvents = events.slice(pageStart, pageEnd);
  const eventRange = events.length > 0 ? `${pageStart + 1} - ${pageEnd}` : "0";

  return (
    <EventsArchivePage
      events={pageEvents}
      pagination={{
        currentPage,
        eventCountLabel: t("events.archive.event-count", {
          current: eventRange,
          total: events.length,
        }),
        pageEnd,
        previousLabel: t("events.archive.previous-page"),
        nextLabel: t("events.archive.next-page"),
        totalCount: events.length,
        totalPages,
      }}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations();
  return {
    title: t("events.archive.page-title"),
    description: t("events.description"),
    alternates: getAlternates("/events/archive", locale),
  };
}
