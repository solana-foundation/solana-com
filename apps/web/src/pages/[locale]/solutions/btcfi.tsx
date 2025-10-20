import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/solutions/layout";
import { useTranslations } from "next-intl";
import { withLocales } from "@workspace/i18n/routing";
import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero.v2";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { Projects } from "@/components/solutions/projects.v2";
import {
  LOGOS,
  PROJECTS,
  PERFORMANCE,
  LATEST_NEWS,
} from "@/data/solutions/btcfi";
import { Performance } from "@/components/solutions/performance.v2";
import { LatestNews } from "@/components/solutions/latest-news.v2";
import { Divider } from "@/components/solutions/divider.v2";
import { SingleVideo } from "@/components/solutions/single-video.v2";
import { SelectionColor } from "@/component-library/selection-color";

const InstitutionalPaymentsPage = () => {
  const t = useTranslations();

  const stats: SolutionHeroStat[] = [
    {
      value: t("btcfi.hero.stats.0.value"),
      label: t("btcfi.hero.stats.0.label"),
      Icon: "/src/img/solutions/btcfi/icons/coins.svg",
    },
    {
      value: t("btcfi.hero.stats.1.value"),
      label: t("btcfi.hero.stats.1.label"),
      Icon: "/src/img/solutions/btcfi/icons/coins.svg",
    },
    {
      value: t("btcfi.hero.stats.2.value"),
      label: t("btcfi.hero.stats.2.label"),
      Icon: "/src/img/solutions/btcfi/icons/wallet.svg",
    },
    {
      value: t("btcfi.hero.stats.3.value"),
      label: t("btcfi.hero.stats.3.label"),
      Icon: "/src/img/solutions/btcfi/icons/steps.svg",
    },
  ];

  const news = LATEST_NEWS(t);

  return (
    <Layout>
      <HTMLHead
        title={t("btcfi.meta.title")}
        description={t("btcfi.meta.description")}
        socialShare="/src/img/solutions/btcfi/og-image.webp"
      />

      <SelectionColor selectionColor="#FFBF00" selectionTextColor="#000000" />

      <div id="btcfi-page" aria-labelledby="hero-title" className="bg-black">
        <SolutionHero
          title={t("btcfi.hero.title")}
          subtitle={t("btcfi.hero.subtitle")}
          stats={stats}
          reportImgSrc="/src/img/solutions/btcfi/report-cover.webp"
          bgJsonFilePath="/src/img/solutions/btcfi/hero-bg.json"
        />

        <Divider />

        <WhatIsIt
          title={t.rich("btcfi.features.title", {
            light: (chunks) => (
              <span className="font-light">
                {chunks}
                <br />
              </span>
            ),
          })}
          description={t("btcfi.features.description")}
          imageSrc="/src/img/solutions/btcfi/what-is.webp"
          highlightColor="#FFBF00"
        />

        <Divider className="mt-[44px] md:mt-[80px] xl:mt-[120px]" />

        <Performance
          title={t.rich("btcfi.performance.title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
          })}
          items={PERFORMANCE}
          translationBase="btcfi.performance"
        />

        <Divider />

        <Projects
          title={t.rich("btcfi.projects.title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
            br: () => <br />,
          })}
          projects={PROJECTS}
          translationBase="btcfi.projects"
          logos={LOGOS}
          bgSrc="/src/img/solutions/btcfi/ecosystem-bg.webp"
          statType="icon"
        />

        <Divider />

        <SingleVideo
          title={t("btcfi.videoPlayer.videos.0.title")}
          description={t("btcfi.videoPlayer.videos.0.description")}
          alt={t("btcfi.videoPlayer.videos.0.alt")}
          thumbnail="/src/img/solutions/btcfi/videos/video1.webp"
          id="PdVUa8TR2nk"
        />

        <Divider />

        <LatestNews
          title={t.rich("btcfi.news.title", {
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
      </div>
    </Layout>
  );
};

export default InstitutionalPaymentsPage;

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
