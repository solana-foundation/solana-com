"use client";

import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero.v2";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { Divider } from "@/components/solutions/divider.v2";
import { Decor } from "@/components/solutions/decor.v2";
import { Products } from "@/components/solutions/products.v2";
import { SelectionColor } from "@/component-library/selection-color";
import { PRODUCTS, TOOLS } from "@/data/solutions/agent-registry";

interface AgentRegistryPageProps {
  translations: {
    heroTitle: string;
    heroSubtitle: string;
    extraCta: string;
    extraCtaHref: string;
    stats: SolutionHeroStat[];
    featuresTitle: string;
    featuresDescription: string;
    featuresCtaButton: string;
    featuresCtaButtonHref: string;
    ecoProjectsTitle: string;
    toolsTitle: string;
    toolsDescription: string;
  };
}

export function AgentRegistryPage({ translations }: AgentRegistryPageProps) {
  return (
    <>
      <SelectionColor selectionColor="#9945FF" selectionTextColor="#FFFFFF" />

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

        {/* What is Agent Registry Section */}
        <div className="[&_section]:!py-[32px] md:[&_section]:!py-[56px] xl:[&_section]:!py-[80px]">
          <WhatIsIt
            title={translations.featuresTitle}
            description={translations.featuresDescription}
            ctaButton={translations.featuresCtaButton}
            ctaButtonHref={translations.featuresCtaButtonHref}
            highlightColor="#9945FF"
            imageSrc="/src/img/solutions/depin/what-is.webp"
          />
        </div>

        <Divider />

        {/* Ecosystem Projects */}
        <div className="[&_section]:!py-[32px] md:[&_section]:!py-[56px] xl:[&_section]:!py-[80px]">
          <Products
            className="z-1"
            title={translations.ecoProjectsTitle}
            products={PRODUCTS}
            translationBase="agentRegistry.ecoProjects"
            highlightColor="#9945FF"
          />
        </div>

        <Decor imageSrc="/src/img/solutions/defi/bg-1.webp" />

        {/* Toolkit Section */}
        <div className="[&_section]:!py-[32px] md:[&_section]:!py-[56px] xl:[&_section]:!py-[80px]">
          <Products
            className="z-1"
            title={translations.toolsTitle}
            description={translations.toolsDescription}
            products={TOOLS}
            translationBase="agentRegistry.tools"
            highlightColor="#9945FF"
          />
        </div>
      </div>
    </>
  );
}
