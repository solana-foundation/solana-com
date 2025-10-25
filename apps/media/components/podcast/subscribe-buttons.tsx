import { Rss } from "lucide-react";
import { SiApple, SiSpotify } from "react-icons/si";
import { Button } from "@/components/ui/button";

interface SubscribeButtonsProps {
  applePodcastsUrl?: string;
  spotifyUrl?: string;
  rssFeedUrl?: string;
  className?: string;
}

export const SubscribeButtons = ({
  applePodcastsUrl,
  spotifyUrl,
  rssFeedUrl,
  className,
}: SubscribeButtonsProps) => {
  // Don't render if no URLs provided
  if (!applePodcastsUrl && !spotifyUrl && !rssFeedUrl) {
    return null;
  }

  return (
    <div className={className}>
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        Subscribe & Listen:
      </p>
      <div className="flex flex-wrap gap-3">
        {applePodcastsUrl && (
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a
              href={applePodcastsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Listen on Apple Podcasts"
            >
              <SiApple className="h-4 w-4" />
              <span>Apple Podcasts</span>
            </a>
          </Button>
        )}

        {spotifyUrl && (
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Listen on Spotify"
            >
              <SiSpotify className="h-4 w-4" />
              <span>Spotify</span>
            </a>
          </Button>
        )}

        {rssFeedUrl && (
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a
              href={rssFeedUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Subscribe via RSS"
            >
              <Rss className="h-4 w-4" />
              <span>RSS Feed</span>
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};
