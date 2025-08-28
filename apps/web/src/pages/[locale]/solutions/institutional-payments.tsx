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
} from "@/data/solutions/institutional-payments";
import { Products } from "@/components/solutions/products";
import { VideoGrid } from "@/components/solutions/video-grid";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { EmailModal } from "@/components/solutions/EmailModal";
import { USE_CASES } from "@/data/solutions/institutional-payments";
import { Performance } from "@/components/solutions/performance";
import { CTACards } from "@/components/solutions/institutional-payments/CTACards";

const InstitutionalPaymentsPage = () => {
  const t = useTranslations();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const stats: SolutionHeroStat[] = [
    {
      value: t("institutional-payments.hero.stats.0.value"),
      label: t("institutional-payments.hero.stats.0.label"),
    },
    {
      value: t("institutional-payments.hero.stats.1.value"),
      label: t("institutional-payments.hero.stats.1.label"),
    },
    {
      value: t("institutional-payments.hero.stats.2.value"),
      label: t("institutional-payments.hero.stats.2.label"),
    },
  ];

  return (
    <Layout>
      <HTMLHead
        title={t("institutional-payments.meta.title")}
        description={t("institutional-payments.meta.description")}
      />

      <div id="institutional-payments-page" aria-labelledby="hero-title">
        <SolutionHero
          badge={t("institutional-payments.hero.badge")}
          title={t("institutional-payments.hero.title")}
          subtitle={t("institutional-payments.hero.subtitle")}
          reportEyebrow={t("institutional-payments.hero.reportEyebrow")}
          emailCta={t("institutional-payments.hero.emailCta")}
          onEmailClick={() => setEmailModalOpen(true)}
          stats={stats}
          globeImgSrc="/src/img/solutions/institutional-payments/hero.webp"
          globeImgAlt={t("institutional-payments.hero.alt")}
          variant="modern"
          titleSize="s"
          reportImgSrc="/src/img/solutions/institutional-payments/hero-download.webp"
        />

        <WhatIsIt
          title={t("institutional-payments.features.title")}
          description={t("institutional-payments.features.description")}
        />

        {/* EcoProjects Section */}
        <section>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 [padding-block:1rem] sm:[padding-block:3rem]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 items-start">
              <h2 className="text-3xl font-bold text-white col-span-full mb-4">
                {t("institutional-payments.projects.title")}
              </h2>
              <Projects
                projects={PROJECTS}
                translationBase="institutional-payments.projects"
                logos={LOGOS}
                headingType="logo"
              />
            </div>
          </div>
        </section>

        {/* Performance Section */}
        <section className="pb-6">
          <Performance
            title={t("institutional-payments.useCases.title")}
            items={USE_CASES}
            translationBase="institutional-payments.useCases.items"
          />
        </section>

        {/* Products Section */}
        <section>
          <Products
            title={t("institutional-payments.products.title")}
            description={t("institutional-payments.products.description")}
            products={PRODUCTS}
            translationBase="institutional-payments.products"
          />
        </section>

        {/* Video Section */}
        <section className="[padding-block:1rem] sm:[padding-block:3rem] bg-[#171c25]">
          <VideoGrid
            title={t("institutional-payments.videoPlayer.title")}
            subtitle={t("institutional-payments.videoPlayer.subtitle")}
            videos={VIDEOS(t)}
            moreVideosUrl={undefined}
            moreVideosLabel={t("institutional-payments.videoPlayer.moreVideos")}
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
        formUrl="https://5lohw.share.hsforms.com/2eu8rKcY_RCe8GKjBX7_0mw?bd_vertical=payments"
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
