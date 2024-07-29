import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../components/layout";
import HTMLHead from "../components/HTMLHead";
import ValidatorsHero from "../components/validators/ValidatorsHero";
import ValidatorsCards from "../components/validators/ValidatorsCards";
import ValidatorsDefinition from "../components/validators/ValidatorsDefinition";
import ValidatorsRewards from "../components/validators/ValidatorsRewards";
import ValidatorsGettingStarted from "../components/validators/ValidatorsGettingStarted";
import ValidatorsFAQ from "../components/validators/ValidatorsFAQ";
import { getAllPostsInDir } from "../lib/markdown";
import { useInView } from "react-intersection-observer";

const ValidatorPage = ({ validatorFAQs }) => {
  const { t } = useTranslation("common");
  const { ref, inView } = useInView({
    threshold: 0,
    initialInView: true,
  });
  return (
    <Layout>
      <HTMLHead
        title={t("titles.validators")}
        description="The Solana Mainnet Beta network is currently supported by 1,000+ independent validators and can support transaction throughput of up to 50k TPS with sub-second confirmation times. Learn more about joining the ecosystem as a validator to start earning SOL rewards."
      />
      <div className="validators-page mt-n12 pt-12 pb-8">
        <ValidatorsHero ref={ref} />
        <ValidatorsCards visible={inView} />
        <ValidatorsDefinition />
        <ValidatorsRewards />
        <ValidatorsFAQ validatorFAQs={validatorFAQs} />
        <ValidatorsGettingStarted />
      </div>
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  const validatorFAQs = getAllPostsInDir("validatorsFAQ").map((p) => ({
    frontmatter: p.frontmatter,
    content: p.content,
  }));
  return {
    props: {
      validatorFAQs,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 30,
  };
}

export default ValidatorPage;
