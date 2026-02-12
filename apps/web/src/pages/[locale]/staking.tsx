import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import {
  Accordion,
  Hero,
  HtmlParser,
  Section,
} from "@solana-foundation/solana-lib";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import {
  META,
  STAKING_ECONOMICS_ACCORDION_KEYS,
  STAKING_OVERVIEW_ACCORDION_KEYS,
  STAKING_REWARDS_ACCORDION_KEYS,
} from "@/data/staking";

const StakingPage = () => {
  const t = useTranslations("staking");

  const overviewAccordions = STAKING_OVERVIEW_ACCORDION_KEYS.map((item) => ({
    title: t(item.titleKey),
    body: t.raw(item.bodyKey),
  }));

  const rewardsAccordions = STAKING_REWARDS_ACCORDION_KEYS.map((item) => ({
    title: t(item.titleKey),
    body: t.raw(item.bodyKey),
  }));

  const economicsAccordions = STAKING_ECONOMICS_ACCORDION_KEYS.map((item) => ({
    title: t(item.titleKey),
    body: t.raw(item.bodyKey),
  }));

  return (
    <Layout>
      <HTMLHead
        title={t("meta.seoTitle")}
        description={t("meta.seoDescription")}
        socialShare={META.seoImage}
      />

      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        headline={t("hero.headline")}
      />

      <Section>
        <HtmlParser rawHtml={t.raw("overview")} />

        <Accordion
          headline={t("sections.overview.headline")}
          accordions={
            overviewAccordions as React.ComponentProps<
              typeof Accordion
            >["accordions"]
          }
        />

        <Accordion
          headline={t("sections.rewards.headline")}
          accordions={
            rewardsAccordions as React.ComponentProps<
              typeof Accordion
            >["accordions"]
          }
        />

        <Accordion
          headline={t("sections.economics.headline")}
          accordions={
            economicsAccordions as React.ComponentProps<
              typeof Accordion
            >["accordions"]
          }
        />
      </Section>
    </Layout>
  );
};

export default StakingPage;

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
