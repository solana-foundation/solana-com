import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Loader from "@/components/Loader";
import Layout from "@/components/layout";

import Tabs from "@/components/Tabs";
import bgImage from "../../../../assets/state-of-solana/solana-bg.webp";
import styles from "./state-of-solana.module.scss";
import Image from "next/image";
import classNames from "classnames";
import Header from "../../../components/Header";

const pageTitle = "State of Solana";

const TLDashboards = dynamic(async () => import("tl-dashboards"), {
  loading: () => (
    <div className={styles.dashboardLoader}>
      <Loader />
    </div>
  ),
  ssr: false,
});

const userWalletDashboards = {
  overview: {
    id: 1,
    title: "Overview",
    slug: "overview",
    org_slug: "solana",
    api_key: "AXa6aNn8xxDCpyOXBx0cnRsKeh1HrBHNBZJcu6Ey",
  },
  // dex: {
  //   id: 2,
  //   title: "DEX",
  //   slug: "dex",
  //   org_slug: "tl",
  //   api_key: "Jix7XZI0p41oMZ7pEVhcW1vCydMvgIsdy5Q7ma4D",
  // },
  // rev: {
  //   id: 3,
  //   title: "REV",
  //   slug: "rev",
  //   org_slug: "tl",
  //   api_key: "0Cm9R8K8xu4vq93Ljb88UJDtWr6jwTM1V9AGMQQo",
  // },
  // "block-rewards": {
  //   id: 4,
  //   title: "Block Rewards",
  //   slug: "block-rewards",
  //   org_slug: "tl",
  //   api_key: "JHrjYsFXzCEcSgpBS6RCCpZqV6dQMCKyn3sgGJon",
  // },
};

const defaultTheme = "dark";

const StateOfSolana = ({ slug = "overview", locale = "en" }) => {
  const [theme] = useState(defaultTheme);
  const [loading, setLoading] = useState({});
  const router = useRouter();
  const dashboardRef = useRef();

  const setTabLoading = (dashboardId, isLoading) => {
    setLoading((prev) => ({
      ...prev,
      [dashboardId]: isLoading,
    }));
  };

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }

    return () => document.body.classList.remove("theme-dark");
  }, [theme]);

  return (
    <>
      <Header />
      <div className={classNames(styles.dashboardSection, "container-xl")}>
        <Image className={styles.dashboardBg} src={bgImage} alt="" fill />
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
        <Tabs
          onChange={(tabId) =>
            router.push(`/${locale}/state-of-solana/${tabId}`)
          }
          activeKey={slug}
        >
          {Object.values(userWalletDashboards).map((wdashboard = {}) => (
            <Tabs.TabPane
              tab={wdashboard?.slug}
              key={wdashboard?.slug}
              title={wdashboard?.title}
            >
              <TLDashboards
                client={wdashboard?.org_slug}
                token={wdashboard?.api_key}
                className={styles.dashboard}
                loader={
                  <Loader color={theme === "dark" ? "#a4afd6" : "#1a3989"} />
                }
                onDashboardLoad={() => {
                  setTabLoading(wdashboard?.id, false);
                }}
                dashboardRef={dashboardRef}
              />
              {loading[wdashboard?.id] !== false && (
                <div className="loading">
                  <div className="loading-indicator">
                    <div id="shadow"></div>
                    <img
                      id="css-logo"
                      style={{ height: "0px" }}
                      src="/static/images/brand-logo.svg"
                      alt=""
                    />
                  </div>
                </div>
              )}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </>
  );
};

export async function getStaticProps({ params }) {
  const { locale = "en", slug = "" } = params;
  try {
    const isDefaultLocale = locale === "en";
    const builderLocale = isDefaultLocale ? "Default" : locale;

    console.log("param", params);

    return {
      props: {
        locale,
        slug,
        builderLocale,
        ...(await serverSideTranslations(builderLocale, ["common"])),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  return {
    paths: Object.keys(userWalletDashboards).map((slug) => ({
      params: { locale: "en", slug: slug },
    })),
    fallback: "blocking",
  };
}

export default StateOfSolana;
