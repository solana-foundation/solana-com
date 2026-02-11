import { useTranslations } from "next-intl";
import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";
import { withLocales } from "@workspace/i18n/routing";
import WalletsLayout from "@/components/wallets/WalletsLayout";
import { walletData } from "@/data/wallets/wallet-data";

const SolanaWallets = ({ walletData }) => {
  const t = useTranslations();
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
  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;
  const randomizedWallets = [...walletData].sort(() => Math.random() - 0.5);

  return {
    props: {
      locale,
      walletData: randomizedWallets,
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

export default SolanaWallets;
