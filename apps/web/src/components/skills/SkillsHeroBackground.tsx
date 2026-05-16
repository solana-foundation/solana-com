"use client";

import UnicornScene from "unicornstudio-react";

export function SkillsHeroBackground() {
  return (
    <UnicornScene
      className="!absolute inset-0 z-0"
      jsonFilePath="/src/img/solutions/icm/hero-bg.json"
      width="100%"
      height="100%"
      scale={1}
      dpi={typeof window !== "undefined" ? window.devicePixelRatio : 2}
      fps={30}
      lazyLoad={true}
      production={true}
      onError={(error) => console.error("UnicornScene error:", error)}
    />
  );
}
