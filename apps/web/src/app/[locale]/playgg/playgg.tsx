"use client";

import PlayGGLayout from "@/components/playgg/PlayGGLayout";
import PlayGGSplash from "@/components/playgg/PlayGGSplash";
import PlayGGGames from "@/components/playgg/PlayGGGames";

export function PlayGGPage() {
  return (
    <PlayGGLayout>
      <PlayGGSplash />
      <PlayGGGames />
    </PlayGGLayout>
  );
}
