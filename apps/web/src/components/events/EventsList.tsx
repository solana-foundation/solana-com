import EventSingleCard from "./EventsSingleCard";
import EventsSingleRow from "./EventsSingleRow";
import { Stagger } from "./EventsMotion";
import type { CalendarEvent } from "@/lib/events/fetchCalendarEvents";

interface EventsListProps {
  list: CalendarEvent[];
  animate?: boolean;
  isCompact?: boolean;
  /** Number of columns for the compact (row) layout on large screens. */
  compactColumns?: 1 | 2;
  emptyLabel?: string;
}

const EventsList = ({
  list,
  animate = true,
  isCompact,
  compactColumns = 1,
  emptyLabel,
}: EventsListProps) => {
  if (!list.length) {
    if (!emptyLabel) return null;

    return (
      <div className="py-16 text-center font-brand-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
        {emptyLabel}
      </div>
    );
  }

  if (isCompact) {
    const compactClassName =
      compactColumns === 2
        ? "border-t border-white/10 md:grid md:grid-cols-2 md:gap-x-12"
        : "border-t border-white/10";

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
      <Stagger className={compactClassName}>{rows}</Stagger>
    ) : (
      <div className={compactClassName}>{rows}</div>
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
