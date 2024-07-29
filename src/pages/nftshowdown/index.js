import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import HTMLHead from "../../components/HTMLHead";
import NFTShowdownLayout from "../../components/nft-showdown/NFTShowdownLayout";
import NFTShowdownIntro from "../../components/nft-showdown/NFTShowdownIntro";
import NFTShowdownFAQ from "../../components/nft-showdown/NFTShowdownFAQ";
import NFTShowdownPartners from "../../components/nft-showdown/NFTShowdownPartners";
import NFTShowdownFooter from "../../components/nft-showdown/NFTShowdownFooter";
import Layout from "../../components/layout";
import { getAllPostsInDir } from "../../lib/markdown";

export default function NFTShowdown({ showdownFAQs }) {
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
        <NFTShowdownFAQ showdownFAQs={showdownFAQs} />
        <NFTShowdownFooter />
      </NFTShowdownLayout>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  const showdownFAQs = getAllPostsInDir("showdownFAQ")
    .map((p) => ({
      frontmatter: p.frontmatter,
      content: p.content,
    }))
    .sort((a, b) => {
      return a.frontmatter.order - b.frontmatter.order;
    });

  return {
    props: {
      showdownFAQs,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 30,
  };
}
