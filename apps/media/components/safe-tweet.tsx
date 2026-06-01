"use client";

import { Tweet, TweetSkeleton } from "react-tweet";

type SafeTweetProps = {
  id: string;
};

export function SafeTweet({ id }: SafeTweetProps) {
  const tweetId = id.trim();

  if (!tweetId) {
    return null;
  }

  return (
    <div data-theme="dark">
      <Tweet
        id={tweetId}
        apiUrl={`/api/tweet/${tweetId}`}
        fallback={<TweetSkeleton />}
      />
    </div>
  );
}
