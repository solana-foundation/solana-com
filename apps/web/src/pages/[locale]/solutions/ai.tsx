import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/solutions/layout";
import { Products } from "@/components/solutions/products.v2";
import { Projects } from "@/components/solutions/projects.v2";
import { SolutionHero } from "@/components/solutions/hero.v2";
import { VideoGrid } from "@/components/solutions/video-grid.v2";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { useTranslations } from "next-intl";
import { withLocales } from "@workspace/i18n/routing";
import { LOGOS, PRODUCTS, PROJECTS, VIDEOS } from "@/data/solutions/ai";
import { Divider } from "@/components/solutions/divider.v2";
import { Decor } from "@/components/solutions/decor.v2";
import { SelectionColor } from "@/component-library/selection-color";

const AiPage = () => {
  const t = useTranslations();

  return (
    <Layout>
      <HTMLHead
        title={t("ai-solution.meta.title")}
        description={t("ai-solution.meta.description")}
        socialShare="/src/img/solutions/ai/og-image.webp"
      />

      <SelectionColor selectionColor="#F48252" selectionTextColor="#000000" />

      <div id="ai-page" className="bg-black" aria-labelledby="hero-title">
        <SolutionHero
          title={t("ai-solution.hero.title")}
          subtitle={t("ai-solution.hero.subtitle")}
          bgJsonFilePath="/src/img/solutions/ai/hero-bg.json"
          extraCta={t("ai-solution.hero.extraCta")}
          extraCtaHref="https://x.com/knimkar/status/1863719025500623344"
        />

        <Divider />

        <WhatIsIt
          title={t.rich("ai-solution.features.title", {
            light: (chunks) => (
              <span className="font-light">
                {chunks}
                <br />
              </span>
            ),
          })}
          description={t("ai-solution.features.description")}
          highlightColor="#F48252"
          imageSrc="/src/img/solutions/ai/what-is.webp"
        />

        <Projects
          title={t.rich("ai-solution.projects.title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
            br: () => <br />,
          })}
          projects={PROJECTS}
          translationBase="ai-solution.projects"
          logos={LOGOS}
          bgSrc="/src/img/solutions/ai/ecosystem-bg.webp"
        />

        <Divider />

        <Products
          className="z-1"
          title={t("ai-solution.products.title")}
          description={t("ai-solution.products.description")}
          products={PRODUCTS}
          translationBase="ai-solution.products"
          highlightColor="#F48252"
        />

        <Decor imageSrc="/src/img/solutions/ai/bg-1.webp" />

        <VideoGrid
          title={t("ai-solution.videoPlayer.title")}
          subtitle={t("ai-solution.videoPlayer.subtitle")}
          videos={VIDEOS(t)}
        />
      </div>

      <VideoPlayerModal />
    </Layout>
  );
};

export default AiPage;

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
