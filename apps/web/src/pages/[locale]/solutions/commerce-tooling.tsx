import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import {
  Hero,
  Stats,
  Trustbar,
  Heading,
  SwitchbackChain,
  CardDeck,
  ConversionPanel,
} from "@solana-foundation/solana-lib";

import {
  META,
  HERO_IMAGE,
  SWITCHBACK_IMAGES,
  TRUSTBAR_LOGOS,
  STATS,
} from "@/data/solutions/commerce-tooling";
import { ResponsiveBox } from "@/component-library/responsive-box";

const CommerceToolingPage = () => {
  const t = useTranslations("commerce-tooling-solution");

  const stats = STATS.map((stat, index) => ({
    ...stat,
    description: t(`stats.${index}.description`),
  }));

  const bobaGuysSwitchback = {
    assetSide: "right" as const,
    eyebrow: t("switchbacks.bobaGuys.eyebrow"),
    headline: t("switchbacks.bobaGuys.headline"),
    body: t.raw("switchbacks.bobaGuys.body"),
    buttons: [
      {
        hierarchy: "primary" as const,
        size: "md" as const,
        url: "https://solana.com/news/boba-guys-customer-loyalty-solana",
        label: t("buttons.learnMore"),
      },
    ],
    image: {
      src: SWITCHBACK_IMAGES.bobaGuys,
      alt: t("switchbacks.bobaGuys.headline"),
    },
    placeholder: "",
    emailError: "",
    submitError: "",
    successMessage: "",
  };

  const solanaPaySwitchback = {
    assetSide: "right" as const,
    eyebrow: t("switchbacks.solanaPay.eyebrow"),
    headline: t("switchbacks.solanaPay.headline"),
    body: t.raw("switchbacks.solanaPay.body"),
    buttons: [
      {
        hierarchy: "primary" as const,
        size: "md" as const,
        url: "https://apps.shopify.com/solana-pay",
        label: t("buttons.learnMore"),
      },
    ],
    image: {
      src: SWITCHBACK_IMAGES.solanaPay,
      alt: t("switchbacks.solanaPay.headline"),
    },
    placeholder: "",
    emailError: "",
    submitError: "",
    successMessage: "",
  };

  return (
    <Layout>
      <HTMLHead
        title={t("meta.title")}
        description={t("meta.description")}
        socialShare={META.seoImage}
      />

      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
        buttons={[
          {
            hierarchy: "primary",
            size: "lg",
            url: "mailto:bd-payments-commerce@solana.org",
            label: t("buttons.getInTouch"),
          },
          {
            hierarchy: "outline",
            size: "lg",
            url: "https://docs.solanapay.com/core/overview",
            label: t("buttons.explorePayments"),
          },
        ]}
        image={{
          src: HERO_IMAGE,
          alt: t("hero.headline"),
        }}
      />

      <Stats stats={stats} contained />

      <Trustbar
        variant="grid"
        logos={TRUSTBAR_LOGOS as { src: string; alt: string; url: string }[]}
      />

      <Heading
        headline={t("headings.betterExperience.headline")}
        body={t("headings.betterExperience.body")}
        variant="centered"
      />

      <SwitchbackChain
        hideBackground={true}
        switchbacks={[bobaGuysSwitchback]}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: {
            marginBottom: "-120px",
          },
          medium: {
            marginBottom: "-45px",
          },
        }}
      >
        <Heading
          headline={t("headings.pointOfSale.headline")}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        numCols={2}
        cards={[
          {
            type: "standard",
            heading: t("posCards.digital.heading"),
            body: t("posCards.digital.body"),
            callToAction: {
              label: t("buttons.seeTheTools"),
              url: "https://www.notion.so/solanafoundation/PoS-Digital-ff4c5e0cca5247778feaa2bce3452c1f?pvs=4",
            },
            headingAs: "h2",
          },
          {
            type: "standard",
            heading: t("posCards.physical.heading"),
            body: t("posCards.physical.body"),
            callToAction: {
              label: t("buttons.seeTheTools"),
              url: "https://www.notion.so/solanafoundation/PoS-Physical-8e6883a50cf74960aab6831c00f62374?pvs=4",
            },
            headingAs: "h2",
          },
        ]}
      />

      <SwitchbackChain
        hideBackground={true}
        switchbacks={[solanaPaySwitchback]}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: {
            marginBottom: "-120px",
          },
          medium: {
            marginBottom: "-45px",
          },
        }}
      >
        <Heading
          headline={t("headings.businessToBusiness.headline")}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        numCols={3}
        cards={[
          {
            type: "standard",
            heading: t("b2bCards.payroll.heading"),
            headingAs: "h3",
            body: t("b2bCards.payroll.body"),
          },
          {
            type: "standard",
            heading: t("b2bCards.vendorPayments.heading"),
            headingAs: "h3",
            body: t("b2bCards.vendorPayments.body"),
          },
          {
            type: "standard",
            heading: t("b2bCards.financeAndAccounting.heading"),
            headingAs: "h3",
            body: t("b2bCards.financeAndAccounting.body"),
          },
        ]}
      />

      <ConversionPanel
        heading={t("conversionPanel.heading")}
        buttons={[
          {
            label: t("buttons.contactUs"),
            hierarchy: "secondary",
            size: "lg",
            url: "mailto:bd-payments-commerce@solana.org",
          },
        ]}
      />
    </Layout>
  );
};

export default CommerceToolingPage;

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
