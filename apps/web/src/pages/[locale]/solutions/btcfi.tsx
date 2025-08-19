import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/solutions/layout";
import { useTranslations } from "next-intl";
import { withLocales } from "@/i18n/routing";
import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero";
import { WhatIsIt } from "@/components/solutions/what-is-it";
import { Projects } from "@/components/solutions/projects";
import {
  LOGOS,
  PROJECTS,
  PERFORMANCE,
  LATEST_NEWS,
} from "@/data/solutions/btcfi";
import { Performance } from "@/components/solutions/performance";
import { News } from "@/components/solutions/btcfi/News";
import { CTACards } from "@/components/solutions/btcfi/CTACards";
import { Divider } from "@/components/solutions/divider";
import { SingleVideo } from "@/components/solutions/btcfi/SingleVideo";
import { Logos } from "@/components/solutions/logos";

const InstitutionalPaymentsPage = () => {
  const t = useTranslations();

  const stats: SolutionHeroStat[] = [
    {
      value: t("btcfi.hero.stats.0.value"),
      label: t("btcfi.hero.stats.0.label"),
    },
    {
      value: t("btcfi.hero.stats.1.value"),
      label: t("btcfi.hero.stats.1.label"),
    },
    {
      value: t("btcfi.hero.stats.2.value"),
      label: t("btcfi.hero.stats.2.label"),
    },
    {
      value: t("btcfi.hero.stats.3.value"),
      label: t("btcfi.hero.stats.3.label"),
    },
  ];

  return (
    <Layout>
      <HTMLHead
        title={t("btcfi.meta.title")}
        description={t("btcfi.meta.description")}
      />

      <div id="btcfi-page" aria-labelledby="hero-title">
        <SolutionHero
          badge={t("btcfi.hero.badge")}
          title={t("btcfi.hero.title")}
          subtitle={t("btcfi.hero.subtitle")}
          reportEyebrow={t("btcfi.hero.reportEyebrow")}
          emailCta={t("btcfi.hero.emailCta")}
          stats={stats}
          globeImgSrc="/src/img/solutions/btcfi/hero.webp"
          globeImgAlt={t("btcfi.hero.alt")}
          variant="modern"
          titleSize="s"
        />

        <WhatIsIt
          title={t("btcfi.features.title")}
          description={t("btcfi.features.description")}
          features={[]}
        />

        {/* Performance Section */}
        <section className="pb-10">
          <Performance
            title={t("btcfi.performance.title")}
            items={PERFORMANCE}
            translationBase="btcfi.performance"
          />
        </section>

        {/* EcoProjects Section */}
        <section className="pt-6 pb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 items-start">
              <h2 className="text-3xl font-bold text-white col-span-full">
                {t("btcfi.projects.title")}
              </h2>
              <Projects
                projects={PROJECTS}
                translationBase="btcfi.projects"
                headingType="logo"
                maxCols={4}
                hideStats
              />
              <h2 className="mt-6 text-3xl font-bold text-white col-span-full">
                {t("btcfi.projects.subtitle")}
              </h2>
              <div className="col-span-full">
                <Logos logos={LOGOS} />
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-10 bg-[#171c25]">
          <SingleVideo />
        </section>

        {/* Latest News Section */}
        <section className="pt-10">
          <News items={LATEST_NEWS(t)} />
          <Divider className="my-6" />
        </section>

        {/* Card Section */}
        <section>
          <CTACards />
        </section>
      </div>
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
