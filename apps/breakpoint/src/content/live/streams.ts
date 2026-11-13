/**
 * Livestream wiring for the event-day home page.
 *
 * Set `youtubeVideoId` to the YouTube live video id (the part after `v=`)
 * once the broadcast is scheduled. While it is empty the hero shows a
 * placeholder that names the next session instead of an empty player.
 */
export type LiveStream = {
  /** Agenda stage name whose sessions drive the "Now" and "Next" copy. */
  stage: string;
  youtubeVideoId: string;
};

export const MAIN_STAGE_STREAM: LiveStream = {
  stage: "Main Stage",
  youtubeVideoId: "",
};

export const LIVE_SESSIONS_API = "/breakpoint/api/live-sessions";

/** Fallback poll so the page recovers from a missed boundary refresh. */
export const LIVE_POLL_INTERVAL_MS = 2 * 60_000;
