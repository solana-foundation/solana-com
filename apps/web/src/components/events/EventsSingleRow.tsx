import Image from "next/image";

import Link from "../../utils/Link";
import EventsSingleLocation from "./EventsSingleLocation";
import FormattedDate from "../shared/FormattedDate";
import defaultImg from "../../../assets/events/solana-community-event.jpg";
import type { CalendarEvent } from "@/lib/events/fetchCalendarEvents";

const EventsSingleRow = ({ event }: { event?: CalendarEvent }) => {
  const eventUrl =
    event?.platform === "external"
      ? event.key!
      : event?.rsvp || event?.lumaUrl!;

  return event ? (
    <Link
      className="link-unstyled flex items-center group"
      target="_blank"
      rel={
        eventUrl && !eventUrl.includes("solana.com") ? "nofollow" : undefined
      }
      to={eventUrl}
    >
      <Image
        alt={(event?.img?.primary as { alt?: string })?.alt || ""}
        src={(event?.img?.primary as string) || defaultImg}
        width={150}
        height={150}
        className="transition-all duration-[400ms] object-contain overflow-hidden aspect-square group-hover:scale-105"
      />
      <div className="transition-all duration-[400ms] border border-transparent rounded-[0.25rem] p-2 w-full md:ml-2 group-hover:border-[#333333]">
        <h3 className="h6 small">{event.title}</h3>
        <p className="smaller subdued mb-0" suppressHydrationWarning={true}>
          {event?.schedule?.from && (
            <FormattedDate
              date={event?.schedule?.from}
              format="E, MMM d"
              timezone={event?.schedule?.timezone}
            />
          )}
          {event?.schedule?.to &&
            new Date(event?.schedule?.from!).getDay() !==
              new Date(event?.schedule?.to).getDay() && (
              <>
                <span className="mx-1">-</span>
                <FormattedDate
                  date={event?.schedule?.to}
                  format="E, MMM d"
                  timezone={event?.schedule?.timezone}
                />
              </>
            )}
        </p>
        <div className="smaller subdued">
          <EventsSingleLocation event={event} />
          <div>{event.type}</div>
        </div>
      </div>
    </Link>
  ) : (
    <></>
  );
};

export default EventsSingleRow;
