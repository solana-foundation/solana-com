"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

interface GiscusWidgetProps {
  discussionKey: string;
}

export default function GiscusWidget({ discussionKey }: GiscusWidgetProps) {
  const { resolvedTheme } = useTheme();
  return (
    <Giscus
      key={discussionKey}
      repo="solana-developers/docs-feedback"
      repoId="R_kgDON1vT5w"
      category="Announcements"
      categoryId="DIC_kwDON1vT584CmvXl"
      mapping="specific"
      term={discussionKey}
      inputPosition="top"
      loading="lazy"
      strict="1"
      reactionsEnabled="1"
      theme={
        resolvedTheme === "dark"
          ? "https://cdn.jsdelivr.net/gh/solana-developers/docs-feedback@main/dark.css"
          : "https://cdn.jsdelivr.net/gh/solana-developers/docs-feedback@main/light.css"
      }
    />
  );
}
