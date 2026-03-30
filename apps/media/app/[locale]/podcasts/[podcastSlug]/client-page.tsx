"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Link } from "@workspace/i18n/routing";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AudioPlayer } from "@/components/podcast/audio-player";
import { EpisodeCard } from "@/components/podcast/episode-card";
import { SubscribeButtons } from "@/components/podcast/subscribe-buttons";
import { PodcastDescription } from "@/components/podcast/podcast-description";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import LoadMoreStatus from "@/components/ui/load-more-status";
import { getSafeExternalUrl } from "@/lib/external-url";
import { getInitials } from "@/lib/podcast-utils";
import type { PodcastShow, PodcastEpisode } from "@/lib/podcast-types";
import ErrorBoundary from "@/components/error-boundary";

interface PodcastShowClientPageProps {
  podcast: PodcastShow;
  initialEpisodes: PodcastEpisode[];
  initialHasMore: boolean;
}

export default function PodcastShowClientPage({
  podcast,
  initialEpisodes,
  initialHasMore,
}: PodcastShowClientPageProps) {
  const hosts = podcast.hosts.map((host) => ({
    ...host,
    twitterUrl: getSafeExternalUrl(host.twitterUrl),
  }));
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>(initialEpisodes);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [currentOffset, setCurrentOffset] = useState(initialEpisodes.length);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const res = await fetch(
        `/api/podcasts/${podcast.slug}/episodes?limit=12&offset=${currentOffset}`,
      );
      if (!res.ok) throw new Error("Failed to fetch episodes");

      const data = await res.json();

      if (data.episodes.length > 0) {
        setEpisodes((prev) => [...prev, ...data.episodes]);
        setCurrentOffset((prev) => prev + data.episodes.length);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more episodes:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, currentOffset, podcast.slug]);

  const latestEpisode = episodes[0];

  return (
    <ErrorBoundary>
      <Section>
        <div className="flex flex-col gap-12 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-8">
          {/* Back Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
              <Link href="/podcasts">
                <ArrowLeft className="size-4" />
                <span>All Podcasts</span>
              </Link>
            </Button>
          </motion.div>

          {/* Podcast Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-8 md:flex-row md:items-start"
          >
            {/* Cover Image */}
            <div className="w-full flex-shrink-0 md:w-64">
              <div className="relative aspect-square w-full overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.35)]">
                <Image
                  src={podcast.coverImage}
                  alt={podcast.title}
                  fill
                  priority
                  sizes="(min-width: 768px) 256px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Podcast Info */}
            <div className="flex flex-1 flex-col gap-5">
              <div>
                <h1 className="text-3xl font-bold mb-3 md:text-4xl text-foreground">
                  {podcast.title}
                </h1>
                {podcast.description && (
                  <PodcastDescription description={podcast.description} />
                )}
              </div>

              {/* Hosts */}
              {hosts.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                    Hosted by
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {hosts.map((host, index) => (
                      <a
                        key={index}
                        href={host.twitterUrl || undefined}
                        target={host.twitterUrl ? "_blank" : undefined}
                        rel={
                          host.twitterUrl ? "noopener noreferrer" : undefined
                        }
                        className="flex items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm transition-colors hover:border-white/20"
                      >
                        <Avatar className="size-5">
                          {host.avatar && (
                            <AvatarImage src={host.avatar} alt={host.name} />
                          )}
                          <AvatarFallback className="text-[9px]">
                            {getInitials(host.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">
                          {host.name}
                        </span>
                        {host.twitterUrl && (
                          <ArrowUpRight className="size-3 text-muted-foreground" />
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Subscribe Buttons */}
              <SubscribeButtons
                applePodcastsUrl={podcast.applePodcastsUrl}
                spotifyUrl={podcast.spotifyUrl}
                youtubeUrl={podcast.youtubeUrl}
                rssFeedUrl={podcast.rssFeedUrl}
                podcastTitle={podcast.title}
                podcastSlug={podcast.slug}
              />

              {/* Release Frequency */}
              {podcast.releaseFrequency && (
                <p className="text-xs text-muted-foreground">
                  New episodes {podcast.releaseFrequency.toLowerCase()}
                </p>
              )}
            </div>
          </motion.div>

          {/* Latest Episode Player */}
          {latestEpisode && latestEpisode.audioUrl && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-3"
            >
              <h2 className="text-xl font-semibold text-foreground">
                Latest Episode
              </h2>
              <AudioPlayer
                episode={latestEpisode}
                podcastTitle={podcast.title}
                podcastSlug={podcast.slug}
              />
            </motion.div>
          )}

          {/* Episodes List */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-foreground">
              All Episodes
              {episodes.length > 0 && (
                <span className="ml-2 text-base font-normal text-muted-foreground">
                  ({episodes.length}
                  {hasMore ? "+" : ""})
                </span>
              )}
            </h2>

            {episodes.length > 0 ? (
              <AnimatedGroup
                preset="fade"
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {episodes.map((episode) => (
                  <EpisodeCard
                    key={episode.id}
                    episode={episode}
                    podcastTitle={podcast.title}
                    podcastSlug={podcast.slug}
                  />
                ))}
              </AnimatedGroup>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  No episodes available yet. Check back soon!
                </p>
              </div>
            )}

            {/* Infinite Scroll */}
            {episodes.length > 0 && (
              <LoadMoreStatus
                isLoading={isLoadingMore}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                loadingText="Loading more episodes..."
              />
            )}
          </div>
        </div>
      </Section>
    </ErrorBoundary>
  );
}
