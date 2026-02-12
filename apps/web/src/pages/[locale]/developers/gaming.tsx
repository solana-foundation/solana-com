import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  ConversionPanel,
  FeatureHighlight,
  Heading,
  Hero,
  Quote,
  Switchback,
  SwitchbackChain,
} from "@solana-foundation/solana-lib";
import {
  COMMUNITY_HEADING,
  COMMUNITY_PANEL,
  FEATURE_HIGHLIGHT,
  FEATURE_HIGHLIGHT_CARDS,
  FUNDING_PANEL,
  GAMES_KIT_PANEL,
  HERO_BUTTONS,
  HERO_IMAGE,
  META,
  SHOWCASE_SWITCHBACK,
  SWITCHBACK_CHAIN,
} from "@/data/developers/gaming";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";

const FeatureHighlightAny = FeatureHighlight as any;

const DevelopersGamingPage = () => {
  const t = useTranslations("developers-gaming");
  const blockSpacing = { large: { marginTop: "20px" } };

  const heroButtons = HERO_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`hero.buttons.${index}`),
  }));

  const gamesKitListItems = GAMES_KIT_PANEL.listItems.map((item, index) => ({
    ...item,
    label: t(`conversionPanels.gamesKit.listItems.${index}`),
  }));

  const featureHighlightCards = FEATURE_HIGHLIGHT_CARDS.map((card, index) => ({
    ...card,
    feature: t(`featureHighlight.cards.${index}.feature`),
    body: t(`featureHighlight.cards.${index}.body`),
  }));

  const featureHighlightButtons = FEATURE_HIGHLIGHT.buttons.map(
    (button, index) => ({
      ...button,
      label: t(`featureHighlight.buttons.${index}`),
    }),
  );

  const switchbackButtons = SHOWCASE_SWITCHBACK.buttons.map(
    (button, index) => ({
      ...button,
      label: t(`switchback.buttons.${index}`),
    }),
  );

  const headingButtons = COMMUNITY_HEADING.buttons.map((button) => ({
    ...button,
    label: t("heading.buttonLabel"),
  }));

  const switchbackChainItems = SWITCHBACK_CHAIN.switchbacks.map(
    (switchback, index) => ({
      ...switchback,
      image: {
        ...switchback.image,
        alt: t(`switchbackChain.items.${index}.headline`),
      },
      eyebrow: "",
      headline: t(`switchbackChain.items.${index}.headline`),
      body: t.raw(`switchbackChain.items.${index}.body`),
      buttons: [],
      placeholder: "",
      emailError: "",
      submitError: "",
      successMessage: "",
    }),
  );

  const fundingButtons = FUNDING_PANEL.buttons.map((button, index) => ({
    ...button,
    label: t(`conversionPanels.funding.buttons.${index}`),
  }));

  const communityListItems = COMMUNITY_PANEL.listItems.map((item, index) => ({
    ...item,
    label: t(`conversionPanels.community.listItems.${index}`),
  }));

  return (
    <Layout>
      <HTMLHead
        title={t("meta.seoTitle")}
        description={t("meta.seoDescription")}
        socialShare={META.seoImage}
      />

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Hero
          headingAs="h1"
          centered={false}
          newsLetter={false}
          eyebrow={t("hero.eyebrow")}
          headline={t("hero.headline")}
          body={t.raw("hero.body")}
          buttons={heroButtons as React.ComponentProps<typeof Hero>["buttons"]}
          image={{ alt: t("hero.headline"), src: HERO_IMAGE }}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <ConversionPanel
          variant={GAMES_KIT_PANEL.variant as "inline-centered"}
          heading={t("conversionPanels.gamesKit.heading")}
          body={t("conversionPanels.gamesKit.body")}
          buttons={[]}
          listItems={
            gamesKitListItems as React.ComponentProps<
              typeof ConversionPanel
            >["listItems"]
          }
          showLogos={false}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <FeatureHighlightAny
          eyebrow={t("featureHighlight.eyebrow")}
          headline={t("featureHighlight.headline")}
          body={t("featureHighlight.body")}
          headingAs={FEATURE_HIGHLIGHT.headingAs}
          color={FEATURE_HIGHLIGHT.color}
          desktopBackground={FEATURE_HIGHLIGHT.desktopBackground}
          cards={featureHighlightCards as any}
          buttons={featureHighlightButtons as any}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Switchback
          assetSide={SHOWCASE_SWITCHBACK.assetSide as "left"}
          eyebrow={t("switchback.eyebrow")}
          headline={t("switchback.headline")}
          body={t.raw("switchback.body")}
          buttons={
            switchbackButtons as React.ComponentProps<
              typeof Switchback
            >["buttons"]
          }
          image={{
            ...SHOWCASE_SWITCHBACK.image,
            alt: t("switchback.headline"),
          }}
          placeholder=""
          emailError=""
          submitError=""
          successMessage=""
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <Heading
          variant={COMMUNITY_HEADING.variant as "floatingButton"}
          eyebrow={t("heading.eyebrow")}
          headline={t("heading.headline")}
          body={t("heading.body")}
          buttons={
            headingButtons as React.ComponentProps<typeof Heading>["buttons"]
          }
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <SwitchbackChain
          hideBackground={SWITCHBACK_CHAIN.hideBackground}
          switchbacks={switchbackChainItems as any}
        />
      </ResponsiveBox>

      <Quote
        eyebrow={t("quote.eyebrow")}
        quote={t.raw("quote.body")}
        author={{
          name: t("quote.author.name"),
          company: t("quote.author.company"),
        }}
      />

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <ConversionPanel
          variant={FUNDING_PANEL.variant as "centered"}
          heading={t("conversionPanels.funding.heading")}
          body={t("conversionPanels.funding.body")}
          buttons={fundingButtons as any}
          logos={FUNDING_PANEL.logos}
          listItems={[]}
          showLogos={FUNDING_PANEL.showLogos}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={blockSpacing}>
        <ConversionPanel
          variant={COMMUNITY_PANEL.variant as "inline-centered"}
          heading={t("conversionPanels.community.heading")}
          body={t("conversionPanels.community.body")}
          buttons={[]}
          logos={[]}
          listItems={communityListItems as any}
          showLogos={COMMUNITY_PANEL.showLogos}
        />
      </ResponsiveBox>
    </Layout>
  );
};

export default DevelopersGamingPage;

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
