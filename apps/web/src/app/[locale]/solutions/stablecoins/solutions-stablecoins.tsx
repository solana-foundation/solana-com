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
} from "@/data/solutions/stablecoins";
import { Products } from "@/components/solutions/products.v2";
import { VideoGrid } from "@/components/solutions/video-grid.v2";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { EmailModal } from "@/components/solutions/EmailModal";
import { Divider } from "@/components/solutions/divider.v2";
import { Decor } from "@/components/solutions/decor.v2";
import { SolutionReport } from "@/components/solutions/report.v2";
import { SelectionColor } from "@/component-library/selection-color";

export function SolutionsStablecoinsPage() {
  const t = useTranslations();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const stats: SolutionHeroStat[] = [
    {
      value: t("stablecoins.hero.stats.0.value"),
      label: t("stablecoins.hero.stats.0.label"),
      Icon: "/src/img/solutions/stablecoins/icons/flow.svg",
    },
    {
      value: t("stablecoins.hero.stats.1.value"),
      label: t("stablecoins.hero.stats.1.label"),
      Icon: "/src/img/solutions/stablecoins/icons/arrows.svg",
    },
    {
      value: t("stablecoins.hero.stats.2.value"),
      label: t("stablecoins.hero.stats.2.label"),
      Icon: "/src/img/solutions/stablecoins/icons/discount.svg",
    },
  ];

  return (
    <>
      <SelectionColor selectionColor="#4396FF" selectionTextColor="#000000" />

      <div
        id="stablecoins-page"
        aria-labelledby="hero-title"
        className="bg-black"
      >
        <SolutionHero
          title={t("stablecoins.hero.title")}
          subtitle={t("stablecoins.hero.subtitle")}
          reportEyebrow={t("stablecoins.hero.reportEyebrow")}
          reportDescription={t("stablecoins.hero.reportDescription")}
          emailCta={t("stablecoins.hero.emailCta")}
          onEmailClick={() => setEmailModalOpen(true)}
          stats={stats}
          reportImgSrc="/src/img/solutions/stablecoins/report-cover.webp"
          bgJsonFilePath="/src/img/solutions/stablecoins/hero-bg.json"
        />

        <Divider />

        <WhatIsIt
          title={t.rich("stablecoins.features.title", {
            light: (chunks) => (
              <span className="font-light">
                {chunks}
                <br />
              </span>
            ),
          })}
          description={t("stablecoins.features.description")}
          imageSrc="/src/img/solutions/stablecoins/what-is.webp"
          highlightColor="#4396FF"
        />

        <Projects
          title={t.rich("stablecoins.projects.title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
            br: () => <br />,
          })}
          projects={PROJECTS}
          translationBase="stablecoins.projects"
          logos={LOGOS}
          bgSrc="/src/img/solutions/stablecoins/ecosystem-bg.webp"
        />

        <Divider />

        <Products
          className="z-1"
          title={t("stablecoins.products.title")}
          description={t("stablecoins.products.description")}
          products={PRODUCTS}
          translationBase="stablecoins.products"
          highlightColor="#4396FF"
        />

        <Decor imageSrc="/src/img/solutions/stablecoins/bg-1.webp" />

        <VideoGrid
          title={t("stablecoins.videoPlayer.title")}
          subtitle={t("stablecoins.videoPlayer.subtitle")}
          videos={VIDEOS(t)}
        />

        <Divider hideOnDesktop />

        <SolutionReport
          eyebrow={t("stablecoins.cta.reportTitle")}
          description={t("stablecoins.cta.reportDescription")}
          emailCta={t("stablecoins.cta.downloadReport")}
          onEmailClick={() => setEmailModalOpen(true)}
          imgSrc="/src/img/solutions/stablecoins/report-cover.webp"
          bgJsonFilePath="/src/img/solutions/stablecoins/hero-bg.json"
        />
      </div>

      <VideoPlayerModal />
      <EmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        formUrl="https://5lohw.share.hsforms.com/2eu8rKcY_RCe8GKjBX7_0mw?bd_vertical=stablecoins"
      />
    </>
  );
}
