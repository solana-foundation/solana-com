import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";
import EmailSubscribeForm from "@/components/shared/EmailSubscribeForm";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";

const NewsletterPage = () => {
  const t = useTranslations();
  return (
    <Layout>
      <HTMLHead title={t("titles.newsletter")} />
      <section className="mt-n12">
        <div className="container d-flex flex-column">
          <div className="row align-items-center justify-content-center g-0 min-vh-100">
            <div className="col-12 col-md-6 col-lg-5 py-8 py-md-11">
              <h3 className="mb-0 fw-bold text-white">
                {t("newsletter.signup")}
              </h3>
              <p className="mb-6">{t("newsletter.spam")}</p>
              <EmailSubscribeForm formId="fdd4a0db-f4af-4b29-90f9-98b0556d4c89" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export async function getStaticProps({ params }) {
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

export default NewsletterPage;
