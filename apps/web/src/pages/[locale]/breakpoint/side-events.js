import HTMLHead from "@/components/HTMLHead";
import SimpleHero from "@/components/breakpoint/BreakpointSimpleHero";
import BreakpointLayout from "@/components/breakpoint/BreakpointLayout";
import { fetchCalendarEvents } from "@/lib/events/fetchCalendarEvents";
import EventsList from "@/components/events/EventsList";
import { useTranslations } from "next-intl";
import { withLocales } from "@workspace/i18n/routing";
import Button from "@/components/shared/Button";

const SideEvents = ({
  sideEventsBreakpointFeatured,
  sideEventsBreakpointCommunity,
}) => {
  const t = useTranslations();

  return (
    <BreakpointLayout data={{ showHeader: true, showFooter: true }}>
      <HTMLHead
        title={t("breakpoint.page.side-events.title")}
        description={t("breakpoint.page.side-events.description")}
        socialShare="https://solana.com/social/breakpoint.jpg?123"
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
  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;

  let sideEventsBreakpointFeatured = [];
  let sideEventsBreakpointCommunity = [];

  try {
    sideEventsBreakpointFeatured = await fetchCalendarEvents(
      "cal-J8paV20F2tKUEXI",
      {
        period: "future",
      },
    );
  } catch (error) {
    console.warn("Failed to fetch featured side events:", error);
    // Continue with empty array
  }

  try {
    sideEventsBreakpointCommunity = await fetchCalendarEvents(
      "cal-NFEDisEmJoSg0TU",
      {
        period: "future",
      },
    );
  } catch (error) {
    console.warn("Failed to fetch community side events:", error);
    // Continue with empty array
  }

  return {
    props: {
      locale,
      sideEventsBreakpointFeatured: JSON.parse(
        JSON.stringify(sideEventsBreakpointFeatured),
      ),
      sideEventsBreakpointCommunity: JSON.parse(
        JSON.stringify(sideEventsBreakpointCommunity),
      ),
      messages,
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
