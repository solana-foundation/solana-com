import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import { Section, Switchback } from "@solana-foundation/solana-lib";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import {
  // META,
  SWITCHBACK,
} from "@/data/community/report-2024-newsletter-sign-up";

const CommunityReport2024NewsletterSignUpPage = () => {
  const t = useTranslations("community-report-2024-newsletter-sign-up");

  return (
    <Layout>
      <HTMLHead
        title={t("meta.seoTitle")}
        description={t("meta.seoDescription")}
        // socialShare={META.seoImage}
      />

      <Section>
        <Switchback
          assetSide={SWITCHBACK.assetSide as any}
          image={SWITCHBACK.image}
          eyebrow={t("switchback.eyebrow")}
          headline={t("switchback.headline")}
          body={t.raw("switchback.body")}
          newsLetter={SWITCHBACK.newsLetter}
          formId={SWITCHBACK.formId}
          placeholder={t("switchback.placeholder")}
          emailError={t("switchback.emailError")}
          submitError={t("switchback.submitError")}
          successMessage={t("switchback.successMessage")}
        />
      </Section>
    </Layout>
  );
};

export default CommunityReport2024NewsletterSignUpPage;

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
