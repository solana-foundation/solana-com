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
import Image from "next/image";
import {
  META,
  HERO,
  BUTTONS,
  HEADINGS,
  CONTENT,
  SWITCHBACK,
  CONVERSION_PANEL,
  SLIDER_CARDS,
  FEATURE_HIGHLIGHT,
  FAQ,
} from "@/data/solutions/actions";

const ActionsPage = () => {
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
        image={{
          alt: "",
          src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F9259fc4ba3594dcda2391ba6680446b7.png",
        }}
        newsLetter={false}
        eyebrow={HERO.eyebrow}
        headline={HERO.headline}
        body={HERO.body}
        buttons={[
          {
            hierarchy: "purpleGradient",
            size: "lg",
            iconSize: "md",
            label: BUTTONS.startBuilding,
            url: "https://solana.com/docs/advanced/actions",
          },
        ]}
      />

      <ResponsiveBox responsiveStyles={{ large: { marginBottom: "-100px" } }}>
        <Heading
          eyebrow={HEADINGS.featuredAction.eyebrow}
          headline={HEADINGS.featuredAction.headline}
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
              <source
                src="https://player.vimeo.com/progressive_redirect/playback/967239233/rendition/1080p/file.mp4?loc=external&signature=8bcd4ecdc41de4bfa3925a3692f01dc302dff9929b8132c36ffca1a3fff1f9b0"
                type="video/mp4"
              />
            </video>
            <div className="tw-html_parser">{CONTENT.blinksDescription}</div>
          </Columns>
        </Section>
      </ResponsiveBox>

      <Section className="text-center">
        <div className="tw-html_parser">
          <h2>{HEADINGS.meetUsers}</h2>
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
            medium: {
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
            src="/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F797611888ec2486d8cad973c054d1e70.png"
            width={1500}
            height={1500}
            sizes="(max-width: 998px) 96vw, 87vw"
            alt=""
            style={{ objectFit: "cover", width: "100%" }}
            loading="eager"
          />
        </ResponsiveBox>
        <HtmlParser rawHtml={CONTENT.meetUsersCaption} />
      </Section>

      <ResponsiveBox responsiveStyles={{ large: { marginTop: "-100px" } }}>
        <Trustbar
          variant="grid"
          logos={
            [
              {
                alt: "Access protocol",
                src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Ff24feae77403493d90609826fcf81437.png",
              },
              {
                alt: "Backpack",
                src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fc92e6e303f804f47b0332b97d3607b26.png",
              },
              {
                alt: "Genopets",
                src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F52200d569bd648b1aaf51cee933dcb28.png",
              },
              {
                alt: "Helium",
                src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fd9cf65c933fc45a081b25a4757e22d94.png",
              },
              {
                alt: "Helius",
                src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fc90433134fba44418dec87e644e6568e.png",
              },
              {
                alt: "Jupiter",
                src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fbcf8f3ef4068450b8a70dbebcdd56e4a.png",
              },
              {
                alt: "Meteora",
                src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Ffb3e0d3a36d4492fb61788f01bf428fe.png",
              },
              {
                alt: "Phantom",
                src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F1c6a92d5bc324859a61bdd6acb7185c4.png",
              },
              {
                alt: "Sanctum",
                src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F4f028f93c2584d0ea60b16a75400473d.png",
              },
            ] as { src: string; alt: string; url: string }[]
          }
          eyebrow="Plus more support from"
        />
      </ResponsiveBox>

      <Switchback
        assetSide="right"
        image={{
          alt: "",
          src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fb5f3fd2c0b4f4f9a9c22f71dba82560f.png",
        }}
        headline={SWITCHBACK.dialect.headline}
        body={SWITCHBACK.dialect.body}
        buttons={[
          {
            hierarchy: "outline",
            size: "md",
            iconSize: "md",
            label: BUTTONS.developerDashboard,
            endIcon: "arrow-up-right",
            url: "https://dashboard.dialect.to",
          },
          {
            hierarchy: "outline",
            size: "md",
            iconSize: "md",
            label: BUTTONS.dialectDocs,
            endIcon: "arrow-up-right",
            url: "https://docs.dialect.to/",
          },
        ]}
      />

      <div className="tw-html_parser" style={{ textAlign: "center" }}>
        <em>{CONTENT.interfaceNote}</em>
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
            <h2>{HEADINGS.withActions}</h2>
          </div>
        </Section>
      </ResponsiveBox>

      <Slider
        cards={SLIDER_CARDS.map((card, i) => ({
          image: {
            alt: "",
            src: `/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F${
              [
                "4c8f1f0f555e4c1ca8f7d5f86ad13d5c",
                "fc09e2ce4b1a4059b22c144f1a071de4",
                "47161c34d2b04f25aca2961505231909",
                "5cd936f2074b42a1913350cc8c97b9eb",
                "0bd981475b1848608afba5c49c3ca48a",
                "f873cab6d1d34e65be121662945e6976",
              ][i]
            }.png`,
          },
          button: {
            label: BUTTONS.moreFromDialect,
            hierarchy: "outline",
            url: "https://dialect.to",
            size: "sm",
            endIcon: "arrow-up-right",
          },
          title: card.title,
          body: "",
          url: "",
        }))}
      />

      <ConversionPanel
        logos={[
          {
            alt: "Solana Foundation",
            src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F59a40050d66345b48267bc0f5a9fa794.png",
          },
          {
            alt: "Solana Foundation",
            src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fcd7c1bc3c5434dceb68f8b7fbd3af1e3.png",
          },
          {
            alt: "Solana Foundation",
            src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F0c8e90abf02b48ff924327fa6b49b152.png",
          },
        ]}
        heading={CONVERSION_PANEL.grants.heading}
        body={CONVERSION_PANEL.grants.body}
        variant="centered"
        buttons={[
          {
            hierarchy: "outline",
            size: "md",
            iconSize: "md",
            label: BUTTONS.makeProposal,
            url: "https://share.hsforms.com/1GE1hYdApQGaDiCgaiWMXHA5lohw",
          },
          {
            hierarchy: "outline",
            size: "md",
            iconSize: "md",
            label: BUTTONS.applyMicrogrant,
            url: "https://earn.superteam.fun/grants/blink-grants/",
            endIcon: "arrow-up-right",
          },
        ]}
        showLogos
      />

      <ResponsiveBox responsiveStyles={{ large: { minHeight: "100px" } }}>
        <Accordion
          accordions={FAQ}
          headline="More About Blinks and Solana Actions"
          eyebrow="FAQ"
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
          cards={FEATURE_HIGHLIGHT.cards.map((card, i) => ({
            stat: {
              stat: "3,751",
              description: card.stat.description,
              value: {
                statType: "none",
                dynamicValueSource: "Explorer API",
                dynamicValueEndpoint: "Transactions per second",
                staticValue: card.stat.staticValue,
              },
            },
            button: { label: "" },
            feature: card.feature,
            body: card.body,
            eyebrow: "",
            // variant: "none",
            color: (["aqua", "orange", "purple", "green"] as const)[i],
          }))}
          headline={HEADINGS.aboutSolana.headline}
          body={HEADINGS.aboutSolana.body}
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
