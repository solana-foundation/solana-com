"use client";

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
import { useTranslations } from "next-intl";
import {
  HERO_IMAGE,
  SWITCHBACK_IMAGES,
  CARD_IMAGES,
  CARD_URLS,
} from "@/data/solutions/token-extensions";

export function SolutionsTokenExtensionsPage() {
  const t = useTranslations("token-extensions-solution");

  const faqItems = Array.from({ length: 12 }, (_, i) => ({
    title: t(`faq.${i}.title`),
    body: t.raw(`faq.${i}.body`),
  }));

  return (
    <>
      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        buttons={[
          {
            hierarchy: "primary",
            size: "lg",
            iconSize: "md",
            label: t("buttons.startBuilding"),
            url: "https://solana.com/developers/guides/token-extensions/getting-started",
          },
        ]}
        image={{
          src: HERO_IMAGE,
          alt: t("hero.headline"),
        }}
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
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
              label={t("buttons.startBuilding")}
              hierarchy="outline"
              size="lg"
              iconSize="md"
              url="https://solana.com/developers/guides/token-extensions/getting-started"
            />
            <Button
              key="get-in-touch"
              label={t("buttons.getInTouch")}
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
          heading={t("conversionPanel.technicalPaper.heading")}
          variant="inline-centered"
          buttons={[
            {
              label: t("buttons.read"),
              hierarchy: "secondary",
              size: "md",
              iconSize: "md",
              url: "https://solana.com/solana_token_extensions_paper",
            },
          ]}
          body={t("conversionPanel.technicalPaper.body")}
        />
      </Columns>

      <Section>
        <YoutubeVideo url="https://www.youtube.com/watch?v=CEuKahqOYbs" />
      </Section>

      <Heading variant="centered" headline={t("headings.features")} />

      <SwitchbackChain
        hideBackground={true}
        switchbacks={[
          {
            assetSide: "right",
            image: {
              src: SWITCHBACK_IMAGES[0],
              alt: t("switchbacks.0.headline"),
            },
            headline: t("switchbacks.0.headline"),
            body: t.raw("switchbacks.0.body"),
            eyebrow: "",
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
          {
            assetSide: "right",
            image: {
              src: SWITCHBACK_IMAGES[1],
              alt: t("switchbacks.1.headline"),
            },
            body: t.raw("switchbacks.1.body"),
            headline: t("switchbacks.1.headline"),
            eyebrow: "",
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
          {
            assetSide: "right",
            image: {
              src: SWITCHBACK_IMAGES[2],
              alt: t("switchbacks.2.headline"),
            },
            headline: t("switchbacks.2.headline"),
            body: t.raw("switchbacks.2.body"),
            eyebrow: "",
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
          {
            assetSide: "right",
            image: {
              src: SWITCHBACK_IMAGES[3],
              alt: t("switchbacks.3.headline"),
            },
            body: t.raw("switchbacks.3.body"),
            headline: t("switchbacks.3.headline"),
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
        <Heading headline={t("headings.digIn")} />
      </ResponsiveBox>

      <CardDeck
        cards={[
          {
            type: "image",
            backgroundImage: {
              src: CARD_IMAGES[0],
            },
            callToAction: {
              url: CARD_URLS[0],
              endIcon: "arrow-right",
              hierarchy: "outline",
              label: "",
            },
            headingAs: "h3",
            heading: t("cards.0.heading"),
          },
          {
            type: "image",
            backgroundImage: {
              src: CARD_IMAGES[1],
            },
            callToAction: {
              url: CARD_URLS[1],
              endIcon: "arrow-right",
              hierarchy: "outline",
            },
            headingAs: "h3",
            heading: t("cards.1.heading"),
          },
          {
            type: "image",
            backgroundImage: {
              src: CARD_IMAGES[2],
            },
            callToAction: {
              url: CARD_URLS[2],
              endIcon: "arrow-right",
              hierarchy: "outline",
            },
            headingAs: "h3",
            heading: t("cards.2.heading"),
          },
          {
            type: "image",
            backgroundImage: {
              src: CARD_IMAGES[3],
            },
            callToAction: {
              url: CARD_URLS[3],
              endIcon: "arrow-right",
              hierarchy: "outline",
            },
            headingAs: "h3",
            heading: t("cards.3.heading"),
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
            label: t("buttons.contactUs"),
            endIcon: "arrow-up-right",
          },
          {
            hierarchy: "outline",
            size: "lg",
            url: "https://solana.com/developers/guides/token-extensions/getting-started",
            label: t("buttons.seeDocs"),
          },
        ]}
        heading={t("conversionPanel.cta.heading")}
        body={t("conversionPanel.cta.body")}
      />

      <Accordion
        accordions={faqItems}
        headline={t("headings.faq.headline")}
        eyebrow={t("headings.faq.eyebrow")}
      />
    </>
  );
}
