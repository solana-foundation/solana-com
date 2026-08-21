"use client";

import { useTranslations } from "next-intl";
import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero.v2";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { Products } from "@/components/solutions/products.v2";
import { Performance } from "@/components/solutions/performance.v2";
import { Divider } from "@/components/solutions/divider.v2";
import { Decor } from "@/components/solutions/decor.v2";
import { SolutionReport } from "@/components/solutions/report.v2";
import { SelectionColor } from "@/component-library/selection-color";
import {
  SOLUTION_LINKS,
  TECHNICAL_GUIDES,
  FAQ_ITEMS,
  RESOURCES,
} from "@/data/solutions/enterprise";
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

        <Performance
          title={t("partners.faq.title")}
          description={t("partners.faq.description")}
          items={FAQ_ITEMS}
          translationBase="partners.faq.items"
          titleKey="question"
          descriptionKey="answer"
          linkLabel={t("partners.faq.learnMore")}
        />

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
