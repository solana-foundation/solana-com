import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withLocales } from "@/i18n/routing";

import HTMLHead from "@/components/HTMLHead";
import NFTShowdownLayout from "@/components/nft-showdown/NFTShowdownLayout";
import NFTShowdownIntro from "@/components/nft-showdown/NFTShowdownIntro";
import NFTShowdownPartners from "@/components/nft-showdown/NFTShowdownPartners";
import NFTShowdownFooter from "@/components/nft-showdown/NFTShowdownFooter";
import Layout from "@/components/layout";

export default function NFTShowdown() {
  const { t } = useTranslation();

  return (
    <Layout>
      <NFTShowdownLayout>
        <HTMLHead
          title={t("nft-showdown.title")}
          description={t("nft-showdown.description")}
          socialShare="https://solana.com/social/nftshowdown.jpg"
        />
        <NFTShowdownIntro />
        <NFTShowdownPartners />
        <NFTShowdownFooter />
      </NFTShowdownLayout>
    </Layout>
  );
}

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
