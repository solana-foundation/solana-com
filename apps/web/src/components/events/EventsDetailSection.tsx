import Image from "next/image";
import SocialShareButtons from "../sharedPageSections/SocialShareButtons";
import Button from "../shared/Button";
import FormattedDate from "../shared/FormattedDate";
import { useTranslations } from "next-intl";
import defaultImg from "../../../public/social/solana.jpg";
import { Link } from "@/utils/Link";

type EventData = {
  platform?: string;
  key?: string;
  rsvp?: string;
  lumaUrl?: string;
  img?: { primary?: { alt?: string } | string };
  title?: string;
  description?: string;
  schedule?: {
    from?: string;
    to?: string;
    timezone?: string;
  };
};

const EventsDetailSection = ({
  event = null,
}: {
  event?: EventData | null;
}) => {
  const t = useTranslations();
  if (!event) return null;

  const eventUrl =
    event.platform === "external" ? event.key! : event.rsvp || event.lumaUrl!;

  return (
    <section className="my-20 flex flex-col items-center gap-x-8 gap-y-8 md:flex-row">
      <div className="relative w-full aspect-square md:w-[500px]">
        <Link
          target="_blank"
          rel={!eventUrl.includes("solana.com") ? "nofollow" : undefined}
          to={eventUrl}
        >
          <Image
            alt={(event?.img?.primary as { alt?: string })?.alt || event.title!}
            src={(event?.img?.primary as string) || defaultImg}
            fill
          />
        </Link>
      </div>
      <div className="flex-1 min-w-[280px] flex flex-col gap-y-5">
        <small className="text-sm leading-[130%]">
          {event?.schedule?.from && (
            <FormattedDate
              date={event?.schedule?.from}
              format="E, MMM d"
              timezone={event?.schedule?.timezone}
            />
          )}
          {event?.schedule?.to &&
            new Date(event?.schedule?.from!).getDay() !==
              new Date(event?.schedule?.to).getDay() && (
              <>
                <span className="mx-1">-</span>
                <FormattedDate
                  date={event?.schedule?.to}
                  format="E, MMM d"
                  timezone={event?.schedule?.timezone}
                />
              </>
            )}
        </small>
        <h2 className="h4">{event.title}</h2>
        <small className="text-sm leading-[130%]">{event.description}</small>
        <Button
          to={eventUrl}
          arrow={true}
          newTab
          rel={!eventUrl.includes("solana.com") ? "nofollow" : undefined}
        >
          {t("events.detail.action")}
        </Button>
        <SocialShareButtons
          url={eventUrl}
          title={event.title}
          className="mt-2"
        />
      </div>
    </section>
  );
};

export default EventsDetailSection;
