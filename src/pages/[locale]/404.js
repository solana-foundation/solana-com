import { Link } from "@/utils/Link";
import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withLocales } from "@/i18n/routing";
import { useTranslation } from "next-i18next";
import NotFoundImg from "@@/public/img/not-found.png";
import Image from "next/image";

const NotFoundPage = () => {
  const { t } = useTranslation();
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
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ["common"])),
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
