"use client";

import React from "react";
import { Link } from "@workspace/i18n/routing";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AudioPlayer } from "@/components/podcast/audio-player";
import { EpisodeCard } from "@/components/podcast/episode-card";
import { EpisodeDescription } from "@/components/podcast/episode-description";
import { SubscribeButtons } from "@/components/podcast/subscribe-buttons";
import { SocialShare } from "@/components/ui/social-share";
import {
  formatDuration,
  formatEpisodeDate,
  getInitials,
} from "@/lib/podcast-utils";
import type { PodcastShow, PodcastEpisode } from "@/lib/podcast-types";
import ErrorBoundary from "@/components/error-boundary";

interface EpisodeClientPageProps {
  podcast: PodcastShow;
  episode: PodcastEpisode;
  relatedEpisodes: PodcastEpisode[];
  previousEpisode: PodcastEpisode | null;
  nextEpisode: PodcastEpisode | null;
}

export default function EpisodeClientPage({
  podcast,
  episode,
  relatedEpisodes,
  previousEpisode,
  nextEpisode,
}: EpisodeClientPageProps) {
  const [episodeUrl, setEpisodeUrl] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setEpisodeUrl(window.location.href);
    }
  }, []);

  return (
    <ErrorBoundary>
      <Section>
        <div className="flex flex-col gap-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-8">
          {/* Back Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
              <Link href={`/podcasts/${podcast.slug}`}>
                <ArrowLeft className="size-4" />
                <span>Back to {podcast.title}</span>
              </Link>
            </Button>
          </motion.div>

          {/* Episode Header with Podcast Context */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-6 md:flex-row md:gap-8"
          >
            {/* Podcast Cover Art */}
            <Link
              href={`/podcasts/${podcast.slug}`}
              className="group relative w-full flex-shrink-0 cursor-pointer md:w-48"
            >
              <div className="relative aspect-square w-full overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-shadow duration-300 group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
                <Image
                  src={podcast.coverImage}
                  alt={podcast.title}
                  fill
                  priority
                  sizes="(min-width: 768px) 192px, 100vw"
                  className="object-cover"
                />
              </div>
            </Link>

            {/* Episode Meta */}
            <div className="flex flex-1 flex-col gap-3">
              {/* Podcast name link */}
              <Link
                href={`/podcasts/${podcast.slug}`}
                className="cursor-pointer text-sm font-medium text-primary hover:underline transition-colors"
              >
                {podcast.title}
              </Link>

              {/* Date + Duration */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{formatEpisodeDate(episode.publishedDate)}</span>
                {episode.duration > 0 && (
                  <>
                    <span className="text-white/20">·</span>
                    <Badge
                      variant="outline"
                      className="border-white/10 text-muted-foreground font-normal"
                    >
                      {formatDuration(episode.duration)}
                    </Badge>
                  </>
                )}
              </div>

              {/* Episode Title */}
              <h1 className="text-2xl font-bold md:text-4xl text-foreground leading-tight">
                {episode.title}
              </h1>

              {/* Description */}
              {(episode.description || episode.descriptionHtml) && (
                <EpisodeDescription
                  description={episode.description}
                  descriptionHtml={episode.descriptionHtml}
                />
              )}

              {/* Hosts */}
              {podcast.hosts && podcast.hosts.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex -space-x-1.5">
                    {podcast.hosts.slice(0, 3).map((host, index) => (
                      <Avatar
                        key={index}
                        className="size-6 border-2 border-card"
                      >
                        {host.avatar && (
                          <AvatarImage src={host.avatar} alt={host.name} />
                        )}
                        <AvatarFallback className="text-[8px]">
                          {getInitials(host.name)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {podcast.hosts.map((h) => h.name).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Audio Player — sticky with backdrop blur */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {episode.audioUrl ? (
              <AudioPlayer
                episode={episode}
                podcastTitle={podcast.title}
                podcastSlug={podcast.slug}
                sticky
              />
            ) : (
              <div className="border border-white/10 bg-white/[0.03] p-8 text-center">
                <p className="text-muted-foreground">
                  Audio not yet available for this episode.
                </p>
              </div>
            )}
          </motion.div>

          {/* Social Share + Subscribe */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between"
          >
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Share this episode
              </h3>
              <SocialShare url={episodeUrl} title={episode.title} />
            </div>

            <SubscribeButtons
              applePodcastsUrl={podcast.applePodcastsUrl}
              spotifyUrl={podcast.spotifyUrl}
              youtubeUrl={podcast.youtubeUrl}
              rssFeedUrl={podcast.rssFeedUrl}
            />
          </motion.div>

          {/* Prev / Next Episode Navigation */}
          {(previousEpisode || nextEpisode) && (
            <div className="grid grid-cols-1 gap-4 border-t border-white/[0.06] pt-8 sm:grid-cols-2">
              {previousEpisode ? (
                <Link
                  href={`/podcasts/${podcast.slug}/episodes/${previousEpisode.slug}`}
                  className="group flex cursor-pointer flex-col gap-1.5 border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ChevronLeft className="size-3" />
                    <span>Previous Episode</span>
                  </div>
                  <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {previousEpisode.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}

              {nextEpisode ? (
                <Link
                  href={`/podcasts/${podcast.slug}/episodes/${nextEpisode.slug}`}
                  className="group flex cursor-pointer flex-col items-end gap-1.5 border border-white/[0.06] bg-white/[0.02] p-4 text-right transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>Next Episode</span>
                    <ChevronRight className="size-3" />
                  </div>
                  <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {nextEpisode.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
            </div>
          )}

          {/* Related Episodes */}
          {relatedEpisodes.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold text-foreground">
                More from {podcast.title}
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                {relatedEpisodes.map((relatedEpisode) => (
                  <EpisodeCard
                    key={relatedEpisode.id}
                    episode={relatedEpisode}
                    podcastTitle={podcast.title}
                    podcastSlug={podcast.slug}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Back to Podcast */}
          <div className="flex justify-center border-t border-white/[0.06] pt-8 pb-4">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/15"
            >
              <Link href={`/podcasts/${podcast.slug}`}>
                View all episodes from {podcast.title}
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </ErrorBoundary>
  );
}
