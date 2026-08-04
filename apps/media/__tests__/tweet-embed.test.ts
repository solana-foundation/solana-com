import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetchTweetMock, nextJsonMock, tweetMock } = vi.hoisted(() => ({
  fetchTweetMock: vi.fn(),
  nextJsonMock: vi.fn((body: unknown, init?: ResponseInit) => ({ body, init })),
  tweetMock: vi.fn((_props: { id: string; apiUrl: string }) => null),
}));

vi.mock("react-tweet", () => ({
  Tweet: tweetMock,
  TweetSkeleton: () => null,
}));

vi.mock("react-tweet/api", () => ({
  fetchTweet: fetchTweetMock,
}));

vi.mock("next/server", () => ({
  NextResponse: {
    json: nextJsonMock,
  },
}));

import { GET as getTweet } from "@/app/api/posts/tweet/[id]/route";
import { SafeTweet } from "@/components/safe-tweet";

describe("tweet embeds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads tweet data through the media app's public posts API", () => {
    renderToStaticMarkup(
      React.createElement(SafeTweet, { id: " 2051767380880077062 " }),
    );

    expect(tweetMock.mock.calls[0]?.[0]).toMatchObject({
      id: "2051767380880077062",
      apiUrl: "/api/posts/tweet/2051767380880077062",
    });
  });

  it("serves normalized tweet data from the public posts API route", async () => {
    fetchTweetMock.mockResolvedValue({
      data: {
        id_str: "2051767380880077062",
        entities: null,
        quoted_tweet: {
          entities: {
            hashtags: [{ text: "Solana", indices: [0, 7] }],
          },
        },
      },
    });

    const response = (await getTweet(new Request("https://example.com"), {
      params: Promise.resolve({ id: "2051767380880077062" }),
    })) as unknown as {
      body: {
        data: {
          entities: Record<string, unknown[]>;
          quoted_tweet: { entities: Record<string, unknown[]> };
        };
      };
      init: {
        headers: Record<string, string>;
      };
    };

    expect(fetchTweetMock).toHaveBeenCalledWith("2051767380880077062");
    expect(response.body.data.entities).toEqual({
      hashtags: [],
      urls: [],
      user_mentions: [],
      symbols: [],
    });
    expect(response.body.data.quoted_tweet.entities).toEqual({
      hashtags: [{ text: "Solana", indices: [0, 7] }],
      urls: [],
      user_mentions: [],
      symbols: [],
    });
    expect(response.init.headers["Cache-Control"]).toBe(
      "public, max-age=0, s-maxage=2592000, stale-while-revalidate=2592000",
    );
  });
});
