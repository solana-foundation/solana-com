"use client";

import React, { useMemo } from "react";
import { Link } from "@workspace/i18n/routing";
import Image from "next/image";
import { ArrowUpRight, Calendar, Clock, Play } from "lucide-react";
import { motion } from "motion/react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { PodcastCard } from "@/components/podcast/podcast-card";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { formatDuration, formatEpisodeDate } from "@/lib/podcast-utils";
import { usePlayerOptional } from "@/components/podcast/player-context";
import type { PodcastShow } from "@/lib/podcast-types";
import ErrorBoundary from "@/components/error-boundary";

interface PodcastsClientPageProps {
  podcasts: PodcastShow[];
}

export default function PodcastsClientPage({
  podcasts,
}: PodcastsClientPageProps) {
  const player = usePlayerOptional();

  // Get latest podcast (one with the most recent episode upload)
  const latestPodcast = useMemo(() => {
    const podcastsWithEpisodes = podcasts.filter(
      (p) => p.latestEpisode?.publishedDate,
    );

    if (podcastsWithEpisodes.length === 0) return null;

    return podcastsWithEpisodes.sort((a, b) => {
      const dateA = new Date(a.latestEpisode!.publishedDate).getTime();
      const dateB = new Date(b.latestEpisode!.publishedDate).getTime();
      return dateB - dateA;
    })[0];
  }, [podcasts]);

  // All podcasts excluding the featured one
  const allPodcasts = useMemo(() => {
    if (!latestPodcast) return podcasts;
    return podcasts.filter((p) => p.id !== latestPodcast.id);
  }, [podcasts, latestPodcast]);

  const handlePlayLatest = () => {
    if (!player || !latestPodcast?.latestEpisode) return;
    player.play(
      latestPodcast.latestEpisode,
      latestPodcast.title,
      latestPodcast.slug,
    );
  };

  return (
    <ErrorBoundary>
      <Section>
        <div className="flex flex-col gap-16">
          {/* Featured Podcast Hero */}
          {latestPodcast && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full overflow-hidden bg-card text-white"
            >
              {/* Gradient overlays */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_0%_0%,rgba(20,241,149,0.12),transparent_55%),radial-gradient(90%_90%_at_100%_0%,rgba(153,69,255,0.1),transparent_60%),radial-gradient(80%_80%_at_50%_100%,rgba(82,158,255,0.08),transparent_75%)]" />

              <div className="relative z-10 flex flex-col gap-10 p-6 md:p-10 lg:flex-row lg:items-center lg:gap-12 max-w-6xl mx-auto">
                <div className="flex flex-1 flex-col gap-6">
                  <span className="text-xs font-medium uppercase tracking-[0.15em] text-primary">
                    Latest Episode
                  </span>

                  <h1 className="text-3xl font-bold leading-[1.1] md:text-5xl lg:text-6xl text-foreground">
                    {latestPodcast.title}
                  </h1>

                  {latestPodcast.descriptionPlainText && (
                    <p className="text-base leading-relaxed text-muted-foreground line-clamp-3 md:text-lg">
                      {latestPodcast.descriptionPlainText}
                    </p>
                  )}

                  {/* Hosts */}
                  {latestPodcast.hosts && latestPodcast.hosts.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Hosted by{" "}
                      {latestPodcast.hosts.map((h) => h.name).join(", ")}
                    </p>
                  )}

                  {/* Latest Episode Preview */}
                  {latestPodcast.latestEpisode && (
                    <div className="flex flex-col gap-3 border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                      <p className="text-xs font-medium uppercase tracking-[0.15em] text-primary">
                        New Episode
                      </p>
                      <p className="text-sm font-semibold text-foreground line-clamp-2">
                        {latestPodcast.latestEpisode.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        {latestPodcast.latestEpisode.publishedDate && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="size-3.5" />
                            <span>
                              {formatEpisodeDate(
                                latestPodcast.latestEpisode.publishedDate,
                              )}
                            </span>
                          </div>
                        )}
                        {latestPodcast.latestEpisode.duration > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="size-3.5" />
                            <span>
                              {formatDuration(
                                latestPodcast.latestEpisode.duration,
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Play button */}
                    {latestPodcast.latestEpisode?.audioUrl && (
                      <Button
                        size="lg"
                        onClick={handlePlayLatest}
                        className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-primary/90"
                      >
                        <Play className="size-4 ml-0.5" />
                        <span>Play Episode</span>
                      </Button>
                    )}

                    {/* View show */}
                    <Button
                      asChild
                      size="lg"
                      variant="ghost"
                      className="group inline-flex items-center rounded-full border border-white/20 bg-white/[0.03] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition hover:border-white/40 hover:bg-white/[0.06]"
                    >
                      <Link href={`/podcasts/${latestPodcast.slug}`}>
                        <span>View Show</span>
                        <ArrowUpRight className="size-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {latestPodcast.coverImage && (
                  <div className="flex flex-1 lg:justify-end">
                    <div className="relative aspect-square w-full max-w-[420px] lg:max-w-[480px]">
                      <div className="relative h-full w-full overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.4)]">
                        <Image
                          src={latestPodcast.coverImage}
                          alt={latestPodcast.title}
                          fill
                          priority
                          sizes="(min-width: 1024px) 480px, (min-width: 768px) 420px, 100vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* All Podcasts */}
          <div className="px-4 md:px-6 lg:px-0">
            {!latestPodcast && (
              <div className="max-w-6xl mx-auto w-full mb-8">
                <h1 className="text-4xl font-bold md:text-6xl mb-3 text-foreground">
                  Podcasts
                </h1>
                <p className="text-lg text-muted-foreground">
                  Explore the Solana podcast network
                </p>
              </div>
            )}

            {latestPodcast && (
              <div className="max-w-6xl mx-auto w-full mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  All Shows
                </h2>
              </div>
            )}

            {allPodcasts.length > 0 && (
              <AnimatedGroup
                preset="fade"
                className="grid grid-cols-1 gap-5 max-w-6xl mx-auto w-full sm:grid-cols-2 lg:grid-cols-3"
              >
                {allPodcasts.map((podcast) => (
                  <PodcastCard key={podcast.id} podcast={podcast} />
                ))}
              </AnimatedGroup>
            )}

            {allPodcasts.length === 0 && !latestPodcast && (
              <div className="text-center py-16 max-w-6xl mx-auto w-full">
                <p className="text-muted-foreground">
                  No podcasts available at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>
    </ErrorBoundary>
  );
}
