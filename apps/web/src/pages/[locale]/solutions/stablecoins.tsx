import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/solutions/layout";
import { useTranslations } from "next-intl";
import { withLocales } from "@/i18n/routing";
import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero";
import { useState } from "react";
import { WhatIsIt } from "@/components/solutions/what-is-it";
import { Projects } from "@/components/solutions/projects";
import {
  LOGOS,
  PRODUCTS,
  PROJECTS,
  VIDEOS,
} from "@/data/solutions/stablecoins";
import { Products } from "@/components/solutions/products";
import { VideoGrid } from "@/components/solutions/video-grid";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { EmailModal } from "@/components/solutions/EmailModal";
import { CTACards } from "@/components/solutions/stablecoins/CTACards";

const InstitutionalPaymentsPage = () => {
  const t = useTranslations();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const stats: SolutionHeroStat[] = [
    {
      value: t("stablecoins.hero.stats.0.value"),
      label: t("stablecoins.hero.stats.0.label"),
    },
    {
      value: t("stablecoins.hero.stats.1.value"),
      label: t("stablecoins.hero.stats.1.label"),
    },
    {
      value: t("stablecoins.hero.stats.2.value"),
      label: t("stablecoins.hero.stats.2.label"),
    },
  ];

  return (
    <Layout>
      <HTMLHead
        title={t("stablecoins.meta.title")}
        description={t("stablecoins.meta.description")}
      />

      <div id="stablecoins-page" aria-labelledby="hero-title">
        <SolutionHero
          badge={t("stablecoins.hero.badge")}
          title={t("stablecoins.hero.title")}
          subtitle={t("stablecoins.hero.subtitle")}
          reportEyebrow={t("stablecoins.hero.reportEyebrow")}
          emailCta={t("stablecoins.hero.emailCta")}
          onEmailClick={() => setEmailModalOpen(true)}
          stats={stats}
          globeImgSrc="/src/img/solutions/stablecoins/hero.webp"
          globeImgAlt={t("stablecoins.hero.alt")}
          variant="modern"
          titleSize="s"
          reportImgSrc="/src/img/solutions/stablecoins/hero-download.webp"
        />

        <WhatIsIt
          title={t("stablecoins.features.title")}
          description={t("stablecoins.features.description")}
          features={[]}
        />

        {/* EcoProjects Section */}
        {/* <section>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 [padding-block:1rem] sm:[padding-block:3rem]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 items-start">
              <h2 className="text-3xl font-bold text-white col-span-full mb-4">
                {t("stablecoins.projects.title")}
              </h2>
              <Projects
                projects={PROJECTS}
                translationBase="stablecoins.projects"
                logos={LOGOS}
                headingType="logo"
              />
            </div>
          </div>
        </section> */}

        {/* Products Section */}
        <section>
          <Products
            title={t("stablecoins.products.title")}
            description={t("stablecoins.products.description")}
            products={PRODUCTS}
            translationBase="stablecoins.products"
          />
        </section>

        {/* Video Section */}
        <section className=" [padding-block:1rem] sm:[padding-block:3rem] bg-[#171c25]">
          <VideoGrid
            title={t("stablecoins.videoPlayer.title")}
            subtitle={t("stablecoins.videoPlayer.subtitle")}
            videos={VIDEOS(t)}
            moreVideosUrl={undefined}
            moreVideosLabel={t("stablecoins.videoPlayer.moreVideos")}
          />
        </section>

        {/* Card Section */}
        <section className="pt-6">
          <CTACards onEmailClick={() => setEmailModalOpen(true)} />
        </section>
      </div>

      <VideoPlayerModal />
      <EmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        formUrl="https://5lohw.share.hsforms.com/2eu8rKcY_RCe8GKjBX7_0mw?bd_vertical=stablecoins"
      />
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
