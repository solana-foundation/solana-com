import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import {
  Hero,
  Heading,
  Section,
  Trustbar,
  Switchback,
  Slider,
  ConversionPanel,
  Accordion,
  FeatureHighlight,
  HtmlParser,
} from "@solana-foundation/solana-lib";
import { ResponsiveBox } from "@/component-library/responsive-box";
import { Columns } from "@/component-library/columns";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  META,
  HERO_IMAGE,
  MEET_USERS_IMAGE,
  SWITCHBACK_IMAGE,
  TRUSTBAR_LOGOS,
  SLIDER_IMAGES,
  CONVERSION_PANEL_LOGOS,
  VIDEO_SOURCE,
} from "@/data/solutions/actions";

const ActionsPage = () => {
  const t = useTranslations("actions-solution");

  const sliderCards = SLIDER_IMAGES.map((src, i) => ({
    image: {
      alt: t(`sliderCards.${i}.title`),
      src,
    },
    button: {
      label: t("buttons.moreFromDialect"),
      hierarchy: "outline" as const,
      url: "https://dialect.to",
      size: "sm" as const,
      endIcon: "arrow-up-right" as const,
    },
    title: t(`sliderCards.${i}.title`),
    body: "",
    url: "",
  }));

  const featureHighlightCards = [0, 1, 2, 3].map((i) => ({
    stat: {
      stat: "3,751",
      description: t(`featureHighlight.cards.${i}.stat.description`),
      value: {
        statType: "none" as const,
        dynamicValueSource: "Explorer API",
        dynamicValueEndpoint: "Transactions per second",
        staticValue:
          i === 0
            ? undefined
            : t.raw(`featureHighlight.cards.${i}.stat.staticValue`),
      },
    },
    button: { label: "" },
    feature: t(`featureHighlight.cards.${i}.feature`),
    body: t(`featureHighlight.cards.${i}.body`),
    eyebrow: "",
    color: (["aqua", "orange", "purple", "green"] as const)[i],
  }));

  const faqItems = Array.from({ length: 12 }, (_, i) => ({
    title: t(`faq.${i}.title`),
    body: t.raw(`faq.${i}.body`),
  }));

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
        image={{
          alt: t("hero.headline"),
          src: HERO_IMAGE,
        }}
        newsLetter={false}
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
        buttons={[
          {
            hierarchy: "purpleGradient",
            size: "lg",
            iconSize: "md",
            label: t("buttons.startBuilding"),
            url: "https://solana.com/docs/advanced/actions",
          },
        ]}
      />

      <ResponsiveBox responsiveStyles={{ large: { marginBottom: "-100px" } }}>
        <Heading
          eyebrow={t("headings.featuredAction.eyebrow")}
          headline={t("headings.featuredAction.headline")}
        />
      </ResponsiveBox>

      <ResponsiveBox
        responsiveStyles={{
          large: {
            position: "relative",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingTop: "20px",
            paddingBottom: "20px",
            marginTop: "0px",
            minHeight: "100px",
          },
        }}
      >
        <Section>
          <Columns
            space={50}
            stackColumnsAt="tablet"
            reverseColumnsWhenStacked={false}
          >
            <video autoPlay muted loop controls width="575" height="325">
              <source src={VIDEO_SOURCE} type="video/mp4" />
            </video>
            <div className="tw-html_parser">
              {t("content.blinksDescription")}
            </div>
          </Columns>
        </Section>
      </ResponsiveBox>

      <Section className="text-center">
        <div className="tw-html_parser">
          <h2>{t("headings.meetUsers")}</h2>
        </div>
        <ResponsiveBox
          responsiveStyles={{
            small: {
              display: "flex",
              flexDirection: "column",
              position: "relative",
              flexShrink: 0,
              width: "100%",
              minHeight: "20px",
              minWidth: "20px",
              overflow: "hidden",
              marginTop: "-50px",
              marginBottom: "-25px",
            },
            large: {
              display: "flex",
              flexDirection: "column",
              position: "relative",
              flexShrink: 0,
              width: "100%",
              minHeight: "20px",
              minWidth: "20px",
              overflow: "hidden",
              marginTop: "-225px",
              marginBottom: "-200px",
              zIndex: -1,
            },
          }}
        >
          <Image
            src={MEET_USERS_IMAGE}
            width={1500}
            height={1500}
            sizes="(max-width: 998px) 96vw, 87vw"
            alt={t("headings.meetUsers")}
            style={{ objectFit: "cover", width: "100%" }}
            loading="eager"
          />
        </ResponsiveBox>
        <HtmlParser rawHtml={t.raw("content.meetUsersCaption")} />
      </Section>

      <ResponsiveBox responsiveStyles={{ large: { marginTop: "-100px" } }}>
        <Trustbar
          variant="grid"
          logos={TRUSTBAR_LOGOS}
          eyebrow={t("trustbar.eyebrow")}
        />
      </ResponsiveBox>

      <Switchback
        assetSide="right"
        image={{
          alt: t("switchback.dialect.headline"),
          src: SWITCHBACK_IMAGE,
        }}
        headline={t("switchback.dialect.headline")}
        body={t.raw("switchback.dialect.body")}
        buttons={[
          {
            hierarchy: "outline",
            size: "md",
            iconSize: "md",
            label: t("buttons.developerDashboard"),
            endIcon: "arrow-up-right",
            url: "https://dashboard.dialect.to",
          },
          {
            hierarchy: "outline",
            size: "md",
            iconSize: "md",
            label: t("buttons.dialectDocs"),
            endIcon: "arrow-up-right",
            url: "https://docs.dialect.to/",
          },
        ]}
      />

      <div className="tw-html_parser" style={{ textAlign: "center" }}>
        <em>{t("content.interfaceNote")}</em>
      </div>

      <ResponsiveBox
        responsiveStyles={{
          large: {
            paddingLeft: "20px",
            paddingRight: "20px",
            marginTop: "20px",
            minHeight: "100px",
            marginBottom: "-100px",
          },
        }}
      >
        <Section>
          <div className="tw-html_parser" style={{ textAlign: "center" }}>
            <h2>{t("headings.withActions")}</h2>
          </div>
        </Section>
      </ResponsiveBox>

      <Slider cards={sliderCards} />

      <ConversionPanel
        logos={CONVERSION_PANEL_LOGOS}
        heading={t("conversionPanel.grants.heading")}
        body={t("conversionPanel.grants.body")}
        variant="centered"
        buttons={[
          {
            hierarchy: "outline",
            size: "md",
            iconSize: "md",
            label: t("buttons.makeProposal"),
            url: "https://share.hsforms.com/1GE1hYdApQGaDiCgaiWMXHA5lohw",
          },
          {
            hierarchy: "outline",
            size: "md",
            iconSize: "md",
            label: t("buttons.applyMicrogrant"),
            url: "https://earn.superteam.fun/grants/blink-grants/",
            endIcon: "arrow-up-right",
          },
        ]}
        showLogos
      />

      <ResponsiveBox responsiveStyles={{ large: { minHeight: "100px" } }}>
        <Accordion
          accordions={faqItems}
          headline={t("accordion.headline")}
          eyebrow={t("accordion.eyebrow")}
        />
      </ResponsiveBox>

      <ResponsiveBox
        responsiveStyles={{
          large: {
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingTop: "20px",
            paddingBottom: "20px",
            marginTop: "0px",
            minHeight: "100px",
          },
        }}
      >
        <FeatureHighlight
          cards={featureHighlightCards}
          headline={t("headings.aboutSolana.headline")}
          body={t("headings.aboutSolana.body")}
          dynamicDataFootnote="Live data"
          headingAs="h3"
          valueOf={null}
        />
      </ResponsiveBox>
    </Layout>
  );
};

export default ActionsPage;

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
