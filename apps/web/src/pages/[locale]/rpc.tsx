import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import { Section } from "@solana-foundation/solana-lib";
import { withLocales } from "@workspace/i18n/routing";
import { META, CONTENT } from "@/data/rpc";
import ReactMarkdown from "react-markdown";

const RpcPage = () => {
  return (
    <Layout>
      <HTMLHead
        title={META.seoTitle}
        description={META.seoDescription}
        // socialShare={META.seoImage}
      />

      <Section>
        <div className="tw-html_parser">
          <ReactMarkdown>{CONTENT}</ReactMarkdown>
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
