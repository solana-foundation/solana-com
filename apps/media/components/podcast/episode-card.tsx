import { Link } from "@workspace/i18n/routing";
import Image from "next/image";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDuration, formatEpisodeDate } from "@/lib/podcast-utils";
import type { PodcastEpisode } from "@/lib/podcast-types";

interface EpisodeCardProps {
  episode: PodcastEpisode;
  showPlayButton?: boolean;
  onPlayClick?: (episode: PodcastEpisode) => void;
}

export const EpisodeCard = ({
  episode,
  showPlayButton = true,
  onPlayClick,
}: EpisodeCardProps) => {
  const handlePlayClick = (e: React.MouseEvent) => {
    if (onPlayClick) {
      e.preventDefault();
      onPlayClick(episode);
    }
  };

  return (
    <Link
      href={`/podcasts/${episode.podcastSlug}/episodes/${episode.id}`}
      className="group flex flex-col gap-4 bg-card p-4 transition-all hover:shadow-lg"
    >
      {/* Thumbnail with Play Button */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {episode.thumbnailUrl ? (
          <Image
            src={episode.thumbnailUrl}
            alt={episode.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Play className="h-16 w-16 text-primary/40" />
          </div>
        )}

        {/* Play Button Overlay */}
        {showPlayButton && episode.audioUrl && (
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={`Play ${episode.title}`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110">
              <Play className="h-8 w-8 ml-1" />
            </div>
          </button>
        )}
      </div>

      {/* Episode Info */}
      <div className="flex flex-col gap-2">
        {/* Date and Duration */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatEpisodeDate(episode.publishedDate)}</span>
          <span>•</span>
          <Badge variant="outline" className="font-normal">
            {formatDuration(episode.duration)}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
          {episode.title}
        </h3>

        {/* Description */}
        {episode.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {episode.description}
          </p>
        )}

        {/* Status Badge */}
        {episode.status === "processing" && (
          <Badge variant="secondary" className="w-fit">
            Processing
          </Badge>
        )}
      </div>
    </Link>
  );
};
