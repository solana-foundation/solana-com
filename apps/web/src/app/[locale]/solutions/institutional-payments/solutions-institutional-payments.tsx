"use client";

import { useTranslations } from "next-intl";
import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero.v2";
import { useState } from "react";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { Projects } from "@/components/solutions/projects.v2";
import {
  LOGOS,
  PRODUCTS,
  PROJECTS,
  VIDEOS,
} from "@/data/solutions/institutional-payments";
import { Products } from "@/components/solutions/products.v2";
import { VideoGrid } from "@/components/solutions/video-grid.v2";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { EmailModal } from "@/components/solutions/EmailModal";
import { USE_CASES } from "@/data/solutions/institutional-payments";
import { Performance } from "@/components/solutions/performance.v2";
import { Divider } from "@/components/solutions/divider.v2";
import { Decor } from "@/components/solutions/decor.v2";
import { SolutionReport } from "@/components/solutions/report.v2";
import { SelectionColor } from "@/component-library/selection-color";

export function SolutionsInstitutionalPaymentsPage() {
  const t = useTranslations();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const stats: SolutionHeroStat[] = [
    {
      value: t("institutional-payments.hero.stats.0.value"),
      label: t("institutional-payments.hero.stats.0.label"),
      Icon: "/src/img/solutions/institutional-payments/icons/flow.svg",
    },
    {
      value: t("institutional-payments.hero.stats.1.value"),
      label: t("institutional-payments.hero.stats.1.label"),
      Icon: "/src/img/solutions/institutional-payments/icons/arrows.svg",
    },
    {
      value: t("institutional-payments.hero.stats.2.value"),
      label: t("institutional-payments.hero.stats.2.label"),
      Icon: "/src/img/solutions/institutional-payments/icons/discount.svg",
    },
  ];

  return (
    <>
      <SelectionColor selectionColor="#F48252" selectionTextColor="#000000" />

      <div
        id="institutional-payments-page"
        aria-labelledby="hero-title"
        className="bg-black"
      >
        <SolutionHero
          title={t("institutional-payments.hero.title")}
          subtitle={t("institutional-payments.hero.subtitle")}
          reportEyebrow={t("institutional-payments.hero.reportEyebrow")}
          reportDescription={t("institutional-payments.hero.reportDescription")}
          emailCta={t("institutional-payments.hero.emailCta")}
          onEmailClick={() => setEmailModalOpen(true)}
          stats={stats}
          reportImgSrc="/src/img/solutions/institutional-payments/report-cover.webp"
          bgJsonFilePath="/src/img/solutions/institutional-payments/hero-bg.json"
        />

        <Divider />

        <WhatIsIt
          title={t.rich("institutional-payments.features.title", {
            light: (chunks) => (
              <span className="font-light">
                {chunks}
                <br />
              </span>
            ),
          })}
          description={t("institutional-payments.features.description")}
          imageSrc="/src/img/solutions/institutional-payments/what-is.webp"
          highlightColor="#F48252"
        />

        <Projects
          title={t.rich("institutional-payments.projects.title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
            br: () => <br />,
          })}
          projects={PROJECTS}
          translationBase="institutional-payments.projects"
          logos={LOGOS}
          bgSrc="/src/img/solutions/institutional-payments/ecosystem-bg.webp"
        />

        <Divider />

        <Performance
          title={t("institutional-payments.useCases.title")}
          items={USE_CASES}
          translationBase="institutional-payments.useCases.items"
        />

        <Divider />

        <Products
          title={t("institutional-payments.products.title")}
          description={t("institutional-payments.products.description")}
          products={PRODUCTS}
          translationBase="institutional-payments.products"
        />

        <Decor imageSrc="/src/img/solutions/institutional-payments/bg-1.webp" />

        <VideoGrid
          title={t("institutional-payments.videoPlayer.title")}
          subtitle={t("institutional-payments.videoPlayer.subtitle")}
          videos={VIDEOS(t)}
        />

        <Divider hideOnDesktop />

        <SolutionReport
          eyebrow={t("institutional-payments.cta.reportTitle")}
          description={t("institutional-payments.cta.reportDescription")}
          emailCta={t("institutional-payments.cta.downloadReport")}
          onEmailClick={() => setEmailModalOpen(true)}
          imgSrc="/src/img/solutions/institutional-payments/report-cover.webp"
          bgJsonFilePath="/src/img/solutions/institutional-payments/hero-bg.json"
        />
      </div>

      <VideoPlayerModal />
      <EmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        formUrl="https://5lohw.share.hsforms.com/2eu8rKcY_RCe8GKjBX7_0mw?bd_vertical=payments"
      />
    </>
  );
}
