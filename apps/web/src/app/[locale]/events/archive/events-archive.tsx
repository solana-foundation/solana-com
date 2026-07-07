"use client";

import EventsHeroSection from "@/components/events/EventsHeroSection";
import EventsList from "@/components/events/EventsList";
import EventsArchivePagination, {
  type EventsArchivePaginationProps,
} from "@/components/events/archive/EventsArchivePagination";
import type { CalendarEvent } from "@/lib/events/fetchCalendarEvents";

interface EventsArchivePageProps {
  events: CalendarEvent[];
  emptyLabel: string;
  pagination: EventsArchivePaginationProps;
}

export function EventsArchivePage({
  events,
  emptyLabel,
  pagination,
}: EventsArchivePageProps) {
  return (
    <div className="overflow-hidden bg-black text-white">
      <EventsHeroSection type="archive" />

      <main className="container py-16 md:py-24">
        <EventsList
          list={events}
          animate={false}
          isCompact
          compactColumns={2}
          emptyLabel={emptyLabel}
        />
        <EventsArchivePagination {...pagination} />
      </main>
    </div>
  );
}
