"use client";

import React, { useState, useMemo } from "react";
import { Link } from "@workspace/i18n/routing";
import Image from "next/image";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { PodcastCard } from "@/components/podcast/podcast-card";
import {
  getPodcastCategories,
  formatDuration,
  formatEpisodeDate,
} from "@/lib/podcast-utils";
import type { PodcastShow } from "@/lib/podcast-types";
import ErrorBoundary from "@/components/error-boundary";

interface PodcastsClientPageProps {
  podcasts: PodcastShow[];
}

export default function PodcastsClientPage({
  podcasts,
}: PodcastsClientPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get latest podcast (one with the most recent episode upload)
  const latestPodcast = useMemo(() => {
    const podcastsWithEpisodes = podcasts.filter(
      (p) => p.latestEpisode?.publishedDate
    );

    if (podcastsWithEpisodes.length === 0) {
      return null;
    }

    // Sort by publishedDate (most recent first) and return the first one
    return podcastsWithEpisodes.sort((a, b) => {
      const dateA = new Date(a.latestEpisode!.publishedDate).getTime();
      const dateB = new Date(b.latestEpisode!.publishedDate).getTime();
      return dateB - dateA;
    })[0];
  }, [podcasts]);

  // Get unique categories
  const categories = useMemo(() => {
    return getPodcastCategories(podcasts);
  }, [podcasts]);

  // Filter podcasts by category
  const filteredPodcasts = useMemo(() => {
    let filtered = podcasts;

    // Exclude latest podcast from the list (it's shown in the hero)
    if (latestPodcast) {
      filtered = filtered.filter((p) => p.id !== latestPodcast.id);
    }

    // Filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    return filtered;
  }, [podcasts, selectedCategory, latestPodcast]);

  // Group podcasts by foundation status
  const groupedPodcasts = useMemo(() => {
    const solanaFoundation = filteredPodcasts.filter((p) =>
      p.tags?.some((tag) => tag.toLowerCase() === "solana foundation")
    );
    const otherPodcasts = filteredPodcasts.filter(
      (p) => !p.tags?.some((tag) => tag.toLowerCase() === "solana foundation")
    );

    return { solanaFoundation, otherPodcasts };
  }, [filteredPodcasts]);

  return (
    <ErrorBoundary>
      <Section>
        <div className="flex flex-col gap-16">
          {/* Latest Podcast Hero */}
          {latestPodcast && (
            <div className="relative w-full overflow-hidden bg-[#070b14] text-white shadow-[0_60px_120px_-60px_rgba(7,12,28,0.9)] p-6 md:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_0%_0%,rgba(82,158,255,0.25),transparent_55%),radial-gradient(90%_90%_at_100%_0%,rgba(25,237,152,0.15),transparent_60%),radial-gradient(80%_80%_at_50%_100%,rgba(153,69,255,0.15),transparent_75%)]" />
              <div className="relative z-10 flex flex-col gap-12 lg:flex-row lg:items-center max-w-6xl mx-auto">
                <div className="flex flex-1 flex-col gap-8">
                  <span className="text-xs font-base uppercase tracking-[0.1em] text-primary">
                    Featured Podcast
                  </span>
                  <h1 className="text-4xl font-bold leading-[1.05] md:text-6xl">
                    {latestPodcast.title}
                  </h1>

                  {typeof latestPodcast.description === "string" && (
                    <p className="text-lg text-white/80 line-clamp-3">
                      {latestPodcast.description}
                    </p>
                  )}

                  {/* Hosts */}
                  {latestPodcast.hosts && latestPodcast.hosts.length > 0 && (
                    <p className="text-sm text-white/60">
                      Hosted by{" "}
                      {latestPodcast.hosts.map((h) => h.name).join(", ")}
                    </p>
                  )}

                  {/* Latest Episode Info */}
                  {latestPodcast.latestEpisode && (
                    <div className="flex flex-col gap-3 border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                      <p className="text-xs font-medium uppercase tracking-[0.1em] text-primary">
                        Latest Episode
                      </p>
                      <p className="text-base font-semibold text-white">
                        {latestPodcast.latestEpisode.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                        {latestPodcast.latestEpisode.publishedDate && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="size-4" />
                            <span>
                              {formatEpisodeDate(
                                latestPodcast.latestEpisode.publishedDate
                              )}
                            </span>
                          </div>
                        )}
                        {latestPodcast.latestEpisode.duration > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="size-4" />
                            <span>
                              {formatDuration(
                                latestPodcast.latestEpisode.duration
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="group inline-flex w-fit items-center rounded-full border border-white/40 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white/70 hover:bg-white/10"
                  >
                    <Link
                      href={
                        latestPodcast.latestEpisode
                          ? `/podcasts/${latestPodcast.slug}/episodes/${latestPodcast.latestEpisode.id}`
                          : `/podcasts/${latestPodcast.slug}`
                      }
                    >
                      <span>
                        {latestPodcast.latestEpisode
                          ? "Listen to Episode"
                          : "Listen Now"}
                      </span>
                      <span className="flex size-9 items-center justify-center">
                        <ArrowUpRight className="size-5" />
                      </span>
                    </Link>
                  </Button>
                </div>

                {latestPodcast.coverImage && (
                  <div className="flex flex-1 lg:justify-end">
                    <div className="relative aspect-square w-full lg:max-w-[520px]">
                      <div className="relative h-full w-full overflow-hidden shadow-2xl">
                        <Image
                          src={latestPodcast.coverImage}
                          alt={latestPodcast.title}
                          fill
                          priority
                          sizes="(min-width: 1024px) 520px, (min-width: 768px) 60vw, 90vw"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="px-4 md:px-6 lg:px-0">
            {/* Page Title for non-latest case */}
            {!latestPodcast && (
              <div className="max-w-6xl mx-auto w-full">
                <h1 className="text-4xl font-bold md:text-6xl mb-4">
                  Podcasts
                </h1>
                <p className="text-lg text-muted-foreground">
                  Explore our collection of podcasts
                </p>
              </div>
            )}

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 max-w-6xl mx-auto w-full mb-6">
                <span className="text-sm font-medium text-muted-foreground">
                  Filter by category:
                </span>
                <Button
                  variant={selectedCategory === null ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="capitalize"
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "secondary"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}

            {/* Solana Foundation Podcasts */}
            {groupedPodcasts.solanaFoundation.length > 0 && (
              <div className="max-w-6xl mx-auto w-full mb-12">
                <h2 className="text-2xl font-bold mb-6">
                  Solana Foundation Podcasts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedPodcasts.solanaFoundation.map((podcast) => (
                    <PodcastCard key={podcast.id} podcast={podcast} />
                  ))}
                </div>
              </div>
            )}

            {/* Other Podcasts */}
            {groupedPodcasts.otherPodcasts.length > 0 && (
              <div className="max-w-6xl mx-auto w-full">
                <h2 className="text-2xl font-bold mb-6">Ecosystem Podcasts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedPodcasts.otherPodcasts.map((podcast) => (
                    <PodcastCard key={podcast.id} podcast={podcast} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {groupedPodcasts.solanaFoundation.length === 0 &&
              groupedPodcasts.otherPodcasts.length === 0 && (
                <div className="text-center py-12 max-w-6xl mx-auto w-full">
                  <p className="text-muted-foreground">
                    {selectedCategory
                      ? `No podcasts found in the "${selectedCategory}" category.`
                      : "No podcasts available at the moment."}
                  </p>
                </div>
              )}
          </div>
        </div>
      </Section>
    </ErrorBoundary>
  );
}
