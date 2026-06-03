import { useMemo } from "react";
import findKey from "lodash/findKey";

interface EventVenue {
  address?: string | null;
  city_state?: string | null;
  [key: string]: string | undefined | null;
}

interface EventsSingleLocationProps {
  event?: {
    venue?: EventVenue | null;
  };
}

const getEventLocation = (event: EventsSingleLocationProps["event"]) => {
  const venue = event?.venue;

  if (!venue) return undefined;

  const key = findKey(venue, (x) => !!x);

  if (key === "address") {
    return venue[key]?.split(", ").reverse()[0];
  }

  if (key === "city_state") {
    return venue[key]?.split(", ")[0];
  }

  return key ? venue[key] : undefined;
};

export default function EventsSingleLocation({
  event,
}: EventsSingleLocationProps) {
  const location = useMemo(() => event && getEventLocation(event), [event]);

  if (location) {
    return location;
  }

  return <>&nbsp;</>;
}
