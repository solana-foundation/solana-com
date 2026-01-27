import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import {
  Hero,
  Heading,
  CardDeck,
  ConversionPanel,
  SwitchbackChain,
  Section,
  Accordion,
  YoutubeVideo,
  Button,
} from "@solana-foundation/solana-lib";
import { ResponsiveBox } from "@/component-library/responsive-box";
import { Columns } from "@/component-library/columns";
import { withLocales } from "@workspace/i18n/routing";
import {
  META,
  HERO,
  BUTTONS,
  CONVERSION_PANEL,
  HEADINGS,
  SWITCHBACKS,
  CARDS,
  FAQ,
} from "@/data/solutions/token-extensions";

const TokenExtensionsPage = () => {
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
        buttons={[
          {
            hierarchy: "primary",
            size: "lg",
            iconSize: "md",
            label: BUTTONS.startBuilding,
            url: "https://solana.com/developers/guides/token-extensions/getting-started",
          },
        ]}
        image={{
          src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Ff51feece35094bfba4ab2931f16836c7.png",
          alt: "",
        }}
        eyebrow={HERO.eyebrow}
        headline={HERO.headline}
        body={HERO.body}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { display: "none" },
          medium: { display: "none" },
          small: { display: "flex", margin: "-45px 0" },
        }}
      >
        <Section>
          <Columns space={10} stackColumnsAt="tablet">
            <Button
              key="start-building"
              label={BUTTONS.startBuilding}
              hierarchy="outline"
              size="lg"
              iconSize="md"
              url="https://solana.com/developers/guides/token-extensions/getting-started"
            />
            <Button
              key="get-in-touch"
              label={BUTTONS.getInTouch}
              hierarchy="primary"
              size="lg"
              iconSize="md"
              url="https://solanafoundation.typeform.com/to/ST7YdGSz"
              endIcon="arrow-up-right"
            />
          </Columns>
        </Section>
      </ResponsiveBox>

      <Columns space={30} stackColumnsAt="tablet">
        <ConversionPanel
          heading={CONVERSION_PANEL.technicalPaper.heading}
          variant="inline-centered"
          buttons={[
            {
              label: BUTTONS.read,
              hierarchy: "secondary",
              size: "md",
              iconSize: "md",
              url: "https://solana.com/solana_token_extensions_paper",
            },
          ]}
          body={CONVERSION_PANEL.technicalPaper.body}
        />
      </Columns>

      <Section>
        <YoutubeVideo url="https://www.youtube.com/watch?v=CEuKahqOYbs" />
      </Section>

      <Heading variant="centered" headline={HEADINGS.features} />

      <SwitchbackChain
        hideBackground={true}
        switchbacks={[
          {
            assetSide: "right",
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F5cd3bb07d43b4c79835035667336c4d2.png",
              alt: "",
            },
            headline: SWITCHBACKS[0].headline,
            body: SWITCHBACKS[0].body,
            eyebrow: "",
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
          {
            assetSide: "right",
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F3388c28f6118426782e772cfe7cba06b.png",
              alt: "",
            },
            body: SWITCHBACKS[1].body,
            headline: SWITCHBACKS[1].headline,
            eyebrow: "",
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
          {
            assetSide: "right",
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F86e1ae95a87544e4afb5c6314b354212.png",
              alt: "",
            },
            headline: SWITCHBACKS[2].headline,
            body: SWITCHBACKS[2].body,
            eyebrow: "",
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
          {
            assetSide: "right",
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F6f4c84e65147435586996bbb18096018.png",
              alt: "",
            },
            body: SWITCHBACKS[3].body,
            headline: SWITCHBACKS[3].headline,
            eyebrow: "",
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
        ]}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-90px" },
          medium: { marginBottom: "-45px" },
        }}
      >
        <Heading headline={HEADINGS.digIn} />
      </ResponsiveBox>

      <CardDeck
        cards={[
          {
            type: "image",
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F9596760b143048b5a5c7630bf3e42382.png",
            },
            callToAction: {
              url: "https://solana.com/news/token-extensions-on-solana",
              endIcon: "arrow-right",
              hierarchy: "outline",
              label: "",
            },
            headingAs: "h3",
            heading: CARDS[0].heading,
          },
          {
            type: "image",
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F5cd3bb07d43b4c79835035667336c4d2.png",
            },
            callToAction: {
              url: "https://solana.com/news/token-extensions-developer-guide",
              endIcon: "arrow-right",
              hierarchy: "outline",
            },
            headingAs: "h3",
            heading: CARDS[1].heading,
          },
          {
            type: "image",
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F5cd3bb07d43b4c79835035667336c4d2.png",
            },
            callToAction: {
              url: "https://solana.com/developers/guides/token-extensions/getting-started",
              endIcon: "arrow-right",
              hierarchy: "outline",
            },
            headingAs: "h3",
            heading: CARDS[2].heading,
          },
          {
            type: "image",
            backgroundImage: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F5cd3bb07d43b4c79835035667336c4d2.png",
            },
            callToAction: {
              url: "https://www.youtube.com/playlist?list=PLilwLeBwGuK6imBuGLSLmzMEyj6yVHGDO",
              endIcon: "arrow-right",
              hierarchy: "outline",
            },
            headingAs: "h3",
            heading: CARDS[3].heading,
          },
        ]}
        featured={true}
        numCols={3}
      />

      <ConversionPanel
        variant="centered"
        buttons={[
          {
            hierarchy: "primary",
            size: "lg",
            url: "https://solanafoundation.typeform.com/to/ST7YdGSz",
            label: BUTTONS.contactUs,
            endIcon: "arrow-up-right",
          },
          {
            hierarchy: "outline",
            size: "lg",
            url: "https://solana.com/developers/guides/token-extensions/getting-started",
            label: BUTTONS.seeDocs,
          },
        ]}
        heading={CONVERSION_PANEL.cta.heading}
        body={CONVERSION_PANEL.cta.body}
      />

      <Accordion
        accordions={FAQ}
        headline={HEADINGS.faq.headline}
        eyebrow={HEADINGS.faq.eyebrow}
      />
    </Layout>
  );
};

export default TokenExtensionsPage;

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
