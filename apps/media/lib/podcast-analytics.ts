/**
 * Google Analytics event tracking for podcast interactions.
 *
 * Events are pushed to the dataLayer via gtag() which is initialized
 * by GTMTrackingSnippet. These events can be used in GA4 to build
 * reports around podcast engagement.
 */

declare global {
  interface Window {
    gtag?: (..._args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
}

export function trackPodcastPlay(params: {
  episode_title: string;
  episode_id?: string;
  podcast_title?: string;
  podcast_slug?: string;
}) {
  gtag("event", "podcast_play", params);
}

export function trackPodcastPause(params: {
  episode_title: string;
  episode_id?: string;
  podcast_title?: string;
  podcast_slug?: string;
}) {
  gtag("event", "podcast_pause", params);
}

export function trackPodcastSubscribe(params: {
  podcast_title?: string;
  podcast_slug?: string;
  platform: string;
}) {
  gtag("event", "podcast_subscribe", params);
}

export function trackPodcastEpisodeClick(params: {
  episode_title: string;
  episode_id?: string;
  podcast_title?: string;
  podcast_slug?: string;
}) {
  gtag("event", "podcast_episode_click", params);
}
