"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { Link } from "@workspace/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AudioPlayer } from "@/components/podcast/audio-player";
import { EpisodeCard } from "@/components/podcast/episode-card";
import { SubscribeButtons } from "@/components/podcast/subscribe-buttons";
import { formatEpisodeDate } from "@/lib/podcast-utils";
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
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>(initialEpisodes);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [currentOffset, setCurrentOffset] = useState(initialEpisodes.length);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0]?.toUpperCase() || "")
      .join("")
      .substring(0, 2);
  };

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const res = await fetch(
        `/api/podcasts/${podcast.slug}/episodes?limit=12&offset=${currentOffset}`
      );
      if (!res.ok) throw new Error("Failed to fetch episodes");

      const moreEpisodesData = await res.json();

      if (moreEpisodesData.episodes.length > 0) {
        setEpisodes((prev) => [...prev, ...moreEpisodesData.episodes]);
        setCurrentOffset((prev) => prev + moreEpisodesData.episodes.length);
        setHasMore(moreEpisodesData.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more episodes:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, currentOffset, podcast.slug]);

  // Infinite scroll observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          handleLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, isLoadingMore, handleLoadMore]);

  const latestEpisode = episodes[0];

  return (
    <ErrorBoundary>
      <Section>
        <div className="flex flex-col gap-16 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-8">
          {/* Back Navigation */}
          <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
            <Link href="/podcasts">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Podcasts</span>
            </Link>
          </Button>

          {/* Podcast Header */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Cover Image */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="relative aspect-square w-full overflow-hidden shadow-lg">
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
            <div className="flex-1 flex flex-col gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{podcast.title}</h1>
                {podcast.description && (
                  <p className="text-lg text-muted-foreground">
                    {String(podcast.description)}
                  </p>
                )}
              </div>

              {/* Hosts */}
              {podcast.hosts && podcast.hosts.length > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    Hosted by:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {podcast.hosts.map((host, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5"
                      >
                        <Avatar className="h-6 w-6">
                          {host.avatar && (
                            <AvatarImage src={host.avatar} alt={host.name} />
                          )}
                          <AvatarFallback className="text-xs">
                            {getInitials(host.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{host.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subscribe Buttons */}
              <SubscribeButtons
                applePodcastsUrl={podcast.applePodcastsUrl}
                spotifyUrl={podcast.spotifyUrl}
                rssFeedUrl={podcast.rssFeedUrl}
              />

              {/* Release Frequency */}
              {podcast.releaseFrequency && (
                <p className="text-sm text-muted-foreground">
                  New episodes: {podcast.releaseFrequency}
                </p>
              )}
            </div>
          </div>

          {/* Latest Episode Player */}
          {latestEpisode && latestEpisode.audioUrl && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold">Latest Episode</h2>
              <AudioPlayer
                url={latestEpisode.audioUrl}
                title={`${latestEpisode.title} - ${formatEpisodeDate(latestEpisode.publishedDate)}`}
              />
            </div>
          )}

          {/* Episodes List */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold">
              All Episodes ({episodes.length}
              {hasMore ? "+" : ""})
            </h2>

            {episodes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {episodes.map((episode) => (
                  <EpisodeCard key={episode.id} episode={episode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No episodes available yet. Check back soon!
                </p>
              </div>
            )}

            {/* Infinite Scroll Sentinel */}
            <div ref={sentinelRef} className="w-full mt-6 flex justify-center">
              {isLoadingMore && (
                <div className="flex items-center gap-2 text-muted-foreground py-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Loading more episodes...</span>
                </div>
              )}
              {!hasMore && episodes.length > 0 && (
                <p className="text-muted-foreground py-4">
                  No more episodes to load
                </p>
              )}
            </div>
          </div>
        </div>
      </Section>
    </ErrorBoundary>
  );
}
