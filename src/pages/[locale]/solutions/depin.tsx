import DePINHero from "@/components/solutions/depin/DePinHero";
import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/solutions/layout";
import { Builders } from "@/components/solutions/depin/Builders";
import { EcoProjects } from "@/components/solutions/depin/EcoProjects";
import { Products } from "@/components/solutions/depin/Products";
// import { LatestNews } from "@/components/solutions/depin/LatestNews";
import { CTACards } from "@/components/solutions/depin/CTACards";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { WhatIsDepin } from "@/components/solutions/depin/WhatIsDepin";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { withLocales } from "@/i18n/routing";

const DePINPage = () => {
  const { t } = useTranslation("common");

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
        <DePINHero />
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
        {/* <section className="py-10">
          <LatestNews />
        </section> */}

        {/* Card Section */}
        <section className="py-10">
          <CTACards />
        </section>
      </div>
      <VideoPlayerModal />
    </Layout>
  );
};

export default DePINPage;

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ["common"])),
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
