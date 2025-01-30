import { useTranslation } from "next-i18next";
import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withLocales } from "@/i18n/routing";
import WalletsLayout from "@/components/wallets/WalletsLayout";

const SolanaWallets = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <HTMLHead
        title={t("wallets.meta.title")}
        description={t("wallets.meta.description")}
      />
      <WalletsLayout />
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

export default SolanaWallets;
