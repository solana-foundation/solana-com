import { StrictMode } from "react";
import { useTranslations } from "next-intl";
import { withLocales } from "@workspace/i18n/routing";

import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";
import EventsHeroSection from "@/components/events/EventsHeroSection";
import EventsDetailSection from "@/components/events/EventsDetailSection";
import EventsList from "@/components/events/EventsList";
import Button from "@/components/shared/Button";
import Divider from "@/components/shared/Divider";
import { InlineLink } from "@/utils/Link";
import { uniqBy, orderBy } from "lodash";
import {
  fetchCalendarEvents,
  fetchCalendarRiverEvents,
} from "@/lib/events/fetchCalendarEvents";

const EventsLandingPage = ({
  events,
  communityEvents,
  featuredEvent,
  usEvents,
}) => {
  const t = useTranslations();

  return (
    <StrictMode>
      <Layout>
        <HTMLHead
          title={t("titles.events")}
          description={t("events.description")}
        />
        <div className="overflow-hidden">
          <EventsHeroSection />
          <div className="container">
            <EventsDetailSection event={featuredEvent} />
            <EventsList list={events} />

            {usEvents.length > 0 && (
              <div className="my-10">
                <h2>{t("events.us.heading")}</h2>
                <p>{t("events.us.description")}</p>
                <EventsList list={usEvents} isCompact />
              </div>
            )}

            <h2>{t("events.community.heading")}</h2>
            <ul>
              <li>{t("events.community.description")}</li>
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
            <div className="mb-6">
              <Button
                to="https://lu.ma/solanafoundation-community"
                className="me-2"
                arrowRight
                newTab
                rel="nofollow"
              >
                {t("commands.submit-event")}
              </Button>
              <Button
                to="https://app.getriver.io/solana"
                arrowRight
                newTab
                rel="nofollow"
              >
                {t("commands.host-event")}
              </Button>
            </div>
            <EventsList list={communityEvents} isCompact />
            <Divider className="my-10" />
            <Button to="/events/archive" className="mt-6">
              {t("events.archive.archive")}
            </Button>
          </div>
        </div>
      </Layout>
    </StrictMode>
  );
};
export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;
  // Solana Foundation calendar
  let mainEvents = await fetchCalendarEvents("cal-J8WZ4jDbwzD9TWi", {
    period: "future",
  });

  // Breakpoint 2026 calendar (https://luma.com/bp26)
  const bp26Events = await fetchCalendarEvents("cal-vSUPHVSJHqgysCR", {
    period: "future",
  });

  // Merge Breakpoint 2026 events with main events
  mainEvents = [...mainEvents, ...bp26Events];

  // Solanamerica calendar
  let usEvents = await fetchCalendarEvents("cal-TLgSVhf1CeO04x3", {
    period: "future",
  });

  // Community calendar
  const communityEvents = await fetchCalendarEvents("cal-C0cmhNE8Qz3xF5r", {
    period: "future",
  });

  const communityRiverEvents = await fetchCalendarRiverEvents({
    time: "future",
    limit: 20,
  });

  const sortInstructions = [[(x) => x.schedule.from], ["asc"]];

  // sorted and unique main events
  let sorted = orderBy([...mainEvents], ...sortInstructions);
  let unique = uniqBy(sorted, "key");

  // sorted community events
  let sortedCommunity = orderBy(
    [...communityEvents, ...communityRiverEvents],
    ...sortInstructions,
  );

  // Set featured event: prefer explicitly marked featured, else first by date
  let featuredEvent =
    unique.find((e) => e.featured === true) || unique[0] || null;
  let events = [...unique];

  return {
    props: {
      locale,
      events: JSON.parse(JSON.stringify(events)), // all events, including subevents
      communityEvents: JSON.parse(JSON.stringify(sortedCommunity)),
      usEvents: JSON.parse(JSON.stringify(usEvents)),
      featuredEvent: JSON.parse(JSON.stringify(featuredEvent)), // never a subevent
      messages,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}

export default EventsLandingPage;
