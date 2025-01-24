import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { withLocales } from "@/i18n/routing";

import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";
import ECDRHero from "@/components/ecdr/ECDRHero";
import ECDRStats from "@/components/ecdr/ECDRStats";
import ECDRJoinCommunity from "@/components/ecdr/ECDRJoinCommunity";

const ECDRPage = () => {
  const { t } = useTranslation("common");
  return (
    <Layout>
      <HTMLHead
        title={t("ecdr.title")}
        description={t("ecdr.description")}
        socialShare="https://solana.com/social/2023outlook.jpg"
      />
      <div className="overflow-hidden">
        <ECDRHero />
        <ECDRStats />
        <ECDRJoinCommunity />
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
  };
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}

export default ECDRPage;
