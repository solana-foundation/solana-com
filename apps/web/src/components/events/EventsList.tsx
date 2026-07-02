import EventSingleCard from "./EventsSingleCard";
import EventsSingleRow from "./EventsSingleRow";
import { Stagger } from "./EventsMotion";
import type { CalendarEvent } from "@/lib/events/fetchCalendarEvents";

interface EventsListProps {
  list: CalendarEvent[];
  animate?: boolean;
  isCompact?: boolean;
  emptyLabel?: string;
}

const EventsList = ({
  list,
  animate = true,
  isCompact,
  emptyLabel = "No events are currently scheduled.",
}: EventsListProps) => {
  if (!list.length) {
    return (
      <div className="py-16 text-center font-brand-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
        {emptyLabel}
      </div>
    );
  }

  if (isCompact) {
    const rows = list.map((event) =>
      animate ? (
        <Stagger.Item key={event.key}>
          <EventsSingleRow event={event} />
        </Stagger.Item>
      ) : (
        <div key={event.key}>
          <EventsSingleRow event={event} />
        </div>
      ),
    );

    return animate ? (
      <Stagger className="border-t border-white/10">{rows}</Stagger>
    ) : (
      <div className="border-t border-white/10">{rows}</div>
    );
  }

  const cards = list.map((event) =>
    animate ? (
      <Stagger.Item className="min-w-0" key={event.key}>
        <EventSingleCard event={event} />
      </Stagger.Item>
    ) : (
      <div className="min-w-0" key={event.key}>
        <EventSingleCard event={event} />
      </div>
    ),
  );

  return animate ? (
    <Stagger className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {cards}
    </Stagger>
  ) : (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {cards}
    </div>
  );
};

export default EventsList;
