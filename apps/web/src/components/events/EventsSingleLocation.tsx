import { useMemo } from "react";
import findKey from "lodash/findKey";

interface EventVenue {
  address?: string;
  city_state?: string;
  [key: string]: string | undefined;
}

interface EventsSingleLocationProps {
  event: {
    venue: EventVenue;
  };
}

const getEventLocation = (event: EventsSingleLocationProps["event"]) => {
  const { venue } = event;

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
  const location = useMemo(() => getEventLocation(event), [event]);

  if (location) {
    return location;
  }

  return <>&nbsp;</>;
}
