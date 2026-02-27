"use client";

import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero.v2";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { Divider } from "@/components/solutions/divider.v2";
import { Decor } from "@/components/solutions/decor.v2";
import { Products } from "@/components/solutions/products.v2";
import { SelectionColor } from "@/component-library/selection-color";
import { PRODUCTS, TOOLS } from "@/data/solutions/x402";

interface X402PageProps {
  translations: {
    heroTitle: string;
    heroSubtitle: string;
    extraCta: string;
    extraCtaHref: string;
    stats: SolutionHeroStat[];
    featuresTitle: string;
    featuresDescription: string;
    ecoProjectsTitle: string;
    toolsTitle: string;
    toolsDescription: string;
  };
}

export function X402Page({ translations }: X402PageProps) {
  return (
    <>
      <SelectionColor selectionColor="#14F195" selectionTextColor="#000000" />

      <div className="overflow-hidden bg-black">
        {/* Hero Section with animated background */}
        <div className="[&_section]:!min-h-[500px] md:[&_section]:!min-h-[600px] xl:[&_section]:!min-h-[700px]">
          <SolutionHero
            title={translations.heroTitle}
            subtitle={translations.heroSubtitle}
            extraCta={translations.extraCta}
            extraCtaHref={translations.extraCtaHref}
            stats={translations.stats}
            bgJsonFilePath="/src/img/solutions/defi/hero-bg.json"
          />
        </div>

        <Divider />

        {/* What is x402 Section - reduce vertical padding */}
        <div className="[&_section]:!py-[32px] md:[&_section]:!py-[56px] xl:[&_section]:!py-[80px]">
          <WhatIsIt
            title={translations.featuresTitle}
            description={translations.featuresDescription}
            highlightColor="#14F195"
            imageSrc="/src/img/solutions/depin/what-is.webp"
          />
        </div>

        <Divider />

        {/* Ecosystem Products - reduce vertical padding */}
        <div className="[&_section]:!py-[32px] md:[&_section]:!py-[56px] xl:[&_section]:!py-[80px]">
          <Products
            className="z-1"
            title={translations.ecoProjectsTitle}
            products={PRODUCTS}
            translationBase="x402.ecoProjects"
            highlightColor="#14F195"
          />
        </div>

        <Decor imageSrc="/src/img/solutions/defi/bg-1.webp" />

        {/* Tools Section - reduce vertical padding */}
        <div className="[&_section]:!py-[32px] md:[&_section]:!py-[56px] xl:[&_section]:!py-[80px]">
          <Products
            className="z-1"
            title={translations.toolsTitle}
            description={translations.toolsDescription}
            products={TOOLS}
            translationBase="x402.tools"
            highlightColor="#14F195"
          />
        </div>
      </div>
    </>
  );
}
