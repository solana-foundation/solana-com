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
import Button from "@/components/shared/Button";
import Divider from "@/components/shared/Divider";
import { InlineLink } from "@/utils/Link";
import { uniqBy, orderBy } from "lodash";
import {
  fetchCalendarEvents,
  fetchCalendarRiverEvents,
} from "@/lib/events/fetchCalendarEvents";

const EventsLandingPage = ({ events, communityEvents }) => {
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
            <EventsDetailSection event={events[0]} />
            <EventsList list={events.slice(1)} />

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

  // HH calendar
  let hhEvents = await fetchCalendarEvents("cal-dLrjJu0Dqay3WBe", {
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
  let sorted = orderBy([...mainEvents, ...hhEvents], ...sortInstructions);
  let unique = uniqBy(sorted, "key");

  // sorted community events
  let sortedCommunity = orderBy(
    [...communityEvents, ...communityRiverEvents],
    ...sortInstructions,
  );

  // Add custom img to Breakpoint to avoid the fallback
  unique.map((el) => {
    if (el.key == "https://solana.com/breakpoint") {
      el.img.primary = breakpointImg;
      el.schedule.from = "2024-09-20T01:00:00.000Z";
      el.schedule.to = "2024-09-21T01:00:00.000Z";
    }
    return el;
  });

  return {
    props: {
      locale,
      events: JSON.parse(JSON.stringify(unique)),
      communityEvents: JSON.parse(JSON.stringify(sortedCommunity)),
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
