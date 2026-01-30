import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import { Hero, Section } from "@solana-foundation/solana-lib";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";

const TosPage = () => {
  const t = useTranslations("tos");

  return (
    <Layout>
      <HTMLHead
        title={t("meta.seoTitle")}
        description={t("meta.seoDescription")}
        // socialShare={META.seoImage}
      />

      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        headline={t("hero.headline")}
      />

      <Section>
        <ReactMarkdown>{t.raw("content")}</ReactMarkdown>
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
  const enMessages = (await import(`@@/public/locales/en/common.json`)).default;
  return {
    props: {
      locale,
      messages: {
        ...messages,
        tos: messages.tos ?? enMessages.tos,
      },
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
