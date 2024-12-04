import { useTranslation } from "next-i18next";
import Layout from "../components/layout";
import HTMLHead from "../components/HTMLHead";
import RampLayout from "../components/ramps/RampsLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  rampData,
  fiatAssets,
  countries,
  paymentRails,
} from "../data/ramps/ramps-data";

const Solanaramp = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <HTMLHead
        title={t("on-off-ramp.meta.title")}
        description={t("on-off-ramp.meta.description")}
      />
      <RampLayout
        data={rampData}
        fiatAssetsOptions={fiatAssets}
        countryOptions={countries}
        paymentRailsOptions={paymentRails}
      />
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Solanaramp;
