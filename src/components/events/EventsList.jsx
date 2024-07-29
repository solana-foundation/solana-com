import EventSingleCard from "./EventsSingleCard";
import EventsSingleRow from "./EventsSingleRow";

const EventsList = ({ list, isCompact }) => {
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
