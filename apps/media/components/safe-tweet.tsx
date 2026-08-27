"use client";

import React from "react";
import { Tweet, TweetSkeleton } from "react-tweet";
import { normalizeTweetId } from "@/lib/tweet-id";

type SafeTweetProps = {
  id: string;
};

// solana.com routes /api/posts/* requests to the separately deployed media app.
function getTweetApiUrl(tweetId: string) {
  return `/api/posts/tweet/${tweetId}`;
}

export function SafeTweet({ id }: SafeTweetProps) {
  const tweetId = normalizeTweetId(id);

  if (!tweetId) {
    return null;
  }

  return (
    <div data-theme="dark">
      <Tweet
        id={tweetId}
        apiUrl={getTweetApiUrl(tweetId)}
        fallback={<TweetSkeleton />}
      />
    </div>
  );
}
