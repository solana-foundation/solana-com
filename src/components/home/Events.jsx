import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import classNames from "classnames";

import { AnimatedText } from "@/components/shared/Text";
import { MotionSlideIn } from "@/components/shared/Motions";
import FormattedDate from "../shared/FormattedDate";
import styles from "./Events.module.scss";

import defaultImg from "../../../assets/events/solana-community-event.jpg";

const MainEventCard = ({ event }) => {
  const { t } = useTranslation();
  if (!event) return null;

  const startDate = new Date(event?.schedule?.from).getDay();
  const endDate = new Date(event?.schedule?.to).getDay();

  const date =
    startDate === endDate ? (
      <FormattedDate
        date={event?.schedule?.from}
        format="MMM d"
        timezone={event?.schedule?.timezone}
      />
    ) : (
      <>
        <FormattedDate
          date={event?.schedule?.from}
          format="MMM"
          timezone={event?.schedule?.timezone}
        />{" "}
        <br />
        <FormattedDate
          date={event?.schedule?.from}
          format="d"
          timezone={event?.schedule?.timezone}
        />
        <span className="mx-1">-</span>
        <FormattedDate
          date={event?.schedule?.to}
          format="d"
          timezone={event?.schedule?.timezone}
        />
      </>
    );

  const eventUrl =
    event.platform === "external" ? event.key : event.rsvp || event.lumaUrl;

  return (
    <div className={styles.MainEventCard}>
      <div className={styles.CardBackground}>
        <Image
          alt={event?.img?.primary?.alt || event.title}
          src={event?.img?.primary || "/social/solana.jpg"}
          fill
        />
      </div>

      <div className={styles.CardContent}>
        <div className={styles.EventImage}>
          <Image
            alt={event?.img?.primary?.alt || event.title}
            src={event?.img?.primary || "/social/solana.jpg"}
            width={400}
            height={400}
          />
        </div>

        <div className={styles.EventDetails}>
          <h2 className={styles.EventDetailTitle}>{event.title}</h2>

          <div className={styles.EventDetailDateText}>
            <small className={styles.EventDetailDate}>{date}</small>

            <div className={styles.EventDetailsDivider}>•</div>

            <small className={styles.EventDetailText}>
              {event.description}
            </small>
          </div>
        </div>

        <Link
          href={eventUrl}
          target="_blank"
          rel={!eventUrl.includes("solana.com") && "nofollow"}
          className={styles.EventButton}
        >
          {t("events.detail.action")}
        </Link>
      </div>
    </div>
  );
};

const CommunityEventCard = ({ event, key }) => {
  const startDate = new Date(event?.schedule?.from).getDay();
  const endDate = new Date(event?.schedule?.to).getDay();

  const date =
    startDate === endDate ? (
      <FormattedDate
        date={event?.schedule?.from}
        format="MMM d"
        timezone={event?.schedule?.timezone}
      />
    ) : (
      <>
        <FormattedDate
          date={event?.schedule?.from}
          format="MMM"
          timezone={event?.schedule?.timezone}
        />{" "}
        <FormattedDate
          date={event?.schedule?.from}
          format="d"
          timezone={event?.schedule?.timezone}
        />
        <span className="mx-1">-</span>
        <FormattedDate
          date={event?.schedule?.to}
          format="d"
          timezone={event?.schedule?.timezone}
        />
      </>
    );

  const content = (
    <>
      <div className={styles.EventImage}>
        <Image
          alt={event?.img?.primary?.alt || ""}
          src={event?.img?.primary || defaultImg}
          width={150}
          height={150}
        />
      </div>

      <div className={styles.CommunityEventDetails}>
        <h4 className={styles.CommunityEventTitle}>{event.title}</h4>
        <p
          className={styles.CommunityEventDate}
          suppressHydrationWarning={true}
        >
          {date}
        </p>
        <p className={styles.CommunityEventCity}>{event.venue.city}</p>
      </div>
    </>
  );

  return (
    <div key={key} className={styles.CommunityEvent}>
      {event?.rsvp ? <Link href={event.rsvp}>{content}</Link> : { content }}
    </div>
  );
};

const Events = ({ events, communityEvents }) => {
  const { t } = useTranslation();

  return (
    <div className={classNames(styles.Events, "page-width")}>
      <div className={styles.MainEvents}>
        {events.map((event) => (
          <MainEventCard key={event.key} event={event} />
        ))}
      </div>

      <div className={styles.CommunityEvents}>
        <AnimatedText element="h3" as="heading">
          {t("events.community.heading")}
        </AnimatedText>

        <div className={styles.EventsWrapper}>
          {communityEvents.map((event, index) => (
            <MotionSlideIn key={`community-event-${index}`}>
              <CommunityEventCard event={event} />
            </MotionSlideIn>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
