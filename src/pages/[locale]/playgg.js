import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withLocales } from "@/i18n/routing";
import { useTranslation } from "next-i18next";

import PlayGGLayout from "@/components/playgg/PlayGGLayout";
import HTMLHead from "@/components/HTMLHead";
import PlayGGSplash from "@/components/playgg/PlayGGSplash";
import PlayGGGames from "@/components/playgg/PlayGGGames";

const PlayGG = () => {
  const { t } = useTranslation("common");

  return (
    <PlayGGLayout>
      <HTMLHead
        title={t("playgg.title")}
        description={t("playgg.description")}
        socialShare="https://solana.com/social/playgg.jpg"
      />
      <PlayGGSplash />
      <PlayGGGames />
    </PlayGGLayout>
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

export default PlayGG;
