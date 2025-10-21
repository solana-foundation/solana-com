import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/solutions/layout";
import { EmailModal } from "@/components/solutions/EmailModal";
import { Products } from "@/components/solutions/products.v2";
import { Projects } from "@/components/solutions/projects.v2";
import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero.v2";
import { VideoGrid } from "@/components/solutions/video-grid.v2";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { withLocales } from "@workspace/i18n/routing";
import { LOGOS, PRODUCTS, PROJECTS, VIDEOS } from "@/data/solutions/consumer";
import { SolutionReport } from "@/components/solutions/report.v2";
import { Divider } from "@/components/solutions/divider.v2";
import { Decor } from "@/components/solutions/decor.v2";
import { SelectionColor } from "@/component-library/selection-color";

const ConsumerPage = () => {
  const t = useTranslations();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const stats: SolutionHeroStat[] = [
    {
      value: t("consumer.hero.stats.0.value"),
      label: t("consumer.hero.stats.0.label"),
      Icon: "/src/img/solutions/consumer/icons/wallet.svg",
    },
    {
      value: t("consumer.hero.stats.1.value"),
      label: t("consumer.hero.stats.1.label"),
      Icon: "/src/img/solutions/consumer/icons/discount.svg",
    },
    {
      value: t("consumer.hero.stats.2.value"),
      label: t("consumer.hero.stats.2.label"),
      Icon: "/src/img/solutions/consumer/icons/money.svg",
    },
    {
      value: t("consumer.hero.stats.3.value"),
      label: t("consumer.hero.stats.3.label"),
      Icon: "/src/img/solutions/consumer/icons/coins.svg",
    },
  ];

  return (
    <Layout>
      <HTMLHead
        title={t("consumer.meta.title")}
        description={t("consumer.meta.description")}
        socialShare="/src/img/solutions/consumer/og-image.webp"
      />

      <SelectionColor selectionColor="#CFF15E" selectionTextColor="#000000" />

      <div id="consumer-page" className="bg-black" aria-labelledby="hero-title">
        <SolutionHero
          title={t("consumer.hero.title")}
          subtitle={t("consumer.hero.subtitle")}
          reportEyebrow={t("consumer.hero.reportEyebrow")}
          reportDescription={t("consumer.hero.reportDescription")}
          emailCta={t("consumer.hero.emailCta")}
          onEmailClick={() => setEmailModalOpen(true)}
          stats={stats}
          reportImgSrc="/src/img/solutions/consumer/report-cover.webp"
          bgJsonFilePath="/src/img/solutions/consumer/hero-bg.json"
        />

        <Divider />

        <WhatIsIt
          title={t.rich("consumer.features.title", {
            light: (chunks) => (
              <span className="font-light">
                {chunks}
                <br />
              </span>
            ),
          })}
          description={t("consumer.features.description")}
          highlightColor="#CFF15E"
          imageSrc="/src/img/solutions/consumer/what-is.webp"
        />

        <Projects
          title={t.rich("consumer.projects.title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
            br: () => <br />,
          })}
          projects={PROJECTS}
          translationBase="consumer.projects"
          logos={LOGOS}
          bgSrc="/src/img/solutions/consumer/ecosystem-bg.webp"
        />

        <Divider />

        <Products
          className="z-1"
          title={t("consumer.products.title")}
          description={t("consumer.products.description")}
          products={PRODUCTS}
          translationBase="consumer.products"
          highlightColor="#CFF15E"
        />

        <Decor imageSrc="/src/img/solutions/consumer/bg-1.webp" />

        <VideoGrid
          title={t("consumer.videoPlayer.title")}
          subtitle={t("consumer.videoPlayer.subtitle")}
          videos={VIDEOS(t)}
        />

        <Divider hideOnDesktop />

        <SolutionReport
          eyebrow={t("consumer.cta.reportTitle")}
          description={t("consumer.cta.reportDescription")}
          emailCta={t("consumer.cta.downloadReport")}
          onEmailClick={() => setEmailModalOpen(true)}
          imgSrc="/src/img/solutions/consumer/report-cover.webp"
          bgJsonFilePath="/src/img/solutions/consumer/hero-bg.json"
        />
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
