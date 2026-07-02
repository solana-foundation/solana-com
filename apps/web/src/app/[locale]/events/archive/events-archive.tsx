"use client";

import EventsHeroSection from "@/components/events/EventsHeroSection";
import EventsList from "@/components/events/EventsList";
import EventsArchivePagination, {
  type EventsArchivePaginationProps,
} from "@/components/events/archive/EventsArchivePagination";
import type { CalendarEvent } from "@/lib/events/fetchCalendarEvents";

interface EventsArchivePageProps {
  events: CalendarEvent[];
  pagination: EventsArchivePaginationProps;
}

export function EventsArchivePage({
  events,
  pagination,
}: EventsArchivePageProps) {
  return (
    <div className="overflow-hidden bg-black text-white">
      <EventsHeroSection type="archive" />

      <main className="container py-16 md:py-24">
        <EventsList list={events} animate={false} />
        <EventsArchivePagination {...pagination} />
      </main>
    </div>
  );
}
