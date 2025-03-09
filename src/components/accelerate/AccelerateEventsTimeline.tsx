import styles from "./AccelerateEventsTimeline.module.scss";

interface EventSchedule {
  from: Date;
  to: Date;
  timezone: string;
}

interface EventVenue {
  city: string;
  city_state: string;
  region?: string;
  country?: string;
  address?: string;
}

interface EventImage {
  primary: string;
  alt: string;
}

interface Event {
  key: string;
  title: string;
  description: string;
  schedule: EventSchedule;
  img: EventImage;
  venue: EventVenue;
  rsvp: string;
}

interface AccelerateEventsTimelineProps {
  events: Event[];
}

const AccelerateEventsTimeline = ({
  events,
}: AccelerateEventsTimelineProps) => {
  const groupedEvents = events.reduce(
    (groups, event) => {
      const date = new Date(event.schedule.from).toISOString().split("T")[0];
      (groups[date] = groups[date] || []).push(event);
      return groups;
    },
    {} as Record<string, Event[]>,
  );

  const sortedDays = Object.entries(groupedEvents)
    .map(([date, dayEvents]) => ({
      date: new Date(date),
      events: dayEvents.sort(
        (a, b) =>
          new Date(a.schedule.from).getTime() -
          new Date(b.schedule.from).getTime(),
      ),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDay = (date: Date): string => {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  if (!events.length) return <></>;

  return (
    <div className={styles.timeline}>
      {sortedDays.map(({ date, events }) => (
        <div key={date.toISOString()} className={styles.dayCard}>
          <div className={styles.dayHeader}>
            <div className={styles.dayName}>{formatDay(date)}</div>
            <div className={styles.dayNumber}>{date.getDate()}</div>
          </div>
          <div className={styles.eventsList}>
            {events.map((event) => (
              <a
                key={event.key}
                className={styles.eventCard}
                href={event.rsvp}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                <div className={styles.eventImage}>
                  <img src={event.img.primary} alt={event.img.alt} />
                </div>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <div className={styles.eventDetails}>
                  <div className={styles.eventLocation}>
                    <span className={styles.icon}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 10.8333C11.3807 10.8333 12.5 9.71404 12.5 8.33333C12.5 6.95262 11.3807 5.83333 10 5.83333C8.61929 5.83333 7.5 6.95262 7.5 8.33333C7.5 9.71404 8.61929 10.8333 10 10.8333Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 17.5L14.5857 13.0857C15.8457 11.8257 16.6667 10.1667 16.6667 8.33333C16.6667 4.65667 13.6767 1.66667 10 1.66667C6.32334 1.66667 3.33334 4.65667 3.33334 8.33333C3.33334 10.1667 4.15434 11.8257 5.41434 13.0857L10 17.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {event.venue.city_state}
                  </div>
                  <div className={styles.eventTime}>
                    <span className={styles.icon}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 5.83333V10L12.5 12.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {formatTime(new Date(event.schedule.from))} -{" "}
                    {formatTime(new Date(event.schedule.to))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccelerateEventsTimeline;
