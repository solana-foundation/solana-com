import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import {
  Hero,
  Heading,
  Section,
  CardDeck,
  Switchback,
  SwitchbackChain,
  ConversionPanel,
  YoutubeVideo,
} from "@solana-foundation/solana-lib";
import { ResponsiveBox } from "@/component-library/responsive-box";
import { Columns } from "@/component-library/columns";
import { withLocales } from "@workspace/i18n/routing";
import {
  META,
  HERO,
  BUTTONS,
  STATS_TEXT,
  HEADINGS,
  SWITCHBACK,
  CASE_STUDIES,
  CARDS_CREATE,
  CARDS_EARN,
  CARDS_SHOWCASE,
  CARDS_CONNECT,
  CONVERSION_PANEL,
} from "@/data/solutions/artists-creators";

const ArtistsCreatorsPage = () => {
  return (
    <Layout>
      <HTMLHead
        title={META.seoTitle}
        description={META.seoDescription}
        socialShare={META.seoImage}
      />

      <Hero
        eyebrow={HERO.eyebrow}
        headline={HERO.headline}
        headingAs="h1"
        body={HERO.body}
        centered={false}
        newsLetter={false}
        image={{
          src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F660c4c99d1c045b2b473ddd5688bb9f2.png",
        }}
        buttons={[
          {
            label: BUTTONS.joinCommunity,
            hierarchy: "primary",
            size: "lg",
            url: "/solutions/artists-creators/?modalLaunch=true&modalLaunchId=artistAndCreatorsNewsletter",
          },
        ]}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: {
            textAlign: "center",
            fontSize: "2.625rem",
            letterSpacing: "-.02em",
            lineHeight: "2.875rem",
          },
          small: {
            textAlign: "left",
            fontSize: "1.5rem",
            lineHeight: "1.75rem",
          },
        }}
      >
        <Section>
          <div className="tw-html_parser" style={{ textWrap: "balance" }}>
            <div>
              <h2
                style={{
                  color: "#c4c4c4",
                  fontWeight: 300,
                  fontSize: "inherit",
                  lineHeight: "inherit",
                }}
              >
                {STATS_TEXT.subtitle}
              </h2>
              <p
                style={{
                  color: "#fff",
                  fontWeight: 700,
                  lineHeight: 1.25,
                  fontSize: "1.75rem",
                  textTransform: "uppercase",
                  margin: 0,
                }}
                dangerouslySetInnerHTML={{ __html: STATS_TEXT.metrics }}
              />
            </div>
          </div>
        </Section>
      </ResponsiveBox>

      <Section>
        <Columns
          space={20}
          stackColumnsAt="tablet"
          reverseColumnsWhenStacked={false}
        >
          <YoutubeVideo url="https://www.youtube.com/watch?v=HssYExTzoUs" />
          <YoutubeVideo url="https://www.youtube.com/watch?v=YHilyEoAPgI" />
        </Columns>
        <Columns
          space={20}
          stackColumnsAt="tablet"
          reverseColumnsWhenStacked={false}
        >
          <YoutubeVideo url="https://www.youtube.com/watch?v=pZ1q-ZG8Z-U" />
          <YoutubeVideo url="https://www.youtube.com/watch?v=FYL4cZruID4" />
        </Columns>
      </Section>

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-120px" },
          medium: { marginBottom: "-45px" },
        }}
      >
        <Heading
          headline={HEADINGS.create.headline}
          body={HEADINGS.create.body}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        cards={CARDS_CREATE.map((card) => ({
          type: "gradient",
          callToAction: {
            hierarchy: "outline",
            url: [
              "https://magiceden.io/",
              "https://studio.metaplex.com/",
              "https://www.underdogprotocol.com/",
              "https://www.solemna.com/",
              "https://primitives.xyz/landing",
              "https://www.ovols.com/creatorx/",
            ][CARDS_CREATE.indexOf(card)],
            label: BUTTONS.learnMore,
          },
          isFeatured: false,
          backgroundGradient: "purple",
          body: card.body,
          heading: card.heading,
          eyebrow: "",
        }))}
        numCols={3}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-120px" },
          medium: { marginBottom: "-45px" },
        }}
      >
        <Heading
          headline={HEADINGS.earn.headline}
          body={HEADINGS.earn.body}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        cards={CARDS_EARN.map((card) => ({
          type: "gradient",
          callToAction: {
            hierarchy: "outline",
            url: [
              "https://hub.accessprotocol.co/creators",
              "https://drip.haus/",
              "https://helio.co/nfts/",
              "https://tiplink.io/",
              "https://royalties.metaplex.com/",
            ][CARDS_EARN.indexOf(card)],
            label: BUTTONS.learnMore,
          },
          backgroundGradient: "green",
          body: card.body,
          heading: card.heading,
          eyebrow: "",
        }))}
        numCols={3}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-120px" },
          medium: { marginBottom: "-45px" },
        }}
      >
        <Heading
          headline={HEADINGS.showcase.headline}
          body={HEADINGS.showcase.body}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        cards={CARDS_SHOWCASE.map((card) => ({
          type: "gradient",
          heading: card.heading,
          body: card.body,
          eyebrow: "",
          callToAction: {
            label: BUTTONS.learnMore,
            hierarchy: "outline",
            url: [
              "https://exchange.art/",
              "https://www.mallow.art/",
              "https://fostermarketplace.app/",
              "https://magiceden.io/",
              "https://primitives.xyz/landing",
              "https://www.tensor.trade/",
              "https://radius.art/",
            ][CARDS_SHOWCASE.indexOf(card)],
          },
          backgroundGradient: "pink",
        }))}
        numCols={3}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-120px" },
          medium: { marginBottom: "-45px" },
        }}
      >
        <Heading
          headline={HEADINGS.connect.headline}
          body={HEADINGS.connect.body}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        cards={CARDS_CONNECT.map((card) => ({
          type: "gradient",
          heading: card.heading,
          body: card.body,
          eyebrow: "",
          callToAction: {
            label: BUTTONS.learnMore,
            hierarchy: "outline",
            url: [
              "https://3.land/",
              "https://grapes.network/",
              "https://matrica.io/",
              "https://www.dialect.to/",
            ][CARDS_CONNECT.indexOf(card)],
          },
          backgroundGradient: "blue",
        }))}
        numCols={3}
      />

      <Switchback
        assetSide="right"
        image={{
          src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F096a261cde734342950c77bb6cf3daef.png",
          alt: "",
        }}
        eyebrow={SWITCHBACK.poweringCreators.eyebrow}
        headline={SWITCHBACK.poweringCreators.headline}
        body={SWITCHBACK.poweringCreators.body}
      />

      <SwitchbackChain
        hideBackground={true}
        switchbacks={[
          {
            assetSide: "right",
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "/news/case-study-dialect",
                label: BUTTONS.readCaseStudy,
              },
            ],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fc8f7cec94aaf4b928e5be1b5494ffbae.png",
              alt: "",
            },
            eyebrow: "",
            headline: CASE_STUDIES[0].headline,
            body: CASE_STUDIES[0].body,
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
          {
            assetSide: "left",
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "https://blockworks.co/news/drip-haus-mass-adoption-strategy",
                label: BUTTONS.learnMore,
              },
            ],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fc311dd7a1b4b4e40ad6932008fbfcd8d.png",
              alt: "",
            },
            eyebrow: "",
            headline: CASE_STUDIES[1].headline,
            body: CASE_STUDIES[1].body,
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
          {
            assetSide: "right",
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "https://www.shilstonearts.com/offleash",
                label: BUTTONS.learnMore,
              },
            ],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Ffc485fa267294967b6c0be1f31738147.png",
              alt: "",
            },
            eyebrow: "",
            headline: CASE_STUDIES[2].headline,
            body: CASE_STUDIES[2].body,
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
        ]}
      />

      <ConversionPanel
        heading={CONVERSION_PANEL.cta.heading}
        buttons={[
          {
            label: BUTTONS.getInTouch,
            hierarchy: "secondary",
            size: "lg",
            url: "mailto:bd-social@solana.org",
          },
          {
            label: BUTTONS.seeCaseStudies,
            hierarchy: "outline",
            size: "lg",
            url: "/news/tag/case-studies",
          },
        ]}
        body={CONVERSION_PANEL.cta.body}
      />
    </Layout>
  );
};

export default ArtistsCreatorsPage;

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
