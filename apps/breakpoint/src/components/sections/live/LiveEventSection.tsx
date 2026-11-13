import { MAIN_STAGE_STREAM } from "@/content/live/streams";
import LiveEventSections from "./LiveEventSections";

/**
 * Event-day hero and "today" agenda. The schedule itself comes from the
 * surrounding `LiveScheduleProvider`, which the home page feeds with the
 * agenda and shares with the venue map.
 */
export default function LiveEventSection() {
  return <LiveEventSections stream={MAIN_STAGE_STREAM} />;
}
