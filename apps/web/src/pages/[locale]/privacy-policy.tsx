import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import { Hero, Section } from "@solana-foundation/solana-lib";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";

const PrivacyPolicyPage = () => {
  const t = useTranslations("privacy-policy");

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
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t("hero.body")}
      />

      <Section>
        <ReactMarkdown skipHtml={false}>
          {t.raw("sections.intro")}
        </ReactMarkdown>
        <h3 id="collection-of-information">{t("sections.collection.title")}</h3>
        <ReactMarkdown skipHtml={false}>
          {t.raw("sections.collection.body")}
        </ReactMarkdown>
        <h3 id="use-of-information">{t("sections.use.title")}</h3>
        <ReactMarkdown skipHtml={false}>
          {t.raw("sections.use.body")}
        </ReactMarkdown>
        <h3 id="sharing-of-information">{t("sections.sharing.title")}</h3>
        <ReactMarkdown skipHtml={false}>
          {t.raw("sections.sharing.body")}
        </ReactMarkdown>
        <h3 id="analytics">{t("sections.analytics.title")}</h3>
        <ReactMarkdown skipHtml={false}>
          {t.raw("sections.analytics.body")}
        </ReactMarkdown>
        <h3 id="transfer-of-information-to-the-united-states-and-other-countries">
          {t("sections.transfer.title")}
        </h3>
        <ReactMarkdown skipHtml={false}>
          {t.raw("sections.transfer.body")}
        </ReactMarkdown>
        <h3 id="your-choices">{t("sections.choices.title")}</h3>
        <ReactMarkdown skipHtml={false}>
          {t.raw("sections.choices.body")}
        </ReactMarkdown>
        <h3 id="your-california-privacy-rights">
          {t("sections.california.title")}
        </h3>
        <ReactMarkdown skipHtml={false}>
          {t.raw("sections.california.body")}
        </ReactMarkdown>
        <h3 id="additional-disclosures-for-individuals-in-europe">
          {t("sections.europe.title")}
        </h3>
        <ReactMarkdown skipHtml={false}>
          {t.raw("sections.europe.body")}
        </ReactMarkdown>
        <h3 id="contact-us">{t("sections.contact.title")}</h3>
        <ReactMarkdown skipHtml={false}>
          {t.raw("sections.contact.body")}
        </ReactMarkdown>
      </Section>
    </Layout>
  );
};

export default PrivacyPolicyPage;

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
        "privacy-policy":
          messages["privacy-policy"] ?? enMessages["privacy-policy"],
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
