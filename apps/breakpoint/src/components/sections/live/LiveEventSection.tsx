import type { ReactNode } from "react";
import { MAIN_STAGE_STREAM } from "@/content/live/streams";
import LiveEventSections from "./LiveEventSections";

/**
 * Event-day hero and "today" agenda. The schedule itself comes from the
 * surrounding `LiveScheduleProvider`, which the home page feeds with the
 * agenda and shares with the venue map. `belowHero` renders full width under
 * the hero (the next-edition announcement bar).
 */
export default function LiveEventSection({
  belowHero,
}: {
  belowHero?: ReactNode;
}) {
  return <LiveEventSections belowHero={belowHero} stream={MAIN_STAGE_STREAM} />;
}
