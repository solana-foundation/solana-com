import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";

import PlayGGLayout from "@/components/playgg/PlayGGLayout";
import HTMLHead from "@/components/HTMLHead";
import PlayGGSplash from "@/components/playgg/PlayGGSplash";
import PlayGGGames from "@/components/playgg/PlayGGGames";

const PlayGG = () => {
  const t = useTranslations();

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
  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;
  return {
    props: {
      locale,
      messages,
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
