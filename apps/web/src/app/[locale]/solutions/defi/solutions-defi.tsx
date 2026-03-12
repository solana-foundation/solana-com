"use client";

import { EmailModal } from "@/components/solutions/EmailModal";
import { Products } from "@/components/solutions/products.v2";
import { Projects } from "@/components/solutions/projects.v2";
import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero.v2";
import { VideoGrid } from "@/components/solutions/video-grid.v2";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { LOGOS, PRODUCTS, PROJECTS, VIDEOS } from "@/data/solutions/defi";
import { SolutionReport } from "@/components/solutions/report.v2";
import { Divider } from "@/components/solutions/divider.v2";
import { Decor } from "@/components/solutions/decor.v2";
import { SelectionColor } from "@/component-library/selection-color";

export function SolutionsDefiPage() {
  const t = useTranslations();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const stats: SolutionHeroStat[] = [
    {
      value: t("defi.hero.stats.0.value"),
      label: t("defi.hero.stats.0.label"),
      Icon: "/src/img/solutions/defi/icons/pulse.svg",
    },
    {
      value: t("defi.hero.stats.1.value"),
      label: t("defi.hero.stats.1.label"),
      Icon: "/src/img/solutions/defi/icons/steps.svg",
    },
    {
      value: t("defi.hero.stats.2.value"),
      label: t("defi.hero.stats.2.label"),
      Icon: "/src/img/solutions/defi/icons/chart.svg",
    },
    {
      value: t("defi.hero.stats.3.value"),
      label: t("defi.hero.stats.3.label"),
      Icon: "/src/img/solutions/defi/icons/money-hand.svg",
    },
  ];

  return (
    <>
      <SelectionColor selectionColor="#55E9AB" selectionTextColor="#000000" />

      <div id="defi-page" className="bg-black" aria-labelledby="hero-title">
        <SolutionHero
          title={t("defi.hero.title")}
          subtitle={t("defi.hero.subtitle")}
          reportEyebrow={t("defi.hero.reportEyebrow")}
          reportDescription={t("defi.hero.reportDescription")}
          emailCta={t("defi.hero.emailCta")}
          onEmailClick={() => setEmailModalOpen(true)}
          stats={stats}
          reportImgSrc="/src/img/solutions/defi/report-cover.webp"
          bgJsonFilePath="/src/img/solutions/defi/hero-bg.json"
        />

        <Divider />

        <WhatIsIt
          title={t.rich("defi.features.title", {
            light: (chunks) => (
              <span className="font-light">
                {chunks}
                <br />
              </span>
            ),
          })}
          description={t("defi.features.description")}
          highlightColor="#55E9AB"
          imageSrc="/src/img/solutions/defi/what-is.webp"
        />

        <Projects
          title={t.rich("defi.projects.title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
            br: () => <br />,
          })}
          projects={PROJECTS}
          translationBase="defi.projects"
          logos={LOGOS}
          bgSrc="/src/img/solutions/defi/ecosystem-bg.webp"
        />

        <Divider />

        <Products
          className="z-1"
          title={t("defi.products.title")}
          description={t("defi.products.description")}
          products={PRODUCTS}
          translationBase="defi.products"
          imageSrc="/src/img/solutions/defi/toolkit.svg"
          highlightColor="#55E9AB"
        />

        <Decor imageSrc="/src/img/solutions/defi/bg-1.webp" />

        <VideoGrid
          title={t("defi.videoPlayer.title")}
          subtitle={t("defi.videoPlayer.subtitle")}
          videos={VIDEOS(t)}
        />

        <Divider hideOnDesktop />

        <SolutionReport
          eyebrow={t("defi.cta.reportTitle")}
          description={t("defi.cta.reportDescription")}
          emailCta={t("defi.cta.downloadReport")}
          onEmailClick={() => setEmailModalOpen(true)}
          imgSrc="/src/img/solutions/defi/report-cover.webp"
          bgJsonFilePath="/src/img/solutions/defi/hero-bg.json"
        />
      </div>
      <VideoPlayerModal />
      <EmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        formUrl="https://5lohw.share.hsforms.com/2eu8rKcY_RCe8GKjBX7_0mw?bd_vertical=Institutional"
      />
    </>
  );
}
