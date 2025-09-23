import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/solutions/layout";
import { CTACards } from "@/components/solutions/icm/CTACards";
import { EmailModal } from "@/components/solutions/EmailModal";
import { Products } from "@/components/solutions/products";
import { Projects } from "@/components/solutions/projects.v2";
import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero.v2";
import { VideoGrid } from "@/components/solutions/video-grid";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { withLocales } from "@/i18n/routing";
import {
  LOGOS,
  PRODUCTS,
  PROJECTS,
  VIDEOS,
} from "@/data/solutions/tokenization";
import { NewsItem } from "@/components/solutions/icm/News";

const ICMPage = () => {
  const t = useTranslations();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const stats: SolutionHeroStat[] = [
    {
      value: t("icm.hero.stats.0.value"),
      label: t("icm.hero.stats.0.label"),
    },
    {
      value: t("icm.hero.stats.1.value"),
      label: t("icm.hero.stats.1.label"),
    },
    {
      value: t("icm.hero.stats.2.value"),
      label: t("icm.hero.stats.2.label"),
    },
    {
      value: t("icm.hero.stats.3.value"),
      label: t("icm.hero.stats.3.label"),
    },
  ];

  return (
    <Layout>
      <HTMLHead
        title={t("icm.meta.title")}
        description={t("icm.meta.description")}
      />

      <div id="icm-page" className="bg-black">
        <SolutionHero
          badge={t("icm.hero.badge")}
          title={t("icm.hero.title")}
          subtitle={t("icm.hero.subtitle")}
          reportEyebrow={t("icm.hero.reportEyebrow")}
          reportDescription={t("icm.hero.reportDescription")}
          emailCta={t("icm.hero.emailCta")}
          onEmailClick={() => setEmailModalOpen(true)}
          stats={stats}
          reportImgSrc="/src/img/solutions/icm/hero-download.svg"
        />

        <WhatIsIt
          title={t.rich("icm.features.title", {
            light: (chunks) => (
              <span className="font-light">
                {chunks}
                <br />
              </span>
            ),
          })}
          description={t.rich("icm.features.description", {
            promiseLink: (chunks) => (
              <a
                href="https://x.com/akshaybd/status/1861225525265735749"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                {chunks}
              </a>
            ),
          })}
        />

        {/* EcoProjects Section */}
        <Projects
          title={t.rich("icm.projects.title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
          })}
          projects={PROJECTS}
          translationBase="icm.projects"
          logos={LOGOS}
          headingType="logo"
        />

        {/* Products Section */}
        <section>
          <Products
            title={t("icm.products.title")}
            description={t("icm.products.description")}
            products={PRODUCTS}
            translationBase="icm.products"
          />
        </section>

        {/* Real Builders Section */}
        <section className=" [padding-block:1rem] sm:[padding-block:3rem] bg-[#171c25]">
          <VideoGrid
            title={t("icm.videoPlayer.title")}
            subtitle={t("icm.videoPlayer.subtitle")}
            videos={VIDEOS(t)}
            moreVideosUrl="https://www.youtube.com/playlist?list=PLilwLeBwGuK69cksrzGufy1LKGPjg6QtV"
            moreVideosLabel={t("icm.videoPlayer.moreVideos")}
          />
        </section>

        <section>
          <NewsItem
            title={t("icm.news.title")}
            summary={t("icm.news.summary")}
            image="/src/img/solutions/icm/icm-anza.webp"
            link="https://www.anza.xyz/blog/the-internet-capital-markets-roadmap"
          />
        </section>

        {/* Card Section */}
        <section>
          <CTACards onEmailClick={() => setEmailModalOpen(true)} />
        </section>
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
