import { useTranslations } from "next-intl";
import { withLocales } from "@workspace/i18n/routing";

import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";
import AiHero from "@/components/ai/AiHero";
import AiWhySection from "@/components/ai/AiWhySection";
import AiCard from "@/components/ai/AiCard";
// import AiHighlight from "@/components/ai/AiHighlight";
import AiBuild from "@/components/ai/AiBuild";

export default function AiPage() {
  const t = useTranslations();
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
