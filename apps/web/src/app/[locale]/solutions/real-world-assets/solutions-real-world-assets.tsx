"use client";

import { Decor } from "@/components/solutions/decor.v2";
import { Divider } from "@/components/solutions/divider.v2";
import { EmailModal } from "@/components/solutions/EmailModal";
import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero.v2";
import { LatestNews } from "@/components/solutions/latest-news.v2";
import { Products } from "@/components/solutions/products.v2";
import { Projects } from "@/components/solutions/projects.v2";
import { SolutionReport } from "@/components/solutions/report.v2";
import { VideoGrid } from "@/components/solutions/video-grid.v2";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { SelectionColor } from "@/component-library/selection-color";
import {
  COMPLIANCE,
  LOGOS,
  PRODUCTS,
  PROJECTS,
  VIDEOS,
} from "@/data/solutions/real-world-assets";
import {
  ChartIcon,
  CoinsIcon,
  LedgerIcon,
  TokenIcon,
} from "@solana-com/ui-chrome/icons";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { NewsItem } from "@/components/solutions/latest-news.v2";
import type { DisplayMetric } from "@/lib/metrics/present";

type SolutionsRealWorldAssetsPageProps = {
  news: NewsItem[];
  heroMetrics: DisplayMetric[];
};

export function SolutionsRealWorldAssetsPage({
  news,
  heroMetrics,
}: SolutionsRealWorldAssetsPageProps) {
  const t = useTranslations();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  // Hero figures come from the metrics registry: live RWA.xyz totals cached
  // server-side, or the dated registry snapshot if RWA.xyz is unavailable.
  // The 24/7 anchor is static.
  const heroStats: SolutionHeroStat[] = [
    {
      value: heroMetrics[0].value,
      label: t("real-world-assets-solution.hero.stats.0.label"),
      source: heroMetrics[0].source,
      Icon: CoinsIcon,
    },
    {
      value: heroMetrics[1].value,
      label: t("real-world-assets-solution.hero.stats.1.label"),
      source: heroMetrics[1].source,
      Icon: TokenIcon,
    },
    {
      value: heroMetrics[2].value,
      label: t("real-world-assets-solution.hero.stats.2.label"),
      source: heroMetrics[2].source,
      Icon: ChartIcon,
    },
    {
      // Locale-invariant static anchor; label stays translatable.
      value: "24/7",
      label: t("real-world-assets-solution.hero.stats.3.label"),
      Icon: LedgerIcon,
    },
  ];

  return (
    <>
      <SelectionColor selectionColor="#A3FF12" selectionTextColor="#000000" />

      <div id="rwa-page" className="bg-black">
        <SolutionHero
          title={t("real-world-assets-solution.hero.title")}
          subtitle={t("real-world-assets-solution.hero.subtitle")}
          reportEyebrow={t("real-world-assets-solution.hero.reportEyebrow")}
          reportDescription={t(
            "real-world-assets-solution.hero.reportDescription",
          )}
          emailCta={t("real-world-assets-solution.hero.emailCta")}
          onEmailClick={() => setEmailModalOpen(true)}
          stats={heroStats}
          reportImgSrc="/src/img/solutions/icm/hero-download.webp"
          bgJsonFilePath="/src/img/solutions/icm/hero-bg.json"
          bgTintColor="rgba(163, 255, 18, 0.55)"
        />

        <Divider />

        <WhatIsIt
          title={t.rich("real-world-assets-solution.features.title", {
            light: (chunks) => (
              <span className="font-light">
                {chunks}
                <br />
              </span>
            ),
          })}
          description={t.rich(
            "real-world-assets-solution.features.description",
            {
              tokensLink: (chunks) => (
                <a
                  href="https://www.tokens.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  {chunks}
                </a>
              ),
            },
          )}
          imageSrc="/src/img/solutions/icm/what-is.webp"
          highlightColor="#A3FF12"
          ctaButton={t("real-world-assets-solution.features.cta")}
          ctaButtonHref="https://www.tokens.xyz/"
        />

        <Projects
          title={t.rich("real-world-assets-solution.projects.title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
            br: () => <br />,
          })}
          projects={PROJECTS}
          translationBase="real-world-assets-solution.projects"
          logos={LOGOS}
          controlsAlign="right"
          bgSrc="/src/img/solutions/icm/ecosystem-bg.webp"
        />

        <Divider />

        <Products
          className="z-[1]"
          title={t("real-world-assets-solution.products.title")}
          description={t("real-world-assets-solution.products.description")}
          products={PRODUCTS}
          translationBase="real-world-assets-solution.products"
          highlightColor="#A3FF12"
        />

        <Divider />

        <Products
          className="z-[1] bg-black"
          title={t("real-world-assets-solution.compliance.title")}
          description={t("real-world-assets-solution.compliance.description")}
          products={COMPLIANCE}
          translationBase="real-world-assets-solution.compliance"
          highlightColor="#A3FF12"
        />

        <Decor imageSrc="/src/img/solutions/icm/bg-1.webp" />

        <VideoGrid
          title={t("real-world-assets-solution.videoPlayer.title")}
          subtitle={t("real-world-assets-solution.videoPlayer.subtitle")}
          videos={VIDEOS(t)}
        />

        <Divider />

        <LatestNews
          title={t.rich("real-world-assets-solution.news.title", {
            light: (chunks) => (
              <span className="font-light">
                {chunks}
                <br />
              </span>
            ),
          })}
          items={news}
        />

        <Divider hideOnDesktop />

        <SolutionReport
          eyebrow={t("real-world-assets-solution.cta.reportTitle")}
          description={t("real-world-assets-solution.cta.reportDescription")}
          emailCta={t("real-world-assets-solution.cta.downloadReport")}
          onEmailClick={() => setEmailModalOpen(true)}
          imgSrc="/src/img/solutions/icm/hero-download.webp"
          linksTitle={t("real-world-assets-solution.cta.whatElseTitle")}
          links={[
            {
              title: t("real-world-assets-solution.cta.items.0.label"),
              href: "/solutions/tokenization",
            },
            {
              title: t("real-world-assets-solution.cta.items.1.label"),
              href: "/solutions/token-extensions",
            },
            {
              title: t("real-world-assets-solution.cta.items.2.label"),
              href: "/solutions/financial-institutions",
            },
          ]}
          bgJsonFilePath="/src/img/solutions/icm/hero-bg.json"
          bgTintColor="rgba(163, 255, 18, 0.55)"
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
