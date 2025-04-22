import { StrictMode } from "react";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withLocales } from "@/i18n/routing";

import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";
import EventsHeroSection from "@/components/events/EventsHeroSection";
import EventsDetailSection from "@/components/events/EventsDetailSection";
import EventsList from "@/components/events/EventsList";
import breakpointImg from "@/../assets/events/breakpoint.jpg";
import shipordieImg from "@/../assets/events/shipordie.jpg";
import scaleordieImg from "@/../assets/events/scaleordie.jpg";
import crossroadsImg from "@/../assets/events/crossroads.jpg";
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
  const { t } = useTranslation();

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
                <Trans
                  i18nKey="events.community.help"
                  components={{
                    meetupLink: (
                      <InlineLink to="https://community-meetups-playbook.super.site/" />
                    ),
                  }}
                />
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
  // Solana Foundation calendar
  let mainEvents = await fetchCalendarEvents("cal-J8WZ4jDbwzD9TWi", {
    period: "future",
  });

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

  // Add custom img and timezone overrides
  unique.map((el) => {
    if (el.key === "https://solana.com/breakpoint") {
      el.img.primary = breakpointImg;
      el.schedule.timezone = "Asia/Dubai";
      el.schedule.to = "2025-12-13T23:59:59+04:00";
    } else if (el.key === "https://solana.com/accelerate/ship-or-die") {
      el.img.primary = shipordieImg;
      el.schedule.timezone = "America/New_York";
      el.schedule.to = "2025-05-23T23:59:59-04:00";
    } else if (el.key === "https://solana.com/accelerate/scale-or-die") {
      el.img.primary = scaleordieImg;
      el.schedule.timezone = "America/New_York";
      el.schedule.to = "2025-05-20T23:59:59-04:00";
    } else if (el.key === "https://www.solanacrossroads.com/") {
      el.img.primary = crossroadsImg;
      el.schedule.timezone = "Europe/Istanbul";
      el.schedule.to = "2025-04-26T23:59:59+03:00";
    } else if (el.rsvp === "https://lu.ma/solana-summit-apac-2025") {
      el.schedule.timezone = "Asia/Ho_Chi_Minh";
      el.schedule.to = "2025-04-26T23:59:59+07:00";
    }
    return el;
  });

  const subevents = ["https://lu.ma/Mega-mixer-2025"];

  // Filter out subevents from being featured
  const featuredEvents = unique.filter(
    (event) => !subevents.includes(event.rsvp),
  );

  // Set featured event and keep all events in the regular list
  let featuredEvent = featuredEvents[0];
  let events = [...unique];

  return {
    props: {
      locale,
      events: JSON.parse(JSON.stringify(events)), // all events, including subevents
      communityEvents: JSON.parse(JSON.stringify(sortedCommunity)),
      usEvents: JSON.parse(JSON.stringify(usEvents)),
      featuredEvent: JSON.parse(JSON.stringify(featuredEvent)), // never a subevent
      ...(await serverSideTranslations(locale, ["common"])),
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
