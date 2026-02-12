import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import { Section, Switchback } from "@solana-foundation/solana-lib";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import { META, SWITCHBACK, SWITCHBACK_BUTTON } from "@/data/tokenized-equities";

const TokenizedEquitiesPage = () => {
  const t = useTranslations("tokenized-equities");

  const switchbackButtons = [
    {
      ...SWITCHBACK_BUTTON,
      label: t("switchback.buttonLabel"),
    },
  ];

  return (
    <Layout>
      <HTMLHead
        title={t("meta.seoTitle")}
        description={t("meta.seoDescription")}
        socialShare={META.seoImage}
      />

      <Section>
        <Switchback
          assetSide={SWITCHBACK.assetSide as any}
          image={SWITCHBACK.image}
          eyebrow={t("switchback.eyebrow")}
          headline={t("switchback.headline")}
          body={t.raw("switchback.body")}
          placeholder={t("switchback.placeholder")}
          emailError={t("switchback.emailError")}
          submitError={t("switchback.submitError")}
          successMessage={t("switchback.successMessage")}
          newsLetter={SWITCHBACK.newsLetter}
          formId={SWITCHBACK.formId}
          buttons={
            switchbackButtons as React.ComponentProps<
              typeof Switchback
            >["buttons"]
          }
        />
      </Section>
    </Layout>
  );
};

export default TokenizedEquitiesPage;

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
