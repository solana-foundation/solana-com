import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import { ResponsiveBox } from "@/component-library/responsive-box";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import {
  CardDeck,
  Heading,
  Hero,
  Section,
  Slider,
} from "@solana-foundation/solana-lib";
import {
  HERO_BUTTONS,
  META,
  PRIMARY_CARD_DECK_CARDS,
  PRIMARY_CARD_DECK_COLUMNS,
  SECONDARY_CARD_DECK_CARDS,
  SECONDARY_CARD_DECK_COLUMNS,
  SLIDER_CARDS,
} from "@/data/pyusd";

const PyusdPage = () => {
  const t = useTranslations("pyusd");

  const heroButtons = HERO_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`hero.buttons.${index}`),
  }));

  const primaryCardText = t.raw("primaryCardDeck.cards") as {
    eyebrow: string;
    heading: string;
    body: string;
    ctaLabel: string;
  }[];

  const primaryCards = PRIMARY_CARD_DECK_CARDS.map((card, index) => ({
    ...card,
    eyebrow: primaryCardText[index]?.eyebrow ?? "",
    heading: primaryCardText[index]?.heading ?? "",
    body: primaryCardText[index]?.body ?? "",
    callToAction: {
      ...card.callToAction,
      label: primaryCardText[index]?.ctaLabel ?? "",
    },
  }));

  const sliderText = t.raw("slider.cards") as {
    title: string;
    body: string;
    ctaLabel: string;
  }[];

  const sliderCards = SLIDER_CARDS.map((card, index) => ({
    ...card,
    title: sliderText[index]?.title ?? "",
    body: sliderText[index]?.body ?? "",
    button: {
      ...card.button,
      label: sliderText[index]?.ctaLabel ?? "",
    },
  }));

  const secondaryCardText = t.raw("secondaryCardDeck.cards") as {
    heading: string;
    ctaLabel: string;
  }[];

  const secondaryCards = SECONDARY_CARD_DECK_CARDS.map((card, index) => ({
    ...card,
    heading: secondaryCardText[index]?.heading ?? "",
    callToAction: {
      ...card.callToAction,
      label: secondaryCardText[index]?.ctaLabel ?? "",
    },
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
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
        buttons={heroButtons as React.ComponentProps<typeof Hero>["buttons"]}
      />

      <CardDeck
        featured={true}
        cards={primaryCards as React.ComponentProps<typeof CardDeck>["cards"]}
        numCols={PRIMARY_CARD_DECK_COLUMNS}
      />

      <Slider
        cards={sliderCards as React.ComponentProps<typeof Slider>["cards"]}
      />

      <Section>
        <ResponsiveBox
          responsiveStyles={{
            large: { marginBottom: "-90px" },
            medium: { marginBottom: "-45px" },
          }}
        >
          <Heading
            eyebrow={t("learnSection.eyebrow")}
            headline={t("learnSection.headline")}
            body={t("learnSection.body")}
          />
        </ResponsiveBox>

        <CardDeck
          featured={true}
          cards={
            secondaryCards as React.ComponentProps<typeof CardDeck>["cards"]
          }
          numCols={SECONDARY_CARD_DECK_COLUMNS}
        />
      </Section>
    </Layout>
  );
};

export default PyusdPage;

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
