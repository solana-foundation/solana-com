import Image from "next/image";
import Link from "../../utils/Link";
import EventsSingleLocation from "./EventsSingleLocation";
import FormattedDate from "../shared/FormattedDate";
import defaultImg from "../../../assets/events/solana-event.jpg";
import { CalendarEvent } from "@/lib/events/fetchCalendarEvents";

const EventsSingleCard = ({ event }: { event?: CalendarEvent }) => {
  const eventUrl =
    event?.platform === "external" ? event.key! : event?.rsvp || event?.lumaUrl;

  return event ? (
    <Link
      className="link-unstyled group"
      target="_blank"
      rel={
        eventUrl && !eventUrl.includes("solana.com") ? "nofollow" : undefined
      }
      to={eventUrl}
    >
      <div className="relative overflow-hidden aspect-square group-hover:rounded-[0.5rem_0.5rem_0_0]">
        <Image
          alt={(event?.img?.primary as { alt?: string })?.alt || event.title!}
          src={(event?.img?.primary as string) || defaultImg}
          fill
          className="object-contain transition-all duration-[400ms] group-hover:scale-105"
        />
      </div>
      <div className="transition-all duration-[400ms] border border-transparent px-4 py-10 group-hover:border-[#333333] group-hover:rounded-[0_0_0.5rem_0.5rem]">
        <h3 className="h6">{event.title}</h3>
        <p
          className="small date text-[#80ecff]"
          suppressHydrationWarning={true}
        >
          {event?.schedule?.from && (
            <FormattedDate
              date={event?.schedule?.from}
              format="E, MMM d"
              timezone={event?.schedule?.timezone}
            />
          )}
          {event?.schedule?.to &&
            event?.schedule?.from &&
            new Date(event?.schedule?.from).getDay() !==
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
        <div className="small">
          <small className="block text-sm leading-[130%] break-words overflow-hidden">
            <EventsSingleLocation event={event} />
          </small>
          <small className="text-sm leading-[130%] break-words">
            {event.type}
          </small>
        </div>
      </div>
    </Link>
  ) : (
    <></>
  );
};

export default EventsSingleCard;
