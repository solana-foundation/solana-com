import { useTranslations } from "next-intl";
import { withLocales } from "@workspace/i18n/routing";

import HTMLHead from "@/components/HTMLHead";
import NFTShowdownLayout from "@/components/nft-showdown/NFTShowdownLayout";
import NFTShowdownIntro from "@/components/nft-showdown/NFTShowdownIntro";
import NFTShowdownPartners from "@/components/nft-showdown/NFTShowdownPartners";
import NFTShowdownFooter from "@/components/nft-showdown/NFTShowdownFooter";
import Layout from "@/components/layout";

export default function NFTShowdown() {
  const t = useTranslations();

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
