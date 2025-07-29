import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/solutions/layout";
import { CTACards } from "@/components/solutions/icm/CTACards";
import { DePinEmailModal } from "@/components/solutions/depin/DePINEmailModal";
import { Products } from "@/components/solutions/products";
import { Projects } from "@/components/solutions/projects";
import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero";
import { VideoGrid } from "@/components/solutions/video-grid";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { WhatIsIt } from "@/components/solutions/what-is-it";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { withLocales } from "@/i18n/routing";
import {
  LOGOS,
  PRODUCTS,
  PROJECTS,
  VIDEOS,
} from "@/data/solutions/internet-capital-markets";

const ICMPage = () => {
  const t = useTranslations();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const stats: SolutionHeroStat[] = [
    {
      value: t("depin.hero.stats.0.value"),
      label: t("depin.hero.stats.0.label"),
    },
    {
      value: t("depin.hero.stats.1.value"),
      label: t("depin.hero.stats.1.label"),
    },
    {
      value: t("depin.hero.stats.2.value"),
      label: t("depin.hero.stats.2.label"),
    },
    {
      value: t("depin.hero.stats.2.value"),
      label: t("depin.hero.stats.2.label"),
    },
  ];

  return (
    <Layout>
      <HTMLHead
        title={t("depin.meta.title")}
        description={t("depin.meta.description")}
      />

      <div
        id="depin-page"
        className="bg-depin-bg"
        aria-labelledby="depin-hero-title"
      >
        <SolutionHero
          title={t("depin.hero.title")}
          subtitle={t("depin.hero.subtitle")}
          reportEyebrow={t("depin.hero.reportEyebrow")}
          emailCta={t("depin.hero.emailCta")}
          onEmailClick={() => setEmailModalOpen(true)}
          stats={stats}
          globeImgSrc="/src/img/solutions/icm/icm-hero.webp"
          globeImgAlt={t("depin.hero.globeAlt")}
        />
        <WhatIsIt
          title={t("depin.features.title")}
          description={t("depin.features.description")}
          features={[
            t("depin.features.fast"),
            t("depin.features.decentralized"),
            t("depin.features.communityFirst"),
          ]}
        />

        {/* EcoProjects Section */}
        <section className="pt-6 pb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 items-start">
              <h2 className="text-3xl font-bold text-white col-span-full">
                {t("depin.ecoProjects.title")}
              </h2>
              <Projects projects={PROJECTS} logos={LOGOS} />
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="pb-10">
          <Products
            title={t("depin.products.title")}
            description={t("depin.products.description")}
            products={PRODUCTS}
            translationBase="depin.products"
          />
        </section>

        {/* Real Builders Section */}
        <section className="py-10 bg-[#171c25]">
          <VideoGrid
            title={t("depin.builders.title")}
            subtitle={t("depin.builders.subtitle")}
            videos={VIDEOS(t)}
            moreVideosUrl="https://www.youtube.com/playlist?list=PLilwLeBwGuK5OT4zLm3-YOGnT0x5cmRsK"
            moreVideosLabel={t("depin.builders.moreVideos")}
          />
        </section>

        {/* Card Section */}
        <section className="pt-0 pb-10">
          <CTACards onEmailClick={() => setEmailModalOpen(true)} />
        </section>
      </div>
      <VideoPlayerModal />
      <DePinEmailModal
        _open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
      />
    </Layout>
  );
};

export default ICMPage;

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
