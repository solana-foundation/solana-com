"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import EventsHeroSection from "@/components/events/EventsHeroSection";
import EventsDetailSection from "@/components/events/EventsDetailSection";
import EventsList from "@/components/events/EventsList";
import Link, { InlineLink } from "@/utils/Link";
import { Reveal } from "@/components/events/EventsMotion";
import type { CalendarEvent } from "@/lib/events/fetchCalendarEvents";

interface EventsLandingPageProps {
  events: CalendarEvent[];
  communityEvents: CalendarEvent[];
  featuredEvent: CalendarEvent | null;
  usEvents: CalendarEvent[];
  translations: {
    usHeading: string;
    usDescription: string;
    communityHeading: string;
    communityDescription: string;
    submitEvent: string;
    archive: string;
  };
}

export function EventsLandingPage({
  events,
  communityEvents,
  featuredEvent,
  usEvents,
  translations,
}: EventsLandingPageProps) {
  const t = useTranslations();
  const visibleFeaturedEvent = featuredEvent || events[0] || null;

  return (
    <div className="bg-black text-white">
      <EventsHeroSection nextEvent={visibleFeaturedEvent} />

      <main>
        {visibleFeaturedEvent && (
          <section
            id="featured"
            className="container border-b border-white/10 py-16 md:py-24"
          >
            <Reveal>
              <SectionLabel>{t("events.featured.label")}</SectionLabel>
              <EventsDetailSection event={visibleFeaturedEvent} />
            </Reveal>
          </section>
        )}

        <section id="upcoming" className="container py-16 md:py-24">
          <Reveal>
            <SectionHeader
              title={t("titles.events")}
              action={
                <TextLink to="https://lu.ma/solana" newTab>
                  {t("commands.follow-luma")}
                </TextLink>
              }
            />
          </Reveal>
          <EventsList list={events} emptyLabel={t("events.empty.upcoming")} />
        </section>

        {usEvents.length > 0 && (
          <section
            id="regional"
            className="container border-t border-white/10 py-16 md:py-24"
          >
            <Reveal>
              <SectionHeader
                title={translations.usHeading}
                description={translations.usDescription}
              />
            </Reveal>
            <EventsList list={usEvents} isCompact />
          </section>
        )}

        <section
          id="community-events"
          className="container border-t border-white/10 py-16 md:py-24"
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal className="lg:sticky lg:top-24 lg:self-start">
              <SectionLabel>{t("events.community.label")}</SectionLabel>
              <h2 className="font-brand text-3xl font-medium tracking-[-0.01em] text-white md:text-5xl">
                {translations.communityHeading}
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/50">
                {translations.communityDescription}
              </p>
              <div className="mt-8 flex flex-col gap-4">
                <TextLink to="https://lu.ma/solanafoundation-community" newTab>
                  {translations.submitEvent}
                </TextLink>
                <p className="m-0 max-w-md text-sm leading-relaxed text-white/40">
                  {t.rich("events.community.help", {
                    meetupLink: (chunks) => (
                      <InlineLink
                        to="https://community-meetups-playbook.super.site/"
                        className="text-white/70 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
                      >
                        {chunks}
                      </InlineLink>
                    ),
                  })}
                </p>
              </div>
            </Reveal>
            <EventsList
              list={communityEvents}
              isCompact
              emptyLabel={t("events.empty.community")}
            />
          </div>
        </section>

        <section className="container border-t border-white/10 py-14">
          <TextLink to="/events/archive">{translations.archive}</TextLink>
        </section>
      </main>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 font-brand-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
      {children}
    </p>
  );
}

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h2 className="font-brand text-3xl font-medium tracking-[-0.01em] text-white md:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/50">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function TextLink({
  to,
  children,
  newTab = false,
}: {
  to: string;
  children: React.ReactNode;
  newTab?: boolean;
}) {
  return (
    <Link
      to={to}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer nofollow" : undefined}
      className="group inline-flex w-fit items-center gap-2 font-brand-mono text-[11px] uppercase tracking-[0.25em] text-white/70 no-underline transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      {children}
      <ArrowUpRight
        aria-hidden
        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
  );
}
