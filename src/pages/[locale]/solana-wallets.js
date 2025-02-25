import { useTranslation } from "next-i18next";
import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withLocales } from "@/i18n/routing";
import WalletsLayout from "@/components/wallets/WalletsLayout";
import { walletData } from "@/data/wallets/wallet-data";

const SolanaWallets = ({ walletData }) => {
  const { t } = useTranslation();
  return (
    <Layout>
      <HTMLHead
        title={t("wallets.meta.title")}
        description={t("wallets.meta.description")}
      />
      <WalletsLayout walletData={walletData} />
    </Layout>
  );
};

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  const randomizedWallets = [...walletData].sort(() => Math.random() - 0.5);

  return {
    props: {
      locale,
      walletData: randomizedWallets,
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

export default SolanaWallets;
