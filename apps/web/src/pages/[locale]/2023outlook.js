import { useTranslations } from "next-intl";
import { withLocales } from "@workspace/i18n/routing";

import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";
import ECDRHero from "@/components/ecdr/ECDRHero";
import ECDRStats from "@/components/ecdr/ECDRStats";
import ECDRJoinCommunity from "@/components/ecdr/ECDRJoinCommunity";

const ECDRPage = () => {
  const t = useTranslations();
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
  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;

  return {
    props: {
      locale,
      messages,
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
