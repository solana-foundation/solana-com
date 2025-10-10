import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/solutions/layout";
import { EmailModal } from "@/components/solutions/EmailModal";
import { Products } from "@/components/solutions/products.v2";
import { Projects } from "@/components/solutions/projects.v2";
import { SolutionHero } from "@/components/solutions/hero.v2";
// import { VideoGrid } from "@/components/solutions/video-grid.v2";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { withLocales } from "@workspace/i18n/routing";
import {
  LOGOS,
  PRODUCTS,
  PROJECTS,
  /**, VIDEOS*/
} from "@/data/solutions/desci";
import { Divider } from "@/components/solutions/divider.v2";
// import { Decor } from "@/components/solutions/decor.v2";
import { SingleVideo } from "@/components/solutions/single-video.v2";

const ConsumerPage = () => {
  const t = useTranslations();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  return (
    <Layout>
      <HTMLHead
        title={t("desci.meta.title")}
        description={t("desci.meta.description")}
        socialShare="/src/img/solutions/desci/og-image.webp"
      />

      <div id="desci-page" className="bg-black" aria-labelledby="hero-title">
        <SolutionHero
          title={t("desci.hero.title")}
          subtitle={t("desci.hero.subtitle")}
          bgJsonFilePath="/src/img/solutions/desci/hero-bg.json"
        />

        <SingleVideo
          className="relative -mt-[300px] md:-mt-[400px] xl:-mt-[400px]"
          thumbnail="/src/img/solutions/desci/videos/video0.webp"
          id="1930665368714093001"
          platform="x"
        />

        <Divider />

        <WhatIsIt
          title={t.rich("desci.features.title", {
            light: (chunks) => (
              <span className="font-light">
                {chunks}
                <br />
              </span>
            ),
          })}
          description={t("desci.features.description")}
          highlightColor="#CFF15ED1"
          imageSrc="/src/img/solutions/desci/what-is.webp"
        />

        <Divider />

        <Projects
          title={t.rich("desci.projects.title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
          })}
          projects={PROJECTS}
          translationBase="desci.projects"
          logos={LOGOS}
          bgSrc="/src/img/solutions/desci/ecosystem-bg.webp"
        />

        <Divider />

        <Products
          className="z-1"
          title={t("desci.products.title")}
          description={t("desci.products.description")}
          products={PRODUCTS}
          translationBase="desci.products"
          highlightColor="#CFF15E"
        />

        {/* <Decor imageSrc="/src/img/solutions/desci/bg-1.webp" /> */}

        {/*<VideoGrid
          title={t("desci.videoPlayer.title")}
          subtitle={t("desci.videoPlayer.subtitle")}
          videos={VIDEOS(t)}
        /> */}
      </div>

      <VideoPlayerModal />
      <EmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        formUrl="https://5lohw.share.hsforms.com/2eu8rKcY_RCe8GKjBX7_0mw?bd_vertical=Institutional"
      />
    </Layout>
  );
};

export default ConsumerPage;

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
