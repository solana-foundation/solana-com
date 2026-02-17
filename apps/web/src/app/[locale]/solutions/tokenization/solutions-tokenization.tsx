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
import {
  LOGOS,
  PRODUCTS,
  PROJECTS,
  VIDEOS,
} from "@/data/solutions/tokenization";
import { LatestNews } from "@/components/solutions/latest-news.v2";
import { SolutionReport } from "@/components/solutions/report.v2";
import { Divider } from "@/components/solutions/divider.v2";
import { Decor } from "@/components/solutions/decor.v2";
import { SelectionColor } from "@/component-library/selection-color";

export function SolutionsTokenizationPage() {
  const t = useTranslations();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const stats: SolutionHeroStat[] = [
    {
      value: t("icm.hero.stats.0.value"),
      label: t("icm.hero.stats.0.label"),
      Icon: "/src/img/solutions/icm/icon-1.svg",
    },
    {
      value: t("icm.hero.stats.2.value"),
      label: t("icm.hero.stats.2.label"),
      Icon: "/src/img/solutions/icm/icon-2.svg",
    },
    {
      value: t("icm.hero.stats.3.value"),
      label: t("icm.hero.stats.3.label"),
      Icon: "/src/img/solutions/icm/icon-3.svg",
    },
    {
      value: t("icm.hero.stats.1.value"),
      label: t("icm.hero.stats.1.label"),
      Icon: "/src/img/solutions/icm/icon-4.svg",
    },
  ];

  return (
    <>
      <SelectionColor selectionColor="#CA9FF5" selectionTextColor="#000000" />

      <div id="icm-page" className="bg-black">
        <SolutionHero
          title={t("icm.hero.title")}
          subtitle={t("icm.hero.subtitle")}
          reportEyebrow={t("icm.hero.reportEyebrow")}
          reportDescription={t("icm.hero.reportDescription")}
          emailCta={t("icm.hero.emailCta")}
          onEmailClick={() => setEmailModalOpen(true)}
          stats={stats}
          reportImgSrc="/src/img/solutions/icm/hero-download.webp"
          bgJsonFilePath="/src/img/solutions/icm/hero-bg.json"
        />

        <Divider />

        <WhatIsIt
          title={t.rich("icm.features.title", {
            light: (chunks) => (
              <span className="font-light">
                {chunks}
                <br />
              </span>
            ),
          })}
          description={t.rich("icm.features.description", {
            promiseLink: (chunks) => (
              <a
                href="https://x.com/akshaybd/status/1861225525265735749"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                {chunks}
              </a>
            ),
          })}
          highlightColor="#CA9FF5"
          imageSrc="/src/img/solutions/icm/what-is.webp"
        />

        {/* EcoProjects Section */}
        <Projects
          title={t.rich("icm.projects.title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
            br: () => <br />,
          })}
          projects={PROJECTS}
          translationBase="icm.projects"
          logos={LOGOS}
          bgSrc="/src/img/solutions/icm/ecosystem-bg.webp"
        />

        <Divider />

        {/* Products Section */}
        <Products
          className="z-1"
          title={t("icm.products.title")}
          description={t("icm.products.description")}
          products={PRODUCTS}
          translationBase="icm.products"
          imageSrc="/src/img/solutions/icm/toolkit.svg"
          highlightColor="#CA9FF5"
        />

        <Decor imageSrc="/src/img/solutions/icm/bg-1.webp" />

        {/* Real Builders Section */}
        <VideoGrid
          title={t("icm.videoPlayer.title")}
          subtitle={t("icm.videoPlayer.subtitle")}
          videos={VIDEOS(t)}
        />

        <Divider />

        {/* Latest News Section */}
        <LatestNews
          title={t.rich("icm.news.title", {
            light: (chunks) => (
              <span className="font-light">
                {chunks}
                <br />
              </span>
            ),
          })}
          items={[
            {
              id: "0",
              title: t("icm.news.items.0.title"),
              date: "2025-07-24",
              image: "/src/img/solutions/icm/icm-anza.webp",
              link: "https://www.anza.xyz/blog/the-internet-capital-markets-roadmap",
            },
          ]}
        />

        <Divider hideOnDesktop />

        {/* Report Section */}
        <SolutionReport
          eyebrow={t("icm.cta.reportTitle")}
          description={t("icm.cta.reportDescription")}
          emailCta={t("icm.cta.downloadReport")}
          onEmailClick={() => setEmailModalOpen(true)}
          imgSrc="/src/img/solutions/icm/hero-download.webp"
          linksTitle={t("icm.cta.whatElseTitle")}
          links={[
            {
              title: t("icm.cta.items.0.label"),
              href: "/solutions/solana-permissioned-environments",
            },
            {
              title: t("icm.cta.items.1.label"),
              href: "/solutions/digital-assets",
            },
            {
              title: t("icm.cta.items.2.label"),
              href: "/solutions/real-world-assets",
            },
          ]}
          bgJsonFilePath="/src/img/solutions/icm/hero-bg.json"
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
