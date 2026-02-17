import EventSingleCard from "./EventsSingleCard";
import EventsSingleRow from "./EventsSingleRow";

interface EventImage {
  primary?:
    | {
        src?: string;
        alt?: string;
      }
    | string;
}

interface EventSchedule {
  from?: string | Date;
  to?: string | Date;
  timezone?: string;
}

interface Event {
  title: string;
  platform?: string;
  key?: string;
  rsvp?: string;
  lumaUrl?: string;
  img?: EventImage;
  schedule?: EventSchedule;
  type?: string;
}

interface EventsListProps {
  list: Event[];
  isCompact?: boolean;
}

const EventsList = ({ list, isCompact }: EventsListProps) => {
  return (
    <div className="my-6">
      <div className="row">
        {isCompact ? (
          <>
            {list.map((event, index) => {
              return (
                <div className="col-sm-6 my-2" key={index}>
                  <EventsSingleRow event={event} />
                </div>
              );
            })}
          </>
        ) : (
          list.map((event, index) => {
            return (
              <div className="col-lg-3 col-md-4 col-sm-6 mb-5" key={index}>
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
