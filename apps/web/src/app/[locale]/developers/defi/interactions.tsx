"use client";

import { memo } from "react";
import { SelectionColor } from "@/component-library/selection-color";
import { SafeUnicornScene } from "@/components/shared/SafeUnicornScene";

export function PageSelectionColor() {
  return (
    <SelectionColor selectionColor="#55E9AB" selectionTextColor="#000000" />
  );
}

export const HeroScene = memo(function HeroScene() {
  return (
    <SafeUnicornScene
      projectId="developers-defi-hero"
      className="!absolute inset-0 z-0 !h-full !w-full opacity-70 motion-reduce:hidden"
      jsonFilePath="/src/img/solutions/defi/hero-bg.json"
      width="100%"
      height="100%"
      scale={1}
      fps={30}
      lazyLoad
      production
      fallback={null}
      onError={(error) => console.error("UnicornScene error:", error)}
    />
  );
});
