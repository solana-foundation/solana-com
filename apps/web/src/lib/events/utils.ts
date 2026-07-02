import type { CalendarEvent } from "./fetchCalendarEvents";

export function hasDifferentEndDay(event: CalendarEvent) {
  if (!event.schedule.from || !event.schedule.to) return false;

  const timeZone = event.schedule.timezone || "UTC";
  const formatter = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone,
  });

  return (
    formatter.format(new Date(event.schedule.from)) !==
    formatter.format(new Date(event.schedule.to))
  );
}
