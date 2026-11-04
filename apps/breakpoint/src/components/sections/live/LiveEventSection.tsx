import { getLiveAgenda } from "@/content/live/agenda";
import { MAIN_STAGE_STREAM } from "@/content/live/streams";
import LiveEventSections from "./LiveEventSections";

/** Event-day hero and "today" agenda, server-fed and client-refreshed. */
export default async function LiveEventSection() {
  const items = await getLiveAgenda();

  return (
    <LiveEventSections
      initialItems={items}
      initialNow={Date.now()}
      stream={MAIN_STAGE_STREAM}
    />
  );
}
