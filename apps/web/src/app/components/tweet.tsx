"use client";

import { Tweet as ReactTweet } from "react-tweet";
import { useTheme } from "@solana-com/ui-chrome";

interface TweetProps {
  id: string;
  fallback?: React.ReactNode;
}

/**
 * Tweet component for embedding X (Twitter) posts in MDX content.
 * Renders tweets statically at build time with automatic dark/light theme support.
 *
 * @example
 * ```mdx
 * <Tweet id="1234567890123456789" />
 * ```
 */
export function Tweet({ id, fallback }: TweetProps) {
  const { theme } = useTheme();

  return (
    <div className="not-prose my-6">
      <div data-theme={theme}>
        <ReactTweet id={id} fallback={fallback} />
      </div>
    </div>
  );
}
