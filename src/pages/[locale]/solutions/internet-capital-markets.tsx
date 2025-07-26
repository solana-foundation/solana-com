import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/solutions/layout";
import { Builders } from "@/components/solutions/depin/Builders";
import { EcoProjects } from "@/components/solutions/depin/EcoProjects";
import { Products } from "@/components/solutions/depin/Products";
import { LatestNews } from "@/components/solutions/depin/LatestNews";
import { CTACards } from "@/components/solutions/depin/CTACards";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { useTranslations } from "next-intl";
import { withLocales } from "@/i18n/routing";
import { useState } from "react";
import { DePinEmailModal } from "@/components/solutions/depin/DePINEmailModal";
import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero";
import { WhatIsIt } from "@/components/solutions/what-is-it";
import { Projects } from "@/components/solutions/projects";

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

const PROJECTS = [
  {
    src: "/src/img/solutions/depin/helium.png",
    key: "helium",
    bg: "#181F24",
  },
  {
    src: "/src/img/solutions/depin/render.png",
    key: "render",
    bg: "#FF2D2E",
  },
  {
    src: "/src/img/solutions/depin/hivemapper.png",
    key: "hivemapper",
    bg: "#4B6FFF",
  },
  {
    src: "/src/img/solutions/depin/grass.png",
    key: "grass",
    bg: "#B6FF3A",
  },
  {
    src: "/src/img/solutions/depin/geodnet.png",
    key: "geodnet",
    bg: "#000000",
  },
];

const LOGOS = [
  {
    src: "/src/img/solutions/depin/ecosystem/375ai.png",
    alt: "375AI",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/blockcast.png",
    alt: "Blockcast",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/cudis.png",
    alt: "Cudis",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/dawn.png",
    alt: "Dawn",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/decharge.png",
    alt: "Decharge",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/dephy.png",
    alt: "Dephy",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/geodnet.png",
    alt: "Geodnet",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/hivemapper.png",
    alt: "Hivemapper",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/inference.png",
    alt: "Inference",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/jambo.png",
    alt: "Jambo",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/onocoy.png",
    alt: "Onocoy",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/pipenetwork.png",
    alt: "Pipenetwork",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/roam.png",
    alt: "Roam",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/shaga.png",
    alt: "Shaga",
    bg: "bg-[#f1ff61]",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/wayru.png",
    alt: "Wayru",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/wingbits-seo.png",
    alt: "Wingbits",
    bg: "bg-[#201c1c]",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/xnet.png",
    alt: "Xnet",
    bg: "bg-white",
  },
];
