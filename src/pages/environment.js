import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import HTMLHead from "../components/HTMLHead";
import Layout from "../components/layout";
import EnvironmentHero from "../components/environment/EnvironmentHero";
import EnvironmentReport from "../components/environment/EnvironmentReport";
import EnvironmentWhatYouCanDo from "../components/environment/EnvironmentWhatYouCanDo";
import EnvironmentFeaturedProjects from "../components/environment/EnvironmentFeaturedProjects";

const EnvironmentPage = () => {
  const { t } = useTranslation();

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

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 60,
  };
}

export default EnvironmentPage;
