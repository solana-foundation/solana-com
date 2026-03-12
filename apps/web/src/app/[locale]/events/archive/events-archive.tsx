"use client";

import { StrictMode, useState } from "react";
import EventsHeroSection from "@/components/events/EventsHeroSection";
import EventsList from "@/components/events/EventsList";
import EventsArchivePagination from "@/components/events/archive/EventsArchivePagination";

interface EventsArchivePageProps {
  events: any[];
}

export function EventsArchivePage({ events }: EventsArchivePageProps) {
  const [page, setPage] = useState(0);
  const TOTAL_EVENTS_PER_PAGE = 8;

  const pageEvents = events.slice(
    page * TOTAL_EVENTS_PER_PAGE,
    page * TOTAL_EVENTS_PER_PAGE + TOTAL_EVENTS_PER_PAGE,
  );

  return (
    <StrictMode>
      <div className="overflow-hidden">
        <EventsHeroSection type="archive" />

        <div className="container pb-10">
          <EventsList list={pageEvents} />
          <EventsArchivePagination
            initialPageSize={TOTAL_EVENTS_PER_PAGE}
            totalCount={events.length}
            currentPage={page}
            setCurrentPage={setPage}
          />
        </div>
      </div>
    </StrictMode>
  );
}
