import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import HTMLHead from "../../components/HTMLHead";
import InstagramLayout from "../../components/instagram/InstagramLayout/InstagramLayout";
import InstagramHero from "../../components/instagram/InstagramHero/InstagramHero";
import InstagramTiles from "../../components/instagram/InstagramTiles/InstagramTiles";
import InstagramFooter from "../../components/instagram/InstagramFooter/InstagramFooter";
import InstagramGiveaway from "../../components/instagram/InstagramGiveaway/InstagramGiveaway";
import InstagramEnergyUsage from "../../components/instagram/InstagramEnergyUsage/InstagramEnergyUsage";
import InstagramDisclaimer from "../../components/instagram/InstagramDisclaimer/InstagramDisclaimer";

const Index = () => {
  const { t } = useTranslation("common");
  return (
    <InstagramLayout>
      <HTMLHead
        title={t("instagram.title")}
        description={t("instagram.description")}
        socialShare="https://solana.com/social/meta.jpg"
      />
      <InstagramHero />
      <InstagramTiles />
      <InstagramGiveaway />
      <InstagramEnergyUsage />
      <InstagramDisclaimer />
      <InstagramFooter />
    </InstagramLayout>
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

export default Index;
