import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { PodcastShow } from "@/lib/podcast-types";

interface PodcastCardProps {
  podcast: PodcastShow;
}

export const PodcastCard = ({ podcast }: PodcastCardProps) => {
  // Truncate description
  const truncateDescription = (desc: string, maxLength: number = 120) => {
    if (typeof desc !== "string") return "";
    if (desc.length <= maxLength) return desc;
    return desc.substring(0, maxLength).trim() + "...";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0]?.toUpperCase() || "")
      .join("")
      .substring(0, 2);
  };

  return (
    <Link
      href={`/media/listen/${podcast.slug}`}
      className="group flex flex-col gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-lg hover:border-primary/50"
    >
      {/* Cover Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Image
          src={podcast.coverImage}
          alt={podcast.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Podcast Info */}
      <div className="flex flex-col gap-2">
        {/* Category Badge */}
        {podcast.category && (
          <Badge variant="secondary" className="w-fit capitalize">
            {podcast.category}
          </Badge>
        )}

        {/* Title */}
        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
          {podcast.title}
        </h3>

        {/* Description */}
        {typeof podcast.description === "string" && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {truncateDescription(podcast.description)}
          </p>
        )}

        {/* Hosts */}
        {podcast.hosts && podcast.hosts.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex -space-x-2">
              {podcast.hosts.slice(0, 3).map((host, index) => (
                <Avatar
                  key={index}
                  className="h-8 w-8 border-2 border-background"
                >
                  {host.avatar && (
                    <AvatarImage src={host.avatar} alt={host.name} />
                  )}
                  <AvatarFallback className="text-xs">
                    {getInitials(host.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {podcast.hosts.length === 1
                ? podcast.hosts[0].name
                : `${podcast.hosts.length} hosts`}
            </span>
          </div>
        )}

        {/* Episode Count */}
        {podcast.episodeCount !== undefined && podcast.episodeCount > 0 && (
          <p className="text-xs text-muted-foreground">
            {podcast.episodeCount} episode
            {podcast.episodeCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </Link>
  );
};
