"use client";

import { StrictMode } from "react";
import { useTranslations } from "next-intl";
import EventsHeroSection from "@/components/events/EventsHeroSection";
import EventsDetailSection from "@/components/events/EventsDetailSection";
import EventsList from "@/components/events/EventsList";
import Button from "@/components/shared/Button";
import Divider from "@/components/shared/Divider";
import { InlineLink } from "@/utils/Link";

interface EventsLandingPageProps {
  events: any[];
  communityEvents: any[];
  featuredEvent: any;
  usEvents: any[];
  translations: {
    usHeading: string;
    usDescription: string;
    communityHeading: string;
    communityDescription: string;
    submitEvent: string;
    hostEvent: string;
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

  return (
    <StrictMode>
      <div className="overflow-hidden">
        <EventsHeroSection />
        <div className="container pb-10">
          <EventsDetailSection event={featuredEvent} />
          <EventsList list={events} />

          {usEvents.length > 0 && (
            <div className="my-20">
              <h2>{translations.usHeading}</h2>
              <p>{translations.usDescription}</p>
              <EventsList list={usEvents} isCompact />
            </div>
          )}

          <h2>{translations.communityHeading}</h2>
          <ul>
            <li>{translations.communityDescription}</li>
            <li>
              {t.rich("events.community.help", {
                meetupLink: (chunks) => (
                  <InlineLink to="https://community-meetups-playbook.super.site/">
                    {chunks}
                  </InlineLink>
                ),
              })}
            </li>
          </ul>
          <div className="mb-8 mt-4">
            <Button
              to="https://lu.ma/solanafoundation-community"
              className="mr-2"
              arrowRight
              newTab
              rel="nofollow"
            >
              {translations.submitEvent}
            </Button>
            <Button
              to="https://app.getriver.io/solana"
              arrowRight
              newTab
              rel="nofollow"
            >
              {translations.hostEvent}
            </Button>
          </div>
          <EventsList list={communityEvents} isCompact />
          <Divider className="my-10" />
          <Button to="/events/archive" className="mt-6">
            {translations.archive}
          </Button>
        </div>
      </div>
    </StrictMode>
  );
}
