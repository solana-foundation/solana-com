import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/solutions/layout";
import WalletsLayout from "@/components/solutions/wallets-explorer/WalletsLayout";
import FooterCallout from "@/components/solutions/FooterCallout";

import styles from "./WalletsExplorer.module.scss";

export default function WalletsExplorer() {
  const { t } = useTranslation();
  return (
    <Layout>
      <HTMLHead
        title={t("solutions-wallets-explorer.meta.title")}
        description={t("solutions-wallets-explorer.meta.description")}
      />

      <WalletsLayout />

      <FooterCallout
        title={t("solutions-wallets-explorer.footer-callout.title")}
        text={t("solutions-wallets-explorer.footer-callout.text")}
        btnText={t("solutions-wallets-explorer.footer-callout.btn")}
        btnUrl="https://solana.org/grants-funding"
        btnLargeText={t("solutions-wallets-explorer.footer-callout.btn-large")}
        btnLargeUrl="/"
        className={styles.FooterCallout}
        topSectionClassName={styles.FooterCalloutTopSection}
        buttonLargeClassName={styles.FooterCalloutButtonLarge}
      />
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
