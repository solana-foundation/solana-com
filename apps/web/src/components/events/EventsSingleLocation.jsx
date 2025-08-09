import { useMemo } from "react";
import findKey from "lodash/findKey";

const getEventLocation = (event) => {
  const { venue } = event;

  const key = findKey(venue, (x) => !!x);

  if (key === "address") {
    return venue[key].split(", ").reverse()[0];
  }

  if (key === "city_state") {
    return venue[key].split(", ")[0];
  }

  return venue[key];
};

export default function EventsSingleLocation({ event }) {
  const location = useMemo(() => getEventLocation(event), [event]);

  if (location) {
    return location;
  }

  return <>&nbsp;</>;
}
