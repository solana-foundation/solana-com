"use client";

import { useTranslations } from "next-intl";
import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero.v2";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { Products } from "@/components/solutions/products.v2";
import { Divider } from "@/components/solutions/divider.v2";
import { SelectionColor } from "@/component-library/selection-color";
import { Mail } from "lucide-react";
import {
  SOLUTION_LINKS,
  TECHNICAL_GUIDES,
  FAQ_ITEMS,
  RESOURCES,
} from "@/data/solutions/enterprise";

export function SolutionsEnterprisePage() {
  const t = useTranslations();

  const stats: SolutionHeroStat[] = [
    {
      value: t("partners.hero.stats.0.value"),
      label: t("partners.hero.stats.0.label"),
      Icon: "/src/img/solutions/institutional-payments/icons/flow.svg",
    },
    {
      value: t("partners.hero.stats.1.value"),
      label: t("partners.hero.stats.1.label"),
      Icon: "/src/img/solutions/institutional-payments/icons/arrows.svg",
    },
    {
      value: t("partners.hero.stats.2.value"),
      label: t("partners.hero.stats.2.label"),
      Icon: "/src/img/solutions/institutional-payments/icons/discount.svg",
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
        />

        <Divider />

        {/* Solutions Section */}
        <Products
          className="z-1"
          title={t("partners.solutions.title")}
          description={t("partners.solutions.description")}
          products={SOLUTION_LINKS}
          translationBase="partners.solutions"
          highlightColor="#14F195"
        />

        <Divider />

        {/* Technical Guides Section */}
        <section className="tw-py-16 md:tw-py-24">
          <div className="tw-container tw-mx-auto tw-px-4">
            <h2 className="tw-text-3xl md:tw-text-4xl tw-font-bold tw-text-white tw-mb-4">
              {t("partners.guides.title")}
            </h2>
            <p className="tw-text-gray-400 tw-mb-12 tw-max-w-2xl">
              {t("partners.guides.description")}
            </p>
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
              {TECHNICAL_GUIDES.map((guide) => (
                <a
                  key={guide.key}
                  href={guide.href}
                  className="tw-group tw-bg-gray-900 tw-border tw-border-gray-800 tw-rounded-xl tw-p-6 hover:tw-border-[#14F195] tw-transition-all tw-duration-300"
                >
                  <div className="tw-text-[#14F195] tw-text-sm tw-font-medium tw-mb-2">
                    {t(`partners.guides.items.${guide.key}.tag`)}
                  </div>
                  <h3 className="tw-text-xl tw-font-semibold tw-text-white tw-mb-3 group-hover:tw-text-[#14F195] tw-transition-colors">
                    {t(`partners.guides.items.${guide.key}.title`)}
                  </h3>
                  <p className="tw-text-gray-400 tw-text-sm">
                    {t(`partners.guides.items.${guide.key}.description`)}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* FAQ Section */}
        <section className="tw-py-16 md:tw-py-24">
          <div className="tw-container tw-mx-auto tw-px-4">
            <h2 className="tw-text-3xl md:tw-text-4xl tw-font-bold tw-text-white tw-mb-4">
              {t("partners.faq.title")}
            </h2>
            <p className="tw-text-gray-400 tw-mb-12 tw-max-w-2xl">
              {t("partners.faq.description")}
            </p>
            <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
              {FAQ_ITEMS.map((faq) => (
                <div
                  key={faq.key}
                  className="tw-bg-gray-900 tw-border tw-border-gray-800 tw-rounded-xl tw-p-6 tw-flex tw-flex-col"
                >
                  <h3 className="tw-text-lg tw-font-semibold tw-text-white tw-mb-4">
                    {t(`partners.faq.items.${faq.key}.question`)}
                  </h3>
                  <p className="tw-text-gray-400 tw-leading-relaxed tw-flex-1">
                    {t(`partners.faq.items.${faq.key}.answer`)}
                  </p>
                  {(faq.link || faq.secondaryLink) && (
                    <div className="tw-flex tw-flex-wrap tw-gap-4 tw-mt-5 tw-pt-4 tw-border-t tw-border-gray-800">
                      {faq.link && (
                        <a
                          href={faq.link}
                          className="tw-text-[#14F195] hover:tw-underline tw-text-sm tw-font-medium"
                        >
                          {t("partners.faq.learnMore")} →
                        </a>
                      )}
                      {faq.secondaryLink && (
                        <a
                          href={faq.secondaryLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tw-text-[#14F195] hover:tw-underline tw-text-sm tw-font-medium"
                        >
                          {faq.secondaryLinkLabel} →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* Resources Section */}
        <section className="tw-py-16 md:tw-py-24">
          <div className="tw-container tw-mx-auto tw-px-4">
            <h2 className="tw-text-3xl md:tw-text-4xl tw-font-bold tw-text-white tw-mb-4">
              {t("partners.resources.title")}
            </h2>
            <p className="tw-text-gray-400 tw-mb-12 tw-max-w-2xl">
              {t("partners.resources.description")}
            </p>
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-6">
              {RESOURCES.map((resource) => (
                <a
                  key={resource.key}
                  href={resource.href}
                  target={resource.external ? "_blank" : undefined}
                  rel={resource.external ? "noopener noreferrer" : undefined}
                  className="tw-group tw-bg-gray-900 tw-border tw-border-gray-800 tw-rounded-xl tw-p-6 hover:tw-border-[#14F195] tw-transition-all tw-duration-300"
                >
                  <h3 className="tw-text-lg tw-font-semibold tw-text-white tw-mb-2 group-hover:tw-text-[#14F195] tw-transition-colors">
                    {t(`partners.resources.items.${resource.key}.title`)}
                  </h3>
                  <p className="tw-text-gray-400 tw-text-sm">
                    {t(`partners.resources.items.${resource.key}.description`)}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Get in Touch */}
        <section className="tw-py-12 tw-border-t tw-border-gray-800">
          <div className="tw-container tw-mx-auto tw-px-4 tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-justify-center tw-gap-4">
            <span className="tw-text-gray-400 tw-text-lg">
              {t("partners.contact.text")}
            </span>
            <a
              href="mailto:enterprise@solana.org"
              className="tw-inline-flex tw-items-center tw-gap-2 tw-bg-[#14F195] tw-text-black tw-font-semibold tw-px-6 tw-py-3 tw-rounded-full hover:tw-bg-[#14F195]/90 tw-transition-colors"
            >
              <Mail className="tw-w-4 tw-h-4" />
              {t("partners.contact.button")}
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
