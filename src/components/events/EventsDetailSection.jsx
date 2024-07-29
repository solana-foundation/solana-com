import styled from "styled-components";
import Image from "next/image";
import SocialShareButtons from "../sharedPageSections/SocialShareButtons";
import Button from "../shared/Button";
import FormattedDate from "../shared/FormattedDate";
import { useTranslation } from "next-i18next";
import defaultImg from "../../../public/social/solana.jpg";
import Link from "../shared/Link";

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  column-gap: 2rem;
  row-gap: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }

  .event-img {
    position: relative;
    width: 100%;
    aspect-ratio: 1/1;

    @media (min-width: 768px) {
      width: 500px;
    }
  }
  .event-details {
    flex: 1;
    min-width: 280px;
    display: flex;
    flex-direction: column;
    row-gap: 1.25rem;
  }

  small {
    font-size: 0.875rem;
    line-height: 130%;
  }
`;

const EventsDetailSection = ({ event = null }) => {
  const { t } = useTranslation();
  if (!event) return null;

  const eventUrl =
    event.platform === "external" ? event.key : event.rsvp || event.lumaUrl;

  return (
    <StyledSection className="my-10">
      <div className="event-img">
        <Link
          target="_blank"
          rel={!eventUrl.includes("solana.com") && "nofollow"}
          to={eventUrl}
        >
          <Image
            alt={event?.img?.primary?.alt || event.title}
            src={event?.img?.primary || defaultImg}
            fill
          />
        </Link>
      </div>
      <div className="event-details">
        <small>
          {event?.schedule?.from && (
            <FormattedDate
              date={event?.schedule?.from}
              format="E, MMM d"
              timezone={event?.schedule?.timezone}
            />
          )}
          {event?.schedule?.to &&
            new Date(event?.schedule?.from).getDay() !==
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
        <small>{event.description}</small>
        <Button
          to={eventUrl}
          arrow={true}
          newTab
          rel={!eventUrl.includes("solana.com") && "nofollow"}
        >
          {t("events.detail.action")}
        </Button>
        <SocialShareButtons
          url={eventUrl}
          title={event.title}
          className="mt-2"
        />
      </div>
    </StyledSection>
  );
};

export default EventsDetailSection;
