import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import { Hero, Section } from "@solana-foundation/solana-lib";
import { withLocales } from "@workspace/i18n/routing";
import {
  META,
  HERO,
  CONTENT_1,
  CONTENT_2,
  CONTENT_3,
  CONTENT_4,
  CONTENT_5,
  CONTENT_6,
  CONTENT_7,
  CONTENT_8,
  CONTENT_9,
  CONTENT_10,
  TITLE_2,
  TITLE_3,
  TITLE_4,
  TITLE_5,
  TITLE_6,
  TITLE_7,
  TITLE_8,
  TITLE_9,
  TITLE_10,
} from "@/data/privacy-policy";
import ReactMarkdown from "react-markdown";

const PrivacyPolicyPage = () => {
  return (
    <Layout>
      <HTMLHead
        title={META.seoTitle}
        description={META.seoDescription}
        // socialShare={META.seoImage}
      />

      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        eyebrow={HERO.eyebrow}
        headline={HERO.headline}
        body={HERO.body}
      />

      <Section>
        <ReactMarkdown skipHtml={false}>{CONTENT_1}</ReactMarkdown>
        <h3 id="collection-of-information">{TITLE_2}</h3>
        <ReactMarkdown skipHtml={false}>{CONTENT_2}</ReactMarkdown>
        <h3 id="use-of-information">{TITLE_3}</h3>
        <ReactMarkdown skipHtml={false}>{CONTENT_3}</ReactMarkdown>
        <h3 id="sharing-of-information">{TITLE_4}</h3>
        <ReactMarkdown skipHtml={false}>{CONTENT_4}</ReactMarkdown>
        <h3 id="analytics">{TITLE_5}</h3>
        <ReactMarkdown skipHtml={false}>{CONTENT_5}</ReactMarkdown>
        <h3 id="transfer-of-information-to-the-united-states-and-other-countries">
          {TITLE_6}
        </h3>
        <ReactMarkdown skipHtml={false}>{CONTENT_6}</ReactMarkdown>
        <h3 id="your-choices">{TITLE_7}</h3>
        <ReactMarkdown skipHtml={false}>{CONTENT_7}</ReactMarkdown>
        <h3 id="your-california-privacy-rights">{TITLE_8}</h3>
        <ReactMarkdown skipHtml={false}>{CONTENT_8}</ReactMarkdown>
        <h3 id="additional-disclosures-for-individuals-in-europe">{TITLE_9}</h3>
        <ReactMarkdown skipHtml={false}>{CONTENT_9}</ReactMarkdown>
        <h3 id="contact-us">{TITLE_10}</h3>
        <ReactMarkdown skipHtml={false}>{CONTENT_10}</ReactMarkdown>
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
