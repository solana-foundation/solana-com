"use client";

import ECDRHero from "@/components/ecdr/ECDRHero";
import ECDRStats from "@/components/ecdr/ECDRStats";
import ECDRJoinCommunity from "@/components/ecdr/ECDRJoinCommunity";

export function Outlook2023Page() {
  return (
    <div className="overflow-hidden">
      <ECDRHero />
      <ECDRStats />
      <ECDRJoinCommunity />
    </div>
  );
}
