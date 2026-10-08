"use client";

import { ResponsiveBox } from "@/component-library/responsive-box";
import { legacyLandingTheme } from "@/components/legacy-landing-theme";
import {
  CardDeck,
  CommunityGallery,
  ConversionPanel,
  Heading,
  Hero,
  Switchback,
} from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  requiredCardContent,
  requiredTranslatedLabel,
} from "@/lib/required-card-content";
import {
  CARD_DECK_CARDS,
  CARD_DECK_COLUMNS,
  COMMUNITY_GALLERY_CARDS,
  COMMUNITY_GALLERY_CONFIG,
  CONVERSION_PANEL_COMMUNITY,
  CONVERSION_PANEL_PRIMARY,
  HERO_BUTTONS,
  HERO_IMAGE,
  SWITCHBACK_BUTTONS,
  SWITCHBACK_IMAGE,
} from "@/data/developers/defi";

export function DevelopersDefiPage() {
  const t = useTranslations("developers-defi");

  const heroButtonLabels = t.raw("hero.buttons");
  const heroButtons = HERO_BUTTONS.map(({ id, ...button }) => ({
    ...button,
    label: requiredTranslatedLabel(
      heroButtonLabels,
      id,
      "developers-defi.hero.buttons",
    ),
  }));

  const switchbackButtonLabels = t.raw("switchback.buttons");
  const switchbackButtons = SWITCHBACK_BUTTONS.map(({ id, ...button }) => ({
    ...button,
    label: requiredTranslatedLabel(
      switchbackButtonLabels,
      id,
      "developers-defi.switchback.buttons",
    ),
  }));

  const cardDeckText = t.raw("cardDeck.cards");
  const cardDeckCards = CARD_DECK_CARDS.map(({ id, ...card }) => {
    const content = requiredCardContent(
      cardDeckText,
      id,
      ["eyebrow", "heading", "ctaLabel"],
      "developers-defi.cardDeck.cards",
    );
    return {
      ...card,
      eyebrow: content.eyebrow,
      heading: content.heading,
      callToAction: { ...card.callToAction, label: content.ctaLabel },
    };
  });

  const communityGalleryText = t.raw("communityGallery.cards");
  const communityGalleryCards = COMMUNITY_GALLERY_CARDS.map(
    ({ id, ...card }) => {
      const content =
        id === "projectCount"
          ? requiredCardContent(
              communityGalleryText,
              id,
              ["eyebrow", "stat", "buttonLabel"],
              "developers-defi.communityGallery.cards",
            )
          : requiredCardContent(
              communityGalleryText,
              id,
              ["heading", "body", "buttonLabel"],
              "developers-defi.communityGallery.cards",
            );

      return {
        ...card,
        eyebrow: "eyebrow" in content ? content.eyebrow : undefined,
        heading: "heading" in content ? content.heading : undefined,
        body: "body" in content ? content.body : undefined,
        stat: "stat" in content ? content.stat : undefined,
        button: card.button
          ? {
              ...card.button,
              label: content.buttonLabel,
            }
          : undefined,
      };
    },
  );

  const conversionButtonLabels = t.raw("conversionPanel.buttons");
  const conversionPanelButtons = CONVERSION_PANEL_PRIMARY.buttons.map(
    ({ id, ...button }) => ({
      ...button,
      label: requiredTranslatedLabel(
        conversionButtonLabels,
        id,
        "developers-defi.conversionPanel.buttons",
      ),
    }),
  );

  const communityListLabels = t.raw("communityPanel.listItems");
  const communityListItems = CONVERSION_PANEL_COMMUNITY.listItems.map(
    ({ id, ...item }) => ({
      ...item,
      label: requiredTranslatedLabel(
        communityListLabels,
        id,
        "developers-defi.communityPanel.listItems",
      ),
    }),
  );

  return (
    <main
      className={`${legacyLandingTheme} bg-[radial-gradient(ellipse_70%_28%_at_80%_0%,rgba(153,69,255,0.16),transparent_75%)] [&>*+*]:border-t [&>*+*]:border-white/10`}
    >
      <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
        <Hero
          headingAs="h1"
          centered={false}
          newsLetter={false}
          eyebrow={t("hero.eyebrow")}
          headline={t("hero.headline")}
          body={t.raw("hero.body")}
          buttons={heroButtons as React.ComponentProps<typeof Hero>["buttons"]}
          image={{
            alt: t("hero.headline"),
            src: HERO_IMAGE,
          }}
        />
      </ResponsiveBox>

      <Heading
        variant="floatingButton"
        eyebrow={t("headings.whySolana.eyebrow")}
        headline={t("headings.whySolana.headline")}
        body={t("headings.whySolana.body")}
      />

      <Switchback
        assetSide="left"
        image={{
          alt: t("switchback.headline"),
          src: SWITCHBACK_IMAGE,
        }}
        eyebrow={t("switchback.eyebrow")}
        headline={t("switchback.headline")}
        body={t.raw("switchback.body")}
        buttons={
          switchbackButtons as React.ComponentProps<
            typeof Switchback
          >["buttons"]
        }
      />

      <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
        <Heading
          eyebrow={t("headings.primitives.eyebrow")}
          headline={t("headings.primitives.headline")}
          body={t("headings.primitives.body")}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
        <CardDeck
          cards={
            cardDeckCards as React.ComponentProps<typeof CardDeck>["cards"]
          }
          numCols={CARD_DECK_COLUMNS}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
        <ConversionPanel
          variant={CONVERSION_PANEL_PRIMARY.variant as "centered"}
          heading={t("conversionPanel.heading")}
          body={t("conversionPanel.body")}
          buttons={
            conversionPanelButtons as React.ComponentProps<
              typeof ConversionPanel
            >["buttons"]
          }
          logos={[]}
          showLogos={false}
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
        <CommunityGallery
          square={COMMUNITY_GALLERY_CONFIG.square}
          cards={
            communityGalleryCards as React.ComponentProps<
              typeof CommunityGallery
            >["cards"]
          }
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
        <ConversionPanel
          variant={CONVERSION_PANEL_COMMUNITY.variant as "inline-centered"}
          heading={t("communityPanel.heading")}
          body={t("communityPanel.body")}
          buttons={[]}
          logos={[]}
          showLogos={CONVERSION_PANEL_COMMUNITY.showLogos}
          listItems={
            communityListItems as React.ComponentProps<
              typeof ConversionPanel
            >["listItems"]
          }
        />
      </ResponsiveBox>
    </main>
  );
}
