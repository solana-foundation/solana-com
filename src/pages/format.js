import Layout from "../components/layout";
import HTMLHead from "../components/HTMLHead";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import FormatNFTVolume from "../components/format/FormatNFTVolume";
import FormatHero from "../components/format/FormatHero";
import FormatEcosystem from "../components/format/FormatEcosystem";

const Format = () => {
  const { t } = useTranslation("common");

  return (
    <Layout>
      <HTMLHead
        title={t("format.title")}
        description={t("format.description")}
        socialShare="https://solana.com/social/format.jpg"
      />
      <div className="mt-n12 pt-12">
        <FormatHero />
        <FormatNFTVolume />
        <FormatEcosystem />
      </div>
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 30,
  };
}

export default Format;
