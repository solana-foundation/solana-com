"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { PodcastCard } from "@/components/podcast/podcast-card";
import {
  getPodcastCategories,
  formatDuration,
  formatEpisodeDate,
} from "@/lib/podcast-data";
import type { PodcastShow } from "@/lib/podcast-types";
import ErrorBoundary from "@/components/error-boundary";

interface PodcastsClientPageProps {
  podcasts: PodcastShow[];
}

export default function PodcastsClientPage({
  podcasts,
}: PodcastsClientPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get featured podcast (one with "Featured" tag)
  const featuredPodcast = useMemo(() => {
    return podcasts.find((p) =>
      p.tags?.some((tag) => tag.toLowerCase() === "featured")
    );
  }, [podcasts]);

  // Get unique categories
  const categories = useMemo(() => {
    return getPodcastCategories(podcasts);
  }, [podcasts]);

  // Filter podcasts by category
  const filteredPodcasts = useMemo(() => {
    if (!selectedCategory) {
      return podcasts;
    }
    return podcasts.filter((p) => p.category === selectedCategory);
  }, [podcasts, selectedCategory]);

  return (
    <ErrorBoundary>
      <Section>
        <div className="flex flex-col gap-16 px-4 md:px-6 lg:px-8 pt-8 md:pt-12">
          {/* Featured Podcast Hero */}
          {featuredPodcast && (
            <div className="relative w-full overflow-hidden bg-[#070b14] text-white shadow-[0_60px_120px_-60px_rgba(7,12,28,0.9)] p-6 md:p-12 rounded-lg">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_0%_0%,rgba(82,158,255,0.25),transparent_55%),radial-gradient(90%_90%_at_100%_0%,rgba(25,237,152,0.15),transparent_60%),radial-gradient(80%_80%_at_50%_100%,rgba(153,69,255,0.15),transparent_75%)]" />
              <div className="relative z-10 flex flex-col gap-12 lg:flex-row lg:items-center max-w-6xl mx-auto">
                <div className="flex flex-1 flex-col gap-8">
                  <span className="text-xs font-base uppercase tracking-[0.1em] text-sky-300/80">
                    Featured Podcast
                  </span>
                  <h1 className="text-4xl font-bold leading-[1.05] md:text-6xl">
                    {featuredPodcast.title}
                  </h1>

                  {typeof featuredPodcast.description === "string" && (
                    <p className="text-lg text-white/80 line-clamp-3">
                      {featuredPodcast.description}
                    </p>
                  )}

                  {/* Hosts */}
                  {featuredPodcast.hosts &&
                    featuredPodcast.hosts.length > 0 && (
                      <p className="text-sm text-white/60">
                        Hosted by{" "}
                        {featuredPodcast.hosts.map((h) => h.name).join(", ")}
                      </p>
                    )}

                  {/* Latest Episode Info */}
                  {featuredPodcast.latestEpisode && (
                    <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                      <p className="text-xs font-medium uppercase tracking-[0.1em] text-sky-300/80">
                        Latest Episode
                      </p>
                      <p className="text-base font-semibold text-white">
                        {featuredPodcast.latestEpisode.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                        {featuredPodcast.latestEpisode.publishedDate && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="size-4" />
                            <span>
                              {formatEpisodeDate(
                                featuredPodcast.latestEpisode.publishedDate
                              )}
                            </span>
                          </div>
                        )}
                        {featuredPodcast.latestEpisode.duration > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="size-4" />
                            <span>
                              {formatDuration(
                                featuredPodcast.latestEpisode.duration
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
                        featuredPodcast.latestEpisode
                          ? `/media/listen/${featuredPodcast.slug}/episodes/${featuredPodcast.latestEpisode.id}`
                          : `/media/listen/${featuredPodcast.slug}`
                      }
                    >
                      <span>
                        {featuredPodcast.latestEpisode
                          ? "Listen to Episode"
                          : "Listen Now"}
                      </span>
                      <span className="flex size-9 items-center justify-center">
                        <ArrowUpRight className="size-5" />
                      </span>
                    </Link>
                  </Button>
                </div>

                {featuredPodcast.coverImage && (
                  <div className="flex flex-1 justify-end">
                    <div className="relative aspect-square w-full max-w-[400px]">
                      <div className="relative h-full w-full overflow-hidden rounded-lg shadow-2xl">
                        <Image
                          src={featuredPodcast.coverImage}
                          alt={featuredPodcast.title}
                          fill
                          priority
                          sizes="(min-width: 1024px) 400px, (min-width: 768px) 60vw, 90vw"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Page Title for non-featured case */}
          {!featuredPodcast && (
            <div className="max-w-6xl mx-auto w-full">
              <h1 className="text-4xl font-bold md:text-6xl mb-4">Podcasts</h1>
              <p className="text-lg text-muted-foreground">
                Explore our collection of podcasts
              </p>
            </div>
          )}

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 max-w-6xl mx-auto w-full">
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

          {/* Podcasts Grid */}
          {filteredPodcasts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
              {filteredPodcasts.map((podcast) => (
                <PodcastCard key={podcast.id} podcast={podcast} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 max-w-6xl mx-auto w-full">
              <p className="text-muted-foreground">
                {selectedCategory
                  ? `No podcasts found in the "${selectedCategory}" category.`
                  : "No podcasts available at the moment."}
              </p>
            </div>
          )}
        </div>
      </Section>
    </ErrorBoundary>
  );
}
