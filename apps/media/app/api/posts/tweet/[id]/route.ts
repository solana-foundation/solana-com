import { NextResponse } from "next/server";
import { fetchTweet, type Tweet } from "react-tweet/api";
import { isTweetId } from "@/lib/tweet-id";

const ONE_MONTH_SECONDS = 60 * 60 * 24 * 30;

type TweetEntities = Tweet["entities"];
type TweetWithEntities = {
  entities?: Partial<TweetEntities> | null;
  parent?: Tweet["parent"];
  quoted_tweet?: Tweet["quoted_tweet"];
};

function normalizeEntities(
  entities: Partial<TweetEntities> | null | undefined,
): TweetEntities {
  const normalized: TweetEntities = {
    hashtags: Array.isArray(entities?.hashtags) ? entities.hashtags : [],
    urls: Array.isArray(entities?.urls) ? entities.urls : [],
    user_mentions: Array.isArray(entities?.user_mentions)
      ? entities.user_mentions
      : [],
    symbols: Array.isArray(entities?.symbols) ? entities.symbols : [],
  };

  if (Array.isArray(entities?.media)) {
    normalized.media = entities.media;
  }

  return normalized;
}

function normalizeTweet<T extends TweetWithEntities>(tweet: T): T {
  return {
    ...tweet,
    entities: normalizeEntities(tweet.entities),
    parent: tweet.parent ? normalizeTweet(tweet.parent) : tweet.parent,
    quoted_tweet: tweet.quoted_tweet
      ? normalizeTweet(tweet.quoted_tweet)
      : tweet.quoted_tweet,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const responseInit = {
    headers: {
      "Cache-Control": `public, max-age=0, s-maxage=${ONE_MONTH_SECONDS}, stale-while-revalidate=${ONE_MONTH_SECONDS}`,
    },
  };

  if (!isTweetId(id)) {
    return NextResponse.json({ error: "Invalid tweet ID" }, { status: 400 });
  }

  try {
    const { data } = await fetchTweet(id);

    return NextResponse.json(
      {
        data: data ? normalizeTweet(data) : null,
      },
      responseInit,
    );
  } catch (error) {
    console.error(`Failed to fetch tweet "${id}":`, error);

    return NextResponse.json(
      {
        error: "Failed to fetch tweet",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
