import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";
import { useTranslations } from "next-intl";
import { withLocales } from "@/i18n/routing";

import FormatNFTVolume from "@/components/format/FormatNFTVolume";
import FormatHero from "@/components/format/FormatHero";
import FormatEcosystem from "@/components/format/FormatEcosystem";

const Format = () => {
  const t = useTranslations();

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

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;
  return {
    props: {
      locale,
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

export default Format;
