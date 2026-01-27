import { withLocales } from "@workspace/i18n/routing";
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
  HERO,
  BUTTONS,
  STATS,
  TRUSTBAR_LOGOS,
  HEADINGS,
  SWITCHBACKS,
  POS_CARDS,
  B2B_CARDS,
  CONVERSION_PANEL,
} from "@/data/solutions/commerce-tooling";
import { ResponsiveBox } from "@/component-library/responsive-box";

const CommerceToolingPage = () => {
  return (
    <Layout>
      <HTMLHead
        title={META.seoTitle}
        description={META.seoDescription}
        socialShare={META.seoImage}
      />

      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        eyebrow={HERO.eyebrow}
        headline={HERO.headline}
        body={HERO.body}
        buttons={[
          {
            hierarchy: "primary",
            size: "lg",
            url: "mailto:bd-payments-commerce@solana.org",
            label: BUTTONS.getInTouch,
          },
          {
            hierarchy: "outline",
            size: "lg",
            url: "https://docs.solanapay.com/core/overview",
            label: BUTTONS.explorePayments,
          },
        ]}
        image={{
          src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fca37372e226847efa17d57f425bf6fbb.png",
          alt: "",
        }}
      />

      <Stats stats={STATS} contained />

      <Trustbar
        variant="grid"
        logos={TRUSTBAR_LOGOS as { src: string; alt: string; url: string }[]}
      />

      <Heading
        headline={HEADINGS.betterExperience.headline}
        body={HEADINGS.betterExperience.body}
        variant="centered"
      />

      <SwitchbackChain
        hideBackground={true}
        switchbacks={[
          {
            assetSide: "right",
            eyebrow: SWITCHBACKS.bobaGuys.eyebrow,
            headline: SWITCHBACKS.bobaGuys.headline,
            body: SWITCHBACKS.bobaGuys.body,
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "/news/boba-guys-customer-loyalty-solana",
                label: BUTTONS.learnMore,
              },
            ],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fb77779d7c64d481bb81d0c74c73c74e9.png",
              alt: "",
            },
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
        ]}
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
          headline={HEADINGS.pointOfSale.headline}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        numCols={2}
        cards={[
          {
            type: "standard",
            heading: POS_CARDS.digital.heading,
            body: POS_CARDS.digital.body,
            callToAction: {
              label: BUTTONS.seeTheTools,
              url: "https://www.notion.so/solanafoundation/PoS-Digital-ff4c5e0cca5247778feaa2bce3452c1f?pvs=4",
            },
            headingAs: "h2",
          },
          {
            type: "standard",
            heading: POS_CARDS.physical.heading,
            body: POS_CARDS.physical.body,
            callToAction: {
              label: BUTTONS.seeTheTools,
              url: "https://www.notion.so/solanafoundation/PoS-Physical-8e6883a50cf74960aab6831c00f62374?pvs=4",
            },
            headingAs: "h2",
          },
        ]}
      />

      <SwitchbackChain
        hideBackground={true}
        switchbacks={[
          {
            assetSide: "right",
            eyebrow: SWITCHBACKS.solanaPay.eyebrow,
            headline: SWITCHBACKS.solanaPay.headline,
            body: SWITCHBACKS.solanaPay.body,
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "https://apps.shopify.com/solana-pay",
                label: BUTTONS.learnMore,
              },
            ],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F3fc5437fef944e45975a2f2ea00f86e6.png",
              alt: "",
            },
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
        ]}
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
          headline={HEADINGS.businessToBusiness.headline}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        numCols={3}
        cards={[
          {
            type: "standard",
            heading: B2B_CARDS.payroll.heading,
            headingAs: "h3",
            body: B2B_CARDS.payroll.body,
          },
          {
            type: "standard",
            heading: B2B_CARDS.vendorPayments.heading,
            headingAs: "h3",
            body: B2B_CARDS.vendorPayments.body,
          },
          {
            type: "standard",
            heading: B2B_CARDS.financeAndAccounting.heading,
            headingAs: "h3",
            body: B2B_CARDS.financeAndAccounting.body,
          },
        ]}
      />

      <ConversionPanel
        heading={CONVERSION_PANEL.heading}
        buttons={[
          {
            label: BUTTONS.contactUs,
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
