import Button from "../shared/Button";
import { useTranslations } from "next-intl";
import { CalendarDays, MapPin, Radio, Users } from "lucide-react";
import type { CalendarEvent } from "@/lib/events/fetchCalendarEvents";
import EventsSingleLocation from "./EventsSingleLocation";

const statItems = [
  {
    label: "Official calendar",
    icon: CalendarDays,
    getValue: (stats: EventsHeroStats) => stats.totalEvents,
  },
  {
    label: "Community-led",
    icon: Users,
    getValue: (stats: EventsHeroStats) => stats.communityEvents,
  },
  {
    label: "Live formats",
    icon: Radio,
    getValue: (stats: EventsHeroStats) => stats.virtualAndIrl,
  },
];

type EventsHeroStats = {
  totalEvents: number;
  communityEvents: number;
  virtualAndIrl: string;
};

const getNextEventDate = (event?: CalendarEvent | null) => {
  if (!event?.schedule.from) return undefined;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: event.schedule.timezone || "UTC",
  }).format(new Date(event.schedule.from));
};

const EventsHeroSection = ({
  type = "hero",
  stats = {
    totalEvents: 0,
    communityEvents: 0,
    virtualAndIrl: "IRL + online",
  },
  nextEvent,
}: {
  type?: string;
  stats?: EventsHeroStats;
  nextEvent?: CalendarEvent | null;
}) => {
  const t = useTranslations();
  const isSingleton = type !== "archive";
  const nextEventDate = getNextEventDate(nextEvent);

  return (
    <section className="relative isolate overflow-hidden bg-[#03040a] pt-16 text-white md:pt-24">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#03040a_0%,#0b1018_44%,#121016_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-black to-transparent" />

      <div className="container relative pb-20 md:pb-28">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-7">
            <p className="mb-4 inline-flex items-center gap-2 rounded-[4px] border border-white/15 bg-white/[0.06] px-3 py-2 font-brand-mono text-xs uppercase text-[#80ecff]">
              <MapPin aria-hidden className="h-4 w-4" />
              Global Solana events
            </p>
            <h1 className="mb-6 max-w-[760px] font-brand text-[56px] font-bold leading-none text-white md:text-[84px] xl:text-[104px]">
              {t(`events.${type}.title`)}
            </h1>
            <p className="mb-8 max-w-[680px] text-lg leading-[1.65] text-white/75 md:text-2xl md:leading-[1.45]">
              {t(`events.${type}.subtitle`)}
            </p>
            {isSingleton && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button to="#featured-events" variant="secondary" size="large">
                  Featured events
                </Button>
                <Button to="#community-events" variant="outline" size="large">
                  Community calendar
                </Button>
              </div>
            )}
            {type === "archive" && (
              <Button to="/events">{t("events.hero.all-events")}</Button>
            )}
          </div>
          <div className="col-span-12 md:col-span-5">
            <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur md:p-5">
              <div className="grid grid-cols-3 gap-2">
                {statItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      className="rounded-[6px] border border-white/10 bg-black/25 p-3"
                      key={item.label}
                    >
                      <Icon
                        aria-hidden
                        className="mb-4 h-4 w-4 text-[#14f195]"
                      />
                      <div className="font-brand text-2xl font-bold leading-none text-white">
                        {item.getValue(stats)}
                      </div>
                      <div className="mt-2 text-xs leading-[1.35] text-white/60">
                        {item.label}
                      </div>
                    </div>
                  );
                })}
              </div>
              {nextEvent && (
                <div className="mt-3 rounded-[6px] border border-[#14f195]/30 bg-[#14f195]/10 p-4">
                  <div className="mb-3 font-brand-mono text-xs uppercase text-[#14f195]">
                    Next highlight
                  </div>
                  <div className="font-brand text-2xl font-semibold leading-[1.15] text-white">
                    {nextEvent.title}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/70">
                    {nextEventDate && (
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays
                          aria-hidden
                          className="h-4 w-4 text-[#80ecff]"
                        />
                        {nextEventDate}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-2">
                      <MapPin aria-hidden className="h-4 w-4 text-[#80ecff]" />
                      <EventsSingleLocation event={nextEvent} />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsHeroSection;
