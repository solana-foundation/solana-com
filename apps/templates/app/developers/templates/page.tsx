import { Suspense } from "react";
import { AppHero } from "@/components/app-hero";
import { TemplatesUiLayoutList } from "@/components/templates/templates-ui-layout-list";

export default function Home() {
  return (
    <Suspense>
      <AppHero
        title="Solana Developer Templates"
        subtitle="Build faster with production-ready templates for dApps, DeFi protocols, NFT marketplaces, and more. Get started with battle-tested code patterns optimized for the Solana ecosystem."
      />
      <TemplatesUiLayoutList />
    </Suspense>
  );
}
