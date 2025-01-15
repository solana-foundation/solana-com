import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HTMLHead from "@/components/HTMLHead";
import SimpleHero from "@/components/breakpoint/BreakpointSimpleHero";
import BreakpointLayout from "@/components/breakpoint/BreakpointLayout";
import { fetchCalendarEvents } from "@/lib/events/fetchCalendarEvents";
import EventsList from "@/components/events/EventsList";
import { useTranslation } from "next-i18next";
import { withLocales } from "@/i18n/routing";
import Button from "@/components/shared/Button";

const SideEvents = ({
  sideEventsBreakpointFeatured,
  sideEventsBreakpointCommunity,
}) => {
  const { t } = useTranslation();

  return (
    <BreakpointLayout data={{ showHeader: true, showFooter: true }}>
      <HTMLHead
        title={t("breakpoint.page.side-events.title")}
        description={t("breakpoint.page.side-events.description")}
        socialShare="https://solana.com/social/breakpoint.jpg"
      />
      <SimpleHero
        frontmatter={{ title: t("breakpoint.page.side-events.title") }}
      />
      <div className="container ">
        <div className="my-8">
          <p>{t("breakpoint.page.side-events.intro")}</p>
        </div>

        <h2 className="h4">{t("breakpoint.page.side-events.featured")}</h2>
        <EventsList list={sideEventsBreakpointFeatured} />

        <h2 className="h4">{t("breakpoint.page.side-events.community")}</h2>
        <p>{t("breakpoint.page.side-events.community-cta")}</p>
        <Button
          to="https://lu.ma/BP24-SideEvents"
          arrowRight
          newTab
          rel="nofollow"
        >
          {t("commands.submit-event")}
        </Button>
        <EventsList list={sideEventsBreakpointCommunity} isCompact />
      </div>
    </BreakpointLayout>
  );
};

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  const sideEventsBreakpointFeatured = await fetchCalendarEvents(
    "cal-J8paV20F2tKUEXI",
    {
      period: "future",
    },
  );

  const sideEventsBreakpointCommunity = await fetchCalendarEvents(
    "cal-NFEDisEmJoSg0TU",
    {
      period: "future",
    },
  );

  return {
    props: {
      locale,
      sideEventsBreakpointFeatured: JSON.parse(
        JSON.stringify(sideEventsBreakpointFeatured),
      ),
      sideEventsBreakpointCommunity: JSON.parse(
        JSON.stringify(sideEventsBreakpointCommunity),
      ),
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 60,
    notFound: true,
  };
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}

export default SideEvents;
