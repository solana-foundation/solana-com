import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import EnvironmentHero from "@/components/environment/EnvironmentHero";
import EnvironmentReport from "@/components/environment/EnvironmentReport";
import EnvironmentWhatYouCanDo from "@/components/environment/EnvironmentWhatYouCanDo";
import EnvironmentFeaturedProjects from "@/components/environment/EnvironmentFeaturedProjects";

const EnvironmentPage = () => {
  const t = useTranslations();

  return (
    <Layout>
      <HTMLHead
        title={t("environment.title")}
        description={t("environment.description")}
      />
      <EnvironmentHero />
      <EnvironmentReport />
      <EnvironmentFeaturedProjects />
      <EnvironmentWhatYouCanDo />
    </Layout>
  );
};

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

export default EnvironmentPage;
