import { Rss } from "lucide-react";
import { SiApple, SiSpotify, SiYoutube } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { getSafeExternalUrl } from "@/lib/external-url";
import { trackPodcastSubscribe } from "@/lib/podcast-analytics";
import { cn } from "@/lib/utils";

interface SubscribeButtonsProps {
  applePodcastsUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  rssFeedUrl?: string;
  podcastTitle?: string;
  podcastSlug?: string;
  className?: string;
}

export const SubscribeButtons = ({
  applePodcastsUrl,
  spotifyUrl,
  youtubeUrl,
  rssFeedUrl,
  podcastTitle,
  podcastSlug,
  className,
}: SubscribeButtonsProps) => {
  const safeApplePodcastsUrl = getSafeExternalUrl(applePodcastsUrl);
  const safeSpotifyUrl = getSafeExternalUrl(spotifyUrl);
  const safeYoutubeUrl = getSafeExternalUrl(youtubeUrl);
  const safeRssFeedUrl = getSafeExternalUrl(rssFeedUrl);

  if (
    !safeApplePodcastsUrl &&
    !safeSpotifyUrl &&
    !safeYoutubeUrl &&
    !safeRssFeedUrl
  ) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
        Subscribe & Listen
      </p>
      <div className="flex flex-wrap gap-2">
        {safeApplePodcastsUrl && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="cursor-pointer gap-1.5 border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
          >
            <a
              href={safeApplePodcastsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Listen on Apple Podcasts"
              onClick={() =>
                trackPodcastSubscribe({
                  podcast_title: podcastTitle,
                  podcast_slug: podcastSlug,
                  platform: "apple_podcasts",
                })
              }
            >
              <SiApple className="size-3.5" />
              <span>Apple Podcasts</span>
            </a>
          </Button>
        )}

        {safeSpotifyUrl && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="cursor-pointer gap-1.5 border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
          >
            <a
              href={safeSpotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Listen on Spotify"
              onClick={() =>
                trackPodcastSubscribe({
                  podcast_title: podcastTitle,
                  podcast_slug: podcastSlug,
                  platform: "spotify",
                })
              }
            >
              <SiSpotify className="size-3.5" />
              <span>Spotify</span>
            </a>
          </Button>
        )}

        {safeYoutubeUrl && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="cursor-pointer gap-1.5 border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
          >
            <a
              href={safeYoutubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Watch on YouTube"
              onClick={() =>
                trackPodcastSubscribe({
                  podcast_title: podcastTitle,
                  podcast_slug: podcastSlug,
                  platform: "youtube",
                })
              }
            >
              <SiYoutube className="size-3.5" />
              <span>YouTube</span>
            </a>
          </Button>
        )}

        {safeRssFeedUrl && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="cursor-pointer gap-1.5 border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
          >
            <a
              href={safeRssFeedUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Subscribe via RSS"
              onClick={() =>
                trackPodcastSubscribe({
                  podcast_title: podcastTitle,
                  podcast_slug: podcastSlug,
                  platform: "rss",
                })
              }
            >
              <Rss className="size-3.5" />
              <span>RSS</span>
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};
