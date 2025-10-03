import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";
import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import classNames from "classnames";
import styles from "@/components/possible/PossibleLayout.module.scss";
import PossibleHero from "@/components/possible/PossibleHero";
import PossibleVisionaries from "@/components/possible/PossibleVisionaries";
import PossibleCaseStudies from "@/components/possible/PossibleCaseStudies";
import PossibleInnovation from "@/components/possible/PossibleInnovations";
import dynamic from "next/dynamic";
import { withLocales } from "@workspace/i18n/routing";

const Possible = () => {
  const t = useTranslations();

  const [statsRef, statsInView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const [ecosystemRef, ecosystemInView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const PossibleStartBuilding = dynamic(
    () => import("@/components/possible/PossibleStartBuilding"),
    {
      ssr: false,
    },
  );

  const PossibleStats = dynamic(
    () => import("@/components/possible/PossibleStats"),
    {
      ssr: false,
    },
  );

  const PossibleEcosystem = dynamic(
    () => import("@/components/possible/PossibleEcosystem"),
    {
      ssr: false,
    },
  );

  const PossibleIcons = dynamic(
    () => import("@/components/possible/PossibleIcons"),
    {
      ssr: false,
    },
  );

  return (
    <Layout>
      <div
        className={classNames(
          styles["possible-layout"],
          "position-relative d-block overflow-hidden",
        )}
      >
        <HTMLHead
          title={t("possible.meta.title")}
          description={t("possible.meta.description")}
          socialShare={"https://solana.com/social/possible.jpg"}
        />
        <PossibleHero />
        <div id={`possible-visionaries`}>
          <PossibleVisionaries />
        </div>
        <PossibleCaseStudies />
        <PossibleInnovation />
        <div id={`possible-startBuilding`}>
          <div ref={statsRef}>
            {statsInView ? (
              <>
                <PossibleStartBuilding />
                <PossibleStats visible={statsInView} showKPIs={false} />
              </>
            ) : (
              <div className="min-vh-100 w-100" />
            )}
          </div>
        </div>
        <div ref={ecosystemRef}>
          {ecosystemInView ? (
            <>
              <PossibleEcosystem />
              <PossibleIcons />
            </>
          ) : (
            <div className="min-vh-100 w-100" />
          )}
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
  };
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}

export default Possible;
