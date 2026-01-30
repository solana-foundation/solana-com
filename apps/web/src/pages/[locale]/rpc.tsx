import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import { Section } from "@solana-foundation/solana-lib";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";

const RpcPage = () => {
  const t = useTranslations("rpc");

  return (
    <Layout>
      <HTMLHead
        title={t("meta.title")}
        description={t("meta.description")}
        // socialShare={META.seoImage}
      />

      <Section>
        <div className="tw-html_parser">
          <ReactMarkdown>{t.raw("content")}</ReactMarkdown>
        </div>
      </Section>
    </Layout>
  );
};

export default RpcPage;

export async function getStaticProps({
  params,
}: {
  params: { locale: string };
}) {
  const { locale = "en" } = params;
  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;
  return {
    props: {
      locale,
      messages,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
