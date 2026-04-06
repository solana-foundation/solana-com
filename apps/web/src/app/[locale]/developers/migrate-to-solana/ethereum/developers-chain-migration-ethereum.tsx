"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import {
  COMPLETE_GUIDE,
  CONCEPT_COMPARISON,
  ERC_STANDARDS,
} from "@/data/developers/evm-to-svm";
import { COSMOS_RESOURCES } from "@/data/developers/evm-to-svm/cosmos";
import { Products } from "@/components/solutions/products.v2";

const UnicornScene = dynamic(
  () => import("unicornstudio-react").then((mod) => mod.default),
  { ssr: false },
);

export function DevelopersChainMigrationEthereumPage() {
  const t = useTranslations("developers-evm-to-svm");

  const heroButtons = [
    {
      hierarchy: "primary",
      url: "/developers/migrate-to-solana/complete-guide",
      label: t("evmGuidesHeading.buttons.0.label"),
    },
    {
      hierarchy: "outline",
      url: "https://rareskills.io/solana-tutorial",
      label: t("evmGuidesHeading.buttons.1.label"),
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-black border-b border-white/10">
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
        />
        <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-8 xl:px-10 py-16 md:py-28 xl:py-40 w-full">
          <div className="flex flex-col gap-6 max-w-2xl">
            <p className="text-xs font-medium text-sky-300/80 uppercase tracking-widest mb-0">
              {t("evmGuidesHeading.eyebrow")}
            </p>
            <h1 className="text-[40px] md:text-[56px] xl:text-[88px] font-brand font-medium text-white leading-[1.1] tracking-[-1.6px] md:tracking-[-2.24px] xl:tracking-[-3.52px] mb-0">
              {t("evmGuidesHeading.headline")}
            </h1>
            <div
              className="text-[#ABABBA] text-lg md:text-2xl text-pretty leading-[1.33] tracking-[-0.36px] md:tracking-[-0.48px] mb-0 [&_p]:m-0"
              dangerouslySetInnerHTML={{
                __html: t.raw("evmGuidesHeading.body") as string,
              }}
            />
            <div className="flex flex-wrap gap-3">
              {heroButtons.map((btn, i) => (
                <a
                  key={i}
                  href={btn.url}
                  className={[
                    "inline-flex items-center px-6 py-3 rounded-full text-sm font-brand font-semibold no-underline transition-opacity hover:opacity-90",
                    btn.hierarchy === "primary"
                      ? "tw-bg-nd-cta tw-text-nd-on-cta-high-em-text"
                      : "border border-white/30 text-white bg-transparent",
                  ].join(" ")}
                >
                  {btn.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Products
        products={COMPLETE_GUIDE}
        title={t("completeGuide.title")}
        description={t("completeGuide.description")}
        translationBase="developers-evm-to-svm.completeGuide"
      />

      <div className="border-t border-white/10" />

      <Products
        products={CONCEPT_COMPARISON}
        title={t("conceptComparison.title")}
        description={t("conceptComparison.description")}
        translationBase="developers-evm-to-svm.conceptComparison"
      />

      <div className="border-t border-white/10" />

      <Products
        products={ERC_STANDARDS}
        title={t("ercStandards.title")}
        description={t("ercStandards.description")}
        translationBase="developers-evm-to-svm.ercStandards"
      />

      <div className="border-t border-white/10" />

      <Products
        products={COSMOS_RESOURCES}
        title="Core Solana references"
        description="Shared starting points for either migration path."
        translationBase="developers-chain-migration-cosmos.resources"
      />
    </>
  );
}
