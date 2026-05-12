"use client";

import { useTranslations } from "next-intl";
import { SolutionHero } from "@/components/solutions/hero.v2";
import { useState } from "react";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { Projects } from "@/components/solutions/projects.v2";
import { PROJECTS, VIDEOS } from "@/data/solutions/financial-institutions";
import { VideoGrid } from "@/components/solutions/video-grid.v2";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { EmailModal } from "@/components/solutions/EmailModal";
import { LatestNews } from "@/components/solutions/latest-news.v2";
import { Divider } from "@/components/solutions/divider.v2";
import { Decor } from "@/components/solutions/decor.v2";
import { SolutionReport } from "@/components/solutions/report.v2";
import { SelectionColor } from "@/component-library/selection-color";
import { FinancialInstitutionsLogoMarquee } from "./logo-marquee";
import type { NewsItem } from "@/components/solutions/latest-news.v2";

type SolutionsFinancialInstitutionsPageProps = {
  news: NewsItem[];
};

const CONNECT_TYPEFORM_URL =
  "https://solanafoundation.typeform.com/to/jhgXGxtG";

export function SolutionsFinancialInstitutionsPage({
  news,
}: SolutionsFinancialInstitutionsPageProps) {
  const t = useTranslations();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  return (
    <>
      <SelectionColor selectionColor="#1E40AF" selectionTextColor="#FFFFFF" />

      <div
        id="fin-institutions-page"
        aria-labelledby="hero-title"
        className="bg-black"
      >
        <SolutionHero
          title={t("financial-institutions-solution.hero.title")}
          subtitle={t("financial-institutions-solution.hero.subtitle")}
          extraCta={t("financial-institutions-solution.hero.emailCta")}
          extraCtaHref={CONNECT_TYPEFORM_URL}
          reportImgSrc="/src/img/solutions/icm/hero-download.webp"
          bgJsonFilePath="/src/img/solutions/icm/hero-bg.json"
          showDownloadCard={false}
        />

        <section
          className="relative overflow-hidden bg-black text-white py-[32px] xl:py-[64px]"
          aria-label="Featured financial institution deployments"
        >
          <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px]">
            <FinancialInstitutionsLogoMarquee />
          </div>
        </section>

        <Projects
          title={t.rich("financial-institutions-solution.projects.title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
            br: () => <br />,
          })}
          projects={PROJECTS}
          translationBase="financial-institutions-solution.projects"
          controlsAlign="right"
          bgSrc="/src/img/solutions/icm/ecosystem-bg.webp"
        />

        <Divider />

        <VideoGrid
          title={t("financial-institutions-solution.videoPlayer.title")}
          subtitle={t("financial-institutions-solution.videoPlayer.subtitle")}
          videos={VIDEOS(t)}
        />

        <Divider />

        <LatestNews
          title={t.rich("financial-institutions-solution.news.title", {
            light: (chunks) => (
              <span className="font-light">
                {chunks}
                <br />
              </span>
            ),
          })}
          items={news}
        />

        <Divider />

        <Decor imageSrc="/src/img/solutions/icm/bg-1.webp" />

        <WhatIsIt
          title={t.rich("financial-institutions-solution.features.title", {
            light: (chunks) => (
              <span className="font-light">
                {chunks}
                <br />
              </span>
            ),
          })}
          description={t(
            "financial-institutions-solution.features.description",
          )}
          imageSrc="/src/img/solutions/icm/what-is.webp"
          highlightColor="#1E40AF"
        />

        <Divider hideOnDesktop />

        <SolutionReport
          eyebrow={t("financial-institutions-solution.cta.reportTitle")}
          description={t(
            "financial-institutions-solution.cta.reportDescription",
          )}
          emailCta={t("financial-institutions-solution.cta.downloadReport")}
          onEmailClick={() => setEmailModalOpen(true)}
          imgSrc="/src/img/solutions/icm/hero-download.webp"
          linksTitle={t("financial-institutions-solution.cta.whatElseTitle")}
          links={[
            {
              title: t("financial-institutions-solution.cta.items.0.label"),
              href: "/solutions/solana-permissioned-environments",
            },
            {
              title: t("financial-institutions-solution.cta.items.1.label"),
              href: "/solutions/digital-assets",
            },
            {
              title: t("financial-institutions-solution.cta.items.2.label"),
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
        formUrl={CONNECT_TYPEFORM_URL}
      />
    </>
  );
}
