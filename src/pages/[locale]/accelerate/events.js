import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HTMLHead from "@/components/HTMLHead";
import SimpleHero from "@/components/accelerate/AccelerateSimpleHero";
import AccelerateLayout from "@/components/accelerate/AccelerateLayout";
import { fetchCalendarEvents } from "@/lib/events/fetchCalendarEvents";
import { useTranslation } from "next-i18next";
import { withLocales } from "@/i18n/routing";
import Button from "@/components/shared/Button";
import AccelerateEventsTimeline from "@/components/accelerate/AccelerateEventsTimeline";

const SideEvents = ({ eventsAccelerate }) => {
  const { t } = useTranslation();

  return (
    <AccelerateLayout data={{ showHeader: true, showFooter: true }}>
      <HTMLHead
        title={t("accelerate.events.title")}
        description={t("accelerate.events.description")}
        socialShare="https://cdn.builder.io/api/v1/image/assets%2Fce0c7323a97a4d91bd0baa7490ec9139%2F41d59a0a05a345f1b5843ec37a63dfda"
      />
      <SimpleHero title={t("accelerate.events.title")} />
      <div className="container ">
        <div className="my-8">
          <AccelerateEventsTimeline events={eventsAccelerate} />
        </div>

        <div className="my-8 d-flex flex-column gap-2 align-items-center">
          <p>{t("accelerate.events.community.note")}</p>
          <Button
            to="https://lu.ma/cal-xIDT6vXOhDyC4FM"
            arrowRight
            newTab
            rel="nofollow"
          >
            {t("accelerate.events.community.cta")}
          </Button>
        </div>
      </div>
    </AccelerateLayout>
  );
};

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  const eventsAccelerate = await fetchCalendarEvents("cal-xIDT6vXOhDyC4FM", {
    period: "future",
  });

  return {
    props: {
      locale,
      eventsAccelerate: JSON.parse(JSON.stringify(eventsAccelerate)),
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

export default SideEvents;
