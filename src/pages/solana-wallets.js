import { useTranslation } from "next-i18next";
import Layout from "../components/layout";
import HTMLHead from "../components/HTMLHead";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import WalletsLayout from "../components/wallets/WalletsLayout";

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

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default SolanaWallets;
