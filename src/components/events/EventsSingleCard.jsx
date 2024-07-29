import styled from "styled-components";
import Image from "next/image";
import Link from "../../utils/Link";
import EventsSingleLocation from "./EventsSingleLocation";
import FormattedDate from "../shared/FormattedDate";
import defaultImg from "../../../assets/events/solana-event.jpg";

const StyledEventWrapperLink = styled(Link)`
  .details {
    transition: all 400ms;
    border: 1px solid transparent;
    padding: 2.5rem 1rem;
  }

  .date {
    color: #80ecff;
  }

  span {
    overflow: hidden;
  }

  img {
    object-fit: contain;
    transition: all 400ms;
  }

  &:hover {
    .details {
      border: 1px solid #333333;
      border-radius: 0 0 0.5rem 0.5rem;
    }
    span {
      border-radius: 0.5rem 0.5rem 0 0;
    }
    img {
      transform: scale(1.05);
    }
  }

  small {
    font-size: 0.875rem;
    line-height: 130%;
    word-wrap: break-word;
  }
`;

const StyledImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: 1/1;
`;

const EventsSingleCard = ({ event }) => {
  const eventUrl =
    event.platform === "external" ? event.key : event.rsvp || event.lumaUrl;

  return event ? (
    <StyledEventWrapperLink
      className="link-unstyled"
      target="_blank"
      rel={!eventUrl.includes("solana.com") && "nofollow"}
      to={eventUrl}
    >
      <StyledImageWrapper>
        <Image
          alt={event?.img?.primary?.alt || event.title}
          src={event?.img?.primary || defaultImg}
          fill
        />
      </StyledImageWrapper>
      <div className="details">
        <h3 className="h6">{event.title}</h3>
        <p className="small date" suppressHydrationWarning={true}>
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
        </p>
        <div className="small">
          <small className="d-block">
            <EventsSingleLocation event={event} />
          </small>
          <small>{event.type}</small>
        </div>
      </div>
    </StyledEventWrapperLink>
  ) : (
    <></>
  );
};

export default EventsSingleCard;
