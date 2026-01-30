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
import { useTranslations } from "next-intl";
import {
  META,
  HERO_IMAGE,
  SWITCHBACK_IMAGE,
  CASE_STUDY_IMAGES,
  CARDS_CREATE_URLS,
  CARDS_EARN_URLS,
  CARDS_SHOWCASE_URLS,
  CARDS_CONNECT_URLS,
} from "@/data/solutions/artists-creators";

const ArtistsCreatorsPage = () => {
  const t = useTranslations("artists-creators-solution");
  const cardsCreate = CARDS_CREATE_URLS.map((url, index) => ({
    url,
    heading: t(`cardsCreate.${index}.heading`),
    body: t(`cardsCreate.${index}.body`),
  }));
  const cardsEarn = CARDS_EARN_URLS.map((url, index) => ({
    url,
    heading: t(`cardsEarn.${index}.heading`),
    body: t(`cardsEarn.${index}.body`),
  }));
  const cardsShowcase = CARDS_SHOWCASE_URLS.map((url, index) => ({
    url,
    heading: t(`cardsShowcase.${index}.heading`),
    body: t(`cardsShowcase.${index}.body`),
  }));
  const cardsConnect = CARDS_CONNECT_URLS.map((url, index) => ({
    url,
    heading: t(`cardsConnect.${index}.heading`),
    body: t(`cardsConnect.${index}.body`),
  }));
  const caseStudies = CASE_STUDY_IMAGES.map((src, index) => ({
    image: { src, alt: t(`caseStudies.${index}.headline`) },
    headline: t(`caseStudies.${index}.headline`),
    body: t.raw(`caseStudies.${index}.body`),
  }));

  return (
    <Layout>
      <HTMLHead
        title={t("meta.title")}
        description={t("meta.description")}
        socialShare={META.seoImage}
      />

      <Hero
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        headingAs="h1"
        body={t.raw("hero.body")}
        centered={false}
        newsLetter={false}
        image={{
          src: HERO_IMAGE,
          alt: t("hero.headline"),
        }}
        buttons={[
          {
            label: t("buttons.joinCommunity"),
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
                {t("statsText.subtitle")}
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
                dangerouslySetInnerHTML={{ __html: t.raw("statsText.metrics") }}
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
          headline={t("headings.create.headline")}
          body={t("headings.create.body")}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        cards={cardsCreate.map((card) => ({
          type: "gradient",
          callToAction: {
            hierarchy: "outline",
            url: card.url,
            label: t("buttons.learnMore"),
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
          headline={t("headings.earn.headline")}
          body={t("headings.earn.body")}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        cards={cardsEarn.map((card) => ({
          type: "gradient",
          callToAction: {
            hierarchy: "outline",
            url: card.url,
            label: t("buttons.learnMore"),
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
          headline={t("headings.showcase.headline")}
          body={t("headings.showcase.body")}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        cards={cardsShowcase.map((card) => ({
          type: "gradient",
          heading: card.heading,
          body: card.body,
          eyebrow: "",
          callToAction: {
            label: t("buttons.learnMore"),
            hierarchy: "outline",
            url: card.url,
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
          headline={t("headings.connect.headline")}
          body={t("headings.connect.body")}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        cards={cardsConnect.map((card) => ({
          type: "gradient",
          heading: card.heading,
          body: card.body,
          eyebrow: "",
          callToAction: {
            label: t("buttons.learnMore"),
            hierarchy: "outline",
            url: card.url,
          },
          backgroundGradient: "blue",
        }))}
        numCols={3}
      />

      <Switchback
        assetSide="right"
        image={{
          src: SWITCHBACK_IMAGE,
          alt: t("switchback.poweringCreators.headline"),
        }}
        eyebrow={t("switchback.poweringCreators.eyebrow")}
        headline={t("switchback.poweringCreators.headline")}
        body={t.raw("switchback.poweringCreators.body")}
      />

      <SwitchbackChain
        hideBackground={true}
        switchbacks={caseStudies.map((caseStudy, index) => ({
          assetSide: index % 2 === 0 ? "right" : "left",
          buttons: [
            {
              hierarchy: "primary",
              size: "md",
              url: [
                "/news/case-study-dialect",
                "https://blockworks.co/news/drip-haus-mass-adoption-strategy",
                "https://www.shilstonearts.com/offleash",
              ][index],
              label:
                index === 0
                  ? t("buttons.readCaseStudy")
                  : t("buttons.learnMore"),
            },
          ],
          image: caseStudy.image,
          eyebrow: "",
          headline: caseStudy.headline,
          body: caseStudy.body,
          placeholder: "",
          emailError: "",
          submitError: "",
          successMessage: "",
        }))}
      />

      <ConversionPanel
        heading={t("conversionPanel.heading")}
        buttons={[
          {
            label: t("buttons.getInTouch"),
            hierarchy: "secondary",
            size: "lg",
            url: "mailto:bd-social@solana.org",
          },
          {
            label: t("buttons.seeCaseStudies"),
            hierarchy: "outline",
            size: "lg",
            url: "/news/tag/case-studies",
          },
        ]}
        body={t("conversionPanel.body")}
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
