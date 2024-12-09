import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import classNames from "classnames";

import Layout from "@/components/solutions/layout";
import HTMLHead from "@/components/HTMLHead";
import ContributeContent from "@/components/contribute/ContributeContent";
import { AnimatedText } from "@/components/shared/Text";

import styles from "./Contribute.module.scss";

const Frame = ({ children }) => (
  <span className={styles.Frame}>
    <span className={styles.FrameInner}>
      <span className={styles.FrameTop} />
      <span className={styles.FrameBottom} />
    </span>
    {children}
  </span>
);

const Contribute = () => {
  const { t } = useTranslation();

  const tabsContent = t("contribute.tabs", {
    returnObjects: true,
  });

  return (
    <Layout>
      <HTMLHead
        title={t("contribute.meta.title")}
        description={t("contribute.meta.description")}
      />

      <div className={styles.PageWrapper}>
        <div className={classNames(styles.Hero)}>
          <div className={styles.HeroTitleWrapper}>
            <AnimatedText element="h1" as="heading">
              <Trans
                i18nKey="contribute.title"
                components={{
                  frame: <Frame />,
                }}
              />
            </AnimatedText>
          </div>
        </div>

        <ContributeContent tabs={tabsContent} />
      </div>
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Contribute;
