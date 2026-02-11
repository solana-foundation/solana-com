import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import { Columns } from "@/component-library/columns";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import {
  CardDeck,
  ConversionPanel,
  Heading,
  RichTextStat,
  Section,
  Switchback,
} from "@solana-foundation/solana-lib";
import {
  ADDITIONAL_CARD_DECK,
  CONVERSION_PANEL,
  ENERGY_CARD_DECK,
  ENERGY_SWITCHBACK,
  HERO_SWITCHBACK,
  META,
  PERFORMANCE_CARD_DECK,
  PERFORMANCE_SWITCHBACK,
  VALIDATOR_CARD_DECK,
  VALIDATOR_SWITCHBACK,
} from "@/data/research";

const ResearchPage = () => {
  const t = useTranslations("research");

  const heroButtons = HERO_SWITCHBACK.buttons.map((button, index) => ({
    ...button,
    label: t(`hero.buttons.${index}`),
  }));

  const validatorButtons = VALIDATOR_SWITCHBACK.buttons.map((button) => ({
    ...button,
    label: t("sections.validator.buttonLabel"),
  }));

  const energyButtons = ENERGY_SWITCHBACK.buttons.map((button) => ({
    ...button,
    label: t("sections.energy.buttonLabel"),
  }));

  const performanceButtons = PERFORMANCE_SWITCHBACK.buttons.map((button) => ({
    ...button,
    label: t("sections.performance.buttonLabel"),
  }));

  const validatorStats = t.raw("sections.validator.stats") as {
    stat: string;
    description: string;
  }[];

  const energyStats = t.raw("sections.energy.stats") as {
    stat: string;
    description: string;
  }[];

  const performanceStats = t.raw("sections.performance.stats") as {
    stat: string;
    description: string;
  }[];

  const validatorCardText = t.raw("cardDecks.validator.cards") as {
    eyebrow: string;
    heading: string;
    body: string;
    ctaLabel: string;
  }[];

  const validatorCards = VALIDATOR_CARD_DECK.cards.map((card, index) => ({
    ...card,
    eyebrow: validatorCardText[index]?.eyebrow ?? "",
    heading: validatorCardText[index]?.heading ?? "",
    body: validatorCardText[index]?.body ?? "",
    callToAction: {
      ...card.callToAction,
      label: validatorCardText[index]?.ctaLabel ?? "",
    },
  }));

  const energyCardText = t.raw("cardDecks.energy.cards") as {
    eyebrow: string;
    heading: string;
    body: string;
    ctaLabel: string;
  }[];

  const energyCards = ENERGY_CARD_DECK.cards.map((card, index) => ({
    ...card,
    eyebrow: energyCardText[index]?.eyebrow ?? "",
    heading: energyCardText[index]?.heading ?? "",
    body: energyCardText[index]?.body ?? "",
    callToAction: {
      ...card.callToAction,
      label: energyCardText[index]?.ctaLabel ?? "",
    },
  }));

  const performanceCardText = t.raw("cardDecks.performance.cards") as {
    eyebrow: string;
    heading: string;
    body: string;
    ctaLabel: string;
  }[];

  const performanceCards = PERFORMANCE_CARD_DECK.cards.map((card, index) => ({
    ...card,
    eyebrow: performanceCardText[index]?.eyebrow ?? "",
    heading: performanceCardText[index]?.heading ?? "",
    body: performanceCardText[index]?.body ?? "",
    callToAction: {
      ...card.callToAction,
      label: performanceCardText[index]?.ctaLabel ?? "",
    },
  }));

  const additionalCardText = t.raw("cardDecks.additional.cards") as {
    eyebrow: string;
    heading: string;
    ctaLabel: string;
  }[];

  const additionalCards = ADDITIONAL_CARD_DECK.cards.map((card, index) => ({
    ...card,
    eyebrow: additionalCardText[index]?.eyebrow ?? "",
    heading: additionalCardText[index]?.heading ?? "",
    callToAction: {
      ...card.callToAction,
      label: additionalCardText[index]?.ctaLabel ?? "",
    },
  }));

  const conversionButtons = CONVERSION_PANEL.buttons.map((button, index) => ({
    ...button,
    label: t(`conversionPanel.buttons.${index}`),
  }));

  return (
    <Layout>
      <HTMLHead
        title={t("meta.seoTitle")}
        description={t("meta.seoDescription")}
        socialShare={META.seoImage}
      />

      <Switchback
        assetSide={HERO_SWITCHBACK.assetSide as "left" | "right"}
        image={HERO_SWITCHBACK.image}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
        buttons={
          heroButtons as React.ComponentProps<typeof Switchback>["buttons"]
        }
        placeholder={HERO_SWITCHBACK.placeholder}
        emailError={HERO_SWITCHBACK.emailError}
        submitError={HERO_SWITCHBACK.submitError}
        successMessage={HERO_SWITCHBACK.successMessage}
      />

      <Section className="tw-max-w-screen-xl tw-mx-auto">
        <Columns space={30} stackColumnsAt="tablet">
          <Switchback
            assetSide={VALIDATOR_SWITCHBACK.assetSide as "left" | "right"}
            headline={t("sections.validator.headline")}
            body={t.raw("sections.validator.body")}
            buttons={
              validatorButtons as React.ComponentProps<
                typeof Switchback
              >["buttons"]
            }
            placeholder={VALIDATOR_SWITCHBACK.placeholder}
            emailError={VALIDATOR_SWITCHBACK.emailError}
            submitError={VALIDATOR_SWITCHBACK.submitError}
            successMessage={VALIDATOR_SWITCHBACK.successMessage}
          />
          <RichTextStat stats={validatorStats} />
        </Columns>
      </Section>

      <CardDeck
        featured={VALIDATOR_CARD_DECK.featured}
        cards={validatorCards as React.ComponentProps<typeof CardDeck>["cards"]}
        numCols={
          VALIDATOR_CARD_DECK.numCols as React.ComponentProps<
            typeof CardDeck
          >["numCols"]
        }
      />

      <Section className="tw-max-w-screen-xl tw-mx-auto">
        <Columns space={30} stackColumnsAt="tablet">
          <RichTextStat stats={energyStats} />
          <Switchback
            assetSide={ENERGY_SWITCHBACK.assetSide as "left" | "right"}
            headline={t("sections.energy.headline")}
            body={t.raw("sections.energy.body")}
            buttons={
              energyButtons as React.ComponentProps<
                typeof Switchback
              >["buttons"]
            }
            placeholder={ENERGY_SWITCHBACK.placeholder}
            emailError={ENERGY_SWITCHBACK.emailError}
            submitError={ENERGY_SWITCHBACK.submitError}
            successMessage={ENERGY_SWITCHBACK.successMessage}
          />
        </Columns>
      </Section>

      <CardDeck
        featured={ENERGY_CARD_DECK.featured}
        cards={energyCards as React.ComponentProps<typeof CardDeck>["cards"]}
        numCols={
          ENERGY_CARD_DECK.numCols as React.ComponentProps<
            typeof CardDeck
          >["numCols"]
        }
      />

      <Section className="tw-max-w-screen-xl tw-mx-auto">
        <Columns space={30} stackColumnsAt="tablet">
          <Switchback
            assetSide={PERFORMANCE_SWITCHBACK.assetSide as "left" | "right"}
            headline={t("sections.performance.headline")}
            body={t.raw("sections.performance.body")}
            buttons={
              performanceButtons as React.ComponentProps<
                typeof Switchback
              >["buttons"]
            }
            placeholder={PERFORMANCE_SWITCHBACK.placeholder}
            emailError={PERFORMANCE_SWITCHBACK.emailError}
            submitError={PERFORMANCE_SWITCHBACK.submitError}
            successMessage={PERFORMANCE_SWITCHBACK.successMessage}
          />
          <RichTextStat stats={performanceStats} />
        </Columns>
      </Section>

      <CardDeck
        featured={PERFORMANCE_CARD_DECK.featured}
        cards={
          performanceCards as React.ComponentProps<typeof CardDeck>["cards"]
        }
        numCols={
          PERFORMANCE_CARD_DECK.numCols as React.ComponentProps<
            typeof CardDeck
          >["numCols"]
        }
      />

      <Heading
        eyebrow={t("additionalResearch.eyebrow")}
        headline={t("additionalResearch.headline")}
        body={t("additionalResearch.body")}
      />

      <CardDeck
        cards={
          additionalCards as React.ComponentProps<typeof CardDeck>["cards"]
        }
        numCols={
          ADDITIONAL_CARD_DECK.numCols as React.ComponentProps<
            typeof CardDeck
          >["numCols"]
        }
      />

      <ConversionPanel
        variant={CONVERSION_PANEL.variant as "centered"}
        heading={t("conversionPanel.heading")}
        body={t("conversionPanel.body")}
        buttons={conversionButtons as any}
      />
    </Layout>
  );
};

export default ResearchPage;

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
