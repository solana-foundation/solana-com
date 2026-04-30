import { Link } from "@workspace/i18n/routing";
import Image from "next/image";
import { Radio } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/podcast-utils";
import type { PodcastShow } from "@/lib/podcast-types";

interface PodcastCardProps {
  podcast: PodcastShow;
  isInternal?: boolean;
}

export const PodcastCard = ({
  podcast,
  isInternal = false,
}: PodcastCardProps) => {
  return (
    <Link
      href={`/podcasts/${podcast.slug}`}
      className={`group flex cursor-pointer flex-col gap-4 border p-4 transition-all duration-300 ${
        isInternal
          ? "border-primary/15 bg-card hover:border-primary/30 hover:shadow-[0_8px_32px_rgba(20,241,149,0.08)]"
          : "border-white/[0.06] bg-card hover:border-white/15 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      }`}
    >
      {/* Cover Image */}
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={podcast.coverImage}
          alt={podcast.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isInternal && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex items-center gap-1 bg-primary/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-primary-foreground backdrop-blur-sm">
              <Radio className="size-2.5" />
              SBN
            </span>
          </div>
        )}
      </div>

      {/* Podcast Info */}
      <div className="flex flex-1 flex-col gap-2">
        {/* Category Badge */}
        {podcast.category && (
          <Badge variant="secondary" className="w-fit capitalize">
            {podcast.category}
          </Badge>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary line-clamp-2">
          {podcast.title}
        </h3>

        {/* Description */}
        {podcast.descriptionPlainText && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {podcast.descriptionPlainText}
          </p>
        )}

        {/* Hosts */}
        {podcast.hosts && podcast.hosts.length > 0 && (
          <div className="mt-auto flex items-center gap-2 pt-3 border-t border-white/[0.06]">
            <div className="flex -space-x-2">
              {podcast.hosts.slice(0, 3).map((host, index) => (
                <Avatar key={index} className="size-7 border-2 border-card">
                  {host.avatar && (
                    <AvatarImage src={host.avatar} alt={host.name} />
                  )}
                  <AvatarFallback className="text-[10px]">
                    {getInitials(host.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {podcast.hosts.length === 1
                ? podcast.hosts[0]?.name
                : podcast.hosts.map((h) => h.name).join(", ")}
            </span>
          </div>
        )}

        {/* Episode count + frequency */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {podcast.episodeCount !== undefined && podcast.episodeCount > 0 && (
            <span>
              {podcast.episodeCount} episode
              {podcast.episodeCount !== 1 ? "s" : ""}
            </span>
          )}
          {podcast.episodeCount && podcast.releaseFrequency && (
            <span className="text-white/20">·</span>
          )}
          {podcast.releaseFrequency && <span>{podcast.releaseFrequency}</span>}
        </div>
      </div>
    </Link>
  );
};
