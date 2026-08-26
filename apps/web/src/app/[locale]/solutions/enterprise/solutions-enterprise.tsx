"use client";

import { useTranslations } from "next-intl";
import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero.v2";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { Products } from "@/components/solutions/products.v2";
import { Divider } from "@/components/solutions/divider.v2";
import { Decor } from "@/components/solutions/decor.v2";
import { SolutionReport } from "@/components/solutions/report.v2";
import { SelectionColor } from "@/component-library/selection-color";
import {
  SOLUTION_LINKS,
  TECHNICAL_GUIDES,
  RESOURCES,
} from "@/data/solutions/enterprise";
import { FAQ_TOTAL } from "@/data/enterprise/faq";
import { Link } from "@workspace/i18n/routing";
import {
  FlowIcon,
  ArrowsIcon,
  DiscountIcon,
} from "@solana-com/ui-chrome/icons";

const CONTACT_HREF = "mailto:enterprise@solana.org";

export function SolutionsEnterprisePage() {
  const t = useTranslations();

  const stats: SolutionHeroStat[] = [
    {
      value: t("partners.hero.stats.0.value"),
      label: t("partners.hero.stats.0.label"),
      Icon: FlowIcon,
    },
    {
      value: t("partners.hero.stats.1.value"),
      label: t("partners.hero.stats.1.label"),
      Icon: ArrowsIcon,
    },
    {
      value: t("partners.hero.stats.2.value"),
      label: t("partners.hero.stats.2.label"),
      Icon: DiscountIcon,
    },
  ];

  return (
    <>
      <SelectionColor selectionColor="#14F195" selectionTextColor="#000000" />

      <div
        id="enterprise-page"
        aria-labelledby="hero-title"
        className="bg-black"
      >
        <SolutionHero
          title={t("partners.hero.title")}
          subtitle={t("partners.hero.subtitle")}
          stats={stats}
          bgJsonFilePath="/src/img/solutions/icm/hero-bg.json"
        />

        <Divider />

        <WhatIsIt
          title={t.rich("partners.features.title", {
            light: (chunks) => (
              <span className="font-light">
                {chunks}
                <br />
              </span>
            ),
          })}
          description={t("partners.features.description")}
          highlightColor="#14F195"
          imageSrc="/src/img/solutions/icm/what-is.webp"
        />

        <Divider />

        <Products
          className="z-[1]"
          title={t("partners.solutions.title")}
          description={t("partners.solutions.description")}
          products={SOLUTION_LINKS}
          translationBase="partners.solutions"
          highlightColor="#14F195"
          imageSrc="/src/img/solutions/icm/toolkit.svg"
        />

        <Decor imageSrc="/src/img/solutions/icm/bg-1.webp" />

        <Products
          className="z-[1]"
          title={t("partners.guides.title")}
          description={t("partners.guides.description")}
          products={TECHNICAL_GUIDES.map((guide) => ({
            key: guide.key,
            href: guide.href,
            eyebrow: t(`partners.guides.items.${guide.key}.tag`),
            external: false,
          }))}
          translationBase="partners.guides.items"
          highlightColor="#14F195"
        />

        <Divider />

        <section className="relative bg-black text-white text-left font-brand">
          <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px] flex flex-col xl:flex-row max-xl:gap-6 xl:gap-20">
            <div className="w-full xl:w-1/2">
              <h2 className="font-brand font-medium leading-none text-[32px] md:text-[40px] xl:text-[64px] mb-5">
                {t("partners.faq.title")}
              </h2>
              <p className="text-[#ABABBA] text-lg md:text-2xl mb-0 max-w-md tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
                {t("partners.faq.description")}
              </p>
            </div>
            <div className="w-full xl:w-1/2 flex items-center">
              <Link
                href="/enterprise/faq"
                className="group flex items-center justify-between gap-6 w-full border border-white/10 hover:border-[#14F195]/60 rounded-2xl px-6 py-8 no-underline transition-colors"
              >
                <div>
                  <p className="font-brand font-medium text-white text-lg md:text-2xl mb-1">
                    Browse all {FAQ_TOTAL} questions
                  </p>
                  <p className="text-[#ABABBA] text-base md:text-lg mb-0">
                    Chain migration, privacy, tokenized funds, payments,
                    custody, and compliance.
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="shrink-0 w-10 h-10 rounded-full border border-white flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-200"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        <Divider />

        <Products
          className="z-[1]"
          title={t("partners.resources.title")}
          description={t("partners.resources.description")}
          products={RESOURCES.map((resource) => ({
            key: resource.key,
            href: resource.href,
            external: resource.external,
          }))}
          translationBase="partners.resources.items"
          highlightColor="#14F195"
        />

        <Divider hideOnDesktop />

        <SolutionReport
          eyebrow={t("partners.contact.text")}
          emailCta={t("partners.contact.button")}
          onEmailClick={() => {
            window.location.href = CONTACT_HREF;
          }}
          bgJsonFilePath="/src/img/solutions/icm/hero-bg.json"
        />
      </div>
    </>
  );
}
