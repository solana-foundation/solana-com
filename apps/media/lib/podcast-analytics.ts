/**
 * Google Analytics event tracking for podcast interactions.
 *
 * These use the shared Solana.com GA4 contract. Do not add a pause event:
 * pausing is noisy and does not represent a meaningful marketing outcome.
 */
import {
  trackAnalyticsEvent,
  trackContentSelection,
} from "@solana-com/ui-chrome/analytics";

export function trackPodcastPlay(params: {
  episode_title: string;
  episode_id?: string;
  podcast_title?: string;
  podcast_slug?: string;
}) {
  trackAnalyticsEvent("podcast_play", {
    app_name: "media",
    content_type: "podcast_episode",
    content_id: params.episode_id,
    content_name: params.episode_title,
    podcast_name: params.podcast_title,
    podcast_slug: params.podcast_slug,
  });
}

export function trackPodcastSubscribe(params: {
  podcast_title?: string;
  podcast_slug?: string;
  platform: string;
}) {
  trackAnalyticsEvent("podcast_subscribe", {
    app_name: "media",
    content_type: "podcast",
    content_name: params.podcast_title,
    podcast_slug: params.podcast_slug,
    platform: params.platform,
  });
}

export function trackPodcastEpisodeClick(params: {
  episode_title: string;
  episode_id?: string;
  podcast_title?: string;
  podcast_slug?: string;
}) {
  trackContentSelection({
    appName: "media",
    contentType: "podcast_episode",
    contentId: params.episode_id,
    contentName: params.episode_title,
    placement: "podcast_card",
  });
}
