import DePINHero from "@@/src/components/solutions/depin/DePinHero";
import HTMLHead from "@@/src/components/HTMLHead";
import Layout from "@@/src/components/solutions/layout";
import { Builders } from "@@/src/components/solutions/depin/Builders";
import { EcoProjects } from "@@/src/components/solutions/depin/EcoProjects";
import { Products } from "@@/src/components/solutions/depin/Products";
import { LatestNews } from "@@/src/components/solutions/depin/LatestNews";
import { CTACards } from "@@/src/components/solutions/depin/CTACards";
import { VideoPlayerModal } from "@@/src/component-library/video-modal";
import { WhatIsDepin } from "@@/src/components/solutions/depin/WhatIsDepin";
import { useTranslations } from "next-intl";
import { withLocales } from "@@/src/i18n/routing";
import { useState } from "react";
import { DePinEmailModal } from "@@/src/components/solutions/depin/DePINEmailModal";

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
        className="bg-depin-bg"
        aria-labelledby="depin-hero-title"
      >
        <DePINHero onEmailClick={() => setEmailModalOpen(true)} />
        <WhatIsDepin />

        {/* EcoProjects Section */}
        <section className="pt-6 pb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 items-start">
              <h2 className="text-3xl font-bold text-white col-span-full">
                {t("depin.ecoProjects.title")}
              </h2>
              <EcoProjects />
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="pb-10">
          <Products />
        </section>

        {/* Real Builders Section */}
        <section className="py-10 bg-[#171c25]">
          <Builders />
        </section>

        {/* Latest News Section */}
        <section className="py-10">
          <LatestNews />
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
