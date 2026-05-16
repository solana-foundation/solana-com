import EventSingleCard from "./EventsSingleCard";
import EventsSingleRow from "./EventsSingleRow";
import type { CalendarEvent } from "@/lib/events/fetchCalendarEvents";

interface EventsListProps {
  list: CalendarEvent[];
  isCompact?: boolean;
}

const EventsList = ({ list, isCompact }: EventsListProps) => {
  return (
    <div className="my-6">
      <div className="grid grid-cols-12 gap-4">
        {isCompact ? (
          <>
            {list.map((event, index) => {
              return (
                <div className="col-span-12 sm:col-span-6 my-2" key={index}>
                  <EventsSingleRow event={event} />
                </div>
              );
            })}
          </>
        ) : (
          list.map((event, index) => {
            return (
              <div
                className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 mb-6"
                key={index}
              >
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
