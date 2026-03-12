"use client";

import React from "react";
import { Link } from "@workspace/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AudioPlayer } from "@/components/podcast/audio-player";
import { EpisodeCard } from "@/components/podcast/episode-card";
import { SocialShare } from "@/components/ui/social-share";
import { formatDuration, formatEpisodeDate } from "@/lib/podcast-utils";
import type { PodcastShow, PodcastEpisode } from "@/lib/podcast-types";
import ErrorBoundary from "@/components/error-boundary";

interface EpisodeClientPageProps {
  podcast: PodcastShow;
  episode: PodcastEpisode;
  relatedEpisodes: PodcastEpisode[];
}

export default function EpisodeClientPage({
  podcast,
  episode,
  relatedEpisodes,
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
        <div className="flex flex-col gap-12 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-8">
          {/* Back Navigation */}
          <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
            <Link href={`/podcasts/${podcast.slug}`}>
              <ArrowLeft className="h-4 w-4" />
              <span>Back to {podcast.title}</span>
            </Link>
          </Button>

          {/* Episode Header */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{formatEpisodeDate(episode.publishedDate)}</span>
              <span>•</span>
              <Badge variant="outline">
                {formatDuration(episode.duration)}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold md:text-5xl">{episode.title}</h1>

            {episode.description && (
              <p className="text-lg text-muted-foreground">
                {episode.description}
              </p>
            )}
          </div>

          {/* Audio Player */}
          {episode.audioUrl ? (
            <div className="sticky top-4 z-10">
              <AudioPlayer url={episode.audioUrl} title={episode.title} />
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-muted p-8 text-center">
              <p className="text-muted-foreground">
                Audio not yet available for this episode.
              </p>
            </div>
          )}

          {/* Social Share */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Share this episode</h3>
            <SocialShare url={episodeUrl} title={episode.title} />
          </div>

          {/* Related Episodes */}
          {relatedEpisodes.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold">
                More from {podcast.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedEpisodes.map((relatedEpisode) => (
                  <EpisodeCard
                    key={relatedEpisode.id}
                    episode={relatedEpisode}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Back to Podcast Link */}
          <div className="flex justify-center pt-8 border-t border-border">
            <Button asChild variant="outline" size="lg">
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
