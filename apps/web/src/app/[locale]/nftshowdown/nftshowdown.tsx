"use client";

import NFTShowdownLayout from "@/components/nft-showdown/NFTShowdownLayout";
import NFTShowdownIntro from "@/components/nft-showdown/NFTShowdownIntro";
import NFTShowdownPartners from "@/components/nft-showdown/NFTShowdownPartners";
import NFTShowdownFooter from "@/components/nft-showdown/NFTShowdownFooter";

export function NFTShowdownPage() {
  return (
    <NFTShowdownLayout>
      <NFTShowdownIntro />
      <NFTShowdownPartners />
      <NFTShowdownFooter />
    </NFTShowdownLayout>
  );
}
