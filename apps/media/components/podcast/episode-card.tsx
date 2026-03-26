"use client";

import { Link } from "@workspace/i18n/routing";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDuration, formatEpisodeDate } from "@/lib/podcast-utils";
import { usePlayerOptional } from "./player-context";
import type { PodcastEpisode } from "@/lib/podcast-types";

interface EpisodeCardProps {
  episode: PodcastEpisode;
  podcastTitle?: string;
  podcastSlug?: string;
}

export const EpisodeCard = ({
  episode,
  podcastTitle,
  podcastSlug,
}: EpisodeCardProps) => {
  const player = usePlayerOptional();
  const isCurrentEpisode = player?.currentEpisode?.id === episode.id;
  const isPlaying = isCurrentEpisode && player?.isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!player) return;

    if (isCurrentEpisode) {
      player.togglePlayPause();
    } else {
      player.play(episode, podcastTitle, podcastSlug || episode.podcastSlug);
    }
  };

  return (
    <Link
      href={`/podcasts/${episode.podcastSlug}/episodes/${episode.id}`}
      className="group flex flex-col gap-3 border border-white/[0.06] bg-card p-4 transition-all duration-300 hover:border-white/15 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
    >
      {/* Thumbnail with Play Button */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {episode.thumbnailUrl ? (
          <Image
            src={episode.thumbnailUrl}
            alt={episode.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Play className="size-12 text-primary/30" />
          </div>
        )}

        {/* Play Button Overlay */}
        {episode.audioUrl && (
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40"
            aria-label={
              isPlaying ? `Pause ${episode.title}` : `Play ${episode.title}`
            }
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-75">
              {isPlaying ? (
                <Pause className="size-6" />
              ) : (
                <Play className="size-6 ml-0.5" />
              )}
            </div>
          </button>
        )}

        {/* Duration badge */}
        {episode.duration > 0 && (
          <div className="absolute bottom-2 right-2">
            <Badge
              variant="secondary"
              className="bg-black/70 text-white border-0 text-[10px] font-normal backdrop-blur-sm"
            >
              {formatDuration(episode.duration)}
            </Badge>
          </div>
        )}
      </div>

      {/* Episode Info */}
      <div className="flex flex-col gap-1.5">
        {/* Date */}
        <span className="text-xs text-muted-foreground">
          {formatEpisodeDate(episode.publishedDate)}
        </span>

        {/* Title */}
        <h3 className="text-base font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary line-clamp-2">
          {episode.title}
        </h3>

        {/* Description */}
        {episode.description && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {episode.description}
          </p>
        )}

        {/* Now Playing indicator */}
        {isCurrentEpisode && (
          <div className="flex items-center gap-1.5 text-xs text-primary">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {isPlaying ? "Now playing" : "Paused"}
          </div>
        )}
      </div>
    </Link>
  );
};
