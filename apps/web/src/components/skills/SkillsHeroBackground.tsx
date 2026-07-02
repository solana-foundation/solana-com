"use client";

import {
  getSafeUnicornDpi,
  SafeUnicornScene,
} from "@/components/shared/SafeUnicornScene";

export function SkillsHeroBackground() {
  return (
    <SafeUnicornScene
      className="!absolute inset-0 z-0"
      jsonFilePath="/src/img/solutions/icm/hero-bg.json"
      width="100%"
      height="100%"
      scale={1}
      dpi={getSafeUnicornDpi()}
      fps={30}
      lazyLoad={true}
      production={true}
      onError={(error) => console.error("UnicornScene error:", error)}
    />
  );
}
