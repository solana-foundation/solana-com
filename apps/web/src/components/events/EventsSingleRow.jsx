import styled from "styled-components";
import Image from "next/image";

import Link from "../../utils/Link";
import EventsSingleLocation from "./EventsSingleLocation";
import FormattedDate from "../shared/FormattedDate";
import defaultImg from "../../../assets/events/solana-community-event.jpg";

const StyledEventWrapperLink = styled(Link)`
  .details {
    transition: all 400ms;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    padding: 0.5rem;
    width: 100%;
  }

  img {
    transition: all 400ms;
    object-fit: contain;
    overflow: hidden;
    aspect-ratio: 1/1;
  }

  &:hover {
    .details {
      border-color: #333333;
    }
    img {
      transform: scale(1.05);
    }
  }
`;

const EventsSingleRow = ({ event }) => {
  const eventUrl =
    event.platform === "external" ? event.key : event.rsvp || event.lumaUrl;

  return event ? (
    <StyledEventWrapperLink
      className="link-unstyled d-flex align-items-center"
      target="_blank"
      rel={!eventUrl.includes("solana.com") && "nofollow"}
      to={eventUrl}
    >
      <Image
        alt={event?.img?.primary?.alt || ""}
        src={event?.img?.primary || defaultImg}
        width={150}
        height={150}
      />
      <div className="details ms-md-2">
        <h3 className="h6 small">{event.title}</h3>
        <p className="smaller subdued mb-0" suppressHydrationWarning={true}>
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
        <div className="smaller subdued">
          <EventsSingleLocation event={event} />
          <div>{event.type}</div>
        </div>
      </div>
    </StyledEventWrapperLink>
  ) : (
    <></>
  );
};

export default EventsSingleRow;
