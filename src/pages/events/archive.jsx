import { uniqBy, orderBy } from "lodash";
import { StrictMode, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "../../components/layout";
import HTMLHead from "../../components/HTMLHead";
import EventsHeroSection from "../../components/events/EventsHeroSection";
import EventsList from "../../components/events/EventsList";
import EventsArchivePagination from "../../components/events/archive/EventsArchivePagination";
import fetchCalendarEvents from "@/lib/events/fetchCalendarEvents";

const EventsArchivePage = ({ events }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const TOTAL_EVENTS_PER_PAGE = 8;

  const pageEvents = events.slice(
    page * TOTAL_EVENTS_PER_PAGE,
    page * TOTAL_EVENTS_PER_PAGE + TOTAL_EVENTS_PER_PAGE,
  );

  return (
    <StrictMode>
      <Layout>
        <HTMLHead
          title={t("events.archive.page-title")}
          description={t("events.description")}
        />
        <div className="overflow-hidden">
          <EventsHeroSection type="archive" />

          <div className="container">
            <EventsList list={pageEvents} />
            <EventsArchivePagination
              initialPageSize={TOTAL_EVENTS_PER_PAGE}
              totalCount={events.length}
              currentPage={page}
              setCurrentPage={setPage}
            />
          </div>
        </div>
      </Layout>
    </StrictMode>
  );
};

export async function getStaticProps({ locale }) {
  // Solana Foundation calendar
  let mainEvents = await fetchCalendarEvents("cal-J8WZ4jDbwzD9TWi", {
    period: "past",
  });

  // HH calendar
  let hhEvents = await fetchCalendarEvents("cal-dLrjJu0Dqay3WBe", {
    period: "past",
  });

  // Community calendar
  const communityEvents = await fetchCalendarEvents("cal-C0cmhNE8Qz3xF5r", {
    period: "past",
  });

  const sortInstructions = [[(x) => x.schedule.from], ["desc"]];
  const sorted = orderBy(
    [...mainEvents, ...hhEvents, ...communityEvents],
    ...sortInstructions,
  );
  let unique = uniqBy(sorted, "key");

  return {
    props: {
      events: JSON.parse(JSON.stringify(unique)),
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 60,
  };
}

export default EventsArchivePage;
