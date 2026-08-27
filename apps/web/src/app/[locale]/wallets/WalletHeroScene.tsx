"use client";

import { useEffect, useState } from "react";
import { SafeUnicornScene } from "@/components/shared/SafeUnicornScene";
import styles from "./WalletDirectory.module.scss";

const SCENE_JSON_PATH = "/src/img/wallets/hero-bg.json";

export function WalletHeroScene() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const fallback = <div className={styles.heroSceneFallback} />;

  return (
    <div className={styles.heroScene} aria-hidden="true">
      {reducedMotion ? (
        fallback
      ) : (
        <SafeUnicornScene
          projectId="wallets-hero"
          jsonFilePath={SCENE_JSON_PATH}
          width="100%"
          height="100%"
          scale={1}
          fps={30}
          lazyLoad
          production
          placeholder={fallback}
          fallback={fallback}
          showPlaceholderOnError
          showPlaceholderWhileLoading
          onError={(error) => console.error("UnicornScene error:", error)}
        />
      )}
    </div>
  );
}
