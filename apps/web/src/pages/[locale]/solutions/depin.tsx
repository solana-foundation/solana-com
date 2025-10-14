import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/solutions/layout";
import { Products } from "@/components/solutions/products.v2";
// import { LatestNews } from "@/components/solutions/latest-news.v2";
import { EmailModal } from "@/components/solutions/EmailModal";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { Projects } from "@/components/solutions/projects.v2";
import {
  LOGOS,
  PRODUCTS,
  PROJECTS,
  VIDEOS,
  // LATEST_NEWS,
} from "@/data/solutions/depin";
import { VideoGrid } from "@/components/solutions/video-grid.v2";
import { Divider } from "@/components/solutions/divider.v2";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { withLocales } from "@workspace/i18n/routing";
import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero.v2";
import { SolutionReport } from "@/components/solutions/report.v2";
import { Decor } from "@/components/solutions/decor.v2";
import { SelectionColor } from "@/component-library/selection-color";

const DePINPage = () => {
  const t = useTranslations();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const stats: SolutionHeroStat[] = [
    {
      value: t("depin.hero.stats.0.value"),
      label: t("depin.hero.stats.0.label"),
      Icon: "/src/img/solutions/depin/icon-1.svg",
    },
    {
      value: t("depin.hero.stats.1.value"),
      label: t("depin.hero.stats.1.label"),
      Icon: "/src/img/solutions/depin/icon-2.svg",
    },
    {
      value: t("depin.hero.stats.2.value"),
      label: t("depin.hero.stats.2.label"),
      Icon: "/src/img/solutions/depin/icon-3.svg",
    },
  ];

  return (
    <Layout>
      <HTMLHead
        title={t("depin.meta.title")}
        description={t("depin.meta.description")}
        socialShare="/src/img/solutions/depin/og-image.webp"
      />

      <SelectionColor selectionColor="#6693F7" selectionTextColor="#000000" />

      <div
        id="depin-page"
        className="bg-black"
        aria-labelledby="depin-hero-title"
      >
        {/** Hero Section */}
        <SolutionHero
          title={t("depin.hero.title")}
          subtitle={t("depin.hero.subtitle")}
          reportEyebrow={t("depin.hero.reportEyebrow")}
          reportDescription={t("depin.hero.reportDescription")}
          emailCta={t("depin.hero.emailCta")}
          onEmailClick={() => setEmailModalOpen(true)}
          stats={stats}
          reportImgSrc="/src/img/solutions/depin/hero-download.webp"
          bgJsonFilePath="/src/img/solutions/depin/hero-bg.json"
        />

        <Divider />

        {/** What is it Section */}
        <WhatIsIt
          title={t.rich("depin.features.title", {
            light: (chunks) => (
              <span className="font-light">
                {chunks}
                <br />
              </span>
            ),
          })}
          description={t("depin.features.description")}
          highlightColor="#6693F7"
          imageSrc="/src/img/solutions/depin/what-is.webp"
        />

        {/* EcoProjects Section */}
        <Projects
          title={t.rich("depin.ecoProjects.title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
            br: () => <br />,
          })}
          projects={PROJECTS}
          translationBase="depin.ecoProjects"
          logos={LOGOS}
          bgSrc="/src/img/solutions/depin/ecosystem-bg.webp"
        />

        <Divider />

        {/* Products Section */}
        <Products
          className="z-1"
          title={t("depin.products.title")}
          description={t("depin.products.description")}
          products={PRODUCTS}
          translationBase="depin.products"
          highlightColor="#6693F7"
        />

        <Decor imageSrc="/src/img/solutions/depin/bg-1.webp" />

        {/* Real Builders Section */}
        <VideoGrid
          title={t("depin.builders.title")}
          subtitle={t("depin.builders.subtitle")}
          videos={VIDEOS(t)}
        />

        {/* Latest News Section */}
        {/* <LatestNews title={t("depin.news.title")} items={LATEST_NEWS(t)} /> */}

        <Divider hideOnDesktop />

        {/* Report Section */}
        <SolutionReport
          eyebrow={t("depin.cta.reportTitle")}
          description={t("depin.cta.reportDescription")}
          emailCta={t("depin.cta.downloadReport")}
          onEmailClick={() => setEmailModalOpen(true)}
          imgSrc="/src/img/solutions/depin/hero-download.webp"
          bgJsonFilePath="/src/img/solutions/depin/hero-bg.json"
        />
      </div>
      <VideoPlayerModal />
      <EmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
      />
    </Layout>
  );
};

export default DePINPage;

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;
  return {
    props: {
      locale,
      messages,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
