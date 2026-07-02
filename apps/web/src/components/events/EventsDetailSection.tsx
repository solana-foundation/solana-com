import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import SocialShareButtons from "../sharedPageSections/SocialShareButtons";
import FormattedDate from "../shared/FormattedDate";
import { useTranslations } from "next-intl";
import defaultImg from "../../../public/social/solana.jpg";
import { Link } from "@/utils/Link";
import { CalendarEvent } from "@/lib/events/fetchCalendarEvents";
import EventsSingleLocation from "./EventsSingleLocation";

const hasDifferentEndDay = (event: CalendarEvent) => {
  if (!event.schedule.from || !event.schedule.to) return false;

  return (
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      timeZone: event.schedule.timezone || "UTC",
    }).format(new Date(event.schedule.from)) !==
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      timeZone: event.schedule.timezone || "UTC",
    }).format(new Date(event.schedule.to))
  );
};

const EventsDetailSection = ({
  event = null,
}: {
  event?: CalendarEvent | null;
}) => {
  const t = useTranslations();
  if (!event) return null;

  const eventUrl =
    event.platform === "external" ? event.key! : event.rsvp || event.lumaUrl!;
  const rel = !eventUrl.includes("solana.com")
    ? "noopener noreferrer nofollow"
    : "noopener noreferrer";
  const hasDescription =
    !!event.description && event.description !== event.title;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
      <Link
        to={eventUrl}
        target="_blank"
        rel={rel}
        className="group relative block aspect-square overflow-hidden bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <Image
          alt={event.img.alt || event.title}
          src={(event?.img?.primary as string) || defaultImg}
          fill
          sizes="(min-width: 768px) 48vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </Link>

      <div className="flex flex-col justify-between gap-y-10 md:py-2">
        <div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-brand-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
            <span suppressHydrationWarning>
              {event?.schedule?.from && (
                <FormattedDate
                  date={event?.schedule?.from}
                  format="MMM d"
                  timezone={event?.schedule?.timezone}
                />
              )}
              {hasDifferentEndDay(event) && event.schedule.to && (
                <>
                  <span className="mx-1">–</span>
                  <FormattedDate
                    date={event.schedule.to}
                    format="MMM d"
                    timezone={event.schedule.timezone}
                  />
                </>
              )}
            </span>
            <span>
              <EventsSingleLocation event={event} />
            </span>
          </div>

          <h2 className="mt-6 font-brand text-4xl font-medium leading-[1.02] tracking-[-0.02em] text-white md:text-6xl">
            {event.title}
          </h2>

          {hasDescription && (
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/55">
              {event.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-8 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to={eventUrl}
            target="_blank"
            rel={rel}
            className="group inline-flex w-fit items-center gap-2 font-brand-mono text-[11px] uppercase tracking-[0.25em] text-white no-underline transition-colors duration-200 hover:text-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span className="border-b border-white pb-1 transition-colors duration-200 group-hover:border-white/40">
              {t("events.detail.action")}
            </span>
            <ArrowUpRight
              aria-hidden
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <SocialShareButtons
            url={eventUrl}
            title={event.title}
            className="mt-0"
          />
        </div>
      </div>
    </div>
  );
};

export default EventsDetailSection;
