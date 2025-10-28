"use client";

import DevelopersHeroSection from "@/components/developers/sections/DevelopersHeroSection/DevelopersHeroSection";
import universitiesHeroImg from "@@/assets/universities/universities-hero.webp";
import { X402_TYPEFORM_URL } from "@/constants/x402";
import { Products } from "@/components/solutions/products.v2";
import { PRODUCTS, TOOLS } from "@/data/solutions/x402";

interface X402PageProps {
  translations: {
    heroTitle: string;
    heroSubtitle: string;
    intro: string;
    build: string;
    textSectionTitle: string;
    textSectionContent: string;
    toolsTitle: string;
    toolsDescription: string;
  };
}

export function X402Page({ translations }: X402PageProps) {
  return (
    <div className="overflow-hidden bg-black">
      <div className="relative">
        {/* Color splash behind hero image - matching exact DevelopersHeroSection__light positioning */}
        <div
          className="absolute z-[-1] top-[-40%] left-[12.5%] w-[75%] pb-[75%] md:hidden rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, #14F195 0%, #9945FF 50%, transparent 70%)",
            filter: "blur(35px)",
            mixBlendMode: "normal",
            opacity: 0.2,
          }}
        />
        <div
          className="hidden md:block absolute z-[-1] top-[-200px] right-[-300px] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, #14F195 0%, #9945FF 50%, transparent 70%)",
            filter: "blur(110px)",
            mixBlendMode: "normal",
            opacity: 0.2,
            transform: "rotate(35.57deg)",
          }}
        />
        <DevelopersHeroSection
          title={translations.heroTitle}
          description={translations.heroSubtitle}
          img={{
            src: universitiesHeroImg,
            alt: translations.heroTitle,
          }}
          buttons={{
            cta: {
              label: translations.intro,
              href: X402_TYPEFORM_URL,
            },
            secondary: {
              label: translations.build,
              href: "https://github.com/solana-foundation/curriculum",
            },
          }}
        />
      </div>

      <section className="[padding-block:3rem] sm:[padding-block:5rem] relative bg-gradient-to-b from-black via-[#0a0a0f] to-black">
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {translations.textSectionTitle}
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              {translations.textSectionContent}
            </p>
          </div>
        </div>
      </section>

      <div className="bg-black">
        <Products
          title="Ecosystem"
          products={PRODUCTS}
          translationBase="x402.ecoProjects"
        />
      </div>

      <div className="bg-gradient-to-b from-black via-[#0f0a15] to-black">
        <Products
          title={translations.toolsTitle}
          description={translations.toolsDescription}
          products={TOOLS}
          translationBase="x402.tools"
        />
      </div>
    </div>
  );
}
