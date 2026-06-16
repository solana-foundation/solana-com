import { SkylinePage } from "./skyline";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import {
  fetchCalendarEvents,
  CalendarEvent,
} from "@/lib/events/fetchCalendarEvents";
import { SKYLINE_CALENDAR_ID } from "@/data/skyline";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  let events: CalendarEvent[] = [];

  try {
    events = await fetchCalendarEvents(SKYLINE_CALENDAR_ID, {
      period: "future",
      pagination_limit: 12,
    });
    events.sort(
      (a, b) =>
        new Date(a.schedule.from ?? 0).getTime() -
        new Date(b.schedule.from ?? 0).getTime(),
    );
  } catch (error) {
    console.error(error);
  }

  return <SkylinePage events={events} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("skyline");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: getAlternates("/skyline", locale),
  };
}
