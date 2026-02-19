import { EventsArchivePage } from "./events-archive";
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
    period: "past",
  });

  // HH calendar
  let hhEvents = await fetchCalendarEvents("cal-dLrjJu0Dqay3WBe", {
    period: "past",
  });

  // Community calendar
  const communityEvents = await fetchCalendarEvents("cal-C0cmhNE8Qz3xF5r", {
    period: "past",
  });

  // Community River calendar
  const communityRiverEvents = await fetchCalendarRiverEvents({
    time: "past",
    limit: 20,
  });

  const sortInstructions = [[(x: any) => x.schedule.from], ["desc"]];
  const sorted = orderBy(
    [...mainEvents, ...hhEvents, ...communityEvents, ...communityRiverEvents],
    ...sortInstructions,
  );
  let unique = uniqBy(sorted, "key");

  return <EventsArchivePage events={unique} />;
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
