import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import { Hero, Section } from "@solana-foundation/solana-lib";
import { withLocales } from "@workspace/i18n/routing";
import { META, HERO, CONTENT } from "@/data/tos";
import ReactMarkdown from "react-markdown";

const TosPage = () => {
  return (
    <Layout>
      <HTMLHead
        title={META.seoTitle}
        description={META.seoDescription}
        // socialShare={META.seoImage}
      />

      <Hero
        headline={HERO.headline}
        headingAs="h1"
        centered={false}
        newsLetter={false}
      />

      <Section>
        <ReactMarkdown>{CONTENT}</ReactMarkdown>
      </Section>
    </Layout>
  );
};

export default TosPage;

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
