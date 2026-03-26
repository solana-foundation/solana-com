import { Rss } from "lucide-react";
import { SiApple, SiSpotify, SiYoutube } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubscribeButtonsProps {
  applePodcastsUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  rssFeedUrl?: string;
  className?: string;
}

export const SubscribeButtons = ({
  applePodcastsUrl,
  spotifyUrl,
  youtubeUrl,
  rssFeedUrl,
  className,
}: SubscribeButtonsProps) => {
  if (!applePodcastsUrl && !spotifyUrl && !youtubeUrl && !rssFeedUrl) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
        Subscribe & Listen
      </p>
      <div className="flex flex-wrap gap-2">
        {applePodcastsUrl && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
          >
            <a
              href={applePodcastsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Listen on Apple Podcasts"
            >
              <SiApple className="size-3.5" />
              <span>Apple Podcasts</span>
            </a>
          </Button>
        )}

        {spotifyUrl && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
          >
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Listen on Spotify"
            >
              <SiSpotify className="size-3.5" />
              <span>Spotify</span>
            </a>
          </Button>
        )}

        {youtubeUrl && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
          >
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Watch on YouTube"
            >
              <SiYoutube className="size-3.5" />
              <span>YouTube</span>
            </a>
          </Button>
        )}

        {rssFeedUrl && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
          >
            <a
              href={rssFeedUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Subscribe via RSS"
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
