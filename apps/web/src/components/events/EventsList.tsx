import EventSingleCard from "./EventsSingleCard";
import EventsSingleRow from "./EventsSingleRow";
import type { CalendarEvent } from "@/lib/events/fetchCalendarEvents";

interface EventsListProps {
  list: CalendarEvent[];
  isCompact?: boolean;
  emptyLabel?: string;
}

const EventsList = ({
  list,
  isCompact,
  emptyLabel = "No events are currently scheduled.",
}: EventsListProps) => {
  if (!list.length) {
    return (
      <div className="rounded-lg border border-dashed border-white/20 bg-white/[0.035] p-8 text-center text-white/60">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="my-6">
      <div
        className={
          isCompact
            ? "grid grid-cols-1 gap-4 lg:grid-cols-2"
            : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {isCompact ? (
          <>
            {list.map((event) => {
              return (
                <div className="min-w-0" key={event.key}>
                  <EventsSingleRow event={event} />
                </div>
              );
            })}
          </>
        ) : (
          list.map((event) => {
            return (
              <div className="min-w-0" key={event.key}>
                <EventSingleCard event={event} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EventsList;
