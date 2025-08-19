import DePINHero from "@/components/solutions/depin/DePinHero";
import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/solutions/layout";
import { Products } from "@/components/solutions/products";
import { LatestNews } from "@/components/solutions/latest-news";
import { CTACards } from "@/components/solutions/depin/CTACards";
import { EmailModal } from "@/components/solutions/EmailModal";
import { WhatIsIt } from "@/components/solutions/what-is-it";
import { Projects } from "@/components/solutions/projects";
import {
  LOGOS,
  PRODUCTS,
  PROJECTS,
  VIDEOS,
  LATEST_NEWS,
} from "@/data/solutions/depin";
import { VideoGrid } from "@/components/solutions/video-grid";
import { Divider } from "@/components/solutions/divider";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { withLocales } from "@/i18n/routing";

const DePINPage = () => {
  const t = useTranslations();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  return (
    <Layout>
      <HTMLHead
        title={t("depin.meta.title")}
        description={t("depin.meta.description")}
      />

      <div
        id="depin-page"
        className="bg-solution-bg"
        aria-labelledby="depin-hero-title"
      >
        <DePINHero onEmailClick={() => setEmailModalOpen(true)} />
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
              <Projects
                projects={PROJECTS}
                logos={LOGOS}
                translationBase="depin.ecoProjects"
              />
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

        {/* Latest News Section */}
        <section className="py-10">
          <LatestNews title={t("depin.news.title")} items={LATEST_NEWS(t)} />
          <Divider className="mt-10" />
        </section>

        {/* Card Section */}
        <section className="pt-0 pb-10">
          <CTACards onEmailClick={() => setEmailModalOpen(true)} />
        </section>
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
