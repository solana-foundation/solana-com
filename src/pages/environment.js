import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import HTMLHead from "../components/HTMLHead";
import Layout from "../components/layout";
import EnvironmentHero from "../components/environment/EnvironmentHero";
import EnvironmentStats from "../components/environment/EnvironmentStats";
import EnvironmentReport from "../components/environment/EnvironmentReport";
import EnvironmentWhatYouCanDo from "../components/environment/EnvironmentWhatYouCanDo";
import EnvironmentFeaturedProjects from "../components/environment/EnvironmentFeaturedProjects";
import EnvironmentEnergyUsage from "../components/environment/EnvironmentEnergyUsage";

const EnvironmentPage = ({ envData }) => {
  const { t } = useTranslation();

  return (
    <Layout>
      <HTMLHead
        title={t("environment.title")}
        description={t("environment.description")}
      />
      <EnvironmentHero />
      <EnvironmentStats envData={envData} />
      <EnvironmentEnergyUsage envData={envData} />
      <EnvironmentReport />
      <EnvironmentFeaturedProjects />
      <EnvironmentWhatYouCanDo />
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  // Math.trunc() and remove existing commas from the API response
  const toTrunc = (s) => Math.trunc(s.replace(/,/g, ""));

  const getEnvironmentData = async () => {
    try {
      const responses = await Promise.all([
        fetch(
          // Average energy used per Solana transaction, in Joules
          "https://carbonara.metabaseapp.com/public/question/48d65369-6baf-4f3e-9fab-be198187a1a1.json",
        ),
        fetch(
          // Average energy used per Solana nonvoting transaction, in Joules
          "https://carbonara.metabaseapp.com/public/question/d9faf5b6-f2ad-4e41-b5e0-32b881d6a9e3.json",
        ),
        fetch(
          // Annual carbon footprint, in tonnes CO2 equivalent (tCO2e)
          "https://carbonara.metabaseapp.com/public/question/b4c1bed0-961d-4350-8859-e7ecb66a6ed3.json",
        ),
      ]);

      const [data1, data2, data3] = [
        await responses[0].json(),
        await responses[1].json(),
        await responses[2].json(),
      ];

      return {
        solTransaction: toTrunc(data1[0]["?column?"]),
        solNonVotingTransaction: toTrunc(data2[0]["?column?"]),
        annualCarbonFootprint: toTrunc(data3[0]["sum"]),
      };
    } catch (err) {
      console.warn("Unable to fetch the environmental data from Carbonara");
      console.warn(err);

      // manually return some hardcoded values to prevent errors
      // note: these values were last updated on Jan 30 2024
      // and should likely be updated at some periodicity
      return {
        solTransaction: 636,
        solNonVotingTransaction: 6674,
        annualCarbonFootprint: 9160,
      };
    }
  };

  const envData = await getEnvironmentData();

  return {
    props: {
      envData,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 30,
  };
}

export default EnvironmentPage;
