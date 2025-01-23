import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withLocales } from "@/i18n/routing";

import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";
import AiHero from "@/components/ai/AiHero";
import AiWhySection from "@/components/ai/AiWhySection";
import AiCard from "@/components/ai/AiCard";
// import AiHighlight from "@/components/ai/AiHighlight";
import AiBuild from "@/components/ai/AiBuild";

export default function AiPage() {
  const { t } = useTranslation("common");
  return (
    <Layout>
      <HTMLHead title={t("ai.title")} description={t("ai.description")} />
      <div className="overflow-hidden pb-10 mb-n10">
        <AiHero />
        <AiWhySection />
        <AiCard />
        {/* <AiHighlight /> */}
        <AiBuild />
      </div>
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
  };
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
