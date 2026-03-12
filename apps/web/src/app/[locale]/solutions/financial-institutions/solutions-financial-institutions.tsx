"use client";

import { useTranslations } from "next-intl";
import {
  CardDeck,
  Carousel,
  Heading,
  Hero,
  Section,
  Slider,
  SwitchbackChain,
  Trustbar,
} from "@solana-foundation/solana-lib";
import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  CAROUSEL,
  CAROUSEL_SLIDES,
  HERO_BUTTON,
  HERO_IMAGE,
  HERO_RIGHT_IMAGE,
  SLIDER_CARDS,
  SWITCHBACKS,
  TOOL_SPOTLIGHT_CARD,
  TRUSTBAR_LOGOS,
} from "@/data/solutions/financial-institutions";

export function SolutionsFinancialInstitutionsPage() {
  const t = useTranslations("financial-institutions-solution");

  const toolSpotlightCards = [
    {
      ...TOOL_SPOTLIGHT_CARD,
      eyebrow: t("cardDecks.toolSpotlight.eyebrow"),
      heading: t("cardDecks.toolSpotlight.heading"),
      body: t("cardDecks.toolSpotlight.body"),
      callToAction: {
        ...TOOL_SPOTLIGHT_CARD.callToAction,
        label: t("cardDecks.toolSpotlight.ctaLabel"),
      },
    },
  ];

  const sliderCards = SLIDER_CARDS.map((card, index) => ({
    ...card,
    title: t(`slider.cards.${index}.title`),
    body: t.raw(`slider.cards.${index}.body`),
    button: {
      ...card.button,
      label: t(`slider.cards.${index}.buttonLabel`),
    },
  }));

  const switchbacks = SWITCHBACKS.map((switchback, index) => ({
    assetSide: "right",
    image: {
      src: switchback.image,
      alt: t(`switchbacks.${index}.headline`),
    },
    eyebrow: "",
    headline: t(`switchbacks.${index}.headline`),
    body: t.raw(`switchbacks.${index}.body`),
    placeholder: "",
    emailError: "",
    submitError: "",
    successMessage: "",
    buttons: [
      {
        ...switchback.button,
        label: t(`switchbacks.${index}.buttonLabel`),
      },
    ],
  }));

  const carouselSlides = CAROUSEL_SLIDES.map((slide, index) => ({
    ...slide,
    image: {
      ...slide.image,
      alt: t(`carousel.slides.${index}.alt`),
    },
    label: t(`carousel.slides.${index}.label`),
    headline: t(`carousel.slides.${index}.headline`),
    body: t.raw(`carousel.slides.${index}.body`),
    button: {
      ...slide.button,
      label: t(`carousel.slides.${index}.buttonLabel`),
    },
  }));

  return (
    <>
      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
        buttons={
          [
            {
              ...HERO_BUTTON,
              label: t("buttons.connect"),
            },
          ] as React.ComponentProps<typeof Hero>["buttons"]
        }
        image={{
          alt: t("hero.headline"),
          src: HERO_IMAGE,
        }}
        rightImage={{
          alt: t("hero.headline"),
          src: HERO_RIGHT_IMAGE,
        }}
      />

      <Trustbar
        variant="grid"
        eyebrow={t("trustbar.eyebrow")}
        logos={TRUSTBAR_LOGOS as React.ComponentProps<typeof Trustbar>["logos"]}
      />

      <Heading
        eyebrow={t("headings.tools.eyebrow")}
        headline={t("headings.tools.headline")}
        body={t("headings.tools.body")}
      />

      <CardDeck
        cards={
          toolSpotlightCards as React.ComponentProps<typeof CardDeck>["cards"]
        }
      />

      <Slider cards={sliderCards} />

      <Heading
        variant="centered"
        eyebrow={t("headings.trusted.eyebrow")}
        headline={t("headings.trusted.headline")}
        body={t("headings.trusted.body")}
      />

      <SwitchbackChain
        hideBackground={true}
        switchbacks={
          switchbacks as React.ComponentProps<
            typeof SwitchbackChain
          >["switchbacks"]
        }
      />
      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-100px" },
          small: { marginBottom: "-45px" },
        }}
      >
        <Heading
          variant="centered"
          eyebrow={t("headings.worldsMostUsed.eyebrow")}
          headline={t("headings.worldsMostUsed.headline")}
          body={t("headings.worldsMostUsed.body")}
        />
      </ResponsiveBox>

      <Section>
        <Carousel
          autoplay={CAROUSEL.autoplay}
          autoplaySpeed={CAROUSEL.autoplaySpeed}
          slides={carouselSlides}
        />
      </Section>
    </>
  );
}
