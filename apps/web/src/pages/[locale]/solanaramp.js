import { useTranslations } from "next-intl";
import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";
import RampLayout from "@/components/ramps/RampsLayout";
import { withLocales } from "@workspace/i18n/routing";
import {
  rampData,
  fiatAssets,
  countries,
  paymentRails,
} from "@/data/ramps/ramps-data";

const Solanaramp = () => {
  const t = useTranslations();

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

export default Solanaramp;
