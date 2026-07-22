import { describe, expect, it } from "vitest";
import { sortPodcastsByLatestEpisode } from "@/lib/podcast-utils";
import type { PodcastShow } from "@/lib/podcast-types";

function podcast(id: string, publishedDate?: string): PodcastShow {
  return {
    id,
    title: id,
    slug: id,
    description: "",
    coverImage: "/cover.png",
    featured: false,
    displayOrder: 1,
    status: "active",
    hosts: [],
    latestEpisode: publishedDate
      ? {
          id: `${id}-episode`,
          slug: `${id}-episode`,
          recordingId: `${id}-episode`,
          podcastSlug: id,
          title: `${id} episode`,
          publishedDate,
          duration: 60,
          audioUrl: "https://example.com/episode.mp3",
          status: "ready",
        }
      : undefined,
  };
}

describe("sortPodcastsByLatestEpisode", () => {
  it("sorts podcasts by latest episode date in descending order", () => {
    const podcasts = [
      podcast("older", "2025-06-01T00:00:00.000Z"),
      podcast("newest", "2026-07-20T00:00:00.000Z"),
      podcast("newer", "2026-01-15T00:00:00.000Z"),
    ];

    expect(sortPodcastsByLatestEpisode(podcasts).map(({ id }) => id)).toEqual([
      "newest",
      "newer",
      "older",
    ]);
  });

  it("places podcasts without a valid latest episode date last", () => {
    const podcasts = [
      podcast("missing"),
      podcast("dated", "2026-07-20T00:00:00.000Z"),
      podcast("invalid", "not-a-date"),
    ];

    expect(sortPodcastsByLatestEpisode(podcasts).map(({ id }) => id)).toEqual([
      "dated",
      "missing",
      "invalid",
    ]);
  });

  it("does not mutate the existing section order when dates match", () => {
    const podcasts = [
      podcast("first", "2026-07-20T00:00:00.000Z"),
      podcast("second", "2026-07-20T00:00:00.000Z"),
    ];

    expect(sortPodcastsByLatestEpisode(podcasts)).not.toBe(podcasts);
    expect(sortPodcastsByLatestEpisode(podcasts).map(({ id }) => id)).toEqual([
      "first",
      "second",
    ]);
    expect(podcasts.map(({ id }) => id)).toEqual(["first", "second"]);
  });
});
