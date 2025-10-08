import Link from "@/components/shared/Link";
import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import NotFoundImg from "@@/public/img/not-found.png";
import Image from "next/image";

const NotFoundPage = () => {
  const t = useTranslations();
  return (
    <Layout>
      <HTMLHead title={t("titles.404")} />
      <div className="container py-10">
        <div className="row align-items-center justify-content-center">
          <div className="col-md-6 col-lg-8 order-md-2">
            <Image src={NotFoundImg} alt="Not found" />
          </div>
          <div className="col-md-6 col-lg-4 order-md-1">
            <h1 className="display-3 fw-bold text-center">{t("404.title")}</h1>
            <p className="mb-5 text-center subdued">{t("404.copy")}</p>
            <div className="text-center">
              <Link className="btn btn-primary" to="/">
                {t("404.button")}
              </Link>
            </div>
          </div>
        </div>
      </div>
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

export default NotFoundPage;
