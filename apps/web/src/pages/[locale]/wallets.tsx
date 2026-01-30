import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import { Columns } from "@/component-library/columns";
import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  CardDeck,
  ConversionPanel,
  Heading,
  Hero,
  HtmlParser,
  Section,
} from "@solana-foundation/solana-lib";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import {
  APPLY_FOR_GRANT_BUTTON,
  CARD_DECKS,
  CARD_DECK_OFFSET_STYLES,
  COMPARE_WALLETS_BUTTON,
  COPY_OFFSET_STYLES,
  HERO_BUTTONS,
  HERO_IMAGE,
  HERO_RIGHT_IMAGE,
  META,
  SECTION_OFFSET_STYLES,
  VIDEO_SOURCES,
  VIDEO_STYLES,
} from "@/data/wallets";

const WalletsPage = () => {
  const t = useTranslations("wallets-landing");

  const heroButtons = HERO_BUTTONS.map(({ labelKey, ...button }) => ({
    ...button,
    label: t(labelKey),
  }));

  const buildCards = CARD_DECKS.build.map(
    ({ headingKey, bodyKey, callToAction, ...card }) => ({
      ...card,
      heading: t(headingKey),
      body: t(bodyKey),
      callToAction: {
        ...callToAction,
        label: t(callToAction.labelKey),
      },
    }),
  );

  const buyCards = CARD_DECKS.buy.map(
    ({ headingKey, bodyKey, callToAction, ...card }) => ({
      ...card,
      heading: t(headingKey),
      body: t(bodyKey),
      callToAction: {
        ...callToAction,
        label: t(callToAction.labelKey),
      },
    }),
  );

  const developerCards = CARD_DECKS.developerResources.map(
    ({ headingKey, bodyKey, callToAction, ...card }) => ({
      ...card,
      heading: t(headingKey),
      body: t(bodyKey),
      callToAction: {
        ...callToAction,
        label: t(callToAction.labelKey),
      },
    }),
  );

  const compareWalletsButton = {
    ...COMPARE_WALLETS_BUTTON,
    label: t(COMPARE_WALLETS_BUTTON.labelKey),
  };

  const applyForGrantButton = {
    ...APPLY_FOR_GRANT_BUTTON,
    label: t(APPLY_FOR_GRANT_BUTTON.labelKey),
  };

  const videoProps = {
    autoPlay: true,
    controls: false,
    muted: true,
    loop: true,
    playsInline: true,
    preload: "metadata" as const,
  };

  return (
    <Layout>
      <HTMLHead
        title={t("meta.seoTitle")}
        description={t("meta.seoDescription")}
        socialShare={META.seoImage}
      />

      <Hero
        headingAs="h1"
        newsLetter={false}
        centered={true}
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
        buttons={heroButtons as React.ComponentProps<typeof Hero>["buttons"]}
        image={{
          alt: t("hero.headline"),
          src: HERO_IMAGE,
        }}
        rightImage={{
          alt: t("hero.headline"),
          src: HERO_RIGHT_IMAGE,
        }}
        leftImage={{
          alt: t("hero.headline"),
          src: HERO_RIGHT_IMAGE,
        }}
      />

      <ConversionPanel
        heading={t("conversionPanels.unlockProgrammableMoney.heading")}
        body={t("conversionPanels.unlockProgrammableMoney.body")}
        variant="inline-centered"
      />

      <ResponsiveBox responsiveStyles={SECTION_OFFSET_STYLES}>
        <Section>
          <Columns space={20} stackColumnsAt="tablet">
            <div className="!flex-grow-[2] self-start">
              <Heading headline={t("sections.compliance.headline")} />
              <ResponsiveBox responsiveStyles={COPY_OFFSET_STYLES}>
                <HtmlParser rawHtml={t.raw("sections.compliance.body")} />
              </ResponsiveBox>
            </div>
            <video style={VIDEO_STYLES} {...videoProps}>
              <source src={VIDEO_SOURCES.compliance} type="video/mp4" />
            </video>
          </Columns>
        </Section>
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={SECTION_OFFSET_STYLES}>
        <Section>
          <Columns
            space={20}
            stackColumnsAt="tablet"
            reverseColumnsWhenStacked={true}
          >
            <video style={VIDEO_STYLES} {...videoProps}>
              <source src={VIDEO_SOURCES.oneClickCommerce} type="video/mp4" />
            </video>
            <div className="!flex-grow-[2] self-start">
              <Heading headline={t("sections.oneClickCommerce.headline")} />
              <ResponsiveBox responsiveStyles={COPY_OFFSET_STYLES}>
                <HtmlParser rawHtml={t.raw("sections.oneClickCommerce.body")} />
              </ResponsiveBox>
            </div>
          </Columns>
        </Section>
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={SECTION_OFFSET_STYLES}>
        <Section>
          <Columns space={30} stackColumnsAt="tablet">
            <div className="!flex-grow-[2] self-start">
              <Heading headline={t("sections.feelessTransactions.headline")} />
              <ResponsiveBox responsiveStyles={COPY_OFFSET_STYLES}>
                <HtmlParser
                  rawHtml={t.raw("sections.feelessTransactions.body")}
                />
              </ResponsiveBox>
            </div>
            <video style={VIDEO_STYLES} {...videoProps}>
              <source
                src={VIDEO_SOURCES.feelessTransactions}
                type="video/mp4"
              />
            </video>
          </Columns>
        </Section>
      </ResponsiveBox>

      <ConversionPanel
        heading={t("conversionPanels.unrivaledSecurity.heading")}
        body={t("conversionPanels.unrivaledSecurity.body")}
        variant="inline-centered"
      />

      <Section>
        <Columns
          space={20}
          stackColumnsAt="tablet"
          reverseColumnsWhenStacked={true}
        >
          <video style={VIDEO_STYLES} {...videoProps}>
            <source src={VIDEO_SOURCES.keyManagement} type="video/mp4" />
          </video>
          <div className="!flex-grow-[2] self-start">
            <Heading headline={t("sections.keyManagement.headline")} />
            <ResponsiveBox responsiveStyles={COPY_OFFSET_STYLES}>
              <HtmlParser rawHtml={t.raw("sections.keyManagement.body")} />
            </ResponsiveBox>
          </div>
        </Columns>
      </Section>

      <ResponsiveBox responsiveStyles={SECTION_OFFSET_STYLES}>
        <Section>
          <Heading headline={t("sections.advancedMultisig.headline")} />
          <ResponsiveBox responsiveStyles={COPY_OFFSET_STYLES}>
            <HtmlParser rawHtml={t.raw("sections.advancedMultisig.body")} />
          </ResponsiveBox>
        </Section>
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={SECTION_OFFSET_STYLES}>
        <ConversionPanel
          heading={t("conversionPanels.poweredBySvm.heading")}
          body={t("conversionPanels.poweredBySvm.body")}
          variant="inline-centered"
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={SECTION_OFFSET_STYLES}>
        <Section>
          <HtmlParser rawHtml={t.raw("sections.svmBulletList.body")} />
        </Section>
      </ResponsiveBox>

      <Heading
        headline={t("sections.build.headline")}
        body={t("sections.build.body")}
      />
      <ResponsiveBox responsiveStyles={CARD_DECK_OFFSET_STYLES}>
        <CardDeck
          cards={buildCards as React.ComponentProps<typeof CardDeck>["cards"]}
          numCols={3}
        />
      </ResponsiveBox>

      <Heading
        headline={t("sections.buy.headline")}
        body={t("sections.buy.body")}
      />
      <ResponsiveBox responsiveStyles={CARD_DECK_OFFSET_STYLES}>
        <CardDeck
          cards={buyCards as React.ComponentProps<typeof CardDeck>["cards"]}
          numCols={3}
        />
      </ResponsiveBox>

      <ConversionPanel
        heading={t("conversionPanels.exploreOptions.heading")}
        body={t("conversionPanels.exploreOptions.body")}
        variant="centered"
        buttons={[
          compareWalletsButton as React.ComponentProps<
            typeof ConversionPanel
          >["buttons"][number],
        ]}
      />

      <Heading
        headline={t("sections.developerResources.headline")}
        body={t("sections.developerResources.body")}
      />
      <ResponsiveBox responsiveStyles={CARD_DECK_OFFSET_STYLES}>
        <CardDeck
          cards={
            developerCards as React.ComponentProps<typeof CardDeck>["cards"]
          }
          numCols={3}
        />
      </ResponsiveBox>

      <ConversionPanel
        heading={t("conversionPanels.applyForGrant.heading")}
        body={t("conversionPanels.applyForGrant.body")}
        buttons={[
          applyForGrantButton as React.ComponentProps<
            typeof ConversionPanel
          >["buttons"][number],
        ]}
      />
    </Layout>
  );
};

export default WalletsPage;

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
