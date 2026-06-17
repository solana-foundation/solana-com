"use client";

import { EmailModal } from "@/components/solutions/EmailModal";
import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero.v2";
import { VideoGrid } from "@/components/solutions/video-grid.v2";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { VIDEOS } from "@/data/solutions/tokenization";
import { LatestNews } from "@/components/solutions/latest-news.v2";
import { SolutionReport } from "@/components/solutions/report.v2";
import { Divider } from "@/components/solutions/divider.v2";
import { Decor } from "@/components/solutions/decor.v2";
import { SelectionColor } from "@/component-library/selection-color";
import {
  TokenIcon,
  CoinsIcon,
  LedgerIcon,
  StepsIcon,
} from "@solana-com/ui-chrome/icons";
import { LogoStrip } from "@/components/solutions/tokenization/logo-strip";
import { CaseStudies } from "@/components/solutions/tokenization/case-studies";
import { AssetTable } from "@/components/solutions/tokenization/asset-table";
import { Liquidity } from "@/components/solutions/tokenization/liquidity";
import { IssuanceStack } from "@/components/solutions/tokenization/issuance-stack";
import { Permissioning } from "@/components/solutions/tokenization/permissioning";
import { DevBand } from "@/components/solutions/tokenization/dev-band";
import type { NewsItem } from "@/components/solutions/latest-news.v2";
import type { TokenizedAsset } from "@/lib/tokens/assets";

type SolutionsTokenizationPageProps = {
  news: NewsItem[];
  assets: TokenizedAsset[];
};

export function SolutionsTokenizationPage({
  news,
  assets,
}: SolutionsTokenizationPageProps) {
  const t = useTranslations();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const stats: SolutionHeroStat[] = [
    {
      value: t("icm.hero.stats.0.value"),
      label: t("icm.hero.stats.0.label"),
      delta: t("icm.hero.stats.0.delta"),
      Icon: TokenIcon,
    },
    {
      value: t("icm.hero.stats.1.value"),
      label: t("icm.hero.stats.1.label"),
      delta: t("icm.hero.stats.1.delta"),
      Icon: CoinsIcon,
    },
    {
      value: t("icm.hero.stats.2.value"),
      label: t("icm.hero.stats.2.label"),
      delta: t("icm.hero.stats.2.delta"),
      Icon: LedgerIcon,
    },
    {
      value: t("icm.hero.stats.3.value"),
      label: t("icm.hero.stats.3.label"),
      delta: t("icm.hero.stats.3.delta"),
      Icon: StepsIcon,
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
          extraCta={t("icm.hero.extraCta")}
          extraCtaHref="#assets"
          stats={stats}
          reportImgSrc="/src/img/solutions/icm/hero-download.webp"
          bgJsonFilePath="/src/img/solutions/icm/hero-bg.json"
        />

        {/* In production with */}
        <LogoStrip />

        <Divider />

        {/* Case studies (tabbed) */}
        <CaseStudies />

        <Divider />

        {/* Live asset registry (tokens.xyz) */}
        <AssetTable assets={assets} />

        <Divider />

        {/* Liquidity & allocators */}
        <Liquidity />

        <Divider />

        {/* Solutions & partners */}
        <IssuanceStack />

        <Divider />

        {/* Permissioning & privacy */}
        <Permissioning />

        {/* Developer CTA band */}
        <DevBand />

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
          items={news}
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
