import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withLocales } from "@/i18n/routing";
import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";
import ValidatorsHero from "@/components/validators/ValidatorsHero";
import ValidatorsCards from "@/components/validators/ValidatorsCards";
import ValidatorsDefinition from "@/components/validators/ValidatorsDefinition";
import ValidatorsRewards from "@/components/validators/ValidatorsRewards";
import ValidatorsGettingStarted from "@/components/validators/ValidatorsGettingStarted";
import ValidatorsFAQ from "@/components/validators/ValidatorsFAQ";
import { useInView } from "react-intersection-observer";

const ValidatorPage = () => {
  const { t } = useTranslation("common");
  const { ref, inView } = useInView({
    threshold: 0,
    initialInView: true,
  });
  return (
    <Layout>
      <HTMLHead
        title={t("validators.title")}
        description={t("validators.description")}
      />
      <div className="validators-page mt-n12 pt-12 pb-8">
        <ValidatorsHero ref={ref} />
        <ValidatorsCards visible={inView} />
        <ValidatorsDefinition />
        <ValidatorsRewards />
        <ValidatorsFAQ />
        <ValidatorsGettingStarted />
      </div>
    </Layout>
  );
};

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

export default ValidatorPage;
